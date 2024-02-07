# Assuming the necessary imports are already in place
from typing import Union, Callable, Dict, Optional, Tuple
import pandas as pd
import plotly.graph_objects as go
from .PatchManager import PatchManager  # Ensure correct import path
from typeid import TypeID
import inspect
import matplotlib.pyplot as plt
import base64
from io import BytesIO

# Plotting Function Registry
plotting_functions: Dict[str, Callable] = {}

def register_plot_function(plot_type: str):
    def decorator(func: Callable):
        plotting_functions[plot_type] = func
        return func
    return decorator

@register_plot_function('pandas_dataframe')
def plot_pandas_dataframe(df: pd.DataFrame, **kwargs) -> None:
    """Generates and emits a patch for plotting a DataFrame."""
    caller_frame_record = inspect.stack()[-1]
    metacode_line = caller_frame_record.code_context[0]

    plot_id = kwargs.get("plot_id")
    page_id = kwargs.get("page_id")
    plot_title = kwargs.get("title", metacode_line)


    PatchManager.emit_patch([{
        "op": "add",
        "path": "/store/shape:"+plot_id,
        "value": {
            "id": "shape:"+plot_id,
            "x": 250,
            "y": 250,
            "rotation": 0,
            "opacity": 1,
            "isLocked": False,
            "props": {
                "w": 500,
                "h": 250,
                "id": "shape:"+plot_id,
                "title": plot_title,
                "type": "pandas/dataframe",
                "renderer": "pandas-dataframe",
                "staticMimes": _get_mime_representations(df),
                "value": df.to_json(orient="split"),
                "metadata": {},
                "codeMetadata": {
                    "code": caller_frame_record.code_context[0]
                }
            },
            "meta": {},
            "type": "codeplot",
            "parentId": page_id,
            "index": "a1",
            "typeName": "shape"
        }
    }])



@register_plot_function('tuple')
def plot_tuple(tuple: Tuple, **kwargs) -> None:
    """Generates and emits a patch for plotting a DataFrame shape."""
    plot_id = kwargs.get("plot_id")
    page_id = kwargs.get("page_id")

    PatchManager.emit_patch([{
        "op": "add",
        "path": "/pages/"+page_id+"/plots/"+plot_id,
        "value": {
            "id": plot_id,
            "type": "tuple",
            "renderer": "tuple",
            "staticMimes": _get_mime_representations(tuple),
            "value": tuple,
            "metadata": {}
        }
    }])


@register_plot_function('pandas_series')
def plot_pandas_series(pandas_series: pd.Series, **kwargs) -> None:
    caller_frame_record = inspect.stack()[-1]
    metacode_line = caller_frame_record.code_context[0]

    plot_id = kwargs.get("plot_id")
    page_id = kwargs.get("page_id")
    plot_title = kwargs.get("title", metacode_line)

    
    # Convert data types to string representations
    dtypes_str = pandas_series.astype(str)
    import json
    # Convert the series of strings to a dictionary and then to JSON
    value = json.dumps(dtypes_str.to_dict())




    PatchManager.emit_patch([{
        "op": "add",
        "path": "/store/shape:"+plot_id,
        "value": {
            "id": "shape:"+plot_id,
            "x": 250,
            "y": 250,
            "rotation": 0,
            "opacity": 1,
            "isLocked": False,
            "props": {
                "w": 500,
                "h": 250,
                "id": "shape:"+plot_id,
                "title": plot_title,
                "type": "pandas/series",
                "renderer": "pandas-series",
                "staticMimes": _get_mime_representations(pandas_series),
                "value": value,
                "metadata": {},
                "codeMetadata": {
                    "code": caller_frame_record.code_context[0]
                }
            },
            "meta": {},
            "type": "codeplot",
            "parentId": page_id,
            "index": "a1",
            "typeName": "shape"
        }
    }])



@register_plot_function('pandas_index')
def plot_pandas_index(pandas_index: pd.Index, **kwargs) -> None:
    """Function to handle Index plotting."""
    plot_id = kwargs.get("plot_id")
    page_id = kwargs.get("page_id")
    import json
    # Convert the series of strings to a dictionary and then to JSON
    value = json.dumps(pandas_index.astype(str).to_list())

    PatchManager.emit_patch([{
        "op": "add",
        "path": "/pages/"+page_id+"/plots/"+plot_id,
        "value": {
            "id": plot_id,
            "type": "pandas/index",
            "renderer": "pandas-index",
            "staticMimes": _get_mime_representations(pandas_index),
            "value": value,
            "metadata": {}
        }
    }])



