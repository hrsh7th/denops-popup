DENOPS_TEST_VIM := vim
DENOPS_TEST_NVIM := nvim
DENOPS_PATH := ../denops.vim

.PHONY: fmt
fmt:
	deno fmt

.PHONY: lint
lint:
	deno lint

.PHONY: test
test:
	DENOPS_TEST_VIM=${DENOPS_TEST_VIM} \
	DENOPS_TEST_NVIM=${DENOPS_TEST_NVIM} \
	DENOPS_PATH=${DENOPS_PATH} \
		deno test --unstable -A

