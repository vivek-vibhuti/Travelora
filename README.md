# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## 1. What Was Done

| Step | Result |
|---|---|
| Clone repo to Desktop | Done |
| `npm install` (frontend) | Success — 0 vulnerabilities |
| `npm install` (server) | Success — 0 vulnerabilities |
| `npm run build` (Vite production) | Success — 34 modules, 246 kB JS / 77 kB gzip |
| `npm run lint` (oxlint) | Passed — 3 minor warnings (unused catch params) |
| Backend run | Live on http://localhost:5000 |
| Frontend run | Live on http://localhost:5173 |

## 2. Verification Results

### Frontend render (real Chromium, zero JS errors)
- Home page renders fully: navbar, hero ("Your Journey Begins Here"), trip-type selector (Beach / Mountain / City / Adventure), destinations section
- React Router works — `/about` route renders correctly

### Backend endpoints
| Test | Result |
|---|---|
| `GET /` | 200 — "TravelAgency Backend is Running!" |
| `POST /api/auth/register` (missing fields) | 400 — validation works without DB |
| `POST /api/auth/login` (missing fields) | 400 — validation works without DB |
| `POST /api/bookings` (missing fields) | 400 — validation works without DB |
| CORS preflight (5173 → 5000) | 204 — `Access-Control-Allow-Origin: *`, all methods allowed |
| Frontend ↔ Backend integration | URLs match routes exactly |

### Database
- PostgreSQL is **not installed** on this machine, so DB-backed operations (actual login/register/booking inserts) return "Server error" — expected and skipped by request.

## 3. Git / Push Status

- Local repo has two remotes:
  - `origin` → **https://github.com/vivek-vibhuti/Travelora** (the fork — push target)
  - `upstream` → https://github.com/Sudeepa-Upasana/Travelora (original)
- Why a fork: `vivek-vibhuti` has **no write access** to Sudeepa-Upasana's repo (GitHub returned 403 Permission denied)
- Commit pushed to fork: `4eb8b02` — "Refresh npm lockfiles after dependency install" (verified live on GitHub)

## 4. Pull Request #1 — Open

**URL:** https://github.com/Sudeepa-Upasana/Travelora/pull/1
**Title:** Refresh npm lockfiles after dependency install
**Changes:** `package-lock.json` + `server/package-lock.json` only — no source code

## 5. What Happens Next (Her Side)

1. **She gets notified** — GitHub emails her and shows a notification that `vivek-vibhuti` opened PR #1
2. **She reviews it** — two lockfile changes only, with build/lint/run verification documented in the PR description
3. **She decides** — one of three outcomes:
   - **Merge** — her repo gets the refreshed lockfiles (one click)
   - **Close** — she rejects it, nothing changes
   - **Ignore** — PRs can sit open indefinitely; GitHub cannot force action

"Accept" is **not automatic** — it's her repo, her call. Small, harmless diff → reasonable chance of merge.

**To speed things up:** message her directly — *"I opened PR #1 with refreshed lockfiles — the project builds and runs clean on Node 22."*

## 6. Remaining Work (Optional)

To make login/register/booking fully functional:
1. Install PostgreSQL (or use Docker / Neon cloud)
2. Create `.env` in `server/` with:
   - `DB_USER`, `DB_HOST`, `DB_NAME`, `DB_PASSWORD`, `DB_PORT`
3. Create `users` and `bookings` tables
4. Restart the backend
