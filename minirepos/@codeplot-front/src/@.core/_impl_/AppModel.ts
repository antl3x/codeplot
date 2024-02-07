import { FileManagerModel } from "@.core.files";
import { types } from "mobx-state-tree";

const AppModel = types
  .model("App", {
    fileManager: FileManagerModel,
    theme: types.model({
      name: types.string,
      color: types.union(types.literal("light"), types.literal("dark")),
    }),
  })
  .views((self) => ({
    get isBrowserSupported() {
      return _isBrowserSupported();
    },
    get isFileOpened() {
      return _isFileOpened(self);
    },
  }));

/* --------------------------- _isBrowserSupported -------------------------- */
/**
 * We currently only supports browsers that implemented
 * File System Access API. This is because we need to
 * read and write files to the user's file system.
 */
const _isBrowserSupported = () => {
  if ("showOpenFilePicker" in window) {
    return true;
  }

  return false;
};

/* ------------------------------ _isFileOpened ----------------------------- */

const _isFileOpened = (_self: unknown) => {
  //eslint-disable-next-line
  const self = _self as any;
  return !!self.fileManager.fileContent;
};

export const appStore = AppModel.create({
  fileManager: {},
  theme: {
    name: "default",
    color: "dark",
  },
});
