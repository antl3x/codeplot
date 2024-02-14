import { ICodeplotShape } from "./ICodeplotShape";

type IArrayToListRenderProps = {
  shape: ICodeplotShape;
};

// Using the given object

export function ArrayToListRender({ shape }: IArrayToListRenderProps) {
  console.log(shape);
  return (
    <div className="overflow-auto bg-[var(--codeplot-surface2-backgroundColor)] w-full h-full p-2">
      {JSON.parse(shape.props.mime["application/javascript"]).map(
        (item: string, index: number) => (
          <div key={index}>
            <span>{item}</span>
          </div>
        ),
      )}
    </div>
  );
}
