import {
  StoreSnapshot,
  Canvas as TLCanvas,
  TLRecord,
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

import "katex/dist/katex.min.css";
import { useStore } from "./useStore";
import { typeid } from "typeid-js";

export const Canvas = observer(
  (
    props: React.PropsWithChildren<
      TldrawProps & { snapshot: StoreSnapshot<TLRecord> }
    >,
  ) => {
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

    const store = useStore({
      roomId: "1122",
      shapeUtils: withDefaults.shapeUtils!,
    });

    return (
      <>
        <TldrawEditor
          store={store}
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
