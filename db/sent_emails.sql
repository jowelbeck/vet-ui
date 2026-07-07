-- sent_emails: idempotency ledger for the onboarding drip sequence.
--
-- The /api/cron job checks this table before sending a lifecycle email
-- (day3/day7/day14/day28) so that a double-invoked cron never double-sends,
-- and a single missed run is still recoverable on the next day.
--
-- Run this in the Supabase SQL editor (this repo has no migrations tooling).

create table if not exists public.sent_emails (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  email_type text        not null,
  sent_at    timestamptz not null default now(),
  unique (user_id, email_type)
);

-- The cron route talks to Supabase with the service_role key, which bypasses
-- RLS. We still enable RLS (deny-by-default) so the table is never readable
-- by anon/authenticated clients.
alter table public.sent_emails enable row level security;

create index if not exists sent_emails_user_id_idx on public.sent_emails (user_id);
