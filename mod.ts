import { Vim, ensureNumber } from './deps.ts';

const once = <A extends unknown[], R>(f: (...args: A) => R) => {
  return (...args: A): R => {
    return f(...args);
  };
};

const init = once(async () => {
  const path = new URL('.', import.meta.url);
  path.pathname = path.pathname + 'popup.vim';
  await Vim.get().load(path);
});

/**
 * popup window style definition.
 */
type PopupWindowStyle = { row: number; col: number; width: number; height: number; border?: boolean; origin?: 'topleft' | 'topright' | 'topcenter' | 'bottomleft' | 'bottomright' | 'bottomcenter' | 'centerleft' | 'centerright' | 'centercenter'};

/**
 * popup window information.
 */
type PopupWindowInfo = { row: number; col: number; width: number; height: number; topline: number; };

/**
 * Open popup window.
 */
export const open = async (bufnr: number, style: PopupWindowStyle): Promise<number> => {
  await init();
  const winid = await Vim.get().call('g:Denops_popup_window_open', bufnr, style);
  ensureNumber(winid);
  return winid;
};

/**
 * Move popup window.
 */
export const move = async (winid: number, style: PopupWindowStyle): Promise<void> => {
  await init();
  await assert(winid);
  await Vim.get().call('g:Denops_popup_window_move', winid, style);
};

/**
 * Close popup window.
 */
export const close = async (winid: number): Promise<void> => {
  await init();
  await assert(winid);
  await Vim.get().call('g:Deops_popup_window_close', winid);
};

/**
 * Get if specified popup window visible or not.
 */
export const info = async (winid: number): Promise<PopupWindowInfo> => {
  await init();
  await assert(winid);
  return await Vim.get().call('g:Deops_popup_window_info', winid) as PopupWindowInfo;
};

/**
 * Get if specified popup window visible or not.
 */
export const isVisible = async (winid: number): Promise<void> => {
  await init();
  await assert(winid);
  await Vim.get().call('g:Deops_popup_window_is_visible', winid);
};

/**
 * Assert if specified winid is popup or not.
*/
export const isPopupWindow = async (winid: number): Promise<boolean> => {
  await init();
  const isPopupWindow = await Vim.get().call('g:Deops_popup_window_is_popup_window', winid);
  ensureNumber(isPopupWindow);
  return isPopupWindow === 1;
};

const assert = async (winid: number): Promise<void> => {
  if (await isPopupWindow(winid)) {
    throw new TypeError(`Invalid winid: ${winid} is not a popup window.`);
  }
};

