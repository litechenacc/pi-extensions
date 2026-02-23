# pi-extensions

Personal extension repository for the **pi coding agent**.

This repo is the source of truth for your custom pi extensions, while pi auto-loads them through symlinks under `~/.pi/agent/extensions/`.

---

## Included extension

### `colon-commands.ts`
Vim-like `:` command behavior:

- `:q` / `:quit` → quit pi
- `:m` / `:model` → prefill native `/model` command in the editor (press **Enter** to open the built-in model picker)

Also provides slash aliases:

- `/q` → quit pi
- `/m` → model helper behavior

---

## Directory layout

```text
~/works/pi-extensions/
├── colon-commands.ts
├── .gitignore
└── README.md
```

pi auto-discovery path (symlink target):

```text
~/.pi/agent/extensions/colon-commands.ts -> ~/works/pi-extensions/colon-commands.ts
```

---

## Setup (already done)

If you recreate on another machine:

1. Clone repo into `~/works/pi-extensions`
2. Ensure extension directory exists:
   - `mkdir -p ~/.pi/agent/extensions`
3. Link extension into pi discovery path:
   - `ln -sfn ~/works/pi-extensions/colon-commands.ts ~/.pi/agent/extensions/colon-commands.ts`
4. In pi, run:
   - `/reload`

---

## Development workflow

1. Edit extension in this repo:
   - `~/works/pi-extensions/colon-commands.ts`
2. Reload pi runtime:
   - `/reload`
3. Quick test:
   - `:m` then Enter
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
