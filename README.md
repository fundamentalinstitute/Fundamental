# Fundamental Institute — fundamental.institute

Marketing site for Fundamental, built from the v2 low-fidelity wireframes on the
same architecture as Sapiens: a decoupled, headless stack.

## Tech stack (Sapiens-style)

| Layer | Choice | Status |
| --- | --- | --- |
| Framework | Next.js (App Router, RSC/SSR) | ✅ in place |
| Styling | Tailwind CSS v4 | ✅ in place |
| Hosting / CI | Vercel | push to deploy |
| Database | Supabase (PostgreSQL + RLS) | schema in `supabase/schema.sql`; set env vars |
| CMS | Sanity (blog, program content) | content currently typed in `lib/content.ts`; swap to GROQ queries |
| Email | Resend | TODO hook in `app/api/leads/route.ts` |
| Analytics | GA4 + PostHog | env placeholders in `.env.example` |

## Brand

- Color: `#005d49` (see `@theme` in `app/globals.css`)
- Display font: **Brice SemiExpanded** (cdnfonts), body: Inter
- Logos in `public/` (green + light variants, from the brand SVGs)

## Run locally

```bash
npm install
npm run dev
```

## Where things live

- `lib/site-config.ts` — every "(from config)" value in the wireframes: batch
  dates, seats, prices, EMI, WhatsApp number, announcement bar. Edit here.
- `lib/content.ts` — FAQs, curriculum, testimonials, blog posts (future Sanity).
- `app/api/leads/route.ts` — all form submissions. Works without Supabase
  (logs to console); inserts into `leads` once env vars are set.
- Pages mirror the wireframe boards 1:1 — Home, Programs, Marketing Management,
  Counselling, Enrol, Brochure, Thank-you (`?type=`), Community, About,
  Contact, Blog + article + lead magnet, Waitlist, legal stubs.

## Phase 2 (not built yet, by design)

Auth, checkout, payment states and the student dashboard are Phase 2 in the
wireframes. `/enrol` is the call-first flow it will replace.

## Before launch (marked TODO in code)

- Real WhatsApp number, address, hours in `lib/site-config.ts`
- Verify the NASSCOM stat wording; fill `proofStats` only with verified numbers
- Replace photo/video placeholders; legal pages copy
