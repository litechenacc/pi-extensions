# pi-extensions

Personal extension repository for the **pi coding agent**.

This repo is the source of truth for your custom pi extensions, while pi auto-loads them through the symlinked `~/.pi/agent/extensions` folder.

---

## Included extensions

### `colon-commands.ts`
Vim-like `:` command behavior:

- `:q` / `:quit` → quit pi
- `:m` / `:model` → prefill native `/model` command in the editor (press **Enter** to open the built-in model picker)

Also provides slash aliases:

- `/q` → quit pi
- `/m` → model helper behavior

### `session-context.ts`
Provides direct session context for the current pi instance:

- slash command `/session-file` to show PID + current session file + session ID
- tool `get_current_session` for the LLM to read current `pid`, `sessionFile`, and `sessionId`

This removes the need for PID tracker temp files.

---

## Directory layout

```text
~/works/pi-extensions/
├── colon-commands.ts
├── session-context.ts
├── .gitignore
└── README.md
```

pi auto-discovery path (folder symlink):

```text
~/.pi/agent/extensions -> ~/works/pi-extensions
```

---

## Setup (recommended)

If you recreate on another machine:

1. Clone repo into `~/works/pi-extensions`
2. Replace extension discovery folder with a symlink:
   - `rm -rf ~/.pi/agent/extensions`
   - `ln -sfn ~/works/pi-extensions ~/.pi/agent/extensions`
3. In pi, run:
   - `/reload`

---

## Development workflow

1. Edit extensions in this repo:
   - `~/works/pi-extensions/*.ts`
2. Reload pi runtime:
   - `/reload`
3. Quick tests:
   - `:m` then Enter
   - `/session-file`
   - `:q`

---

## Git

- Default branch: `main`
- Global git default branch is configured as `main` (`git config --global init.defaultBranch main`)

Common commands:

```bash
git status
git add .
git commit -m "feat: ..."
```
