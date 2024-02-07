from .PatchManager import PatchManager  # Ensure correct import path
from typeid import TypeID
import json
import inspect
import io
import base64
import datetime

def plot(data, **kwargs) -> None:
    """
    Main plotting function that dispatches to specific plotting functions based on data type or '_as' parameter.
    """
    caller_frame_record = inspect.stack()[-1]
    metacode_line = caller_frame_record.code_context[0]

    last_plot_coords = PatchManager.get_last_plot_xz_coordinates()

    kwargs.setdefault("id", str(TypeID(prefix="plot")))
    kwargs.setdefault("title", metacode_line),
    kwargs.setdefault("width", 500)
    kwargs.setdefault("height", 250)
    kwargs.setdefault("rotation", 0)
    kwargs.setdefault("opacity", 1)
    kwargs.setdefault("is_locked", False)
    kwargs.setdefault("x_pos", last_plot_coords["x"])
    kwargs.setdefault("y_pos", last_plot_coords["y"] + kwargs["height"] + 10)
    kwargs.setdefault("page_id", PatchManager.get_first_page()["id"])

 
    PatchManager.emit_patch([{
        "op": "add",
        "path": "/store/shape:"+kwargs["id"],
        "value": {
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
                    "pythonCallerFrameCodeContext": caller_frame_record.code_context[0]
                },
                "createdAt": datetime.datetime.utcnow().isoformat() + "Z"
            },
            "meta": {},
            "type": "codeplot",
            "parentId": kwargs["page_id"],
            "index": "a1",
            "typeName": "shape"
        }
    }])
       
       
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