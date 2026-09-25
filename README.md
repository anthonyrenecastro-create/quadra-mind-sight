# Quadra-M.I.N.D. Sight

Guided consciousness-exploration, metacognitive training, binaural spatial
audio, four-quadrant cognitive exercises, and AI-guided dialectic
introspection. React 19 + Vite + Tailwind CSS frontend, Express backend,
installable PWA.

## Prerequisites

- Node.js 20+

## Run locally

1. Install dependencies:

   `npm install`

2. Copy the environment template and fill in your values:

   `cp .env.example .env`

   | Variable | Required? | Notes |
   |---|---|---|
   | `GEMINI_API_KEY` | Recommended | Powers the AI facilitator / solve / interpersonal / patterns endpoints. Get one at https://aistudio.google.com/apikey. Without it, those features use built-in offline fallback responses. |
   | `GEMINI_MODEL` | No | Defaults to `gemini-2.5-flash`. |
   | `VITE_APP_URL` | Recommended | Your public origin (e.g. `https://your-domain.com`). Used for the PWA manifest and OAuth redirects. |

   > `VITE_*` variables are baked into the frontend at **build time** — rebuild
   > after changing them. The rest are read by the server at **runtime**.

3. Start the dev server (Vite middleware + Express API on one port):

   `npm run dev`

   Open http://localhost:3000

## Production build

`npm run build` produces `dist/` (frontend) and `dist/server.cjs` (backend).
Serve it with:

`NODE_ENV=production npm start`

The server listens on `process.env.PORT` (falls back to 3000) and serves the
built frontend plus the `/api/*` endpoints from the single process.

## Deploying

Any Node.js host works: Render, Railway, Fly.io, a VPS, etc.

1. Set the environment variables from `.env.example` in your host's dashboard.
   Remember: `VITE_*` values must be present **at build time**.
2. Build command: `npm run build`
3. Start command: `NODE_ENV=production npm start`

> **Vercel:** the included `vercel.json` deploys the frontend as a static
> site, but the Express API (`/api/gemini/*`, etc.) will not run there —
> the AI features need the Node server. Prefer a host that runs
> long-lived Node processes.

## Google Play (TWA)

The app ships PWA-ready with `twa-manifest.json` for wrapping via
Bubblewrap or PWABuilder (in-app instructions live in Profile → Play Store).

Before building the `.aab`:

1. Deploy the app to your production domain over HTTPS.
2. In `twa-manifest.json`, set `host` (and `name`) to your domain —
   it currently points at the old AI Studio host.
3. In `public/.well-known/assetlinks.json`, replace the SHA-256 fingerprint
   with your own signing key's fingerprint, so Android verifies the
   Digital Asset Link and the TWA runs fullscreen without a URL bar.

## Scripts

- `npm run dev` — dev server with Vite middleware
- `npm run build` — production build (frontend + server bundle)
- `npm run start` — run the production server (needs `NODE_ENV=production`)
- `npm run lint` — TypeScript check
