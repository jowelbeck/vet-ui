-- ─────────────────────────────────────────────────────────────────────────────
-- profiles: per-account status shared by VetsAI + HealthPost (one Supabase).
-- Powers account-level deactivation (login block) and platform-admin gating.
-- Run in the Supabase SQL editor.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  email               text,
  product             text not null default 'vetsai',   -- 'vetsai' | 'healthpost'
  deactivated         boolean not null default false,
  deactivated_at      timestamptz,
  deactivated_by      uuid,
  deactivation_reason text,
  is_platform_admin   boolean not null default false,
  created_at          timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- A user may read ONLY their own profile — this is what the login / navigation
-- check reads to see if the account is deactivated.
drop policy if exists profiles_self_read on public.profiles;
create policy profiles_self_read on public.profiles
  for select to authenticated
  using (id = auth.uid());

-- No client-side writes. All admin actions (deactivate/reactivate, list users)
-- go through server routes using the service_role key, which bypasses RLS; those
-- routes verify the caller is a platform admin before writing.

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, product)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'product', 'vetsai'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profiles for existing users.
insert into public.profiles (id, email, product)
select id, email, coalesce(raw_user_meta_data->>'product', 'vetsai')
from auth.users
on conflict (id) do nothing;

-- Grant the platform owner admin rights. Change the email if yours differs.
update public.profiles set is_platform_admin = true
where email = 'jowelbeck@aol.com';
