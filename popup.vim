if exists('g:loaded_denops_popup')
  finish
endif
let g:loaded_denops_popup = v:true

function! g:Denops_popup_window_open(...) abort
  return call(function('s:_open'), a:000)
endfunction

function! g:Denops_popup_window_move(...) abort
  return call(function('s:_move'), a:000)
endfunction

function! g:Denops_popup_window_close(...) abort
  return call(function('s:_close'), a:000)
endfunction

function! g:Denops_popup_window_info(...) abort
  return call(function('s:_info'), a:000)
endfunction

function! g:Denops_popup_window_is_visible(...) abort
  return call(function('s:_is_visible'), a:000)
endfunction

function! g:Denops_popup_window_is_popup_window(...) abort
  return call(function('s:_is_popup_window'), a:000)
endfunction

"
" _open
"
if has('nvim')
  function! s:_open(bufnr, style) abort
    return nvim_open_win(a:bufnr, v:false, s:_style(a:style))
  endfunction
else
  function! s:_open(bufnr, style) abort
    return popup_create(a:bufnr, s:_style(a:style))
  endfunction
endif

"
" _close
"
if has('nvim')
  function! s:_close(winid) abort
    call nvim_win_close(a:winid, v:true)
  endfunction
else
  function! s:_close(winid) abort
    call popup_close(a:winid)
  endfunction
endif

"
" _move
"
if has('nvim')
  function! s:_move(winid, style) abort
    call nvim_win_set_config(a:winid, s:_style(a:style))
  endfunction
else
  function! s:_move(winid, style) abort
    call popup_move(a:winid, s:_style(a:style))
  endfunction
endif

"
" _info
"
if has('nvim')
  function! s:_info(winid) abort
    let l:info = getwininfo(a:winid)[0]
    return {
    \   'row': l:info.winrow,
    \   'col': l:info.wincol,
    \   'width': l:info.width,
    \   'height': l:info.height,
    \   'topline': l:info.topline,
    \ }
  endfunction
else
  function! s:_info(winid) abort
    let l:pos = popup_getpos(a:winid)
    return {
    \   'row': l:pos.core_line,
    \   'col': l:pos.core_col,
    \   'width': l:pos.core_width,
    \   'height': l:pos.core_height,
    \   'topline': l:pos.firstline,
    \ }
  endfunction
endif

"
" _is_visible
"
if has('nvim')
  function! s:_is_visible(winid) abort
    try
      return !!(type(a:winid) == type(0) && nvim_win_is_valid(a:winid) && nvim_win_get_number(a:winid) != -1)
    catch /.*/
    endtry
    return 0
  endfunction
else
  function! s:_is_visible(winid) abort
    return !!(type(a:winid) == type(0) && winheight(a:winid) != -1)
  endfunction
endif

"
" _is_popup_window
"
if has('nvim')
  function! s:_is_popup_window(winid) abort
    try
      let l:config = nvim_win_get_config(a:winid)
      return !!(empty(l:config) || !empty(get(l:config, 'relative', '')))
    catch /.*/
    endtry
    return 0
  endfunction
else
  function! s:_is_popup_window(winid) abort
    return !!(winheight(a:winid) != -1 && win_id2win(a:winid) == 0)
  endfunction
endif

"
" _style
"
if has('nvim')
  function! s:_style(style) abort
    let l:style = s:_resolve_origin(a:style)
    let l:style = s:_resolve_border(l:style)
    let l:style = {
    \   'relative': 'editor',
    \   'row': l:style.row - 1,
    \   'col': l:style.col - 1,
    \   'width': l:style.width,
    \   'height': l:style.height,
    \   'focusable': v:true,
    \   'style': 'minimal',
    \   'border': has_key(l:style, 'border') ? l:style.border : 'none',
    \ }
    if !exists('*win_execute') " We can't detect neovim features via patch version so we try it by function existence.
      unlet l:style.border
    endif
    return l:style
  endfunction
else
  function! s:_style(style) abort
    let l:style = s:_resolve_origin(a:style)
    let l:style = s:_resolve_border(l:style)
    return {
    \   'line': l:style.row,
    \   'col': l:style.col,
    \   'pos': 'topleft',
    \   'wrap': v:false,
    \   'moved': [0, 0, 0],
    \   'scrollbar': 0,
    \   'maxwidth': l:style.width,
    \   'maxheight': l:style.height,
    \   'minwidth': l:style.width,
    \   'minheight': l:style.height,
    \   'tabpage': 0,
    \   'firstline': get(l:style, 'topline', 1),
    \   'padding': [0, 0, 0, 0],
    \   'border': has_key(l:style, 'border') ? [1, 1, 1, 1] : [0, 0, 0, 0],
    \   'borderchars': get(l:style, 'border', []),
    \   'fixed': v:true,
    \ }
  endfunction
endif

"
" _resolve_origin
"
function! s:_resolve_origin(style) abort
  if index(['topleft', 'topright', 'bottomleft', 'bottomright', 'topcenter', 'bottomcenter'], get(a:style, 'origin', '')) == -1
    let a:style.origin = 'topleft'
  endif

  if a:style.origin ==# 'topleft'
    let a:style.col = a:style.col
    let a:style.row = a:style.row
  elseif a:style.origin ==# 'topright'
    let a:style.col = a:style.col - (a:style.width - 1)
    let a:style.row = a:style.row
  elseif a:style.origin ==# 'bottomleft'
    let a:style.col = a:style.col
    let a:style.row = a:style.row - (a:style.height - 1)
  elseif a:style.origin ==# 'bottomright'
    let a:style.col = a:style.col - (a:style.width - 1)
    let a:style.row = a:style.row - (a:style.height - 1)
  elseif a:style.origin ==# 'topcenter'
    let a:style.col = a:style.col - float2nr(a:style.width / 2)
    let a:style.row = a:style.row
  elseif a:style.origin ==# 'bottomcenter'
    let a:style.col = a:style.col - float2nr(a:style.width / 2)
    let a:style.row = a:style.row - (a:style.height - 1)
  elseif a:style.origin ==# 'centercenter'
    let a:style.col = a:style.col - float2nr(a:style.width / 2)
    let a:style.row = a:style.row - float2nr(a:style.height / 2)
  endif
  return a:style
endfunction

"
" _resolve_border
"
if has('nvim')
  function! s:_resolve_border(style) abort
    if !empty(get(a:style, 'border', v:null))
      if &ambiwidth ==# 'single'
        let a:style.border = ['┌', '─', '┐', '│', '┘', '─', '└', '│']
      else
        let a:style.border = ['+', '-', '+', '|', '+', '-', '+', '|']
      endif
    elseif has_key(a:style, 'border')
      unlet a:style.border
    endif
    return a:style
  endfunction
else
  function! s:_resolve_border(style) abort
    if !empty(get(a:style, 'border', v:null))
      if &ambiwidth ==# 'single'
        let a:style.border = ['─', '│', '─', '│', '┌', '┐', '┘', '└']
      else
        let a:style.border = ['-', '|', '-', '|', '+', '+', '+', '+']
      endif
    elseif has_key(a:style, 'border')
      unlet a:style.border
    endif
    return a:style
  endfunction
endif

