import {
  HTMLContainer,
  Rectangle2d,
  ShapeUtil,
  TLOnResizeHandler,
  TLShapeUtilFlag,
  resizeBox,
} from "@tldraw/tldraw";
import { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";

import { ArrayToListRender } from "./[render] ArrayToListRender";
import { DefaultMimeApplicationLatexRender } from "./[render] DefaultMimeApplicationLatexRender.tsx";
import { DefaultMimeTextHtmlRender } from "./[render] DefaultMimeTextHtmlRender";
import { DefaultMimeImagePngRender } from "./[render] DefaultMimeImagePngRender";
import { DefaultMimeImageSvgXmlRender } from "./[render] DefaultMimeImageSvgXmlRender";
import { DefaultMimeTextPlainRender } from "./[render] DefaultMimeTextPlainRender";

import { Icon } from "@.ui.Icons";
import { ICodeplotShape } from "./ICodeplotShape";
import "./styles.css";
import { DefaultMimeApplicationPlotlyV1Render } from "./[render] DefaultMimeApplicationPlotlyV1Render.tsx";
/* -------------------------------------------------------------------------- */
/*                              CodeplotShapeUtil                             */
/* -------------------------------------------------------------------------- */

export class CodeplotShapeUtil extends ShapeUtil<ICodeplotShape> {
  static override type = "codeplot" as const;
  override canEdit: TLShapeUtilFlag<ICodeplotShape> = () => true;
  override canEditInReadOnly = () => true;
  override canBind = () => true;
  override onResize: TLOnResizeHandler<ICodeplotShape> = (shape, info) => {
    return resizeBox(shape, info);
  };

  /* ------------------------------- defaultProps ------------------------------ */

  getDefaultProps(): ICodeplotShape["props"] {
    return {
      w: 100,
      h: 100,
    } as ICodeplotShape["props"];
  }

  /* ------------------------------- getGeometry ------------------------------ */

  getGeometry(shape: ICodeplotShape) {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  /* -------------------------------- component ------------------------------- */

  component(shape: ICodeplotShape) {
    return <Component shape={shape} />;
  }

  /* -------------------------------- indicator ------------------------------- */

  indicator(shape: ICodeplotShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}

export const Component = observer(({ shape }: { shape: ICodeplotShape }) => {
  const pinRef = useRef(shape.props.metadata.isPinned);
  const [, forceUpdate] = useState({});

  // Initialize pin state from props only on the first render
  useEffect(() => {
    pinRef.current = shape.props.metadata.isPinned;
    // Force an update in case the initial pin state should cause a re-render
    forceUpdate({});
  }, []); // Empty dependency array ensures this runs only once on mount

  const togglePin = () => {
    pinRef.current = !pinRef.current;
    // Force a re-render since we're updating the ref
    forceUpdate({});
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <HTMLContainer
      id={shape.id}
      data-is_pinned={pinRef.current}
      className="codeplot-HTMLContainer"
      style={{
        width: shape.props.w,
        height: shape.props.h,
      }}
    >
      <div className="codeplot-HTMLContainer__TopBar">
        <div className="codeplot-HTMLContainer__TopBar__TitleContainer">
          <button
            className="codeplot-HTMLContainer__TopBar__PinButton"
            type="button"
            onPointerDown={stopPropagation}
            onClick={togglePin}
          >
            <Icon
              className="codeplot-HTMLContainer__TopBar__PinButton__Icon"
              name={pinRef.current ? "PinOn" : "PinOff"}
            />
          </button>
          <span>{_formatPlotTitle(shape.props?.title || shape.props?.id)}</span>
        </div>
        <span className="codeplot-HTMLContainer__TopBar__TypeLabel">
          {shape.props.type}
        </span>
      </div>
      <div
        className="codeplot-HTMLContainer__Render"
        onWheelCapture={stopPropagation}
        onPointerDown={stopPropagation}
        onContextMenu={stopPropagation}
      >
        <RenderSwitch shape={shape} />
      </div>
    </HTMLContainer>
  );
});

/* -------------------------------------------------------------------------- */
/*                                Switch Render                               */
/* -------------------------------------------------------------------------- */

export const RenderSwitch = observer(({ shape }: { shape: ICodeplotShape }) => {
  switch (shape.props.type) {
    case "pandas/dataframe":
      return <DefaultMimeTextHtmlRender shape={shape} />;
    case "pandas/index":
      return <ArrayToListRender shape={shape} />;
  }

  if (shape.props.mime?.["application/vnd.plotly.v1+json"]) {
    return <DefaultMimeApplicationPlotlyV1Render shape={shape} />;
  }

  if (shape.props.mime?.["application/x-latex"]) {
    return <DefaultMimeApplicationLatexRender shape={shape} />;
  }

  if (shape.props.mime?.["image/svg+xml"]) {
    return <DefaultMimeImageSvgXmlRender shape={shape} />;
  }

  if (shape.props.mime?.["image/png"]) {
    return <DefaultMimeImagePngRender shape={shape} />;
  }

  if (shape.props.mime?.["text/html"]) {
    return <DefaultMimeTextHtmlRender shape={shape} />;
  }

  if (shape.props.mime?.["text/plain"]) {
    return <DefaultMimeTextPlainRender shape={shape} />;
  }
});

/* -------------------------------------------------------------------------- */
/*                                    Utils                                   */
/* -------------------------------------------------------------------------- */

const _formatPlotTitle = (title: string) => {
  const titleMatch = title.match(
    /\.plot\(\s*((?:[^\s,()]+|\((?:[^()]*|\([^()]*\))*\))+)/,
  );
  if (titleMatch) {
    return titleMatch[1];
  }
  return title;
};
