import {
  Canvas as TLCanvas,
  TldrawEditor,
  TldrawEditorProps,
} from "@tldraw/editor";
import {
  ContextMenu,
  TldrawHandles,
  TldrawHoveredShapeIndicator,
  TldrawProps,
  TldrawScribble,
  TldrawSelectionBackground,
  TldrawSelectionForeground,
  TldrawUi,
  defaultShapeTools,
  defaultShapeUtils,
  defaultTools,
} from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";
import { observer } from "mobx-react";
import React, { useMemo } from "react";

import { CodeplotShapeUtil } from "@.tldraw.shapes";
import { tldrawStore } from "@.tldraw.store";
import { overrides } from "./overrides";

export const Canvas = observer(
  (props: React.PropsWithChildren<TldrawProps & { snapshot: string }>) => {
    console.log(" rendered");

    const withDefaults: TldrawEditorProps = useMemo(
      () => ({
        initialState: "select",

        components: {
          Scribble: TldrawScribble,
          CollaboratorScribble: TldrawScribble,
          SelectionForeground: TldrawSelectionForeground,
          SelectionBackground: TldrawSelectionBackground,
          Handles: TldrawHandles,
          HoveredShapeIndicator: TldrawHoveredShapeIndicator,
        },
        shapeUtils: [...defaultShapeUtils, CodeplotShapeUtil],
        tools: [...defaultTools, ...defaultShapeTools],
      }),
      [],
    );

    return (
      <>
        <TldrawEditor
          snapshot={JSON.parse(props.snapshot)}
          autoFocus={true}
          {...withDefaults}
          onMount={(editor) => {
            tldrawStore.setTtldrEditor(editor);
          }}
        >
          <TldrawUi forceMobile overrides={overrides} {...withDefaults}>
            <ContextMenu>
              <TLCanvas />
            </ContextMenu>
            {props.children}
          </TldrawUi>
        </TldrawEditor>
      </>
    );
  },
);
