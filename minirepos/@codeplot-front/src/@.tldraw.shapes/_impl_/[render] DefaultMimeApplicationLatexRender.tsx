import { observer } from "mobx-react";
import { useEffect, useRef, useState } from "react";
import { ICodeplotShape } from "./ICodeplotShape";
import "./[render] DefaultMimeApplicationLatexRender.css";

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
        <MathJaxSVG latex={processedLatex} />
      </div>
    );
  },
);

const MathJaxSVG = ({ latex }: { latex: string }) => {
  const [svg, setSvg] = useState<string>("");
  const mathJaxContainerRef = useRef(null);

  useEffect(() => {
    if (window.MathJax) {
      // Ensure MathJax has finished loading
      window.MathJax.startup.promise.then(() => {
        // Convert LaTeX to SVG
        const svgNode = window.MathJax.tex2svg(latex, {
          em: 10,
          ex: 5,
          containerWidth: "100%",
          height: "100%",
          display: true,
        });
        setSvg(svgNode.outerHTML);

        // Optional: If you want to directly append the SVG to the DOM
        // mathJaxContainerRef.current.innerHTML = '';
        // mathJaxContainerRef.current.appendChild(svgNode);
      });
    }
  }, [latex]); // Rerun this effect if the 'latex' prop changes

  return (
    <div
      className="codeplot-DefaultMimeApplicationLatexRender"
      ref={mathJaxContainerRef}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};
