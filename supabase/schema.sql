-- SchemeSetu — Supabase schema. Supabase is a progressive-enhancement
-- layer on top of this app's offline-first design (bundled
-- data/schemes.ts + localStorage) — never a hard dependency. See
-- lib/schemes/live-schemes.tsx and lib/supabase/sync.ts for how the
-- app reads/writes these tables, always with a silent fallback to the
-- existing local behavior on any failure.
--
-- Run this once in the Supabase SQL Editor (Project → SQL Editor →
-- New query → paste → Run). It flushes any tables left over from an
-- earlier, unrelated integration attempt before creating these fresh.
--
-- After running this, seed the `schemes` table from data/schemes.ts:
--   SUPABASE_URL=https://gnkjmtxwfmnnziycidlb.supabase.co \
--   SUPABASE_SERVICE_ROLE_KEY=<your service role key> \
--   npm run seed:supabase
--
-- Also enable "Allow anonymous sign-ins" under Authentication →
-- Sign In / Providers — required for the per-visitor backup of
-- assessment/saved-scheme/checklist data (schemes themselves are
-- public-read and don't need it).

-- --- Flush anything left over from the earlier, abandoned integration ---
drop table if exists public.schemes cascade;
drop table if exists public.assessment_profiles cascade;
drop table if exists public.saved_schemes cascade;
drop table if exists public.checklist_progress cascade;

-- --- Schemes: public read-only mirror of data/schemes.ts -----------------
-- The full Scheme object is stored as jsonb for lossless round-
-- tripping through the app's existing TypeScript type — `id` is
-- pulled out as its own column for fast lookups, everything else
-- (name, eligibility fields, requiredDocuments, dataConfidenceNote,
-- etc.) stays inside `data`, byte-identical to what data/schemes.ts
-- already has. Never edited by hand here — reseed from
-- data/schemes.ts via `npm run seed:supabase` after any edit there,
-- so the two never drift.
create table public.schemes (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.schemes enable row level security;

create policy "schemes are publicly readable"
  on public.schemes for select
  using (true);

-- No insert/update/delete policy for anon/authenticated on purpose —
-- only the service-role key (used solely by scripts/seed-supabase-
-- schemes.ts) can write here, so a compromised anon key can never
-- alter scheme data.

-- --- Per-visitor assessment draft -----------------------------------------
-- Mirrors DraftEntrepreneurProfile (lib/matching/types.ts). A
-- best-effort backup of what's already in localStorage — see
-- lib/assessment/persistence.ts.
create table public.assessment_profiles (
  visitor_id uuid primary key references auth.users(id) on delete cascade,
  profile jsonb not null,
  step_index int not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.assessment_profiles enable row level security;

create policy "visitors manage their own assessment profile"
  on public.assessment_profiles for all
  using (auth.uid() = visitor_id)
  with check (auth.uid() = visitor_id);

-- --- Per-visitor saved/bookmarked schemes ---------------------------------
-- Mirrors lib/schemes/saved-schemes-context.tsx's localStorage list.
create table public.saved_schemes (
  visitor_id uuid not null references auth.users(id) on delete cascade,
  scheme_id text not null,
  saved_at timestamptz not null default now(),
  primary key (visitor_id, scheme_id)
);

alter table public.saved_schemes enable row level security;

create policy "visitors manage their own saved schemes"
  on public.saved_schemes for all
  using (auth.uid() = visitor_id)
  with check (auth.uid() = visitor_id);

-- --- Per-visitor, per-scheme application-checklist progress ---------------
-- Mirrors lib/schemes/checklist-persistence.ts's localStorage state.
create table public.checklist_progress (
  visitor_id uuid not null references auth.users(id) on delete cascade,
  scheme_id text not null,
  completed jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (visitor_id, scheme_id)
);

alter table public.checklist_progress enable row level security;

create policy "visitors manage their own checklist progress"
  on public.checklist_progress for all
  using (auth.uid() = visitor_id)
  with check (auth.uid() = visitor_id);
