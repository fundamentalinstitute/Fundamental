-- Leads table: every form on the site writes here through /api/leads.
-- RLS locks the public anon key out of ALL access; only the service role
-- (used server-side in the Next.js API route) can write.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  type text not null,            -- counselling | enrol | brochure | community | waitlist | enquiry | notify | newsletter | ...
  name text,
  email text,
  phone text,
  payload jsonb not null default '{}'::jsonb
);

alter table public.leads enable row level security;
-- No policies on purpose: anon/authenticated get nothing; service role bypasses RLS.

create index if not exists leads_type_created_idx on public.leads (type, created_at desc);
