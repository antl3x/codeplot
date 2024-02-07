import { fileStore } from "@.core.files";
import {
  TLUiMenuGroup,
  TLUiMenuSchema,
  TLUiOverrides,
  TldrawUiContextProviderProps,
  findMenuItem,
  menuItem,
} from "@tldraw/tldraw";

/* -------------------------------------------------------------------------- */
/*                              Actions Overrides                             */
/* -------------------------------------------------------------------------- */

const _actionsOverrides: TLUiOverrides["actions"] = (
  editor,
  actions,
  helpers,
) => {
  let newActions = actions;
  newActions = _openCodeplotFileTldrawAction(editor, newActions, helpers);
  newActions = _openGithubTldrawAction(editor, newActions, helpers);

  return newActions;
};

/* -------------------------------------------------------------------------- */
/*                               Menu Overrides                               */
/* -------------------------------------------------------------------------- */

const _menuOverrides: TLUiOverrides["menu"] = (editor, menu, helpers) => {
  let newMenu = menu;
  newMenu = _openCodeplotFileTldrawMenu(editor, newMenu, helpers);
  newMenu = _openGithubMenu(editor, newMenu, helpers);
  newMenu = _removeEmbedMenu(newMenu);
  newMenu = _removeUploadMediaMenu(newMenu);

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

/* ------------------------ Open Codeplot File Action ----------------------- */

const _openCodeplotFileTldrawAction: NonNullable<TLUiOverrides["actions"]> = (
  _,
  actions,
) => {
  actions["open-codeplot-file"] = {
    id: "open-codeplot-file",
    label: "Open Codeplot File",
    readonlyOk: true,
    kbd: "$u",
    onSelect() {
      fileStore.openFilePicker();
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

/* ------------------------- Open Codeplot File Menu ------------------------ */

const _openCodeplotFileTldrawMenu: NonNullable<TLUiOverrides["menu"]> = (
  _,
  menu,
  { actions },
) => {
  const fileMenu = findMenuItem(menu, ["menu", "file"]);
  if (fileMenu.type === "submenu") {
    const newMenuItem = menuItem(actions["open-codeplot-file"]);
    fileMenu.children.unshift(newMenuItem);
  }
  return menu;
};

/* -------------------------------------------------------------------------- */
/*                                  Overrides                                 */
/* -------------------------------------------------------------------------- */

export const overrides: TldrawUiContextProviderProps["overrides"] = {
  actions: _actionsOverrides,
  menu: _menuOverrides,
};
