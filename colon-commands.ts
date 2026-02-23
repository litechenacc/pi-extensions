import type { ExtensionAPI, ExtensionContext } from "@mariozechner/pi-coding-agent";

function isCurrentModel(ctx: ExtensionContext, provider: string, id: string): boolean {
  return !!ctx.model && ctx.model.provider === provider && ctx.model.id === id;
}

async function openModelSelector(pi: ExtensionAPI, ctx: ExtensionContext, query?: string): Promise<void> {
  const models = ctx.modelRegistry.getAll();
  if (models.length === 0) {
    ctx.ui.notify("No models found in registry", "warning");
    return;
  }

  const q = (query ?? "").trim().toLowerCase();
  const filtered = q
    ? models.filter((m) => {
        const key = `${m.provider}/${m.id}`.toLowerCase();
        const name = (m.name ?? "").toLowerCase();
        return key.includes(q) || name.includes(q) || m.id.toLowerCase().includes(q) || m.provider.toLowerCase().includes(q);
      })
    : models;

  if (filtered.length === 0) {
    ctx.ui.notify(`No models match "${query}"`, "warning");
    return;
  }

  let target = filtered[0];

  if (filtered.length > 1) {
    const options = filtered.map((m) => {
      const key = `${m.provider}/${m.id}`;
      const current = isCurrentModel(ctx, m.provider, m.id) ? " (current)" : "";
      return `${key}${current} — ${m.name}`;
    });

    const selected = await ctx.ui.select("Select model", options);
    if (!selected) return;

    const idx = options.indexOf(selected);
    if (idx < 0) return;
    target = filtered[idx];
  }

  const ok = await pi.setModel(target);
  if (!ok) {
    ctx.ui.notify(`No API key for ${target.provider}/${target.id}`, "error");
    return;
  }

  ctx.ui.notify(`Model set: ${target.provider}/${target.id}`, "info");
}

export default function (pi: ExtensionAPI) {
  // Optional slash aliases too
  pi.registerCommand("q", {
    description: "Quit pi",
    handler: async (_args, ctx) => {
      ctx.shutdown();
    },
  });

  pi.registerCommand("m", {
    description: "Select model (like /model)",
    handler: async (args, ctx) => {
      await openModelSelector(pi, ctx, args);
    },
  });

  // Colon shortcuts: :q and :m
  pi.on("input", async (event, ctx) => {
    if (event.source === "extension") return { action: "continue" as const };

    const text = event.text.trim();
    if (!text.startsWith(":")) return { action: "continue" as const };

    const body = text.slice(1).trim();
    if (!body) return { action: "handled" as const };

    const spaceIdx = body.indexOf(" ");
    const cmd = (spaceIdx === -1 ? body : body.slice(0, spaceIdx)).toLowerCase();
    const args = (spaceIdx === -1 ? "" : body.slice(spaceIdx + 1)).trim();

    if (cmd === "q" || cmd === "quit") {
      ctx.shutdown();
      return { action: "handled" as const };
    }

    if (cmd === "m" || cmd === "model") {
      // Use built-in /model flow by pre-filling the editor so the native TUI command UX is preserved.
      // User only needs to press Enter.
      ctx.ui.setEditorText(args ? `/model ${args}` : "/model ");
      ctx.ui.notify("Prepared /model in editor (press Enter)", "info");
      return { action: "handled" as const };
    }

    ctx.ui.notify('Unsupported colon command. Use :q or :m [query]', "warning");
    return { action: "handled" as const };
  });
}
