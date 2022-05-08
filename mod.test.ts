import { assertEquals, assertRejects } from "https://deno.land/std@0.138.0/testing/asserts.ts";
import { test } from "https://deno.land/x/denops_std@v3.3.1/test/mod.ts";
import * as popup from "./mod.ts";

test({
  name: "Basic usage",
  mode: "all",
  fn: async (denops) => {
    await denops.cmd("new");
    const bufnr = 2;
    const state = {
      closed: false,
    };
    const winid = await popup.open(denops, bufnr, {
      row: 3,
      col: 3,
      width: 10,
      height: 10,
      topline: 1,
    }, {
      onClose: () => {
        state.closed = true;
      },
    });
    assertEquals(await popup.isVisible(denops, winid), true);
    assertEquals(await popup.info(denops, winid), {
      row: 3,
      col: 3,
      width: 10,
      height: 10,
      topline: 1,
    });
    assertEquals(await popup.list(denops), [winid]);

    await popup.move(denops, winid, {
      row: 5,
      col: 5,
      width: 12,
      height: 12,
      topline: 1,
    });
    assertEquals(await popup.isVisible(denops, winid), true);
    assertEquals(await popup.info(denops, winid), {
      row: 5,
      col: 5,
      width: 12,
      height: 12,
      topline: 1,
    });

    assertEquals(state.closed, false);
    await popup.close(denops, winid);
    assertEquals(state.closed, true);
    assertEquals(await popup.isVisible(denops, winid), false);
    await assertRejects(async () => {
      await popup.info(denops, winid); // should throw error because the window already closed.
    });
    assertEquals(await popup.list(denops), []);
  },
});
