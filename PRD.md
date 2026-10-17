# PRD.md — GradPath Atlas

Version 1.0 · Phase 1 (Core MVP) · Desktop-first web application

## 1. Executive Overview & Personas

**Purpose.** GradPath Atlas is a planning workspace for undergraduates applying to several master's programmes. It replaces scattered spreadsheets, emails and notes with one plan: programmes, requirements, documents, deadlines and tasks, compared side by side.

**Problem.** Applicants track 4–10 programmes with overlapping but non-identical requirements. Missed deadlines and duplicated document work are the main failure modes.

**Personas.**
| Persona | Goal | Pain |
|---|---|---|
| Final-year student (primary) | Submit every shortlisted application on time, reuse documents | No single view of what is due, what is missing, what can be reused |
| Education adviser (secondary) | Review a student's plan and flag gaps | Receives plans as email attachments; no shared view |
| University careers team (buyer) | Support cohorts of applicants | Needs licences, not per-student payments |

**Revenue model.** Free basic tier (up to 3 programmes) → paid one-season Application Pass (unlimited programmes, export, adviser sharing) → Adviser/University licence (seat-based). Phase 1 shows a test upgrade flow only; no real payments.

**Core value loop (7-day MVP).** Add programmes → compare requirements → link reusable documents → see missing items and next deadlines → complete tasks → submit.

## 2. Phased Scope Isolation

**Phase 1 — Core MVP (this build).**
- Sign-up, sign-in, sign-out, password reset (simulated client-side; see §4)
- Dashboard: progress per programme, next deadlines, missing items
- Programme comparison table (sortable, filterable, column toggles)
- Programme detail page: requirements, linked documents, tasks, notes, status
- Tasks page with dependencies ("request reference" before "submit application")
- Documents page: reuse matrix (document × programme)
- Deadlines page: timeline sorted by date with risk flags
- Adviser review page: read-only summary view
- Settings: profile, plan, reset demo data, clear all data
- Pricing page with test upgrade flow
- Exportable summary (print view + CSV)
- Seeded fictional demo data (universities, programmes, documents, tasks)

**Phase 2 — Post-launch (deferred).**
- Real backend (Supabase: Postgres, Auth, RLS), multi-device sync
- Adviser accounts with per-student share links and comments
- Stripe Checkout for Application Pass and licences
- Email/calendar reminders
- Import of programme requirements from university sites (clearly labelled optional)
- Team/cohort analytics for careers services

## 3. Interface & UI Layout

**Routes** (hash router for static hosting):
| Route | Page | Key components |
|---|---|---|
| `/` | Landing | Hero (headline + CTA above fold), value props, pricing teaser |
| `/login`, `/signup`, `/reset` | Auth | Form, validation, error states |
| `/app` | Dashboard | Stat cards, next-deadline list, missing-items list, programme progress bars |
| `/app/compare` | Programme comparison | Wide data table, filters, column toggles, status chips |
| `/app/programmes/:id` | Programme detail | Header, requirements checklist, documents, tasks, notes |
| `/app/tasks` | Tasks | Grouped list, dependency badges, done toggle |
| `/app/documents` | Documents | Document list + reuse matrix |
| `/app/deadlines` | Deadlines | Date-sorted timeline with risk flags (overdue / <14 d / ok) |
| `/app/adviser` | Adviser review | Read-only summary, print/CSV export |
| `/app/settings` | Settings | Profile, plan, data reset |
| `/pricing` | Pricing | Three tiers, test upgrade button |

**Layout.** Authenticated pages use a fixed left sidebar (nav) + top bar (workspace name, user menu) + scrollable content area, optimised ≥1280 px. Below 1024 px the sidebar collapses to a top nav; tables scroll horizontally. Key content renders above the 667 px fold on mobile.

**Visual style.** Calm, structured: neutral greys, one teal accent, strong type hierarchy, generous table row height. Empty, loading, validation and error states for every list and form.

