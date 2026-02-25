import type { ExtensionAPI, ExtensionContext } from "@mariozechner/pi-coding-agent";
import { Type } from "@sinclair/typebox";
import { basename } from "node:path";

type SessionInfo = {
  pid: number;
  cwd: string;
  sessionFile?: string;
  sessionId?: string;
};

function extractSessionId(sessionFile?: string): string | undefined {
  if (!sessionFile) return undefined;
  const stem = basename(sessionFile, ".jsonl");
  const match = stem.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i);
  return match?.[1];
}

function getSessionInfo(ctx: ExtensionContext): SessionInfo {
  const sessionFile = ctx.sessionManager.getSessionFile() ?? undefined;
  return {
    pid: process.pid,
    cwd: ctx.cwd,
    sessionFile,
    sessionId: extractSessionId(sessionFile),
  };
}

function formatSessionInfo(info: SessionInfo): string {
  return [
    `pid=${info.pid}`,
    `cwd=${info.cwd}`,
    `session_file=${info.sessionFile ?? ""}`,
    `session_id=${info.sessionId ?? ""}`,
  ].join("\n");
}

export default function (pi: ExtensionAPI) {
  pi.registerCommand("session-file", {
    description: "Show current PID, session file, and session ID",
    handler: async (_args, ctx) => {
      const info = getSessionInfo(ctx);
      const text = formatSessionInfo(info);

      // Keep only the highlighted transcript entry.
      pi.sendMessage({
        customType: "session-context",
        content: text,
        display: true,
        details: info,
      });
    },
  });

  pi.registerTool({
    name: "get_current_session",
    label: "Get Current Session",
    description: "Return the current pi process PID, current session JSONL path, and session ID UUID.",
    parameters: Type.Object({}),
    async execute(_toolCallId, _params, _signal, _onUpdate, ctx) {
      const info = getSessionInfo(ctx);
      const text = formatSessionInfo(info);

      return {
        content: [{ type: "text", text }],
        details: info,
      };
    },
  });
}
