import { TLBaseShape } from "@tldraw/editor";

export type ICodeplotShape = TLBaseShape<
  "codeplot",
  {
    id: string;
    title: string;
    type: string;
    renderWith: string;
    mime: {
      "text/plain": string;
      "text/html": string;
      "image/png": string;
      "image/jpeg": string;
      "image/svg+xml": string;
      "application/json": string;
      "application/javascript": string;
      "application/x-latex": string;
      "text/markdown": string;
      "application/vnd.plotly.v1+json": string;
    };
    w: number;
    h: number;
    metadata: {
      isPinned: boolean;
      pythonCallerFrameCodeContext: string;
    };
  }
>;
