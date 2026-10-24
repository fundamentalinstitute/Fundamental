-- Fundamentals Institute — specialised form tables.
--
-- Architecture: the browser never writes to Supabase directly. All form
-- submissions go through the Next.js route /api/leads, which validates and
-- writes server-side. The route prefers SUPABASE_SERVICE_ROLE_KEY (bypasses
-- RLS); when only the publishable key is configured it relies on the narrow
-- INSERT-only policies / SECURITY DEFINER functions below. Anonymous clients
-- can never read, update, or delete submissions.
--
-- Apply with:  supabase db push   (or paste into the Supabase SQL editor)

-- ───────────────────────── central log (already exists on some envs) ──
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  type text not null,
  name text,
  email text,
  phone text,
  payload jsonb not null default '{}'::jsonb
);
alter table public.leads enable row level security;
create index if not exists leads_type_created_idx on public.leads (type, created_at desc);

-- ───────────────────────── counselling_enquiries ──
create table if not exists public.counselling_enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text,
  email text,
  interest text,                        -- program / area of interest
  preferred_batch text,                 -- online | offline, when known
  situation text,
  question text,
  preferred_day text,
  time_slot text,
  source_page text,
  consent boolean not null default true, -- forms state terms at submit
  status text not null default 'new'     -- new | contacted | scheduled | closed
    check (status in ('new','contacted','scheduled','closed'))
);
alter table public.counselling_enquiries enable row level security;
create index if not exists counselling_created_idx on public.counselling_enquiries (created_at desc);

-- ───────────────────────── program_applications ──
create table if not exists public.program_applications (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,        -- human-readable application ref (FI-…)
  created_at timestamptz not null default now(),
  name text not null,
  phone text,
  email text,
  program text not null,
  batch_mode text not null check (batch_mode in ('online','offline')),
  schedule text,
  start_date text,
  fee numeric,
  location text,
  city text,
  applicant_status text,                 -- student / graduate / working / switching
  notes text,
  source_page text,
  consent boolean not null default true,
  status text not null default 'new'     -- new | counselled | payment_sent | enrolled | dropped
    check (status in ('new','counselled','payment_sent','enrolled','dropped')),
  whatsapp_status text not null default 'not_initiated' -- not_initiated | link_opened | confirmed
    check (whatsapp_status in ('not_initiated','link_opened','confirmed'))
);
alter table public.program_applications enable row level security;
create index if not exists applications_created_idx on public.program_applications (created_at desc);
create index if not exists applications_batch_idx on public.program_applications (program, batch_mode);

-- ───────────────────────── founder_waitlist ──
create table if not exists public.founder_waitlist (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  email text,
  phone text,
  audience text,                         -- graduate / professional / founder / …
  opportunity text not null default 'founder-programs',
  source_page text,
  consent boolean not null default true,
  status text not null default 'waiting' -- waiting | invited | joined | removed
    check (status in ('waiting','invited','joined','removed'))
);
alter table public.founder_waitlist enable row level security;
create index if not exists founder_waitlist_created_idx on public.founder_waitlist (created_at desc);

-- ───────────────────────── notification_subscriptions ──
create table if not exists public.notification_subscriptions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  email text,
  phone text,
  program text not null default 'next-batch', -- what they want to hear about
  channel text not null default 'email',
  source_page text,
  consent boolean not null default true,
  status text not null default 'active'  -- active | notified | cancelled
    check (status in ('active','notified','cancelled'))
);
alter table public.notification_subscriptions enable row level security;
-- one active signup per (email, program); different programs stay allowed
create unique index if not exists notification_unique_idx
  on public.notification_subscriptions (lower(email), program)
  where email is not null;

-- ───────────────────────── newsletter_subscribers ──
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  name text,
  source_page text,
  consent boolean not null default true,
  consent_at timestamptz not null default now(),
  status text not null default 'subscribed' -- subscribed | unsubscribed | pending
    check (status in ('subscribed','unsubscribed','pending')),
  unsubscribed_at timestamptz
);
alter table public.newsletter_subscribers enable row level security;
create unique index if not exists newsletter_email_idx
  on public.newsletter_subscribers (lower(email));

