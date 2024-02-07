import { appStore } from "@.core";
import { ICodeplotShape } from "./ICodeplotShape";

// import ReactJson from "react-json-view";
import { Inspector, chromeDark, chromeLight } from "react-inspector";

type IDefaultObjectRenderProps = {
  shape: ICodeplotShape;
  isInteractive: boolean;
};

// Using the given object

export function DefaultObjectRender({ shape }: IDefaultObjectRenderProps) {
  console.log(shape);
  return (
    <div className="overflow-auto bg-[var(--codeplot-surface2-backgroundColor)] w-full h-full p-2">
      <Inspector
        table={false}
        theme={
          {
            ...(appStore.theme.color === "dark" ? chromeDark : chromeLight),
            ...{
              BASE_BACKGROUND_COLOR: "var(--codeplot-surface2-backgroundColor)",
            },
          } as unknown as string
        }
        data={JSON.parse(shape.props.value)}
      />

      {/* <ReactJson theme={"brewer"} src={JSON.parse(shape.props.value)} /> */}
    </div>
  );
}
