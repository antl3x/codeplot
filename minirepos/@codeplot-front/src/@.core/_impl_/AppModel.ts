import { ToastQueue } from "@react-spectrum/toast";
import {
  StoreSnapshot,
  TLRecord,
  TLShape,
  Editor as TldrawEditor,
  debounce,
} from "@tldraw/editor";
import { Instance, types } from "mobx-state-tree";
import { typeid } from "typeid-js";
import { DEFAULT_TLDR_SNAPSHOT } from "./DEFAULT_TLDR_SNAPSHOT";

/* -------------------------------------------------------------------------- */
/*                                 ThemeModel                                 */
/* -------------------------------------------------------------------------- */
const ThemeModel = types
  .model({
    name: "default",
    color: types.union(types.literal("dark"), types.literal("light")),
  })
  .actions((self) => ({
    setThemeColor(theme: "light" | "dark") {
      self.color = theme;
    },
  }));

/* -------------------------------------------------------------------------- */
/*                                  FileModel                                 */
/* -------------------------------------------------------------------------- */

const FileModel = types
  .model("File", {
    minCodeplotVersion: types.literal("0.0.1"),
    tldrSnapshot: types.frozen<StoreSnapshot<TLRecord>>(DEFAULT_TLDR_SNAPSHOT),
  })
  .actions((self) => ({
    setTldrSnapshot(snapshot: StoreSnapshot<TLRecord>) {
      self.tldrSnapshot = snapshot;
    },
  }));
/* -------------------------------------------------------------------------- */
/*                                    FileManagerModel                                   */
/* -------------------------------------------------------------------------- */

const FileManagerModel = types
  .model({
    openedFile: types.maybe(FileModel),
  })
  .actions((self) => ({
    _setOpenedFile(file: Instance<typeof FileModel>) {
      self.openedFile = file;
    },
  }))
  .actions((self) => ({
    /* ------------------------- Open Snapshot File Hook ------------------------ */
    useOpenSnapshotFile() {
      const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const fileContent = JSON.parse(e.target?.result as string);
            try {
              const file = FileModel.create({
                ...fileContent,
              });

              file.setTldrSnapshot(fileContent.tldrSnapshot);

              self._setOpenedFile(file);
            } catch (e) {
              ToastQueue.negative("This file is invalid or corrupted.");
              console.error(e);
            }
          };
          reader.readAsText(file);
        }
      };

      return {
        onChange,
      };
    },

    /* ----------------------------- Create New File ---------------------------- */
    useCreateNewFile() {
      const onClick = () => {
        self._setOpenedFile(
          FileModel.create({
            minCodeplotVersion: "0.0.1",
            tldrSnapshot: DEFAULT_TLDR_SNAPSHOT,
          }),
        );
      };

      return {
        onClick,
      };
    },
  }));

/* -------------------------------------------------------------------------- */
/*                                  AppModel                                  */
/* -------------------------------------------------------------------------- */

const AppModel = types
  .model("App", {
    wsHost:
      import.meta.env.VITE_TARGET === "localhost" ||
      import.meta.env.VITE_TARGET === "selfhost"
        ? "ws://localhost:9108"
        : "wss://api.codeplot.co",
    roomId: typeid("room").toString(),
    fileManager: FileManagerModel,
    theme: ThemeModel,
  })
  .views((self) => ({
    get wsUrl() {
      return `${self.wsHost}/${self.roomId}`;
    },
  }))
  .volatile(() => ({
    tldrEditor: null as TldrawEditor | null,
    tldrEditorListeners: [] as (() => void)[],
  }))
  .actions((self) => ({
    setTldrEditor(editor: TldrawEditor) {
      self.tldrEditor = editor;

      // Sync the snapshot with the file manager
      const lin = editor.store.listen(
        debounce(() => {
          self.fileManager.openedFile?.setTldrSnapshot(
            editor.store.getSnapshot(),
          );
        }, 1000),
      );

      /* ---------------------------- autoZoomListener ---------------------------- */
      /**
       * # Overview
       * We want to zoom to the selection when a new shape is added to the canvas.
       */
      const autoZoomListener = editor.store.listen((entry) => {
        const rec = entry?.changes?.added;
        const recId = Object.keys(rec)?.[0] as TLShape["id"];
        if (!recId) return;

        editor.select(rec[recId] as TLShape);
        editor.zoomToSelection();
        editor.zoomToBounds(editor.getSelectionPageBounds()!);
        editor.resetZoom();
        editor.zoomToSelection();
      });

      /* ------------------------------------ - ----------------------------------- */

      self.tldrEditorListeners.push(lin);
      self.tldrEditorListeners.push(autoZoomListener);
    },
    beforeDestroy() {
      self.tldrEditorListeners.forEach((lin) => lin());
    },
  }));

export const appStore = AppModel.create({
  fileManager: {},
  theme: {
    color: "dark",
    name: "default",
  },
});
