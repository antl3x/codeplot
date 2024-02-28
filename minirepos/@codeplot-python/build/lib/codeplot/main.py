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
                await asyncio.sleep(0.1)  
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
                logging.info(f"Connected to {uri}")

                return self
        
    async def set(self, key, val):
        self.ykeyvalue.set(key, val)
        await asyncio.sleep(0.1)

    def _update_ykeyvalue(self):
        self.ykeyvalue = YKeyValue(self.ydoc, self.ydoc.get_array(f"tldrRec:{self.session_id}"))
    
    def _get_instance(self):
        instance = self.ykeyvalue.get("instance:instance")
        return instance
    
    def _get_pointer(self):
        pointer = self.ykeyvalue.get("pointer:pointer")
        return pointer

    def _get_shape(self, shape_id):
        shape = self.ykeyvalue.get(f"shape:{shape_id}")
        return shape

    def _get_current_page_camera(self):
            instance = self._get_instance()
            current_pageid = instance["currentPageId"]
            camera = self.ykeyvalue.get(f"camera:{current_pageid}")
            return camera




    async def plot(self, data, **kwargs) -> None:
        """
        Main plotting function that dispatches to specific plotting functions based on data type or '_as' parameter.
        """
        try:
            # We force this update to receive latest data from the shared document
            self._update_ykeyvalue()
            
            metacode_line = ""

            # last_plot_coords = PatchManager.get_last_plot_xz_coordinates()
            camera = self._get_current_page_camera()
            instance = self._get_instance()

            # to get x and y pos to plot we need consider camera zoom and xy position
            shape = self._get_shape(kwargs['id'])

            
            kwargs.setdefault("id", str(TypeID(prefix="plot")))
            kwargs.setdefault("title", "Untitled"),
            kwargs.setdefault("width", shape['props']['w'] if shape else 500) 
            kwargs.setdefault("height",  shape['props']['h'] if shape else 250)
            kwargs.setdefault("rotation",shape['rotation'] if shape else 0)
            kwargs.setdefault("opacity", shape['opacity'] if shape else 1)
            kwargs.setdefault("is_locked", shape['isLocked'] if shape else False)
            kwargs.setdefault("x_pos", shape['x'] if shape else -camera["x"] + 100)
            kwargs.setdefault("y_pos", shape['y'] if shape else -camera["y"] + 100)
            kwargs.setdefault("page_id", instance["currentPageId"])
            kwargs.setdefault("id", str(TypeID(prefix="plot")))

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
                            "pythonCallerFrameCodeContext": metacode_line,
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
        except Exception as e:
            print("Error plotting:", e)

    async def _plotIPythonCell(self, data, **kwargs) -> None:

        try:
            # We force this update to receive latest data from the shared document
            self._update_ykeyvalue()


            # last_plot_coords = PatchManager.get_last_plot_xz_coordinates()
            camera = self._get_current_page_camera()
            instance = self._get_instance()

            # to get x and y pos to plot we need consider camera zoom and xy position
            shape = self._get_shape(kwargs['id'])

            
            kwargs.setdefault("id", str(TypeID(prefix="plot")))
            kwargs.setdefault("title", "Untitled"),
            kwargs.setdefault("width", shape['props']['w'] if shape else 500) 
            kwargs.setdefault("height",  shape['props']['h'] if shape else 250)
            kwargs.setdefault("rotation",shape['rotation'] if shape else 0)
            kwargs.setdefault("opacity", shape['opacity'] if shape else 1)
            kwargs.setdefault("is_locked", shape['isLocked'] if shape else False)
            kwargs.setdefault("x_pos", shape['x'] if shape else -camera["x"] + 100)
            kwargs.setdefault("y_pos", shape['y'] if shape else -camera["y"] + 100)
            kwargs.setdefault("page_id", instance["currentPageId"])
            kwargs.setdefault("id", str(TypeID(prefix="plot")))

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
                        "mime": data,
                        "metadata": {
                            "isPinned": False,
                            "ipythonRawCell": kwargs["ipython_raw_cell"],
                            "ipythonCellId": kwargs["ipython_cell_id"],
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
        except Exception as e:
            print("Error plotting:", e)
       
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