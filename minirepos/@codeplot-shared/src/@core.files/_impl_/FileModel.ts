import { types } from "mobx-state-tree";

import { PageModel } from "@core.pages";

export const FileModel = types.model("File", {
  pages: types.map(PageModel),
});
