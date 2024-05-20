import { appStore } from "@.core";
import { observer } from "mobx-react";
import { useRef } from "react";
import { ICodeplotShape } from "./ICodeplotShape";
import { GLOBAL_IFRAME_SCRIPT, GLOBAL_STYLE } from "./IFRAME_SANDBOX_SCRIPTS";

// import ReactJson from "react-json-view";

type IDefaultMimeImageSvgXmlRenderProps = {
  shape: ICodeplotShape;
};

// Using the given object

export const DefaultMimeImageSvgXmlRender = observer(
  ({ shape }: IDefaultMimeImageSvgXmlRenderProps) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    return (
      <div className="h-full w-full">
        <iframe
          ref={iframeRef}
          className={`overflow-auto w-full h-full`}
          sandbox="allow-same-origin allow-scripts"
          srcDoc={`
        <html data-theme-color=${appStore.theme.color}></html>
        ${GLOBAL_STYLE}
        ${GLOBAL_IFRAME_SCRIPT}
        <style>
          svg {
            width: 100%;
            height: 100%;
            ${appStore.theme.color === "dark" ? "filter: invert(1);" : ""}
          }
        </style>
        ${shape.props.mime["image/svg+xml"]}`}
        />
      </div>
    );
  },
);
