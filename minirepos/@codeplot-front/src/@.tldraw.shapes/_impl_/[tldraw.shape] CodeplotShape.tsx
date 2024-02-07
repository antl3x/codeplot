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
import { DefaultHTMLRender } from "./[render] DefaultHTMLRender";
import { DefaultObjectRender } from "./[render] DefaultObjectRender";

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
      <div
          onClick={console.log}
          className="absolute -mt-6 flex justify-between w-full"
        >
          <span title={shape.props.title}>
            {_formatPlotTitle(shape.props.title)}
          </span>
          <span className="opacity-25">{shape.props.type}</span>
        </div>
      <HTMLContainer
      onPointerDown={(e) => e.stopPropagation()}

      onWheelCapture={e => {
        e.stopPropagation();
      }
      }

      id={shape.id}
      className="rounded-md overflow-x-auto"
      style={{
        border: 0,
        padding: "8px",
        pointerEvents: isInteractive ? "auto" : "none",
        zIndex: isInteractive ? "" : "-1",
      }}
      >
        {shape.props.type === "pandas/dataframe" && (
          <DefaultObjectRender shape={shape} isInteractive={isInteractive} />
          )}
        {shape.props.type !== "pandas/dataframe" && (
          <DefaultHTMLRender shape={shape} isInteractive={isInteractive} />
          )}
      </HTMLContainer>
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
