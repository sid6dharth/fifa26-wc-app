-- =====================================================================
-- World Cup 2026 Prediction League — initial schema
-- Implements ARCHITECTURE.md §5 (core tables) + §6 (integrity & security).
-- Invite-only sign-up via invite codes; magic-link auth handled by Supabase.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------
create type fixture_status as enum ('scheduled', 'live', 'finished', 'postponed', 'cancelled');
create type prediction_mode as enum ('score', 'group', 'bracket', 'award', 'daily');
create type match_outcome as enum ('home', 'draw', 'away');

-- ---------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- profiles  (league identity; 1:1 with auth.users, created on invite redeem)
-- ---------------------------------------------------------------------
create table profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  avatar_url   text,
  is_admin     boolean not null default false,
  created_at   timestamptz not null default now()
);

-- Admin check, used by RLS policies. SECURITY DEFINER + stable so policies
-- can call it without recursive RLS on profiles.
create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select is_admin from profiles where id = auth.uid()), false);
$$;

-- ---------------------------------------------------------------------
-- teams
-- ---------------------------------------------------------------------
create table teams (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  country_code text not null,
  flag_url     text,
  group_label  text
);

-- ---------------------------------------------------------------------
-- fixtures
-- ---------------------------------------------------------------------
create table fixtures (
  id                uuid primary key default gen_random_uuid(),
  provider_match_id text unique,
  round             text not null,
  group_label       text,
  home_team_id      uuid references teams (id),
  away_team_id      uuid references teams (id),
  kickoff_at        timestamptz not null,
  status            fixture_status not null default 'scheduled',
  home_score        smallint,
  away_score        smallint,
  updated_at        timestamptz not null default now()
);
create index fixtures_kickoff_idx on fixtures (kickoff_at);
create index fixtures_status_idx on fixtures (status);
create trigger fixtures_updated_at before update on fixtures
  for each row execute function set_updated_at();

-- Server-truth lock: a fixture is locked once kickoff has passed.
create or replace function is_fixture_locked(p_fixture_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select kickoff_at <= now() from fixtures where id = p_fixture_id), true);
$$;

-- ---------------------------------------------------------------------
-- predictions  (score predictor and other per-fixture modes)
-- ---------------------------------------------------------------------
create table predictions (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references profiles (id) on delete cascade,
  fixture_id        uuid not null references fixtures (id) on delete cascade,
  mode              prediction_mode not null default 'score',
  predicted_home    smallint,
  predicted_away    smallint,
  predicted_outcome match_outcome,
  locked            boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (user_id, fixture_id, mode)
);
create index predictions_fixture_idx on predictions (fixture_id);
create trigger predictions_updated_at before update on predictions
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------
-- bracket_picks / group_picks / award_picks
-- ---------------------------------------------------------------------
create table bracket_picks (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references profiles (id) on delete cascade,
  round             text not null,
  slot              text not null,
  predicted_team_id uuid references teams (id),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (user_id, round, slot)
);

create table group_picks (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references profiles (id) on delete cascade,
  group_label        text not null,
  team_id            uuid not null references teams (id),
  predicted_position smallint not null,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (user_id, group_label, team_id)
);

create table award_picks (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles (id) on delete cascade,
  award_type text not null,
  value      text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, award_type)
);

-- ---------------------------------------------------------------------
-- points_ledger  (APPEND-ONLY; recompute by atomically replacing rows for
-- one source_ref — see ARCHITECTURE.md §6. No UPDATE/DELETE RLS policies.)
-- ---------------------------------------------------------------------
create table points_ledger (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles (id) on delete cascade,
  source_mode prediction_mode not null,
  source_ref  text not null,
  points      integer not null,
  reason      text,
  created_at  timestamptz not null default now()
);
create index points_ledger_user_idx on points_ledger (user_id);
create index points_ledger_source_idx on points_ledger (source_mode, source_ref);

