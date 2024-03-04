import { useEditor } from "@tldraw/editor";
import { useEffect } from "react";
import { ICodeplotShape } from "./ICodeplotShape";

// import ReactJson from "react-json-view";

type IDefaultMimeImagePngRenderProps = {
  shape: ICodeplotShape;
};

// Using the given object

export function DefaultMimeImagePngRender({
  shape,
}: IDefaultMimeImagePngRenderProps) {
  const editor = useEditor();
  useEffect(() => {
    _getBase64ImageDimensions(shape.props.mime["image/png"], ({ w, h }) => {
      editor.updateShape({ ...shape, props: { w, h } });
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="h-full w-full overflow-auto invert bg-[var(--codeplot-surface2-backgroundColor)]">
      <img
        className="h-full w-full"
        src={`data:image/png;base64,${shape.props.mime["image/png"]}`}
      />
    </div>
  );
}

/* ------------------------ _getBase64ImageDimensions ----------------------- */

function _getBase64ImageDimensions(
  base64String: string,
  callback: (dimensions: { w: number; h: number }) => void,
) {
  // Create a new Image object
  const image = new Image();

  // Define the onload event handler
  image.src = `data:image/png;base64,${base64String}`;
  image.onload = function () {
    // Once the image is loaded, retrieve the dimensions
    const dimensions = {
      w: image.width,
      h: image.height,
    };

    // Execute the callback function with the dimensions
    callback(dimensions);
  };

  // Set the source of the image to the base64 string
}

// Example usage
