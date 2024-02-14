import { ICodeplotShape } from "./ICodeplotShape";

// import ReactJson from "react-json-view";

type IDefaultMimeImagePngRenderProps = {
  shape: ICodeplotShape;
};

// Using the given object

export function DefaultMimeImagePngRender({
  shape,
}: IDefaultMimeImagePngRenderProps) {
  return (
    <div className="h-full w-full overflow-auto invert bg-[var(--codeplot-surface2-backgroundColor)]">
      <img
        className="h-full w-full"
        src={`data:image/png;base64,${shape.props.mime["image/png"]}`}
      />
    </div>
  );
}
