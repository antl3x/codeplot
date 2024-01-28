import { types, flow } from 'mobx-state-tree';

export const FileModel = types.model({
    fileContent: types.maybeNull(types.string),
  })
  .volatile(() => ({
    fileHandle: null as FileSystemFileHandle | null,
  }))
  .actions(self => ({
    setFileContent(content: string | null) {
      self.fileContent = content;
    }})).actions(self => ({
  // Action to select and read a file
  selectAndReadFile: flow(function* () {
    if ('showOpenFilePicker' in window) {
      try {
        const [fileHandle] = yield window.showOpenFilePicker();
        self.fileHandle = fileHandle; // Set the volatile file handle
        const file = yield fileHandle.getFile();
        const content = yield file.text();
        self.setFileContent(content);
      } catch (error) {
        console.error(`Error selecting file: ${error}`);
      }
    } else {
      console.error("The File System Access API is not supported in this browser.");
    }
  }),
  // Method to check for file changes
  checkForChanges: flow(function* () {
    if (self.fileHandle) {
      const file = yield self.fileHandle.getFile();
      const content = yield file.text();
      if (content !== self.fileContent) {
        self.setFileContent(content);
        console.log('File content updated');
      }
    }
  })
}));
