-- Run this in your Supabase SQL Editor to set up the database

create table if not exists dashboard_data (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  data jsonb not null default '{}',
  updated_at timestamptz default now()
);

-- Row Level Security: users can only access their own data
alter table dashboard_data enable row level security;

create policy "Users can read own data"
  on dashboard_data for select
  using (auth.uid() = user_id);

create policy "Users can insert own data"
  on dashboard_data for insert
  with check (auth.uid() = user_id);

create policy "Users can update own data"
  on dashboard_data for update
  using (auth.uid() = user_id);

create policy "Users can delete own data"
  on dashboard_data for delete
  using (auth.uid() = user_id);
