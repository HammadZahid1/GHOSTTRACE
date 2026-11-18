/** Workspace export/import helpers. All data stays in the browser. */

const KEYS = [
  "ghosttrace:ui-preferences", "ghosttrace:investigations", "ghosttrace:evidence",
  "ghosttrace:entities", "ghosttrace:relationships", "ghosttrace:timeline", "ghosttrace:canvas",
];

export interface WorkspaceBundle {
  format: "ghosttrace-workspace";
  version: 1;
  exportedAt: string;
  data: Record<string, unknown>;
}

export function exportWorkspace(): WorkspaceBundle {
  const data: Record<string, unknown> = {};
  for (const key of KEYS) {
    const raw = localStorage.getItem(key);
    if (raw) {
      try { data[key] = JSON.parse(raw); } catch { /* skip corrupt entries */ }
    }
  }
  return { format: "ghosttrace-workspace", version: 1, exportedAt: new Date().toISOString(), data };
}

/** Validate unknown imported JSON before applying it. */
export function validateWorkspace(value: unknown): WorkspaceBundle {
  if (!value || typeof value !== "object") throw new Error("Invalid workspace: expected an object");
  const w = value as Partial<WorkspaceBundle>;
  if (w.format !== "ghosttrace-workspace" || w.version !== 1) throw new Error("Unrecognized workspace format/version");
  if (!w.data || typeof w.data !== "object" || Array.isArray(w.data)) throw new Error("Invalid workspace data");
  for (const [key, entry] of Object.entries(w.data)) {
    if (!KEYS.includes(key)) throw new Error(`Unexpected workspace key: ${key}`);
    if (!entry || typeof entry !== "object") throw new Error(`Invalid entry for ${key}`);
  }
  return w as WorkspaceBundle;
}

export function applyWorkspace(w: WorkspaceBundle): number {
  let applied = 0;
  for (const [key, entry] of Object.entries(w.data)) {
    localStorage.setItem(key, JSON.stringify(entry));
    applied++;
  }
  return applied;
}

export function downloadWorkspace() {
  const blob = new Blob([JSON.stringify(exportWorkspace(), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "ghosttrace-workspace.json"; a.click();
  URL.revokeObjectURL(url);
}
