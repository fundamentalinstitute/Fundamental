# Supabase setup

## Apply the migration

Option A — SQL editor (fastest): open the Supabase dashboard → SQL Editor →
paste `migrations/20261024090000_form_tables.sql` → Run. It is idempotent
(safe to run twice) and keeps the existing `leads` table.

Option B — CLI:

```bash
supabase link --project-ref orsirzyrrxhkhsjjrvi
supabase db push
```

## Verify

Dashboard → Table Editor should show: `leads`, `counselling_enquiries`,
`program_applications`, `founder_waitlist`, `notification_subscriptions`,
`newsletter_subscribers`, `contact_submissions` — all with RLS enabled.

Quick end-to-end test: run the site, submit any form, and check the matching
table for the new row.

## Which form writes where

| Form / CTA | Lead type | Table | WhatsApp after save |
|---|---|---|---|
| Homepage "Get free counselling" | `counselling` | `counselling_enquiries` (+ `leads` log) | yes |
| /counselling "Request a call" | `counselling` | `counselling_enquiries` | yes |
| /enrol (Enrol Online / Offline, Apply Now) | `enrol` | `program_applications` (unique `reference`) | yes, batch-specific |
| /waitlist "Join the waitlist" | `waitlist` | `founder_waitlist` | no |
| Footer "Get notified when the next batch opens" | `notify` | `notification_subscriptions` | no |
| /community city "Notify me" | `notify` | `notification_subscriptions` (program = chapter) | no |
| /programs coming-soon "Notify me" | `notify-program` | `notification_subscriptions` | no |
| /blog newsletter "Subscribe" | `newsletter` | `newsletter_subscribers` (dedup + resubscribe) | no |
| /contact "Send enquiry" | `enquiry` | `contact_submissions` | no |
| /brochure "Send me the brochure" | `brochure` | `leads` log | yes |
| /community "Join the Founders Club" | `community` | `leads` log | yes (community message) |
| /unsubscribe | — | `newsletter_subscribers.status = unsubscribed` | no |

## Security model

- The browser never writes to Supabase directly; everything goes through
  `/api/leads` (validation, honeypot, rate limit, size caps).
- RLS is ON for every table. Policies grant **INSERT only** to `anon`; there
  are no SELECT/UPDATE/DELETE policies, so submissions cannot be read or
  altered by visitors. Admin access = dashboard / service role.
- Newsletter and notification dedupe run through `SECURITY DEFINER` functions
  (`newsletter_subscribe`, `newsletter_unsubscribe`, `notification_subscribe`)
  so anon never needs UPDATE rights.
- The service role key, if set, is used only server-side.

## Automatic WhatsApp confirmations (not configured)

Opening WhatsApp for the applicant (implemented) ≠ sending them a message
automatically. Automatic sends need the WhatsApp Business Cloud API with
approved templates and server-side credentials. `program_applications`
already has a `whatsapp_status` column to track this once configured.
