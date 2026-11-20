# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # next dev --turbopack
npm run build    # next build --turbopack
npm run start    # serve the production build
npm run lint     # eslint (flat config, next/core-web-vitals)
```

There is no test suite. JavaScript (`.jsx`/`.js`) with a single TypeScript file, `src/middleware.ts`. The `@/*` alias maps to `src/*`.

Firestore seed/maintenance scripts live in `scripts/*.mjs` and run with plain `node` (see below).

## What this is

The DevFest Kolkata 2026 (GDG Kolkata) marketing site: Next.js 15 App Router, React 19, Tailwind v4, Firebase Admin. Package/README still say "2025"; the content and Firestore collections are 2026.

## Architecture

**Single-page site.** `src/app/page.jsx` renders only `TramHero` (`src/components/Home/TramHero.jsx`), a large scroll-driven client component that owns the hero animation and composes every other homepage section (`AboutSection`, `TicketsSection`, `SpeakersSection`, `PartnersSection`, `FaqSection`, `FooterSection`, …). Sections in `src/components/Home/` come in pairs/variants (e.g. `Speakers.jsx` vs `SpeakersSection.jsx`, `Tickets.jsx` vs `TicketsSection.jsx`); the `*Section.jsx` files are the ones `TramHero` actually mounts — check there before editing. Avoid adding `overflow-x` ancestors above the hero: it breaks `position: sticky` (see the comment in `page.jsx`).

**Data comes from Firestore via server-side API routes, with no client Firebase and no sign-in.** Each `src/app/api/*/route.js` initialises `firebase-admin` itself (the `getDb()` helper is copy-pasted per route; `src/lib/firebaseAdmin.js` is a separate variant exporting `auth`) using `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` from `.env` (gitignored). Routes only return whitelisted display fields.

- `GET /api/speakers/view` → collection `speaker`
- `GET /api/tickets/view` → collection `devfest2026-tickets` (pass `day` 0/1/2, or inferred from the `date` string)
- `GET /api/attendee?q=` → looks up `attendees2026` by email / phone / booking id for the social badge generator (`BadgeSection`); never returns PII beyond name, ticket, designation, organisation
- `POST /api/webhook` → Konfhub registration webhook; writes raw payloads into `attendees2026`
- `POST /api/delete-user` → used by `/support`
- `POST /api/certificate` `{bookingId}` → workshop certificate PDF (see Certificates below)

**Client Firebase is deliberately disabled.** `src/lib/firebase.js` exports `auth = db = googleProvider = null` (init is commented out). `AuthContext` tolerates a null `auth`. The `(ticket)` route group (`/register`, `/ticket`) and `/me` still exist but `src/middleware.ts` redirects `/register` and `/ticket` to `/`. Don't re-enable client auth without restoring the commented block.

**Middleware (`src/middleware.ts`)** does two things: an edge rate limiter for `/api/attendee` (signed HMAC cookie `_rla`, keyed with `FIREBASE_CLIENT_EMAIL`; `MAX` attempts per 10-minute window — the header comment says 5 but the constant is 3), and the redirects above. Its `matcher` must list any new path you want it to handle.

**Collection naming is inconsistent — verify before changing.** The speakers API reads `speaker`, while `scripts/seed-speakers.mjs` writes `speakers2026` (the API was switched to `speaker` in a later commit). Align them deliberately if you touch either.

## Certificates

Workshop-only (the DevFest tiers get none). `CertificateSection` (mounted in `TramHero` after the social pass) → `POST /api/certificate` with a typed **booking ID** (the ticket holder's secret — an email would let anyone claim someone else's certificate), no sign-in. The route reads **`attendees-flattened-2026`** (flat keys like `data_Attendee Details_Email Address`, plus a top-level `check_in` boolean; this is a different collection from the raw `attendees2026`), looks up `data_Attendee Details_Booking Id` (8 lowercase hex), requires a ticket matching `/workshop/i` with `check_in === true`, then issues once: `certificates2026/{bookingId}` is created in a transaction (409 `already_generated` on repeat) *after* the PDF renders, so a render failure never burns the attendee's one certificate. Responses carry a `code` (`invalid_booking_id`, `no_workshop_ticket`, `not_checked_in`, `already_generated`) the UI maps to inline messages or the "attend the workshop" popup. Keys look like `DFK26-W-XXXXXXXX` and are printed on the PDF (no QR; `/certificate/verify/[key]` still exists as a public lookup page but nothing links to it).

`src/lib/certificate.js` is a pure pdf-lib generator (ported from the Evntfy project's `certificate.ts`). It reads Google Sans static cuts from `src/fonts/certificate/` and artwork from `public/` at request time, so `next.config.mjs` lists them in `outputFileTracingIncludes` — add new assets there. Both workshop topics (`src/data/workshops.json`) print on every certificate. Only Latin text is supported: other scripts are dropped from names. The middleware rate-limits `/api/certificate` (10 attempts / 10 min via cookie, like `/api/attendee`). `src/lib/adminDb.js` is the shared Admin initialiser for new routes.

## Scripts (`scripts/`)

Standalone Node scripts using `firebase-admin`; they parse `.env` directly (not via Next). All support `--dry`.

- `seed-speakers.mjs`, `seed-tickets.mjs` — upsert to fixed doc ids (speaker slug / ticket id) with `merge: true`, so re-running is idempotent. Speaker/ticket content is defined inline in the script.
- `copy-collection.mjs <source> <target> [--dry] [--deep] [--force]` — copy a Firestore collection.
- `apply-ticket-transfers.mjs <transfers.csv> [--dry]` — rewrites attendee fields in `attendees2026` for transferred tickets (never touches Buyer fields; idempotent).

## Static content & assets

- Team data: `src/data/team.json`; legacy ticket data: `src/tickets.json`.
- Images are in `public/` (speaker photos in `public/speakers/`, matched to speakers by a name-derived key). Remote images are only allowed from `lh3.googleusercontent.com` (`next.config.mjs`).
- `index.html` and `privacy-policy.html` at the repo root are leftover static files, not part of the Next app.
- Fonts: Google Fonts via `next/font` plus local `src/fonts/GoogleSans.ttf`, exposed as CSS variables in `src/app/layout.jsx`.
- UI primitives in `src/components/ui/` follow shadcn conventions (`components.json`).
