import { appStore } from "@.core";
import { ToastQueue } from "@react-spectrum/toast";
import {
  TLUiMenuGroup,
  TLUiMenuSchema,
  TLUiOverrides,
  TldrawUiContextProviderProps,
  findMenuItem,
  menuItem,
} from "@tldraw/tldraw";
import { getSnapshot } from "mobx-state-tree";

/* -------------------------------------------------------------------------- */
/*                              Actions Overrides                             */
/* -------------------------------------------------------------------------- */

const _actionsOverrides: TLUiOverrides["actions"] = (
  editor,
  actions,
  helpers,
) => {
  let newActions = actions;
  newActions = _saveSnapshotFileTldrawAction(editor, newActions, helpers);
  newActions = _openGithubTldrawAction(editor, newActions, helpers);
  newActions = _toggleDarkMode(editor, newActions, helpers);
  newActions = _copyRoomUrlTldrawAction(editor, newActions, helpers);
  newActions = _openDiscordTldrawAction(editor, newActions, helpers);

  return newActions;
};

/* -------------------------------------------------------------------------- */
/*                               Menu Overrides                               */
/* -------------------------------------------------------------------------- */

const _menuOverrides: TLUiOverrides["menu"] = (editor, menu, helpers) => {
  let newMenu = menu;
  newMenu = _saveSnapshotFileTldrawMenu(editor, newMenu, helpers);
  newMenu = _openGithubMenu(editor, newMenu, helpers);
  newMenu = _removeEmbedMenu(newMenu);
  newMenu = _removeUploadMediaMenu(newMenu);
  newMenu = _copyRoomUrl(editor, newMenu, helpers);
  newMenu = _openDiscordMenu(editor, newMenu, helpers);

  return newMenu;
};

/* -------------------------------------------------------------------------- */
/*                                   Actions                                  */
/* -------------------------------------------------------------------------- */

const _openGithubTldrawAction: NonNullable<TLUiOverrides["actions"]> = (
  _,
  actions,
) => {
  actions["open-github"] = {
    id: "open-github",
    label: "Github",
    readonlyOk: true,
    onSelect() {
      window.open("https://github.com/codeplot-co/codeplot");
    },
  };
  return actions;
};

/* ------------------------ _openDiscordTldrawAction ------------------------ */

const _openDiscordTldrawAction: NonNullable<TLUiOverrides["actions"]> = (
  _,
  actions,
) => {
  actions["open-discord"] = {
    id: "open-discord",
    label: "Join Discord",
    readonlyOk: true,
    onSelect() {
      window.open("https://codeplot.co/discord");
    },
  };
  return actions;
};

/* ------------------------------ Copy Room URL ----------------------------- */

const _copyRoomUrlTldrawAction: NonNullable<TLUiOverrides["actions"]> = (
  _,
  actions,
) => {
  actions["copy-room-url"] = {
    id: "copy-room-url",
    label: "Copy Room URL",
    readonlyOk: true,
    onSelect() {
      navigator.clipboard.writeText(appStore.wsUrl);
      ToastQueue.neutral("Room url copied to clipboard!", {
        timeout: 3000,
      });
    },
  };
  return actions;
};

/* ---------------------------- Toggle Dark Mode ---------------------------- */

const _toggleDarkMode: NonNullable<TLUiOverrides["actions"]> = (_, actions) => {
  actions["toggle-dark-mode"] = {
    ...actions["toggle-dark-mode"],
    onSelect() {
      appStore.theme.setThemeColor(
        appStore.theme.color === "dark" ? "light" : "dark",
      );

      appStore.tldrEditor?.user.updateUserPreferences({
        isDarkMode: appStore.theme.color === "dark",
      });
    },
  };
  return actions;
};

/* ------------------------ Open Codeplot File Action ----------------------- */

const _saveSnapshotFileTldrawAction: NonNullable<TLUiOverrides["actions"]> = (
  _,
  actions,
) => {
  actions["save-snapshot-file"] = {
    id: "save-snapshot-file",
    label: "Save Snapshot File",
    readonlyOk: true,
    kbd: "$u",
    onSelect() {
      // get snapshot and save file prompt user
      const snapshot = getSnapshot(appStore.fileManager).openedFile;
      const blob = new Blob([JSON.stringify(snapshot)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Snapshot.codeplot";
      a.click();
    },
  };
  return actions;
};

/* -------------------------------------------------------------------------- */
/*                                    Menus                                   */
/* -------------------------------------------------------------------------- */

/* ---------------------------- Remove Embed Menu --------------------------- */

const _removeEmbedMenu = (menu: TLUiMenuSchema) => {
  const extrasMenu = findMenuItem(menu, ["extras"]) as TLUiMenuGroup;
  extrasMenu.children = extrasMenu.children.filter(
    (item) => item?.id !== "insert-embed",
  );

  return menu;
};

/* ---------------------------- Remove UploadMedia Menu --------------------------- */

const _removeUploadMediaMenu = (menu: TLUiMenuSchema) => {
  const extrasMenu = findMenuItem(menu, ["extras"]) as TLUiMenuGroup;
  extrasMenu.children = extrasMenu.children.filter(
    (item) => item?.id !== "insert-media",
  );

  return menu;
};

/* ---------------------------- Open Github Menu ---------------------------- */

export const _openGithubMenu: NonNullable<TLUiOverrides["menu"]> = (
  _,
  menu,
  { actions },
) => {
  menu.push(menuItem(actions["open-github"]));
  return menu;
};

/* ---------------------------- Open Discord Menu --------------------------- */

export const _openDiscordMenu: NonNullable<TLUiOverrides["menu"]> = (
  _,
  menu,
  { actions },
) => {
  menu.push(menuItem(actions["open-discord"]));
  return menu;
};

/* ------------------------------ Copy Room URL ----------------------------- */

export const _copyRoomUrl: NonNullable<TLUiOverrides["menu"]> = (
  _,
  menu,
  { actions },
) => {
  menu.push(menuItem(actions["copy-room-url"]));
  return menu;
};

/* ------------------------- Open Codeplot File Menu ------------------------ */

const _saveSnapshotFileTldrawMenu: NonNullable<TLUiOverrides["menu"]> = (
  _,
  menu,
  { actions },
) => {
  const fileMenu = findMenuItem(menu, ["menu", "file"]);
  if (fileMenu.type === "submenu") {
    const newMenuItem = menuItem(actions["save-snapshot-file"]);
    fileMenu.children.unshift(newMenuItem);
  }
  return menu;
};

/* -------------------------------------------------------------------------- */
/*                               _toolsOverrides                              */
/* -------------------------------------------------------------------------- */

const _toolsOverrides: TLUiOverrides["tools"] = (_, tools) => {
  return tools;
};

/* -------------------------------------------------------------------------- */
/*                              _toolbarOverrides                             */
/* -------------------------------------------------------------------------- */

const _toolbarOverrides: TLUiOverrides["toolbar"] = (_, toolbar) => {
  return toolbar.filter((item) => {
    return item;
  });
};
/* -------------------------------------------------------------------------- */
/*                                  Overrides                                 */
/* -------------------------------------------------------------------------- */

export const overrides: TldrawUiContextProviderProps["overrides"] = {
  actions: _actionsOverrides,
  menu: _menuOverrides,
  toolbar: _toolbarOverrides,
  tools: _toolsOverrides,
};
