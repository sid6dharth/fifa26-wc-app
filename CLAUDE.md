# CLAUDE.md

Source of truth for this repo. Read this first, every session. Keep it lean — do **not** bloat it; details live in the referenced docs.

## What this is

A World Cup 2026 prediction game for a private friends-and-family league. Members predict match scores, fill knockout brackets, and climb a live leaderboard. Results are fetched automatically and scored without manual work.

- **No real money, no betting, no public sign-up.** Invite-only.
- **Mobile-first, installable PWA.** Most use is on phones, often minutes before kickoff.
- **Free-tier infrastructure.** Never let user traffic hit the third-party football API directly.

## Reference docs (read on demand, not every time)

| Doc | Read it when | Stability |
|-----|--------------|-----------|
| `ARCHITECTURE.md` | Touching system design, tech stack, data model, or the results/scoring pipeline. | **Frozen.** Do not change without explicit owner sign-off. |
| `DESIGN_SYSTEM.md` | Any UI work — colors, fonts, spacing, components, theming. | Stable. Update only via owner approval. |
| `IMPLEMENTATION.md` | Starting any build work. Contains the phased plan. | Living doc. |

## How we work (the loop)

1. The user picks a **phase** from `IMPLEMENTATION.md` (each phase is multiple tasks which are a couple of lines — a high-level intent, intentionally terse).
2. **Expand that phase into a concrete plan** before writing code: break it into ordered tasks, name the files/modules to create or change, list the data touched, call out edge cases and how you'll verify it. Surface any open decisions as questions.
3. **Present the expanded plan to the user and wait for approval.** Do not start coding until they confirm.
4. Implement only the approved phase. Stay in scope — don't pull work forward from later phases.
5. On completion, state what changed and what the next phase would be.

Only expand one phase at a time. If a phase is ambiguous, ask rather than guess.

## Hard rules (do not violate)

- **Server-enforced lock.** A prediction is accepted only if server time is before kickoff. The client clock is never trusted.
- **Worker-only API access.** A scheduled worker polls the football API and caches results in our DB; the app reads only from our DB. Cache aggressively; poll fast only during live matches.
- **Idempotent scoring.** Re-running the scoring engine for a match must produce the same ledger. `points_ledger` is append-only; recompute by replacing rows for one source atomically.
- **Secrets stay server-side.** The football API key lives only in the worker's environment, never in client code.
- **Follow `DESIGN_SYSTEM.md` for all UI.** Gold is reserved for rewards only.
- **Don't edit `ARCHITECTURE.md`** as part of feature work.

## Conventions

- Stack: Next.js + TypeScript, Tailwind + shadcn/ui, Supabase (Postgres/Auth/Realtime). See `ARCHITECTURE.md`.
- Keep modules small and scoring functions pure and unit-tested.
- Map the football provider behind an adapter so it can be swapped.
- Prefer clarity over cleverness; this is a small, long-lived hobby codebase.