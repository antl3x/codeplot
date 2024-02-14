import asyncio
import logging
import y_py as Y
from websockets import connect
from ypy_websocket import WebsocketProvider
import websockets
from typeid import TypeID
import json
import inspect
import io
import base64
import datetime
import nest_asyncio
from .yutils import YKeyValue

logging.basicConfig(level=logging.INFO)

def is_notebook() -> bool:
    try:
        shell = get_ipython().__class__.__name__
        if shell == 'ZMQInteractiveShell':
            return True   # Jupyter notebook or qtconsole
        elif shell == 'TerminalInteractiveShell':
            return False  # Terminal running IPython
        else:
            return False  # Other type (?)
    except NameError:
        return False  
    
class Codeplot:
    def __init__(self, uri):

        self.connections = {}
        self.lock = asyncio.Lock()
        self.uri = uri

    async def connect(self, uri):
                session_id = uri.split("/")[-1]
                ydoc = Y.YDoc()
                websocket = await websockets.connect(uri)
                provider = WebsocketProvider(ydoc, websocket)
                task = asyncio.create_task(provider.start())
                await provider.started.wait()

                # TODO: This is a bugfix. Somehow the provider is not ready to accept messages
                # immediately after the started event is set. This is a temporary fix.
                await asyncio.sleep(1)  
                ####


                logging.info(f"WebSocket and provider established for {uri}")
                yarray = ydoc.get_array(f"tldrRec:{session_id}")
                ykeyvalue = YKeyValue(ydoc, yarray)

                self.ydoc = ydoc
                self.provider = provider
                self.yarray = yarray
                self.session_id = session_id
                self.websocket = websocket
                self.ykeyvalue = ykeyvalue

                return self
        
    async def set(self, key, val):
        self.ykeyvalue.set(key, val)
        await asyncio.sleep(1)


    async def plot(self, data, **kwargs) -> None:
        
        """
        Main plotting function that dispatches to specific plotting functions based on data type or '_as' parameter.
        """
        caller_frame_record = inspect.stack()[-1]
        metacode_line = "" if is_notebook() else caller_frame_record.code_context[0]

        # last_plot_coords = PatchManager.get_last_plot_xz_coordinates()
        last_plot_coords = {"x": 10, "y": 10}

        kwargs.setdefault("id", str(TypeID(prefix="plot")))
        kwargs.setdefault("title", "Untitled"),
        kwargs.setdefault("width", 500)
        kwargs.setdefault("height", 250)
        kwargs.setdefault("rotation", 0)
        kwargs.setdefault("opacity", 1)
        kwargs.setdefault("is_locked", False)
        kwargs.setdefault("x_pos", last_plot_coords["x"])
        kwargs.setdefault("y_pos", last_plot_coords["y"] + kwargs["height"] + 10)
        kwargs.setdefault("page_id", "page:page")

        shape = {
                "id": "shape:"+kwargs["id"],
                "x": kwargs["x_pos"],
                "y": kwargs["y_pos"],
                "rotation": kwargs["rotation"],
                "opacity": kwargs["opacity"],
                "isLocked": kwargs["is_locked"],
                "props": {
                    "w": kwargs["width"],
                    "h": kwargs["height"],
                    "id": "shape:"+kwargs["id"],
                    "title": kwargs["title"],
                    "type": str(type(data)),
                    "renderWith": "default",
                    "mime": _get_mime_representations(data),
                    "metadata": {
                        "isPinned": False,
                        "pythonCallerFrameCodeContext": metacode_line
                    },
                    "createdAt": datetime.datetime.utcnow().isoformat() + "Z"
                },
                "meta": {},
                "type": "codeplot",
                "parentId": kwargs["page_id"],
                "index": "a1",
                "typeName": "shape"
            }
    
        await self.set(f"shape:"+kwargs['id'], shape)

       
       
class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if hasattr(obj, 'to_dict'):
            to_dict_signature = inspect.signature(obj.to_dict)
            if 'orient' in to_dict_signature.parameters:
                return obj.to_dict(orient='records')
            else:
                return obj.to_dict()
        elif hasattr(obj, 'to_json'):
            to_json_signature = inspect.signature(obj.to_json)
            if 'orient' in to_json_signature.parameters:
                return obj.to_json(orient='records')
            else:
                return obj.to_json()
        elif hasattr(obj, 'tolist'):
            return obj.tolist()
        elif hasattr(obj, 'isoformat'):
            return obj.isoformat()
        else:
            return {"string": str(obj)}


def _get_mime_representations(obj):
    mime_types = {
        '__repr__': 'text/plain',
        '_repr_svg_': 'image/svg+xml',
        '_repr_png_': 'image/png',
        '_repr_jpeg_': 'image/jpeg',
        '_repr_html_': 'text/html',
        '_repr_json_': 'application/json',
        '_repr_javascript_': 'application/javascript',
        '_repr_latex_': 'application/x-latex',
        '_repr_markdown_': 'text/markdown',
        # Add more as needed
    }

    representations = {}

    for method_name, mime_type in mime_types.items():
        if hasattr(obj, method_name):
            method = getattr(obj, method_name)
            try:
                content = method()
                if content is not None:
                    representations[mime_type] = content
            except Exception as e:
                print(f"Error calling {method_name}: {e}")

    # Duck typing check for a matplotlib figure-like object
    if hasattr(obj, 'savefig'):
        buffer_png = io.BytesIO()
        obj.savefig(buffer_png, format='png', dpi=300)
        buffer_png.seek(0)
        # Encode the bytes in base64 and decode to get a string
        representations['image/png'] = base64.b64encode(buffer_png.getvalue()).decode('ascii')

        # For the SVG representation
        buffer_svg = io.BytesIO()
        obj.savefig(buffer_svg, format='svg')
        buffer_svg.seek(0)
        # The SVG data is text, so you can read and directly assign it
        representations['image/svg+xml'] = buffer_svg.getvalue().decode('utf-8')
    
    if 'application/json' not in representations:
        # Use the custom encoder here.
        representations['application/json'] = json.dumps(obj, cls=CustomJSONEncoder)

    return representations