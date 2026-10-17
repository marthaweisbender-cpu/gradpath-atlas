# tasklist.md — GradPath Atlas (Phase 1)

Rules: execute strictly the first `- [ ]` item; run its Verification Gate; only then mark `- [x]`. Gates: **Build** = `npm run build` zero errors; **Test** = `npm test -- --run` green; **Dev** = page renders at `npm run dev` without console errors; **Visual** = check at 1440 px and 375 px.

## Module 1 — Environment
- [x] 1.1 Scaffold Vite + React + TypeScript project. Gate: Build.
- [x] 1.2 Add Tailwind 4, React Router, Zustand, Vitest, Playwright, Prettier. Gate: Build.
- [x] 1.3 Configure `vite.config.ts` (`base: /gradpath-atlas/`, vitest), `playwright.config.ts`, `.gitignore`. Gate: Build.
- [x] 1.4 Add GitHub Actions workflow `deploy.yml` (lint → test → build → Pages). Gate: YAML valid.
- [x] 1.5 `git init`, first commit. Gate: `git log` shows commit.

## Module 2 — Data layer
- [x] 2.1 Define TypeScript types for all PRD §5 entities in `src/data/types.ts`. Gate: Build.
- [x] 2.2 Create fictional seed data in `src/data/seed.ts` (4 universities, 6 programmes, requirements, 7 documents, tasks with dependencies, notes, 1 adviser). Gate: Build + unit test asserting referential integrity.
- [x] 2.3 Create persisted Zustand store `src/store/useAppStore.ts` with CRUD actions for programmes, requirements, documents, tasks, notes, status records. Gate: Test (store actions).
- [x] 2.4 Add derived selectors `src/store/selectors.ts`: readiness per programme, upcoming deadlines with risk, missing items, document reuse matrix. Gate: Test (selectors).

## Module 3 — Authentication (simulated)
- [x] 3.1 Add auth slice: `signUp`, `signIn`, `signOut`, `resetPassword` with SHA-256 hashing via Web Crypto. Gate: Test (hashing + flow).
- [x] 3.2 Build `/signup`, `/login`, `/reset` pages with validation and error states; PICS notice on sign-up. Gate: Dev + Visual.
- [x] 3.3 Add `RequireAuth` route guard redirecting to `/login`. Gate: Dev (unauthenticated `/app` redirects).

## Module 4 — Core UI
- [x] 4.1 App shell: sidebar nav, top bar, content area, responsive collapse. Gate: Visual.
- [x] 4.2 Landing page `/` with hero, value props, CTA, pricing teaser. Gate: Visual (hero above 667 px fold).
- [x] 4.3 Dashboard `/app`: stat cards, next deadlines, missing items, programme progress. Gate: Dev.
- [x] 4.4 Programme comparison `/app/compare`: sortable (`aria-sort`), filterable table with column toggles and status chips. Gate: Dev + Test (sort/filter).
- [x] 4.5 Programme detail `/app/programmes/:id`: header, status select, requirements with document linking, tasks, notes. Gate: Dev.
- [x] 4.6 Add/edit programme dialog (and university inline create). Gate: Dev.
- [x] 4.7 Tasks `/app/tasks`: grouped by programme, dependency badge blocks completion until prerequisite done. Gate: Test (dependency rule).
- [x] 4.8 Documents `/app/documents`: list with status, reuse matrix document × programme. Gate: Dev.
- [x] 4.9 Deadlines `/app/deadlines`: date-sorted timeline with overdue / <14 d / ok flags. Gate: Dev.
- [x] 4.10 Adviser review `/app/adviser`: read-only summary, print stylesheet, CSV export. Gate: Dev (CSV downloads).
- [x] 4.11 Settings `/app/settings`: profile, plan display, reset demo data, clear all data. Gate: Dev.
- [x] 4.12 Empty, loading, validation and error states on every list and form. Gate: Visual.

## Module 5 — Pricing
- [x] 5.1 Pricing page `/pricing`: Free / Application Pass / Adviser licence. Gate: Visual.
- [x] 5.2 Test upgrade flow: sets plan locally, shows "test mode" banner, free tier limits programmes to 3. Gate: Test (limit enforced).

## Module 6 — Quality & launch
- [x] 6.1 Accessibility pass: contrast ≥ 4.5:1, focus rings, labels, keyboard nav. Gate: manual audit at 1440 px.
- [x] 6.2 Playwright smoke: landing → sign-up → dashboard → compare → sign-out. Gate: `npm run e2e` green.
- [x] 6.3 README: links, setup, testing checklist, post-MVP list. Gate: renders on GitHub.
- [ ] 6.4 Push `main`; GitHub Actions deploy green; live URL loads; smoke flows pass in production. Gate: live URL check.

## Deferred (Phase 2)
- Supabase backend (Postgres, Auth, RLS), multi-device sync
- Adviser accounts with share links and comments
- Stripe Checkout + webhooks
- Email / calendar reminders
- Optional import of programme requirements
- Cohort analytics for careers services
