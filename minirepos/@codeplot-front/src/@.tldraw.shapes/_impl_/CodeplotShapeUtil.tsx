import {
  HTMLContainer,
  Rectangle2d,
  ShapeUtil,
  TLOnResizeHandler,
  TLShapeUtilFlag,
  resizeBox,
} from "@tldraw/tldraw";
import { useRef, useState } from "react";
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
  const [isPinned, setIsPinned] = useState(pinRef.current);

  const togglePin = () => {
    pinRef.current = !isPinned;
    setIsPinned(!isPinned);
  };

  return (
    <HTMLContainer
      id={shape.id}
      className="group flex flex-col rounded-lg overflow-hidden"
      style={{
        width: shape.props.w,
        height: shape.props.h,
        pointerEvents: "auto",
      }}
    >
      <div
        className={`
        w-full min-h-8 px-2 z-10 
        ${pinRef.current ? "flex" : "hidden"}
        ${pinRef.current ? "" : "group-hover:absolute"}
        group-hover:flex
        gap-4 items-center justify-between
        hover:!cursor-move 
        bg-[var(--codeplot-surface2-backgroundColor)]`}
      >
        <div className="flex items-center gap-2">
          <button
            className={`flex items-center justify-center
          active:bg-[var(--codeplot-surface3-backgroundColor)]
          hover:bg-[var(--codeplot-surface3-backgroundColor)]
         ${pinRef.current ? "bg-[var(--codeplot-surface3-backgroundColor)]" : ""}
          w-[18px] h-[18px] pointer-events-auto rounded-sm`}
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onClick={togglePin}
          >
            <Icon
              name={pinRef.current ? "PinOn" : "PinOff"}
              className="w-[12px] h-[12px]"
            />
          </button>
          <span className="text-white">
            {_formatPlotTitle(shape.props?.title || shape.props?.id)}
          </span>
        </div>
        <span
          className={`text-ellipsis
        truncate
        text-[var(--codeplot-surface2-color)]
        opacity-50
        `}
        >
          {shape.props.type}
        </span>
      </div>
      <div className="w-full h-full">
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
