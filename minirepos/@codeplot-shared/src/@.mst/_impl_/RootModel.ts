import { types } from "mobx-state-tree";

import { FileModel } from "@.mst.file";

/* -------------------------------------------------------------------------- */
/*                                  RootModel                                 */
/* -------------------------------------------------------------------------- */

export const RootModel = types.model("Root", {
  file: FileModel,
});
