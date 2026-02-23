# pi-extensions

Personal extensions for the pi coding agent.

## Current extensions

- `colon-commands.ts` — Vim-like `:` command shortcuts:
  - `:q` / `:quit` → quit pi
  - `:m` / `:model` → prefill native `/model` command in editor

## Wiring

This repo is linked into pi auto-discovery via symlink:

- `~/.pi/agent/extensions/colon-commands.ts` → `~/works/pi-extensions/colon-commands.ts`

After edits, run `/reload` in pi to apply changes.
