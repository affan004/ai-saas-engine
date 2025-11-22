-- 1. Enable UUIDs (standard for IDs)
create extension if not exists "uuid-ossp";

-- 2. Create the Tenants Table (The "Account" level)
create table public.tenants (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  slug text not null unique, -- e.g. "dentist-app-1"
  custom_domain text,        -- e.g. "app.dentist.com"
  subscription_status text default 'active'
);

-- 3. Create the Members Table (Links Auth Users to Tenants)
create table public.members (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid references public.tenants(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text default 'owner', -- 'owner', 'member', 'viewer'
  unique(tenant_id, user_id)
);

-- 4. Enable RLS on these tables immediately
alter table public.tenants enable row level security;
alter table public.members enable row level security;

-- --- RLS POLICIES (The Security Logic) ---

-- Policy: Users can see tenants they are a member of
create policy "Users can view their own tenants"
on public.tenants
for select
using (
  exists (
    select 1 from public.members
    where members.tenant_id = tenants.id
    and members.user_id = auth.uid()
  )
);

-- Policy: Users can view members of their own teams
create policy "Users can view members of their tenants"
on public.members
for select
using (
  exists (
    select 1 from public.members as m
    where m.tenant_id = members.tenant_id
    and m.user_id = auth.uid()
  )
);

-- --- HELPER FUNCTIONS (Crucial for AI Generation) ---

-- 5. Function to create a new tenant and link the creator automatically
-- We call this from our API when a user signs up or builds an app.
create or replace function create_tenant_for_user(
  tenant_name text,
  tenant_slug text,
  user_id uuid
) returns uuid as $$
declare
  new_tenant_id uuid;
begin
  -- Create the tenant
  insert into public.tenants (name, slug)
  values (tenant_name, tenant_slug)
  returning id into new_tenant_id;

  -- Link the user as an owner
  insert into public.members (tenant_id, user_id, role)
  values (new_tenant_id, user_id, 'owner');

  return new_tenant_id;
end;
$$ language plpgsql security definer;