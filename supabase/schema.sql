-- BottleZap — run in Supabase SQL Editor (or migrations)
-- Enable pgcrypto for gen_random_uuid if not present
create extension if not exists "pgcrypto";

-- Profiles (synced from auth via trigger)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('business', 'collector')),
  full_name text not null default '',
  email text not null default ''
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Listings
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  business_id uuid not null references auth.users (id) on delete cascade,
  business_email text not null,
  business_name text not null,
  address text not null,
  lat double precision not null,
  lng double precision not null,
  bottle_count integer not null check (bottle_count >= 10),
  bottle_types text[] not null default '{}',
  reward_offer text not null default '',
  collection_window text not null default '',
  status text not null default 'active' check (status in ('active', 'claimed', 'completed')),
  claimed_by uuid references auth.users (id) on delete set null,
  claimed_at timestamptz
);

create index if not exists listings_status_idx on public.listings (status);
create index if not exists listings_business_idx on public.listings (business_id);

alter table public.listings enable row level security;

create policy "Authenticated read listings"
  on public.listings for select
  to authenticated
  using (
    status = 'active'
    or business_id = auth.uid()
    or claimed_by = auth.uid()
  );

create policy "Business inserts own listings"
  on public.listings for insert
  to authenticated
  with check (
    business_id = auth.uid()
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'business'
    )
  );

create policy "Business updates own listings"
  on public.listings for update
  to authenticated
  using (business_id = auth.uid())
  with check (business_id = auth.uid());

-- New user → profile row
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  r text;
begin
  r := coalesce(new.raw_user_meta_data->>'role', 'collector');
  if r not in ('business', 'collector') then
    r := 'collector';
  end if;
  insert into public.profiles (id, role, full_name, email)
  values (
    new.id,
    r,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.email, '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Claim listing (collectors only)
create or replace function public.claim_listing(p_listing_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;
  if not exists (select 1 from public.profiles where id = uid and role = 'collector') then
    raise exception 'Only collectors can claim listings';
  end if;
  update public.listings
  set
    status = 'claimed',
    claimed_by = uid,
    claimed_at = now()
  where id = p_listing_id
    and status = 'active'
    and claimed_by is null;
  if not found then
    raise exception 'Listing is not available to claim';
  end if;
end;
$$;

grant execute on function public.claim_listing(uuid) to authenticated;
