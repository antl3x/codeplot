import {
  HTMLContainer,
  Rectangle2d,
  ShapeUtil,
  TLOnResizeHandler,
  TLShapeUtilFlag,
  resizeBox,
  useIsEditing,
  useValue,
} from "@tldraw/tldraw";

import { ICodeplotShape } from "./ICodeplotShape";
import { ArrayToListRender } from "./[render] ArrayToListRender";
import { DefaultHTMLRender } from "./[render] DefaultHTMLRender";
import { DefaultMimeImagePngRender } from "./[render] DefaultMimeImagePngRender";
import { DefaultMimeImageSvgXmlRender } from "./[render] DefaultMimeImageSvgXmlRender";
import { DefaultMimeTextPlainRender } from "./[render] DefaultMimeTextPlainRender";

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
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const isEditing = useIsEditing(shape.id);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const isHoveringWhileEditingSameShape = useValue(
      "is hovering",
      () => {
        const { editingShapeId, hoveredShapeId } =
          this.editor.getCurrentPageState();

        if (editingShapeId && hoveredShapeId !== editingShapeId) {
          const editingShape = this.editor.getShape(editingShapeId);
          if (
            editingShape &&
            this.editor.isShapeOfType<ICodeplotShape>(editingShape, "codeplot")
          ) {
            return true;
          }
        }

        return false;
      },
      [],
    );

    const isInteractive = isEditing || isHoveringWhileEditingSameShape;

    return (
      <>
        <div className="w-full h-full codeplot-HTMLContainer_Container">
          <div className="codeplot-HTMLContainer_TopBar absolute w-full flex gap-x-6 flex-wrap justify-between items-center">
            <span title={shape.props.title}>
              {_formatPlotTitle(shape.props.title)}
            </span>
            <span className="truncate opacity-25 text-ellipsis overflow-hidden">
              {shape.props.type}
            </span>
          </div>
          <HTMLContainer
            onPointerDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onWheelCapture={(e) => {
              e.stopPropagation();
            }}
            id={shape.id}
            className="rounded-lg overflow-hidden"
            style={{
              border: 0,
              pointerEvents: isInteractive ? "auto" : "none",
              zIndex: isInteractive ? "" : "-1",
            }}
          >
            {renderSwitch(shape, isInteractive)}
          </HTMLContainer>
        </div>
      </>
    );
  }

  /* -------------------------------- indicator ------------------------------- */

  indicator(shape: ICodeplotShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }

  // Implement hitTest and canBind as needed based on your requirements
}

/* -------------------------------------------------------------------------- */
/*                                Switch Render                               */
/* -------------------------------------------------------------------------- */

function renderSwitch(shape: ICodeplotShape, isInteractive: boolean) {
  switch (shape.props.type) {
    case "pandas/dataframe":
      return <DefaultHTMLRender shape={shape} isInteractive={isInteractive} />;
    case "pandas/index":
      return <ArrayToListRender shape={shape} isInteractive={isInteractive} />;
  }

  if (shape.props.mime?.["image/svg+xml"]) {
    return (
      <DefaultMimeImageSvgXmlRender
        shape={shape}
        isInteractive={isInteractive}
      />
    );
  }

  if (shape.props.mime?.["image/png"]) {
    return (
      <DefaultMimeImagePngRender shape={shape} isInteractive={isInteractive} />
    );
  }

  if (shape.props.mime?.["text/html"]) {
    return <DefaultHTMLRender shape={shape} isInteractive={isInteractive} />;
  }

  if (shape.props.mime?.["text/plain"]) {
    return (
      <DefaultMimeTextPlainRender shape={shape} isInteractive={isInteractive} />
    );
  }
}

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
