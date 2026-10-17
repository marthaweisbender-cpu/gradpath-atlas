# GradPath Atlas

Master's application planning workspace for final-year students: compare programmes, reuse documents, track deadlines and tasks in one place. Built for MKTG 4150 New Product Management, Team Assignment 1 (CUHK, 2026/27 T1).

- **Live app:** https://marthaweisbender-cpu.github.io/gradpath-atlas/
- **Repository:** https://github.com/marthaweisbender-cpu/gradpath-atlas
- **Specs:** [PRD.md](PRD.md) · [tasklist.md](tasklist.md) · agent rules in [AGENTS.md](AGENTS.md)

All universities, programmes and people in the app are fictional.

## Stack
Vite 8 · React 19 · TypeScript (strict) · Tailwind CSS 4 · React Router 7 (hash) · Zustand (persisted to localStorage) · Vitest · Playwright · GitHub Actions → GitHub Pages.

Phase 1 has no backend: authentication is simulated client-side and all data stays in the browser (see PRD §4). Phase 2 plans Supabase + Stripe.

## Setup
```
npm ci
npm run dev        # http://localhost:5173/gradpath-atlas/
npm run build      # type-check + production build → dist/
npm test -- --run  # unit tests
npm run e2e        # Playwright smoke (builds preview server; set CHROMIUM_PATH to reuse a local Chromium)
npm run lint
```

## Student testing checklist
1. Sign up (any email, 8+ char password), accept the data notice → dashboard shows demo programmes.
2. Compare: sort by deadline, filter by status, toggle columns.
3. Open a programme: change status, link a document to a requirement, add a note.
4. Tasks: "Submit Port Meridian application" is locked until "Request reference" is done.
5. Documents: change a document to *ready* and watch readiness rise on the dashboard.
6. Deadlines: items within 14 days are flagged.
7. Adviser review: export CSV, print to PDF.
8. Pricing: upgrade (test mode) → free-plan limit of 3 programmes lifts.
9. Settings: reset demo data; erase everything.

## Post-MVP improvements
- Supabase backend with Auth, Postgres and row-level security; multi-device sync
- Adviser accounts, share links and comments
- Stripe Checkout and webhooks for Application Pass and licences
- Email / calendar reminders for deadlines
- Optional import of programme requirements (clearly labelled)
- Cohort analytics for careers services
