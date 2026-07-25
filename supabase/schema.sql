-- Family Cafe King production database schema
-- Run this in Supabase Dashboard → SQL Editor after creating the project.

create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text not null,
  city text not null,
  brand text not null,
  budget text not null,
  status text not null default 'New',
  notes text not null default '',
  source_page text not null default 'landing-page'
);

create table if not exists public.upcoming_launches (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  city text not null,
  brand text not null,
  date_text text not null,
  image_data text not null,
  tag text not null default 'Coming Soon',
  accent text not null default '#8C1F28'
);

alter table public.leads enable row level security;
alter table public.upcoming_launches enable row level security;

-- Public landing page visitors may submit leads, but can never read other users' lead data.
drop policy if exists "allow_public_lead_inserts" on public.leads;
create policy "allow_public_lead_inserts"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

-- Authenticated admins can manage all leads.
drop policy if exists "allow_admin_lead_management" on public.leads;
create policy "allow_admin_lead_management"
  on public.leads
  for all
  to authenticated
  using (true)
  with check (true);

-- Everyone can read upcoming launch cards shown on the landing page.
drop policy if exists "allow_public_launch_reads" on public.upcoming_launches;
create policy "allow_public_launch_reads"
  on public.upcoming_launches
  for select
  to anon, authenticated
  using (true);

-- Only signed-in admins can add or remove launch cards.
drop policy if exists "allow_admin_launch_inserts" on public.upcoming_launches;
create policy "allow_admin_launch_inserts"
  on public.upcoming_launches
  for insert
  to authenticated
  with check (true);

drop policy if exists "allow_admin_launch_updates" on public.upcoming_launches;
create policy "allow_admin_launch_updates"
  on public.upcoming_launches
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "allow_admin_launch_deletes" on public.upcoming_launches;
create policy "allow_admin_launch_deletes"
  on public.upcoming_launches
  for delete
  to authenticated
  using (true);

-- Recommended indexes for dashboard filtering.
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_brand_idx on public.leads (brand);
create index if not exists upcoming_launches_created_at_idx on public.upcoming_launches (created_at asc);
