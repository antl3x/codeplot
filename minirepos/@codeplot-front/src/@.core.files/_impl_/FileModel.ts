import { PageModel, PagesMetadataModel } from "@.core.pages";
import { types } from "mobx-state-tree";
import { createTLStore } from "@tldraw/editor";
import { defaultShapeUtils } from "@tldraw/tldraw";

export const FileModel = types
  .model("File", {
    minCodeplotVersion: types.string,
    pages: types.map(PageModel),
    "pages:metadata": PagesMetadataModel,
    ".tldr": types.optional(types.frozen(), {
      tldrawFileFormatVersion: 1,
      schema: createTLStore({
        shapeUtils: defaultShapeUtils,
      }).schema.serialize(),
      records: [],
    }),
  })
  .actions((self) => ({
    updateTldrContent(content: string) {
      self[".tldr"] = JSON.parse(content);
    },
  }));
