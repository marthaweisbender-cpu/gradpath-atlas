# AGENTS.md — GradPath Atlas

Operating rules for any AI agent working in this repo.

## Context
- Course assignment (MKTG 4150, CUHK). See `project-plan.md` for goals, deadline, grading.
- Specs: `PRD.md` (what), `tasklist.md` (order). Read both before coding.

## Hard rules
- English only. No real names, emails, phones, addresses, or real university data. Fictional seed data only.
- No secrets in the repo. No `.env` committed.
- One tasklist item at a time. Run its verification gate before marking `[x]`.
- Do not add features outside PRD Phase 1. Phase 2 ideas go to `tasklist.md` → Deferred.
- 3 failed fixes → stop, `git checkout . && git clean -fd` to last green commit, reassess.
- Keep code, comments, and docs concise and goal-oriented. No decorative comments.

## Stack
Vite · React 18 · TypeScript (strict) · Tailwind · React Router (hash) · Zustand (persist → localStorage) · Vitest · Playwright · GitHub Actions → GitHub Pages (`base: /gradpath-atlas/`).

## Commands
```
npm run dev        # local
npm run build      # gate: zero TS errors
npm run test       # Vitest
npm run e2e        # Playwright smoke
npm run lint
```

## Conventions
- Conventional commits (`feat:`, `fix:`, `docs:`, `chore:`).
- Components in `src/components`, pages in `src/pages`, store in `src/store`, seed data in `src/data`.
- Desktop-first; responsive but optimised ≥1280 px. WCAG 2.2 AA: contrast ≥4.5:1, visible focus, labelled inputs.
- Images: CC0 or AI-generated only.
