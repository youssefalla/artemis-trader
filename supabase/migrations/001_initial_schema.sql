-- =============================================
-- Artemis-Trader: Initial Database Schema
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- PROFILES TABLE
-- =============================================
create table public.profiles (
  id            uuid references auth.users(id) on delete cascade primary key,
  email         text not null,
  full_name     text,
  xm_account_id text,
  is_verified_affiliate boolean not null default false,
  subscription_status text not null default 'inactive'
    check (subscription_status in ('active', 'inactive', 'trial', 'cancelled')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- =============================================
-- BOT SETTINGS TABLE
-- =============================================
create table public.bot_settings (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references public.profiles(id) on delete cascade not null unique,
  risk_level      text not null default 'Low'
    check (risk_level in ('Low', 'Medium', 'High')),
  bot_active      boolean not null default false,
  max_lot_size    numeric(10, 2) not null default 0.01,
  take_profit_pips integer not null default 50,
  stop_loss_pips   integer not null default 30,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger bot_settings_updated_at
  before update on public.bot_settings
  for each row execute procedure public.handle_updated_at();

-- Auto-create default bot_settings when profile is created
create or replace function public.handle_new_profile()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.bot_settings (user_id) values (new.id);
  return new;
end;
$$;

create trigger on_profile_created
  after insert on public.profiles
  for each row execute procedure public.handle_new_profile();

-- =============================================
-- TRADE HISTORY TABLE
-- =============================================
create table public.trade_history (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.profiles(id) on delete cascade not null,
  symbol      text not null,
  order_type  text not null check (order_type in ('BUY', 'SELL')),
  lot_size    numeric(10, 2) not null,
  open_price  numeric(18, 5) not null,
  close_price numeric(18, 5),
  profit      numeric(18, 2),
  status      text not null default 'open' check (status in ('open', 'closed')),
  opened_at   timestamptz not null default now(),
  closed_at   timestamptz
);

create index trade_history_user_id_idx on public.trade_history(user_id);
create index trade_history_opened_at_idx on public.trade_history(opened_at desc);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
alter table public.profiles       enable row level security;
alter table public.bot_settings   enable row level security;
alter table public.trade_history  enable row level security;

-- Profiles: users can only read/update their own row
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Bot settings: users can only access their own settings
create policy "bot_settings_select_own" on public.bot_settings
  for select using (auth.uid() = user_id);

create policy "bot_settings_update_own" on public.bot_settings
  for update using (auth.uid() = user_id);

-- Trade history: users can only see their own trades
create policy "trade_history_select_own" on public.trade_history
  for select using (auth.uid() = user_id);

create policy "trade_history_insert_own" on public.trade_history
  for insert with check (auth.uid() = user_id);
