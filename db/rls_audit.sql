-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 1: RLS AUDIT (read-only). Run this in the Supabase SQL Editor and send
-- the two result tables back. It changes nothing — it only reports whether Row
-- Level Security is ON for each tenant table and what policies exist.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1a) Is RLS enabled on each tenant table?  (rls_enabled should be true for all)
select
  c.relname            as table_name,
  c.relrowsecurity     as rls_enabled,
  c.relforcerowsecurity as rls_forced
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind = 'r'
  and c.relname in (
    'patients','invoices','appointments','lab_results','cases',
    'clinics','clinic_members','vet_pharmacy_stock','vet_pharmacy_dispensing',
    'subscriptions','sent_emails'
  )
order by table_name;

-- 1b) What policies exist on each of those tables?
select
  schemaname,
  tablename,
  policyname,
  cmd            as command,     -- SELECT / INSERT / UPDATE / DELETE / ALL
  roles,
  qual           as using_expr,  -- row visibility condition
  with_check     as check_expr   -- write condition
from pg_policies
where schemaname = 'public'
  and tablename in (
    'patients','invoices','appointments','lab_results','cases',
    'clinics','clinic_members','vet_pharmacy_stock','vet_pharmacy_dispensing',
    'subscriptions','sent_emails'
  )
order by tablename, cmd;
