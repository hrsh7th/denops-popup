import { assertEquals, assertThrowsAsync, Denops, Vim } from "./deps.ts";
import * as popup from "./mod.ts";

Denops.test({
  name: "Basic usage",
  mode: "both",
  fn: async (denops) => {
    const vim = new Vim(denops);
    const bufnr = await vim.fn.bufadd("popup");

    const winid = await popup.open(vim, bufnr, {
      row: 3,
      col: 3,
      width: 10,
      height: 10,
      topline: 1,
    });
    assertEquals(await popup.isVisible(vim, winid), true);
    assertEquals(await popup.info(vim, winid), {
      row: 3,
      col: 3,
      width: 10,
      height: 10,
      topline: 1,
    });

    await popup.move(vim, winid, {
      row: 5,
      col: 5,
      width: 12,
      height: 12,
      topline: 1,
    });
    assertEquals(await popup.isVisible(vim, winid), true);
    assertEquals(await popup.info(vim, winid), {
      row: 5,
      col: 5,
      width: 12,
      height: 12,
      topline: 1,
    });

    await popup.close(vim, winid);
    assertEquals(await popup.isVisible(vim, winid), false);
    await assertThrowsAsync(async () => {
      await popup.info(vim, winid); // should throw error because the window already closed.
    });
  },
});
