import { ToastQueue } from "@react-spectrum/toast";
import { Instance, flow, types } from "mobx-state-tree";

/* -------------------------------------------------------------------------- */
/*                                    Model                                   */
/* -------------------------------------------------------------------------- */

export const FileManagerModel = types
  .model({
    fileContent: types.maybeNull(types.string),
    initialFileContent: types.maybeNull(types.string),
  })
  .volatile(() => ({
    fileHandle: null as FileSystemFileHandle | null,
    lastSaved: types.optional(types.Date, () => new Date()),
  }))
  .actions((self) => ({
    _setupCheckForHostFileChanges: _setupCheckForHostFileChanges(self),
    openFilePicker: _openFilePicker(self),
    setFileContent: _setFileContent(self),
    saveFileContent: _saveFileContent(self),
  }))
  .actions((self) => ({
    afterCreate() {
      self._setupCheckForHostFileChanges();
    },
  }));

/* ---------------------- Check for host files changes ---------------------- */
// Method to check for file changes

function _setupCheckForHostFileChanges(_self: unknown) {
  return () => {
    setInterval(async () => {
      const self = _self as Instance<typeof FileManagerModel>;
      if (self.fileHandle) {
        const fileHandle = self.fileHandle;
        try {
          const file = await fileHandle.getFile();
          const content = await file.text();
          if (content !== self.fileContent) {
            self.setFileContent(content);
            console.log("File content updated from external changes");
          }
        } catch (error) {
          console.error("Error reading file:", error);
        }
      }
    }, 1000);
  };
}

/* ---------------------------- Save file content --------------------------- */

function _saveFileContent(_self: unknown) {
  return flow(function* (content: string) {
    // eslint-disable-next-line
    const self = _self as Instance<typeof FileManagerModel> as any;
    if (self.fileHandle && self.fileContent !== content) {
      console.log("Saving file...");
      try {
        self.isSaving = true;
        const writable = yield self.fileHandle.createWritable();
        yield writable.write(content);
        yield writable.close();
        self.isSaving = false;
        self.lastSaved = new Date();
        // self.setFileContent(content);
        console.log("File saved successfully");
      } catch (error) {
        console.error("Error saving file:", error);
        ToastQueue.negative(
          "Saving file failed, probably due to a permission issue.",
        );
        self.isSaving = false;
      }
    }
  });
}

/* ---------------------------- Set File Content ---------------------------- */

const _setFileContent = (_self: unknown) => (content: string | null) => {
  const self = _self as Instance<typeof FileManagerModel>;
  self.fileContent = content;
};

/* ------------------------- Select and read a file ------------------------- */
// Action to select and read a file

const _openFilePicker = (_self: unknown) =>
  flow(function* () {
    const self = _self as Instance<typeof FileManagerModel>;

    if ("showOpenFilePicker" in window) {
      try {
        //eslint-disable-next-line
        const [fileHandle] = yield window.showOpenFilePicker({
          types: [
            {
              description: "Codeplot file",
              accept: {
                "application/json": [".codeplot"],
              },
            },
          ],
        });
        self.fileHandle = fileHandle;
        const file = yield fileHandle.getFile();
        const content = yield file.text();
        self.setFileContent(content);
        self.initialFileContent = content;
      } catch (error) {
        console.error(`Error selecting file: ${error}`);
      }
    } else {
      throw new Error(
        "The File System Access API is not supported in this browser.",
      );
    }
  });
