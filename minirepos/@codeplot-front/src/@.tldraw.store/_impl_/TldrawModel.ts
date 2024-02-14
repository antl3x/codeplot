import { appStore } from "@.core";
import { Editor } from "@tldraw/editor";
import { compare } from "fast-json-patch";
import { IReactionDisposer, reaction } from "mobx";
import { Instance, types } from "mobx-state-tree";

/* -------------------------------------------------------------------------- */
/*                                    Model                                   */
/* -------------------------------------------------------------------------- */

const TldrawModel = types
  .model("Tldraw")
  .volatile(() => ({
    tldrEditor: null as Editor | null,
    _setupReloadStoreOnFileChanges: null as null | IReactionDisposer,
  }))
  .actions((self) => ({
    setTtldrEditor: _setTldrEditor(self),
    onDestroy() {
      if (self._setupReloadStoreOnFileChanges) {
        self._setupReloadStoreOnFileChanges();
      }
    },
  }));

/* -------------------------- Attach TlDraw Editor -------------------------- */

const _setTldrEditor = (_self: unknown) => (editor: Editor) => {
  const self = _self as Instance<typeof TldrawModel>;
  if (self.tldrEditor) return;

  self.tldrEditor = editor;

  _setupJsonDiffOnStoreChanges(self);
  _setupReloadStoreOnFileChanges(self);
  _setupColorModeSync(self);

  self.tldrEditor.user.updateUserPreferences({
    isDarkMode: appStore.theme.color === "dark",
  });
};

/* -------------------- Setup save file on store changes -------------------- */

const _setupJsonDiffOnStoreChanges = (_self: unknown) => {
  const self = _self as Instance<typeof TldrawModel>;

  if (!self.tldrEditor) return;
};

/* -------------------- Setup color mode sync -------------------- */

const _setupColorModeSync = (_self: unknown) => {
  const self = _self as Instance<typeof TldrawModel>;

  if (!self.tldrEditor) return;
  if (!appStore.fileManager.fileContent) return;

  reaction(
    () => appStore.theme.color,
    (color) => {
      self.tldrEditor!.user.updateUserPreferences({
        isDarkMode: color === "dark",
      });
    },
  );
};

/* ------------------- Setup reload store on file changes ------------------- */

const _setupReloadStoreOnFileChanges = (_self: unknown) => {
  const self = _self as Instance<typeof TldrawModel>;

  if (!self.tldrEditor) return;
  if (!appStore.fileManager.fileContent) return;

  self._setupReloadStoreOnFileChanges = reaction(
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
