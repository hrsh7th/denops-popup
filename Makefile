DENOPS_TEST_VIM ?= vim
DENOPS_TEST_NVIM ?= nvim

.PHONY: fmt
fmt:
	deno fmt

.PHONY: lint
lint:
	deno lint

.PHONY: test
test:
	deno lint
	deno fmt --check
	DENOPS_POPUP_TEST=1 deno test --unstable -A

