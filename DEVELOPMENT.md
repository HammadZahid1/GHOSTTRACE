# Development

## Setup

Requires Node.js 20+ and npm. Run `npm install`, then `npm run dev`. Visit `http://localhost:3000`.

No `.env` files, keys, services, accounts, or database setup exist or are needed.

## Verification checklist

```bash
npm test            # Vitest — 20 tests
npm run lint        # ESLint 9 flat config
npx tsc --noEmit    # strict TypeScript
npm run build       # production build
```

## Conventions

- Keep algorithms in `src/engines/` and state in `src/stores/`; components should stay presentational.
- Type all domain objects using `src/types/index.ts`.
- Use the `cn()` helper for conditional class names and the shared design tokens in `src/app/globals.css`.
- Add unit tests for each new engine function.
- All scenario content must remain fictional and coherent; references must resolve between datasets.
- Never add network calls, analytics, secrets, backend code, or external model APIs.

## Commit policy

Meaningful incremental commits only; each milestone is verified then pushed individually. No force pushes and no history rewrites.

## Accessibility

Keyboard navigation, focus-visible rings, semantic landmarks, dialog roles, reduced-motion handling, and mobile drawer navigation are implemented. Keep new controls labeled and reachable by keyboard.

## Release v0.1.0 verification

| Check | Result |
|---|---|
| `npm run lint` | passed (0 errors, 0 warnings) |
| `npx tsc --noEmit` | passed |
| `npm test` | 5 files / 20 tests passed |
| `npm run build` | passed — all routes prerendered |

## Known limitations

Rule-based extraction is approximate; browser heap metrics are best-effort; 3D views need WebGL (static fallback provided); uploaded file contents are memory-only by design.
