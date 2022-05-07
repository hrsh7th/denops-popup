import { Denops, assertNumber, load, once } from "./deps.ts";

const memo = <A extends unknown[], R extends Promise<unknown>>(
  f: (denops: Denops, ...args: A) => R,
) => {
  let v: R | undefined;
  return (denops: Denops, ...args: A): R => {
    return (denops.meta.mode !== "test" && v) || (v = f(denops, ...args));
  };
};

const noop = () => {
  return Promise.resolve();
};

const init = memo(async (denops: Denops) => {
  const path = new URL(".", import.meta.url);
  path.pathname = path.pathname + "popup.vim";
  await load(denops, path);
});

/**
 * popup window style definition.
 */
export type PopupWindowStyle = {
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
    | "centercenter";
};

/**
 * popup window information.
 */
export type PopupWindowInfo = {
  row: number;
  col: number;
  width: number;
  height: number;
  topline: number;
};

/**
 * Open popup window.
 */
export async function open(
  denops: Denops,
  bufnr: number,
  style: PopupWindowStyle,
  event?: {
    onClose: () => unknown;
  },
): Promise<number> {
  await init(denops);
  const [onClose] = once(denops, event?.onClose ?? noop);
  const winid = await denops.call("Denops_popup_window_open", bufnr, style, {
    onClose: [denops.name, onClose],
  });
  assertNumber(winid);
  return winid;
}

/**
 * Move popup window.
 */
export async function move(
  denops: Denops,
  winid: number,
  style: PopupWindowStyle,
): Promise<void> {
  await init(denops);
  await assert(denops, winid);
  await denops.call("Denops_popup_window_move", winid, style);
}

/**
 * Close popup window.
 */
export async function close(denops: Denops, winid: number): Promise<void> {
  await init(denops);
  await assert(denops, winid);
  await denops.call("Denops_popup_window_close", winid);
}

/**
 * Return PopupWindowInfo for the specified winid.
 */
export async function info(
  denops: Denops,
  winid: number,
): Promise<PopupWindowInfo> {
  await init(denops);
  await assert(denops, winid);
  return await denops.call(
    "Denops_popup_window_info",
    winid,
  ) as PopupWindowInfo;
}

/**
 * Return the specified winid is visible or not.
 *
 * NOTE: If specified winid is not a popup window, this API always return false.
 */
export async function isVisible(
  denops: Denops,
  winid: number,
): Promise<boolean> {
  await init(denops);
  const is = await denops.call("Denops_popup_window_is_visible", winid);
  assertNumber(is);
  return (is === 1) && isPopupWindow(denops, winid);
}

/**
 * Return the specified winid is popup or not.
 *
 * NOTE: If specified winid is not a valid window, this API always return false.
*/
export async function isPopupWindow(
  denops: Denops,
  winid: number,
): Promise<boolean> {
  await init(denops);
  const is = await denops.call("Denops_popup_window_is_popup_window", winid);
  assertNumber(is);
  return is === 1;
}

const assert = async (denops: Denops, winid: number): Promise<void> => {
  if (!(await isPopupWindow(denops, winid))) {
    throw new TypeError(`Invalid winid: ${winid} is not a popup window.`);
  }
};