## 4. Technical Stack & Architectural Constraints

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Vite 8 + React 19 + TypeScript (strict) | Fast static build for GitHub Pages |
| Styling | Tailwind CSS 4 | Utility-first, consistent tokens |
| Routing | React Router 7 (hash history) | Works on static hosting without rewrites |
| State/persistence | Zustand with `persist` → `localStorage` | Single source of truth; survives reload |
| Testing | Vitest + Testing Library; Playwright smoke | Verification gates |
| CI/CD | GitHub Actions → GitHub Pages | Required "GitHub supplied tools" |

**Constraints.**
- Phase 1 has no server. Authentication is simulated: credentials are stored hashed (SHA-256 via Web Crypto) in `localStorage`; sessions are a flag in the store. This is not secure and is documented in-app as a demo limitation. Phase 2 replaces it with Supabase Auth.
- All data is per-browser. "Reset demo data" restores the seed.
- No real university data; all seed data is fictional.
- No secrets exist in Phase 1. Any Phase 2 keys go in `.env.local` (server) / `VITE_` prefix (client, public only).
- No native-binary ORMs; Phase 2 uses Supabase JS client.

## 5. Database Schema & Entity Design

Phase 1 stores these entities as typed arrays in the persisted store. Phase 2 maps them 1:1 to Postgres tables with UUID primary keys, `ON DELETE CASCADE` on child rows and RLS `user_id = auth.uid()` on every table.

| Table | Columns |
|---|---|
| `users` | id uuid PK, email text unique, name text, password_hash text, plan enum(free, season, adviser), created_at |
| `universities` | id PK, user_id FK, name, country, city |
| `programmes` | id PK, user_id FK, university_id FK→universities, name, degree, field, tuition_usd int, duration_months int, intake text, deadline date, status enum(researching, shortlisted, applying, submitted, offer, rejected, dropped), priority int |
| `requirements` | id PK, programme_id FK→programmes, type enum(transcript, cv, statement, reference, language_test, gre, portfolio, interview, fee), label, detail, required bool, document_id FK→documents null |
| `documents` | id PK, user_id FK, name, type (same enum), status enum(missing, draft, ready), updated_at |
| `tasks` | id PK, user_id FK, programme_id FK null, title, due date, done bool, depends_on_id FK→tasks null |
| `notes` | id PK, programme_id FK, body text, created_at |
| `advisers` | id PK, user_id FK, name, email, share_token |
| `status_records` | id PK, programme_id FK, status, changed_at |

Derived (not stored): deadlines (from `programmes.deadline` and `tasks.due`), readiness per programme = required requirements with a `ready` linked document ÷ required requirements.

## 6. Third-Party API & Payment Boundaries

- Phase 1: no third-party APIs, no network calls after page load.
- Pricing page "Upgrade" sets `users.plan` locally and shows a "test mode" banner. No card fields are rendered.
- Phase 2 boundaries: Stripe Checkout session created server-side; webhook `checkout.session.completed` updates `users.plan`; `STRIPE_SECRET_KEY` and `SUPABASE_SERVICE_ROLE_KEY` server-only; only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` on the client.

## 7. Quality, Accessibility & Compliance Standards

- WCAG 2.2 AA: text contrast ≥ 4.5:1, visible 2 px focus ring, labelled inputs, keyboard-operable tables and menus, `aria-sort` on sortable columns.
- Verification gates: `npm run lint`, `npm test`, `npm run build` zero errors, Playwright smoke (landing → sign-up → dashboard → compare) before deploy.
- Privacy: Personal Information Collection Statement on sign-up; data stays in the user's browser; "Clear all data" in Settings implements the GDPR Art. 17 / HK PDPO erasure equivalent for Phase 1.
- Content: English only; fictional names; CC0 or generated imagery only.
- Availability: GitHub Pages deployment kept live ≥ 30 days after submission.
