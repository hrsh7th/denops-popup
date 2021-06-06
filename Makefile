
.PHONY: fmt
fmt:
	deno fmt *.ts

.PHONY: lint
lint:
	deno lint *.ts

.PHONY: test
test:
	DENOPS_POPUP_TEST=1 \
	DENOPS_PATH=/Users/hiroshi_shichita/Develop/Vim/denops.vim \
	DENOPS_TEST_VIM=vim \
	DENOPS_TEST_NVIM=nvim \
	deno test --unstable -A

