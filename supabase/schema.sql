-- Run this file once in Supabase SQL Editor.
-- Authentication users are created in Authentication > Users.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  section text not null unique,
  content jsonb not null default '{}'::jsonb,
  is_published boolean not null default true,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) between 5 and 254),
  phone text check (char_length(phone) <= 40),
  company text check (char_length(company) <= 160),
  message text not null check (char_length(message) between 5 and 5000),
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 120),
  position text not null check (char_length(position) between 2 and 160),
  biography text not null default '' check (char_length(biography) <= 2000),
  image_url text check (char_length(image_url) <= 1000),
  image_alt text check (char_length(image_alt) <= 240),
  display_order integer not null default 0 check (display_order >= 0),
  is_published boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Preserve team profiles created by the earlier schema while moving them to
-- the field names used by the public site and admin panel.
do $$ begin
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'team_members' and column_name = 'name')
    and not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'team_members' and column_name = 'full_name')
  then alter table public.team_members rename column name to full_name; end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'team_members' and column_name = 'role')
    and not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'team_members' and column_name = 'position')
  then alter table public.team_members rename column role to position; end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'team_members' and column_name = 'description')
    and not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'team_members' and column_name = 'biography')
  then alter table public.team_members rename column description to biography; end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'team_members' and column_name = 'is_active')
    and not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'team_members' and column_name = 'is_published')
  then alter table public.team_members rename column is_active to is_published; end if;
end $$;

alter table public.team_members add column if not exists image_alt text;
alter table public.team_members add column if not exists created_by uuid references auth.users(id) on delete set null;
alter table public.team_members add column if not exists updated_by uuid references auth.users(id) on delete set null;
update public.team_members set biography = '' where biography is null;
alter table public.team_members alter column biography set default '';
alter table public.team_members alter column biography set not null;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_content_updated_at on public.site_content;
create trigger site_content_updated_at before update on public.site_content
for each row execute function public.touch_updated_at();

drop trigger if exists enquiries_updated_at on public.enquiries;
create trigger enquiries_updated_at before update on public.enquiries
for each row execute function public.touch_updated_at();

drop trigger if exists team_members_updated_at on public.team_members;
create trigger team_members_updated_at before update on public.team_members
for each row execute function public.touch_updated_at();

alter table public.profiles enable row level security;
alter table public.site_content enable row level security;
alter table public.enquiries enable row level security;
alter table public.team_members enable row level security;

drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile" on public.profiles for select
to authenticated using (id = auth.uid());

drop policy if exists "Admins manage profiles" on public.profiles;
create policy "Admins manage profiles" on public.profiles for all
to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public reads published content" on public.site_content;
create policy "Public reads published content" on public.site_content for select
to anon, authenticated using (is_published or public.is_staff());

drop policy if exists "Staff manages content" on public.site_content;
create policy "Staff manages content" on public.site_content for all
to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "Public creates enquiries" on public.enquiries;
create policy "Public creates enquiries" on public.enquiries for insert
to anon, authenticated with check (status = 'new' and notes is null);

drop policy if exists "Staff reads enquiries" on public.enquiries;
create policy "Staff reads enquiries" on public.enquiries for select
to authenticated using (public.is_staff());

drop policy if exists "Staff updates enquiries" on public.enquiries;
create policy "Staff updates enquiries" on public.enquiries for update
to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "Public reads published team members" on public.team_members;
create policy "Public reads published team members" on public.team_members for select
to anon, authenticated using (is_published or public.is_staff());

drop policy if exists "Staff manages team members" on public.team_members;
create policy "Staff manages team members" on public.team_members for all
to authenticated using (public.is_staff()) with check (public.is_staff());

insert into public.site_content (section, content, is_published) values
('hero', '{"eyebrow":"YOUR SAFETY, OUR MISSION","title":"Next-Gen Safety.\\nUncompromising Protection.","description":"A Trusted Partner in Health Security-Prepared people.","primary_button":"Explore Solutions","secondary_button":"Book a Consultation"}', true),
('about', '{"heading":"About Us","story_title":"Our Story","story_paragraph_1":"Safety Innovations Impact Group is a professional safety training and compliance company established in February 2025, dedicated to equipping organisations and communities with life-saving skills and practical emergency preparedness.","story_paragraph_2":"Founded in February 2025, the company was created in response to a growing need: many workplaces meet safety requirements on paper but remain unprepared in real emergencies. Our goal is to bridge the gap between compliance and real-world readiness.","story_paragraph_3":"We provide hands-on first aid and fire safety training designed not just to certify participants, but to give them the confidence to act when seconds matter. Our instructors bring practical experience, structured teaching methods, and scenario-based learning to ensure that knowledge becomes instinct. Every program is tailored to the environment in which it will be used, because emergencies never happen in a classroom — they happen in real workplaces.","statement":"At Safety Innovations Impact Group, safety is not a checklist, it''s our culture."}', true),
('call_to_action', '{"eyebrow":"Emergencies are unpredictable. Preparation should not be.","title":"Train your team. Protect your workplace. Build a culture of safety.","button":"Contact SIIG"}', true),
('contact', '{"heading":"Contact Us","intro":"Ready to enhance your workplace safety? Contact us today for a consultation or to learn more about our services.","phone":"+233 26 137 0547","phone_link":"+233261370547","email":"safetyinnovations.ltd@gmail.com","instagram":"@safety_innovationsimpactgh","instagram_url":"https://www.instagram.com/safety_innovationsimpactgh/"}', true)
on conflict (section) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public reads site media" on storage.objects;
create policy "Public reads site media" on storage.objects for select
to public using (bucket_id = 'site-media');

drop policy if exists "Staff uploads site media" on storage.objects;
create policy "Staff uploads site media" on storage.objects for insert
to authenticated with check (bucket_id = 'site-media' and public.is_staff());

drop policy if exists "Staff updates site media" on storage.objects;
create policy "Staff updates site media" on storage.objects for update
to authenticated using (bucket_id = 'site-media' and public.is_staff())
with check (bucket_id = 'site-media' and public.is_staff());

drop policy if exists "Staff deletes site media" on storage.objects;
create policy "Staff deletes site media" on storage.objects for delete
to authenticated using (bucket_id = 'site-media' and public.is_staff());

-- After creating the first user in Authentication > Users, promote that account:
-- insert into public.profiles (id, full_name, role)
-- select id, 'SIIG Administrator', 'admin' from auth.users where email = 'YOUR_EMAIL';
