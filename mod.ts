import { Denops, ensureNumber, load } from "./deps.ts";

const once = <A extends unknown[], R extends Promise<unknown>>(
  f: (...args: A) => R,
) => {
  let v: R | undefined;
  return (...args: A): R => {
    return (Deno.env.get("DENOPS_POPUP_TEST") !== "1" && v) || (v = f(...args));
  };
};

const init = once(async (denops: Denops) => {
  const path = new URL(".", import.meta.url);
  path.pathname = path.pathname + "popup.vim";
  await load(denops, path);
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
  denops: Denops,
  bufnr: number,
  style: PopupWindowStyle,
): Promise<number> => {
  await init(denops);
  const winid = await denops.call("Denops_popup_window_open", bufnr, style);
  ensureNumber(winid);
  return winid;
};

/**
 * Move popup window.
 */
export const move = async (
  denops: Denops,
  winid: number,
  style: PopupWindowStyle,
): Promise<void> => {
  await init(denops);
  await assert(denops, winid);
  await denops.call("Denops_popup_window_move", winid, style);
};

/**
 * Close popup window.
 */
export const close = async (denops: Denops, winid: number): Promise<void> => {
  await init(denops);
  await assert(denops, winid);
  await denops.call("Denops_popup_window_close", winid);
};

/**
 * Get if specified popup window visible or not.
 */
export const info = async (
  denops: Denops,
  winid: number,
): Promise<PopupWindowInfo> => {
  await init(denops);
  await assert(denops, winid);
  return await denops.call(
    "Denops_popup_window_info",
    winid,
  ) as PopupWindowInfo;
};

/**
 * Get if specified popup window is visible or not.
 *
 * NOTE: If specified winid is not a popup window, this API always returns false.
 */
export const isVisible = async (
  denops: Denops,
  winid: number,
): Promise<boolean> => {
  await init(denops);
  const is = await denops.call("Denops_popup_window_is_visible", winid);
  ensureNumber(is);
  return (is === 1) && isPopupWindow(denops, winid);
};

/**
 * Assert if specified winid is popup or not.
*/
export const isPopupWindow = async (
  denops: Denops,
  winid: number,
): Promise<boolean> => {
  await init(denops);
  const is = await denops.call("Denops_popup_window_is_popup_window", winid);
  ensureNumber(is);
  return is === 1;
};

const assert = async (denops: Denops, winid: number): Promise<void> => {
  if (!(await isPopupWindow(denops, winid))) {
    throw new TypeError(`Invalid winid: ${winid} is not a popup window.`);
  }
};
