-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 2: ENFORCE RLS (tenant isolation).
--
-- Run in the Supabase SQL Editor AFTER reviewing the Step-1 audit. This enables
-- Row Level Security and adds per-user policies so each account can only read/
-- write ITS OWN rows. It is idempotent (safe to re-run).
--
-- Tenancy model (derived from the app code):
--   * patients / invoices / appointments / lab_results / cases / pharmacy tables
--     are stamped with user_id = auth.uid() on insert and read unfiltered — so
--     owner-scoped RLS (user_id = auth.uid()) both closes the leak AND matches
--     current behaviour. No app code change required.
--   * clinics.user_id = the owner. clinic_members links members to a clinic by
--     email.
--
-- ⚠️ TEAM-SHARING CAVEAT: because patient/invoice rows carry the CREATOR's
-- user_id (not a clinic_id), these policies isolate data per USER, not per
-- clinic. Invited staff will NOT see the owner's patients and vice-versa. If
-- shared clinic data is a required feature, the fix is to add a clinic_id column
-- to these tables and switch the policies to clinic-membership — tell me and I'll
-- write that migration. The policies below are the correct SECURITY baseline
-- that stops cross-tenant exposure today.
-- ─────────────────────────────────────────────────────────────────────────────

-- Owner-scoped tables: full CRUD limited to your own rows.
do $$
declare t text;
begin
  foreach t in array array[
    'patients','invoices','appointments','lab_results','cases',
    'vet_pharmacy_stock','vet_pharmacy_dispensing'
  ]
  loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('drop policy if exists %I on public.%I;', t || '_owner', t);
    execute format(
      'create policy %I on public.%I for all to authenticated '
      'using (user_id = auth.uid()) with check (user_id = auth.uid());',
      t || '_owner', t
    );
  end loop;
end $$;

-- clinics: owner-only.
alter table public.clinics enable row level security;
drop policy if exists clinics_owner on public.clinics;
create policy clinics_owner on public.clinics
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- clinic_members: a member can read their OWN membership row (matched by email);
-- the clinic owner can read/manage all member rows for clinics they own.
alter table public.clinic_members enable row level security;

drop policy if exists clinic_members_self_read on public.clinic_members;
create policy clinic_members_self_read on public.clinic_members
  for select to authenticated
  using (
    email = (auth.jwt() ->> 'email')
    or clinic_id in (select id from public.clinics where user_id = auth.uid())
  );

drop policy if exists clinic_members_owner_write on public.clinic_members;
create policy clinic_members_owner_write on public.clinic_members
  for all to authenticated
  using (clinic_id in (select id from public.clinics where user_id = auth.uid()))
  with check (clinic_id in (select id from public.clinics where user_id = auth.uid()));

-- subscriptions: users read their own; writes come from the Paystack webhook via
-- the service_role key, which bypasses RLS.
alter table public.subscriptions enable row level security;
drop policy if exists subscriptions_self_read on public.subscriptions;
create policy subscriptions_self_read on public.subscriptions
  for select to authenticated
  using (user_id = auth.uid());

-- sent_emails: written only by the cron job via service_role. RLS on, no
-- authenticated policies => no anon/authenticated access at all.
alter table public.sent_emails enable row level security;

-- ── Verify: re-run the Step-1 audit; rls_enabled should now be true for every
-- table, and each should list the policies created above.
