# Deploy EmpVee to Cloudflare Workers

This app is built with **Next.js 16** and the **OpenNext Cloudflare adapter** (`@opennextjs/cloudflare`).

## 1. Prerequisites

- A Cloudflare account
- A PostgreSQL database reachable over the public internet (Neon, Supabase, etc.)
- LINE OA credentials (Channel Access Token, Channel Secret, LIFF ID)

## 2. Local secrets

Copy `.env.example` to `.env.local` and fill in all values:

```bash
DB_CONN_STRING=postgresql://...
LINE_CHANNEL_ACCESS_TOKEN=...
LINE_CHANNEL_SECRET=...
LINE_LIFF_ID=...
NEXT_PUBLIC_LIFF_ID=...
LINE_LOGIN_CHANNEL_ID=...
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

For `wrangler dev` / preview, copy `.dev.vars.example` to `.dev.vars` with the same values.

## 3. Database setup

```bash
# Push the Drizzle schema to PostgreSQL
npm run db:push

# Seed demo employees / attendance / requests
npm run db:seed
```

## 4. Build & deploy

### Option A — Cloudflare Workers Builds (recommended)

1. Push the `web/` folder to a Git repository.
2. In the Cloudflare dashboard, create a new **Workers & Pages** project and connect the repo.
3. Set the **build command** to `npm run deploy`.
4. Add the following **environment variables / secrets** in the dashboard:
   - `NEXT_PUBLIC_APP_URL` — your production domain (e.g. `https://empvee-demo.your-account.workers.dev`)
   - `NEXT_PUBLIC_LIFF_ID`
   - `DB_CONN_STRING` (add as encrypted secret)
   - `LINE_CHANNEL_ACCESS_TOKEN` (encrypted secret)
   - `LINE_CHANNEL_SECRET` (encrypted secret)
   - `LINE_LIFF_ID`, `LINE_LOGIN_CHANNEL_ID`
5. Deploy. Cloudflare builds on Linux, so Windows-specific OpenNext issues do not apply.

### Option B — Wrangler CLI

Requires a Linux/macOS environment (or WSL) because `@opennextjs/cloudflare` has known Windows file-lock issues.

```bash
npx wrangler login
npm run deploy
```

Then set secrets:

```bash
npx wrangler secret put DB_CONN_STRING
npx wrangler secret put LINE_CHANNEL_ACCESS_TOKEN
npx wrangler secret put LINE_CHANNEL_SECRET
# ... etc.
```

## 5. Post-deploy LINE Console setup

After the first deploy you will get a `*.workers.dev` URL.

1. **LIFF endpoint**: Add `https://<your-domain>/liff` in the LINE Developers console.
2. **Webhook URL**: Set `https://<your-domain>/api/line/webhook` and enable.
3. **Rich Menu**: Open the admin dashboard at `https://<your-domain>/` and click **สร้าง Rich Menu** (or call `POST /api/line/richmenu`).

## 6. Notes

- `NEXT_PUBLIC_*` variables are baked into the static bundle at build time. They must be set in the build environment, not just as runtime secrets.
- The Worker uses `nodejs_compat` so `@neondatabase/serverless` can connect over WebSocket.
- LINE push notifications are best-effort; invalid user IDs are logged but do not fail the approval API.
