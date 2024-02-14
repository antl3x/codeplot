import { Tooltip, TooltipTrigger } from "@adobe/react-spectrum";
import {
  Canvas as TLCanvas,
  TldrawEditor,
  TldrawEditorProps,
} from "@tldraw/editor";
import {
  ContextMenu,
  TldrawHandles,
  TldrawHoveredShapeIndicator,
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
import { overrides } from "./overrides";

import { appStore } from "@.core";
import { ToastQueue } from "@react-spectrum/toast";
import "katex/dist/katex.min.css";
import { useStore } from "./useStore";

export const Canvas = observer((props: React.PropsWithChildren) => {
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
    shapeUtils: withDefaults.shapeUtils!,
    snapshot: appStore.fileManager.openedFile!.tldrSnapshot,
    roomId: appStore.roomId,
    wsHost: appStore.wsHost,
  });

  return (
    <div className="w-full h-full flex flex-col">
      <TldrawEditor
        {...withDefaults}
        store={store}
        onMount={appStore.setTldrEditor}
      >
        <TldrawUi forceMobile overrides={overrides} {...withDefaults}>
          <ContextMenu>
            <TLCanvas />
          </ContextMenu>
          {props.children}
        </TldrawUi>
      </TldrawEditor>
      <div
        className={`w-full h-[32px]
        flex items-center
        text-xs
        bg-[var(--codeplot-surface2-backgroundColor)]`}
      >
        <div className="flex items-center ml-auto px-2">
          <TooltipTrigger>
            <button
              className={`
              opacity-75
              text-[var(--codeplot-surface2-color)]
              ml-2 px-2 py-1 rounded-md hover:bg-[var(--codeplot-surface3-backgroundColor)] focus:bg-[var(--codeplot-surface2-backgroundColor)] focus:outline-none`}
              tabIndex={0}
              aria-label="Copy WS URL to clipboard"
              onClick={() => {
                navigator.clipboard.writeText(appStore.wsUrl);
                ToastQueue.neutral("Room url copied to clipboard!");
              }}
            >
              {appStore.wsUrl}
            </button>
            <Tooltip>Copy to clipboard</Tooltip>
          </TooltipTrigger>
        </div>
      </div>
    </div>
  );
});
