import { ICodeplotShape } from "./ICodeplotShape";

// import ReactJson from "react-json-view";
import { Inspector } from "react-inspector";

type IDefaultObjectRenderProps = {
  shape: ICodeplotShape;
  isInteractive: boolean;
};


// Using the given object

export function DefaultObjectRender({ isInteractive, shape }: IDefaultObjectRenderProps) {

  return (
      <Inspector table={false} theme="chromeDark" data={JSON.parse(shape.props.value)} />
  );
}
