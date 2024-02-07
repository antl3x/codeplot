import { types } from "mobx-state-tree";

export const PagesMetadataModel = types.model("PagesMetadata", {
  order: types.array(types.string),
});
