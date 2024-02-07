import { appStore } from "@.core";
import { debounce } from "@.utils";
import { Editor } from "@tldraw/editor";
import { IReactionDisposer, reaction } from "mobx";
import { Instance, types } from "mobx-state-tree";

/* -------------------------------------------------------------------------- */
/*                                    Model                                   */
/* -------------------------------------------------------------------------- */

const TldrawModel = types
  .model("Tldraw")
  .volatile(() => ({
    tldrEditor: null as Editor | null,
    _setupReloadStoreOnFileChangesReaction: null as null | IReactionDisposer,
  }))
  .actions((self) => ({
    setTtldrEditor: _setTldrEditor(self),
    onDestroy() {
      if (self._setupReloadStoreOnFileChangesReaction) {
        self._setupReloadStoreOnFileChangesReaction();
      }
    },
  }));

/* -------------------------- Attach TlDraw Editor -------------------------- */

const _setTldrEditor = (_self: unknown) => (editor: Editor) => {
  const self = _self as Instance<typeof TldrawModel>;
  if (self.tldrEditor) return;

  self.tldrEditor = editor;

  _setupSaveFileOnStoreChanges(self);
  _setupReloadStoreOnFileChanges(self);

  self.tldrEditor.user.updateUserPreferences({
    isDarkMode: appStore.theme.color === "dark",
  });
};

/* -------------------- Setup save file on store changes -------------------- */

const _setupSaveFileOnStoreChanges = (_self: unknown) => {
  const self = _self as Instance<typeof TldrawModel>;

  if (!self.tldrEditor) return;
  if (!appStore.fileManager.fileContent) return;

  const saveDebounced = debounce(appStore.fileManager.saveFileContent, 1000);

  self.tldrEditor.store.listen(
    () => {
      saveDebounced(JSON.stringify(self.tldrEditor!.store.getSnapshot()));
    },
    { source: "user", scope: "all" },
  );
};

/* ------------------- Setup reload store on file changes ------------------- */

const _setupReloadStoreOnFileChanges = (_self: unknown) => {
  const self = _self as Instance<typeof TldrawModel>;

  if (!self.tldrEditor) return;
  if (!appStore.fileManager.fileContent) return;

  self._setupReloadStoreOnFileChangesReaction = reaction(
    () => appStore.fileManager.fileContent,
    () => {
      const tldrEditor = self.tldrEditor!;
      const previousCamera = tldrEditor.getCamera()!;

      tldrEditor.store.loadSnapshot(
        JSON.parse(appStore.fileManager.fileContent!),
      );

      tldrEditor!.getInstanceState().isFocused = true;

      tldrEditor.setCamera({
        x: previousCamera.x,
        y: previousCamera.y,
        z: previousCamera.z,
      });
    },
  );
};

/* -------------------------------------------------------------------------- */
/*                                    Store                                   */
/* -------------------------------------------------------------------------- */

export const tldrawStore = TldrawModel.create({});
