import { types } from "mobx-state-tree";
import { NEW_FILE_CONTENT } from "./NEW_FILE_CONTENT";
import fastJsonPatch from "fast-json-patch";
import type { Operation } from "fast-json-patch";

/* -------------------------------------------------------------------------- */
/*                                  FileModel                                 */
/* -------------------------------------------------------------------------- */

export const FileModel = types
  .model("File", {
    schemaVersion: 1,
    tldrawFile: JSON.stringify(NEW_FILE_CONTENT),
  })
  .actions((self) => ({
    applyTldrFilePatch(patch: Operation[]) {
      const patchOp = fastJsonPatch.applyPatch(
        JSON.parse(self.tldrawFile),
        patch,
      );

      const newDoc = patchOp?.[0]?.newDocument;

      if (newDoc) {
        self.tldrawFile = JSON.stringify(newDoc);
      }
    },
  }));