@register_plot_function('plotly_figure')
def plot_plotly_figure(figure: go.Figure, **kwargs) -> None:
    """Handles Plotly figure plotting."""
    caller_frame_record = inspect.stack()[-1]
    metacode_line = caller_frame_record.code_context[0]

    plot_id = kwargs.get("plot_id")
    page_id = kwargs.get("page_id")
    plot_title = kwargs.get("title", metacode_line)
    
    from plotly.offline import plot
    html = plot(figure, output_type='div', include_plotlyjs=False)
   

    PatchManager.emit_patch([{
        "op": "add",
        "path": "/store/shape:"+plot_id,
        "value": {
            "id": "shape:"+plot_id,
            "x": 250,
            "y": 250,
            "rotation": 0,
            "opacity": 1,
            "isLocked": False,
            "props": {
                "w": 500,
                "h": 250,
                "id": "shape:"+plot_id,
                "title": plot_title,
                "type": "plotly/figure",
                "renderer": "plotly-figure",
                "staticMimes": _get_mime_representations(figure),
                "value": html,
                "metadata": {},
                "codeMetadata": {
                    "code": caller_frame_record.code_context[0]
                }
            },
            "meta": {},
            "type": "codeplot",
            "parentId": page_id,
            "index": "a1",
            "typeName": "shape"
        }
    }])

    # ----------------------------- MatplotLib Figure ---------------------------- #

    
@register_plot_function('matplotlib_figure')
def plot_matplotlib_figure(figure: plt.Figure, **kwargs) -> None:
    """Handles matplotlib figure plotting."""
    caller_frame_record = inspect.stack()[-1]
    metacode_line = caller_frame_record.code_context[0]

    plot_id = kwargs.get("plot_id")
    page_id = kwargs.get("page_id")
    plot_title = kwargs.get("title", metacode_line)

    # Convert the Matplotlib figure to a PNG image and then encode it to base64
    buffer = BytesIO()
    figure.savefig(buffer, format='png')
    buffer.seek(0)
    img_base64 = base64.b64encode(buffer.read()).decode('utf-8')
    html = f'<img src="data:image/png;base64,{img_base64}" />'
    
    
   

    PatchManager.emit_patch([{
        "op": "add",
        "path": "/store/shape:"+plot_id,
        "value": {
            "id": "shape:"+plot_id,
            "x": 250,
            "y": 250,
            "rotation": 0,
            "opacity": 1,
            "isLocked": False,
            "props": {
                "w": 500,
                "h": 250,
                "id": "shape:"+plot_id,
                "title": plot_title,
                "type": "matplotlib/figure",
                "renderer": "matplotlib-figure",
                "staticMimes": {
                    **_get_mime_representations(figure),
                    "image/png": img_base64,
                    "text/html": html
                },
                "value": html,
                "metadata": {},
                "codeMetadata": {
                    "code": caller_frame_record.code_context[0]
                }
            },
            "meta": {},
            "type": "codeplot",
            "parentId": page_id,
            "index": "a1",
            "typeName": "shape"
        }
    }])


def plot(data: Union[pd.DataFrame, pd.Series, go.Figure, plt.Figure], _as: Optional[str] = None, **kwargs) -> None:
    """
    Main plotting function that dispatches to specific plotting functions based on data type or '_as' parameter.
    """
    kwargs.setdefault("plot_id", str(TypeID(prefix="plot")))
    kwargs.setdefault("dataref_id", str(TypeID(prefix="dataref")))
    kwargs.setdefault("page_id", PatchManager.get_first_page()["id"])

    if _as:
        plot_function = plotting_functions.get(_as)
        if plot_function:
            plot_function(data, **kwargs)
        else:
            raise ValueError(f"No plot function found for custom type: '{_as}'")
    else:
        if isinstance(data, pd.DataFrame):
            plotting_functions['pandas_dataframe'](data, **kwargs)
        elif isinstance(data, pd.Series):
            plotting_functions['pandas_series'](data, **kwargs)
        elif isinstance(data, pd.Index):
            plotting_functions['pandas_index'](data, **kwargs)
        elif isinstance(data, go.Figure):
            plotting_functions['plotly_figure'](data, **kwargs)
        elif isinstance(data, plt.Figure):
            plotting_functions['matplotlib_figure'](data, **kwargs)
        elif isinstance(data, tuple):
            plotting_functions['tuple'](data, **kwargs)
        else:
            raise TypeError(f"Unsupported data type: {type(data)}")
        
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

    return representations