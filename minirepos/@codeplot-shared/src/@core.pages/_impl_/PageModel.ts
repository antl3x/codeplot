import { types } from "mobx-state-tree";

export const PageModel = types
  .model("Page", { id: types.string, name: types.string })
  .actions((self) => ({
    updateName(name: string) {
      self.name = name;
    },
  }));