-- ---------------------------------------------------------------------
-- audit_log  (admin overrides / re-scores)
-- ---------------------------------------------------------------------
create table audit_log (
  id         uuid primary key default gen_random_uuid(),
  actor      uuid references profiles (id),
  action     text not null,
  entity     text not null,
  before     jsonb,
  after      jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- invite_codes  (invite-only gate)
-- ---------------------------------------------------------------------
create table invite_codes (
  code       text primary key,
  created_by uuid references profiles (id),
  max_uses   integer not null default 1,
  uses       integer not null default 0,
  active     boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

-- Redeem an invite code and create the caller's profile. SECURITY DEFINER so a
-- not-yet-member can run it; idempotent if the profile already exists.
create or replace function redeem_invite(p_code text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid   uuid := auth.uid();
  v_email text;
  v_name  text;
begin
  if v_uid is null then
    raise exception 'not_authenticated';
  end if;

  if exists (select 1 from profiles where id = v_uid) then
    return; -- already a member
  end if;

  perform 1
  from invite_codes
  where code = p_code
    and active
    and uses < max_uses
    and (expires_at is null or expires_at > now())
  for update;

  if not found then
    raise exception 'invalid_or_expired_code';
  end if;

  select email into v_email from auth.users where id = v_uid;
  v_name := coalesce(nullif(split_part(coalesce(v_email, ''), '@', 1), ''), 'Member');

  insert into profiles (id, display_name) values (v_uid, v_name);
  update invite_codes set uses = uses + 1 where code = p_code;
end;
$$;

-- ---------------------------------------------------------------------
-- leaderboard view  (totals + per-mode subtotals over the ledger)
-- security_invoker so it respects the caller's RLS on the underlying tables.
-- ---------------------------------------------------------------------
create view leaderboard
with (security_invoker = true)
as
select
  p.id           as user_id,
  p.display_name,
  p.avatar_url,
  coalesce(sum(l.points), 0)                                         as total_points,
  coalesce(sum(l.points) filter (where l.source_mode = 'score'), 0)   as score_points,
  coalesce(sum(l.points) filter (where l.source_mode = 'bracket'), 0) as bracket_points,
  coalesce(sum(l.points) filter (where l.source_mode = 'group'), 0)   as group_points,
  coalesce(sum(l.points) filter (where l.source_mode = 'award'), 0)   as award_points,
  coalesce(sum(l.points) filter (where l.source_mode = 'daily'), 0)   as daily_points
from profiles p
left join points_ledger l on l.user_id = p.id
group by p.id, p.display_name, p.avatar_url;

-- =====================================================================
-- Row-level security
-- =====================================================================
alter table profiles      enable row level security;
alter table teams         enable row level security;
alter table fixtures      enable row level security;
alter table predictions   enable row level security;
alter table bracket_picks enable row level security;
alter table group_picks   enable row level security;
alter table award_picks   enable row level security;
alter table points_ledger enable row level security;
alter table audit_log     enable row level security;
alter table invite_codes  enable row level security;

-- profiles: league members are visible to each other; you edit only your own.
create policy profiles_select on profiles
  for select to authenticated using (true);
create policy profiles_update_own on profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- teams / fixtures: everyone reads; only admins write (worker uses service role).
create policy teams_select on teams
  for select to authenticated using (true);
create policy teams_admin_write on teams
  for all to authenticated using (is_admin()) with check (is_admin());

create policy fixtures_select on fixtures
  for select to authenticated using (true);
create policy fixtures_admin_write on fixtures
  for all to authenticated using (is_admin()) with check (is_admin());

-- predictions: your own always; others' only AFTER the fixture locks.
create policy predictions_select on predictions
  for select to authenticated
  using (user_id = auth.uid() or is_fixture_locked(fixture_id));
create policy predictions_insert_own on predictions
  for insert to authenticated
  with check (user_id = auth.uid() and not is_fixture_locked(fixture_id));
create policy predictions_update_own on predictions
  for update to authenticated
  using (user_id = auth.uid() and not is_fixture_locked(fixture_id))
  with check (user_id = auth.uid() and not is_fixture_locked(fixture_id));
create policy predictions_delete_own on predictions
  for delete to authenticated
  using (user_id = auth.uid() and not is_fixture_locked(fixture_id));

-- bracket / group / award picks: own read+write (reveal rules refined later).
create policy bracket_rw_own on bracket_picks
  for all to authenticated
  using (user_id = auth.uid() or is_admin())
  with check (user_id = auth.uid());
create policy group_rw_own on group_picks
  for all to authenticated
  using (user_id = auth.uid() or is_admin())
  with check (user_id = auth.uid());
create policy award_rw_own on award_picks
  for all to authenticated
  using (user_id = auth.uid() or is_admin())
  with check (user_id = auth.uid());

-- points_ledger: readable by all members (powers the leaderboard). No write
-- policies → append-only from clients; the worker/admin writes via service role.
create policy points_ledger_select on points_ledger
  for select to authenticated using (true);

-- audit_log: admins only.
create policy audit_admin_select on audit_log
  for select to authenticated using (is_admin());

-- invite_codes: only admins can list/manage; redemption goes through the
-- SECURITY DEFINER function above, which bypasses these policies.
create policy invite_admin_all on invite_codes
  for all to authenticated using (is_admin()) with check (is_admin());
