-- Seed data for local/initial setup.
-- Run AFTER 0001_init.sql. Safe to re-run (idempotent upsert).

-- Bootstrap invite code so the owner can create the first profile.
-- Change the code and bump max_uses as you invite more people.
insert into invite_codes (code, max_uses, uses, active)
values ('FAMILY-2026', 20, 0, true)
on conflict (code) do nothing;

-- After the owner signs in and redeems the code once, promote them to admin:
--   update profiles set is_admin = true where id = '<your-auth-user-id>';
-- (find the id in Supabase → Authentication → Users)
