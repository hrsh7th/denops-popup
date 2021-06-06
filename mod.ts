import { ensureNumber, Vim } from "./deps.ts";

const once = <A extends unknown[], R extends Promise<unknown>>(
  f: (...args: A) => R,
) => {
  let v: R | undefined;
  return (...args: A): R => {
    return (Deno.env.get("DENOPS_POPUP_TEST") !== "1" && v) || (v = f(...args));
  };
};

const init = once(async (vim: Vim) => {
  const path = new URL(".", import.meta.url);
  path.pathname = path.pathname + "popup.vim";
  await vim.load(path);
});

/**
 * popup window style definition.
 */
type PopupWindowStyle = {
  row: number;
  col: number;
  width: number;
  height: number;
  border?: boolean;
  topline?: number;
  origin?:
    | "topleft"
    | "topright"
    | "topcenter"
    | "bottomleft"
    | "bottomright"
    | "bottomcenter"
    | "centerleft"
    | "centerright"
    | "centercenter";
};

/**
 * popup window information.
 */
type PopupWindowInfo = {
  row: number;
  col: number;
  width: number;
  height: number;
  topline: number;
};

/**
 * Open popup window.
 */
export const open = async (
  vim: Vim,
  bufnr: number,
  style: PopupWindowStyle,
): Promise<number> => {
  await init(vim);
  const winid = await vim.call("g:Denops_popup_window_open", bufnr, style);
  ensureNumber(winid);
  return winid;
};

/**
 * Move popup window.
 */
export const move = async (
  vim: Vim,
  winid: number,
  style: PopupWindowStyle,
): Promise<void> => {
  await init(vim);
  await assert(vim, winid);
  await vim.call("g:Denops_popup_window_move", winid, style);
};

/**
 * Close popup window.
 */
export const close = async (vim: Vim, winid: number): Promise<void> => {
  await init(vim);
  await assert(vim, winid);
  await vim.call("g:Denops_popup_window_close", winid);
};

/**
 * Get if specified popup window visible or not.
 */
export const info = async (
  vim: Vim,
  winid: number,
): Promise<PopupWindowInfo> => {
  await init(vim);
  await assert(vim, winid);
  return await vim.call("g:Denops_popup_window_info", winid) as PopupWindowInfo;
};

/**
 * Get if specified popup window is visible or not.
 *
 * NOTE: If specified winid is not a popup window, this API always returns false.
 */
export const isVisible = async (vim: Vim, winid: number): Promise<boolean> => {
  await init(vim);
  const is = await vim.call("g:Denops_popup_window_is_visible", winid);
  ensureNumber(is);
  return (is === 1) && isPopupWindow(vim, winid);
};

/**
 * Assert if specified winid is popup or not.
*/
export const isPopupWindow = async (
  vim: Vim,
  winid: number,
): Promise<boolean> => {
  await init(vim);
  const is = await vim.call("g:Denops_popup_window_is_popup_window", winid);
  ensureNumber(is);
  return is === 1;
};

const assert = async (vim: Vim, winid: number): Promise<void> => {
  if (!(await isPopupWindow(vim, winid))) {
    throw new TypeError(`Invalid winid: ${winid} is not a popup window.`);
  }
};