-- ───────────────────────── contact_submissions ──
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text,
  phone text,
  subject text,                          -- enquiry type / interest
  message text not null,
  source_page text,
  status text not null default 'new'     -- new | replied | closed
    check (status in ('new','replied','closed'))
);
alter table public.contact_submissions enable row level security;
create index if not exists contact_created_idx on public.contact_submissions (created_at desc);

-- ───────────────────────── RLS policies ──
-- INSERT-only for anon/authenticated so the API route can also run on the
-- publishable key. No SELECT/UPDATE/DELETE policies exist, so submissions can
-- never be read or altered by visitors. Admin access = service role / dashboard.
do $$
declare t text;
begin
  foreach t in array array[
    'leads','counselling_enquiries','program_applications','founder_waitlist',
    'contact_submissions'
  ] loop
    execute format(
      'drop policy if exists "public can submit" on public.%I;
       create policy "public can submit" on public.%I
         for insert to anon, authenticated with check (true);', t, t);
  end loop;
end $$;

-- Newsletter + notification writes go through SECURITY DEFINER functions so
-- duplicate handling (upsert/resubscribe) works without granting UPDATE to anon.

create or replace function public.newsletter_subscribe(
  p_email text, p_name text default null, p_source text default null
) returns text
language plpgsql security definer set search_path = public as $$
declare existing public.newsletter_subscribers%rowtype;
begin
  if p_email is null or p_email !~ '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$' or length(p_email) > 320 then
    raise exception 'invalid email';
  end if;
  select * into existing from newsletter_subscribers where lower(email) = lower(p_email);
  if found then
    if existing.status = 'subscribed' then
      return 'already_subscribed';
    end if;
    update newsletter_subscribers
      set status = 'subscribed', consent = true, consent_at = now(),
          unsubscribed_at = null, name = coalesce(p_name, name),
          source_page = coalesce(p_source, source_page)
      where id = existing.id;
    return 'resubscribed';
  end if;
  insert into newsletter_subscribers (email, name, source_page)
    values (p_email, left(p_name, 100), left(p_source, 200));
  return 'subscribed';
end $$;

create or replace function public.newsletter_unsubscribe(p_email text) returns boolean
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  update newsletter_subscribers
    set status = 'unsubscribed', unsubscribed_at = now()
    where lower(email) = lower(p_email) and status <> 'unsubscribed';
  get diagnostics n = row_count;
  return n > 0;
end $$;

create or replace function public.notification_subscribe(
  p_email text, p_program text, p_name text default null,
  p_phone text default null, p_channel text default 'email', p_source text default null
) returns text
language plpgsql security definer set search_path = public as $$
begin
  if p_email is null or p_email !~ '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$' or length(p_email) > 320 then
    raise exception 'invalid email';
  end if;
  insert into notification_subscriptions (email, program, name, phone, channel, source_page)
    values (p_email, left(coalesce(p_program,'next-batch'),200), left(p_name,100),
            left(p_phone,20), coalesce(p_channel,'email'), left(p_source,200))
    on conflict (lower(email), program) where email is not null do nothing;
  if found then return 'subscribed'; end if;
  return 'already_subscribed';
end $$;

revoke all on function public.newsletter_subscribe(text, text, text) from public;
revoke all on function public.newsletter_unsubscribe(text) from public;
revoke all on function public.notification_subscribe(text, text, text, text, text, text) from public;
grant execute on function public.newsletter_subscribe(text, text, text) to anon, authenticated, service_role;
grant execute on function public.newsletter_unsubscribe(text) to anon, authenticated, service_role;
grant execute on function public.notification_subscribe(text, text, text, text, text, text) to anon, authenticated, service_role;
