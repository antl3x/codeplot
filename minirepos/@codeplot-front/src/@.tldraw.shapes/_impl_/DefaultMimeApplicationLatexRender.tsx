import { observer } from "mobx-react";
import { BlockMath } from "react-katex";
import "./DefaultMimeApplicationLatexRender.css";
import { ICodeplotShape } from "./ICodeplotShape";

type IDefaultMimeImageApplicationLatexrProps = {
  shape: ICodeplotShape;
};

export const DefaultMimeApplicationLatexRender = observer(
  ({ shape }: IDefaultMimeImageApplicationLatexrProps) => {
    const processedLatex = shape.props.mime["application/x-latex"].replace(
      /\$/g,
      "",
    );

    return (
      <div className="w-full h-full overflow-auto flex justify-center items-center">
        <BlockMath math={processedLatex} />
      </div>
    );
  },
);
