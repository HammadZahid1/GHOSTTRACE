# GHOSTTRACE

**Ghosttrace Intelligence Investigation System** — *"Uncover the Connections. Reconstruct the Truth."*

An interactive, **100% frontend-only** digital intelligence and forensic analysis environment for exploring **fictional** evidence, detecting textual patterns, mapping entity relationships, reconstructing event timelines, and generating structured reports.

> **Educational / portfolio demonstration only.** All scenarios, people, organizations, and evidence are fictional. GHOSTTRACE is not an OSINT, surveillance, or real-world investigation tool. It performs deterministic local computation — **no LLM, no external AI inference, no backend, no API keys**.

## Features

- Cinematic landing page with a procedural Three.js intelligence core
- Responsive application shell with collapsible sidebar, command palette (Ctrl/Cmd+K), global search (Ctrl/Cmd+F)
- Investigation overview command center + four complete fictional scenarios
- Evidence Vault: drag-and-drop local TXT/CSV/JSON/Markdown import, search, filters, preview, metadata, export
- Document Analyzer: tokenizer, word frequency, keywords, unigrams/bigrams/trigrams, candidate patterns, highlighting, history, JSON/TXT export
- Entity Intelligence: six entity categories, manual create/edit/delete, notes, relationship linking
- Connection Graph: interactive 3D/2D force-directed network, filters, BFS shortest path, centrality metrics
- Timeline Reconstruction: horizontal/vertical views, zoom, filters, unverified-time states, review workflow, reordering, export
- Pattern Observatory: frequency charts, co-occurrence, temporal clusters, visible methodology, correlation ≠ causation warning
- Investigation Canvas: draggable cards, connections, notes, groups, minimap, zoom, local persistence
- Report Generator: classified sections (source-backed / detected / unverified / methodology), Markdown/JSON/print export
- System Monitor: local activity, analysis history, explicitly labeled simulated metrics
- Settings: workspace JSON export/import with schema validation, privacy controls

## Technology

Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · Three.js / React Three Fiber / Drei · Recharts · Framer Motion · Lucide React · Zustand · Vitest · ESLint 9.

## Installation

```bash
git clone https://github.com/HammadZahid1/GHOSTTRACE.git
cd GHOSTTRACE
npm install
npm run dev
```

Open `http://localhost:3000`. No configuration, services, or environment variables are required.

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm test` | Run Vitest unit tests |
| `npm run lint` | ESLint check |
| `npx tsc --noEmit` | TypeScript check |

## Project structure

```
src/app/                 routes (landing + (workspace) route group)
src/components/          common UI, layout, landing, graph, dialogs
src/engines/             tokenizer, frequency, ngrams, statistics, similarity, patterns, graph, timeline, pattern-detection, reports
src/data/scenarios.ts    four fictional datasets
src/stores/              Zustand stores (UI, investigations, evidence, entities, relationships, timeline, canvas, analysis)
src/utils/               class helper, workspace import/export
src/tests/               Vitest suites
docs/                    additional documentation
```

## Architecture overview

Static scenario data + user-provided local text feed deterministic TypeScript engines; results are rendered through React, SVG, Recharts, and React Three Fiber. State is kept in Zustand with selective `localStorage` persistence. There is no server, database, or network transmission anywhere in the application.

## Sample datasets

`Project Nightfall`, `The Meridian Archive`, `Echo Protocol`, and `Glass Horizon` — each with 12 entities, 18 relationships, 16 events, and 8 evidence documents with coherent cross-references.

## Local analysis methodology

See [METHODOLOGY.md](METHODOLOGY.md). All extraction uses tokenization, frequency counting, regular expressions, dataset lookups, and graph algorithms. Confidence values describe **method reliability**, never the probability that a person performed an action.

## Privacy

See [PRIVACY.md](PRIVACY.md). **Your evidence remains in your browser. GHOSTTRACE does not upload documents to external services.**

## Testing

`npm test` (17 tests), `npm run lint`, `npx tsc --noEmit`, and `npm run build` all pass. Tests cover text engines, graph traversal/shortest path, dataset integrity, timeline operations, pattern detection, report generation, and import validation.

## Known limitations

- Rule-based extraction is not named-entity recognition; it can miss or misclassify patterns.
- Captured file contents are held in memory (not persisted) to avoid large `localStorage` writes.
- System Monitor CPU/GPU values are explicitly simulated; browsers do not expose real counters.
- 3D views require WebGL; a static fallback is used otherwise.
- Correlation and shared references are never proof of causation or conduct.

## Roadmap

- Additional fictional scenarios and document formats
- IndexedDB persistence for large local documents
- More graph layout algorithms and temporal clustering methods
- Improved accessible canvas keyboard interactions

## Contributing

Issues and pull requests are welcome. Keep all sample data fictional, preserve frontend-only operation, add tests for new algorithms, and never introduce external services or credentials.

## License

MIT
