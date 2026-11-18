# Development

## Setup

Requires Node.js 20+ and npm. Run `npm install`, then `npm run dev`. Visit `http://localhost:3000`.

No `.env` files, keys, services, accounts, or database setup exist or are needed.

## Verification checklist

```bash
npm test            # Vitest — 17 tests
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
