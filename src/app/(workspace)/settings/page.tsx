"use client";

import { useState } from "react";
import { Download, ShieldCheck, Upload, Trash2 } from "lucide-react";
import { Badge, Button, Panel } from "@/components/common";
import { ModuleHeader } from "@/components/layout/ModuleHeader";
import { applyWorkspace, downloadWorkspace, validateWorkspace } from "@/utils/workspace-io";

export default function SettingsPage() {
  const [message, setMessage] = useState("");
  const storageAvailable = typeof window !== "undefined" && Boolean(window.localStorage);

  return (
    <>
      <ModuleHeader eyebrow="System / Settings" title="Settings"
        description="Workspace preferences, data portability, and privacy controls."
        actions={<Badge tone="success" dot>Local workspace</Badge>} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Data portability" eyebrow="Local storage">
          <p className="text-xs leading-relaxed text-text-secondary">
            Export your workspace preferences, investigations, evidence metadata, entities,
            relationships, timeline edits, and canvas state as a single JSON file.
            Import validates the structure before applying it.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" variant="primary" icon={<Download className="h-3.5 w-3.5" />} onClick={downloadWorkspace}>Export workspace</Button>
            <label className="flex h-8 cursor-pointer items-center gap-2 rounded-lg border border-panel-border px-3 text-xs text-text-secondary hover:border-cyan/40">
              <Upload className="h-3.5 w-3.5" /> Import workspace
              <input type="file" accept=".json" className="hidden" onChange={async (e) => {
                try {
                  const f = e.target.files?.[0]; if (!f) return;
                  const parsed = JSON.parse(await f.text());
                  const count = applyWorkspace(validateWorkspace(parsed));
                  setMessage(`Imported ${count} workspace entries. Reload to apply.`);
                } catch (err) { setMessage(`Import rejected: ${(err as Error).message}`); }
                e.target.value = "";
              }} />
            </label>
          </div>
          {message && <p className="mt-3 rounded border border-panel-border bg-panel p-2 font-mono text-[0.7rem] text-text-secondary">{message}</p>}
        </Panel>

        <Panel title="Privacy" eyebrow="Data handling">
          <div className="flex gap-3">
            <ShieldCheck className="h-5 w-5 shrink-0 text-success" />
            <div>
              <p className="text-xs text-text-primary">Your evidence remains in your browser. GHOSTTRACE does not upload documents to external services.</p>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                Imported file contents are kept in memory; only scenario data and harmless preferences
                are persisted. No authentication, telemetry, API keys, or external inference exist.
              </p>
            </div>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded border border-panel-border p-2"><dt className="gt-label">Storage</dt><dd className="mt-1 text-text-secondary">{storageAvailable ? "localStorage available" : "in-memory fallback"}</dd></div>
            <div className="rounded border border-panel-border p-2"><dt className="gt-label">Network calls</dt><dd className="mt-1 text-text-secondary">none</dd></div>
          </dl>
        </Panel>

        <Panel title="Preferences" eyebrow="Interface">
          <ul className="space-y-2 text-xs text-text-secondary">
            <li>Sidebar collapsed state — saved automatically</li>
            <li>Reduced motion — respected from your OS setting</li>
            <li>Command palette — Ctrl/Cmd + K</li>
            <li>Global search — Ctrl/Cmd + F</li>
            <li>Save canvas — Ctrl/Cmd + S</li>
          </ul>
        </Panel>

        <Panel title="Reset" eyebrow="Danger zone">
          <p className="text-xs text-text-secondary">Clear all local workspace state from this browser. This cannot be undone.</p>
          <Button className="mt-4" size="sm" variant="danger" icon={<Trash2 className="h-3.5 w-3.5" />} onClick={() => {
            const keys = ["ghosttrace:ui-preferences", "ghosttrace:investigations", "ghosttrace:evidence", "ghosttrace:entities", "ghosttrace:relationships", "ghosttrace:timeline", "ghosttrace:canvas"];
            keys.forEach((k) => localStorage.removeItem(k));
            setMessage("Local workspace cleared. Reload to restore defaults.");
          }}>Clear local data</Button>
        </Panel>
      </div>
    </>
  );
}
