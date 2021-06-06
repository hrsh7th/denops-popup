# denops-popup

vim/neovim's floating/popup window polyfill for denops.

## API

### `open`

Open popup window with specified buffer.

```typescript
import { open } from "https://deno.land/x/denops_popup/mod.ts";

await open(vim, bufnr, {
  row: 1,
  col: 1,
  width: 20,
  height: 20,
});
```

### `move`

Move specified popup window.

```typescript
import { move } from "https://deno.land/x/denops_popup/mod.ts";

await move(vim, winid, {
  row: 1,
  col: 1,
  width: 20,
  height: 20,
});
```

### `close`

Close specified popup window.

```typescript
import { close } from "https://deno.land/x/denops_popup/mod.ts";

await close(vim, winid);
```

### `info`

Get specified popup window's information.

```typescript
import { info } from "https://deno.land/x/denops_popup/mod.ts";

console.log(await info(vim, winid));
```

### `isVisible`

Get if specified popup window is visible or not.

```typescript
import { isVisible } from "https://deno.land/x/denops_popup/mod.ts";

console.log(await isVisible(vim, winid));
```

### `isPopupWindow`

Get if specified popup window is popup window or not.

```typescript
import { isPopupWindow } from "https://deno.land/x/denops_popup/mod.ts";

console.log(await isPopupWindow(vim, winid));
```

## NOTE

The APIs excepts open, isVisible and isPopupWindow will throw error if provided
winid is not a popup window.
