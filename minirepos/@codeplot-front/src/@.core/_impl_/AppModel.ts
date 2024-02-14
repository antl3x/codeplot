import { FileManagerModel } from "@.core.files";
import { createNewSession } from "@.ws.client";
import { RootModel } from "@codeplot/shared/@.mst";
import { types } from "mobx-state-tree";

const AppModel = types
  .model("App", {
    fileManager: FileManagerModel,
    sharedRootStore: RootModel,
    theme: types
      .model({
        name: "default",
        color: types.union(types.literal("dark"), types.literal("light")),
      })
      .actions((self) => ({
        setThemeColor(theme: "light" | "dark") {
          self.color = theme;
        },
      })),
  })
  .volatile(() => ({
    wsSession: null as ReturnType<typeof createNewSession> | null,
  }))
  .actions((self) => ({
    createNewSession(sessionId: string, url = "http://localhost:9107") {
      self.wsSession = createNewSession({ sessionId, url });
    },
  }))
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
  sharedRootStore: {
    file: {},
  },
  theme: {
    name: "default",
    color: "dark",
  },
});
