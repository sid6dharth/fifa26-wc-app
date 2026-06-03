# World Cup 2026 — Prediction League

A mobile-first, invite-only prediction game for a private friends-and-family league.
Predict scores, fill knockout brackets, climb a live leaderboard. Built with Next.js +
TypeScript, Tailwind v4, and Supabase. See `CLAUDE.md`, `ARCHITECTURE.md`,
`DESIGN_SYSTEM.md`, and `IMPLEMENTATION.md` for the full picture.

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase keys (see below)
npm run dev                  # http://localhost:3000
```

Without Supabase keys the app builds and the landing page renders, but sign-in and any
authenticated route will error until the env vars are set.

## Manual setup (one-time, requires your accounts)

These steps need dashboards I can't access — do them once:

1. **Create a Supabase project** (free tier) → Project Settings → API. Copy the
   `Project URL`, `anon` key, and `service_role` key into `.env.local`
   (see `.env.example`).
2. **Apply the schema.** Either:
   - paste `supabase/migrations/0001_init.sql` into the Supabase SQL Editor and run it,
     then run `supabase/seed.sql`; **or**
   - use the CLI: `supabase link --project-ref <ref>` then `supabase db push`.
3. **Configure auth.** Supabase → Authentication → URL Configuration: set the Site URL
   (`http://localhost:3000` for dev, your Vercel URL for prod) and add
   `/auth/callback` to the redirect allowlist. Email magic-link is on by default.
4. **Bootstrap yourself as admin.** Sign in once with the seeded invite code
   (`FAMILY-2026`), then in SQL: `update profiles set is_admin = true where id = '<your-user-id>';`
   (find the id in Authentication → Users).
5. **Deploy to Vercel.** Import the repo, add the same three env vars to the Vercel
   project, and deploy. Update the Supabase Site URL / redirect allowlist with the
   production domain.

## How auth + the invite gate work

- **Magic link only** (no passwords). `signInWithOtp` emails a link to `/auth/callback`,
  which exchanges the code for a session.
- **Invite-only.** A signed-in user with no `profiles` row is sent to `/onboarding` to
  redeem an **invite code**. The `redeem_invite` Postgres function (SECURITY DEFINER)
  validates the code and creates their profile. Manage codes in the `invite_codes` table.
- Middleware refreshes the session on every request; the `(app)` route group is guarded
  server-side (never trusts the client clock).

## Scripts

- `npm run dev` — dev server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npx prettier --write .` — format
