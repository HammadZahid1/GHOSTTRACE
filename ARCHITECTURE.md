# Architecture

## Layers

1. **Static data** — `src/data/scenarios.ts` builds four fictional scenarios deterministically from typed tuples. Every entity, relationship, event, and evidence reference is validated by `validateScenario`.
2. **Analysis engines** — pure TypeScript functions in `src/engines/`: text tokenization/frequency/n-grams/statistics/similarity, regex-based candidate patterns, deterministic force-directed graph layout, BFS traversal and shortest path, chronological filtering, pattern counting, and report construction.
3. **State** — Zustand stores in `src/stores/` isolate concerns: UI preferences, investigations, evidence metadata, local entities, relationships, timeline edits, canvas state, and analysis history. `localStorage` persistence is selective; uploaded file contents stay in memory.
4. **Presentation** — App Router routes under `src/app/(workspace)` share a shell (sidebar, top bar, command palette). Reusable primitives live in `src/components/common`; 3D visualization in `src/components/visuals` and `src/components/graph`. Charts use Recharts; the hero and graph use React Three Fiber with WebGL fallbacks.

## Routing

Public: `/`. Workspace: `/workspace`, `/investigations`, `/evidence`, `/analyzer`, `/entities`, `/graph`, `/timeline`, `/patterns`, `/canvas`, `/reports`, `/monitor`, `/settings`.

The `(workspace)` folder is a route group — it does not appear in URLs.

## Data flow

```
sample scenarios / local imported text
        ↓
   Zustand stores (validated)
        ↓
   pure analysis engines
        ↓
  React views (SVG / Recharts / R3F)
        ↓
  Markdown / JSON export or localStorage preferences
```

## Performance & safety

- Heavy 3D modules are dynamically imported (`ssr: false`), with static fallbacks when WebGL is unavailable.
- Three.js scenes use additive point clouds, line segments, and primitive geometry; no downloaded assets.
- Graph layouts run a fixed iteration count with seeded initial positions — results are reproducible.
- Document contents are treated as untrusted strings and rendered as text, never as HTML.
- JSON imports are schema-validated before being applied.
