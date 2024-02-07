import { TLBaseShape } from "@tldraw/editor";

export type ICodeplotShape = TLBaseShape<
  "codeplot",
  {
    id: string;
    title: string;
    type: string;
    renderer: string;
    staticMimes: {
      "text/plain": string;
      "text/html": string;
    };
    value: string;
    w: number;
    h: number;
    metacode: {
      context: string;
    };
  }
>;
