-- =============================================
-- Artemis-Trader: Affiliate / Influencer Schema
-- =============================================

-- ── affiliates ─────────────────────────────────────────────────
create table public.affiliates (
  id               uuid primary key references public.profiles(id) on delete cascade,
  code             text unique not null,          -- e.g. "JOHN2024"
  commission_rate  numeric(5,2) not null default 20.00,  -- percent
  tier             text not null default 'starter'
    check (tier in ('starter', 'pro', 'elite')),
  total_clicks     integer not null default 0,
  total_referrals  integer not null default 0,
  total_conversions integer not null default 0,
  total_earned     numeric(12,2) not null default 0.00,
  total_paid       numeric(12,2) not null default 0.00,
  payout_method    text check (payout_method in ('bank','paypal','crypto', null)),
  payout_details   jsonb,
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create trigger affiliates_updated_at
  before update on public.affiliates
  for each row execute procedure public.handle_updated_at();

-- ── affiliate_clicks ───────────────────────────────────────────
create table public.affiliate_clicks (
  id           uuid primary key default uuid_generate_v4(),
  affiliate_id uuid references public.affiliates(id) on delete cascade not null,
  ip_hash      text,
  referrer     text,
  created_at   timestamptz not null default now()
);

create index affiliate_clicks_affiliate_id_idx on public.affiliate_clicks(affiliate_id);
create index affiliate_clicks_created_at_idx   on public.affiliate_clicks(created_at desc);

-- ── affiliate_referrals ────────────────────────────────────────
create table public.affiliate_referrals (
  id               uuid primary key default uuid_generate_v4(),
  affiliate_id     uuid references public.affiliates(id) on delete cascade not null,
  referred_user_id uuid references public.profiles(id) on delete set null,
  referred_email   text not null,
  status           text not null default 'signed_up'
    check (status in ('signed_up', 'converted', 'churned')),
  plan             text,
  commission       numeric(12,2) not null default 0.00,
  created_at       timestamptz not null default now(),
  converted_at     timestamptz
);

create index affiliate_referrals_affiliate_id_idx on public.affiliate_referrals(affiliate_id);

-- ── affiliate_payouts ──────────────────────────────────────────
create table public.affiliate_payouts (
  id           uuid primary key default uuid_generate_v4(),
  affiliate_id uuid references public.affiliates(id) on delete cascade not null,
  amount       numeric(12,2) not null,
  status       text not null default 'pending'
    check (status in ('pending', 'processing', 'paid', 'cancelled')),
  method       text,
  notes        text,
  requested_at timestamptz not null default now(),
  paid_at      timestamptz
);

create index affiliate_payouts_affiliate_id_idx on public.affiliate_payouts(affiliate_id);

-- ── RLS ────────────────────────────────────────────────────────
alter table public.affiliates          enable row level security;
alter table public.affiliate_clicks    enable row level security;
alter table public.affiliate_referrals enable row level security;
alter table public.affiliate_payouts   enable row level security;

create policy "affiliates_select_own" on public.affiliates
  for select using (auth.uid() = id);
create policy "affiliates_update_own" on public.affiliates
  for update using (auth.uid() = id);

create policy "affiliate_clicks_select_own" on public.affiliate_clicks
  for select using (
    affiliate_id in (select id from public.affiliates where id = auth.uid())
  );
create policy "affiliate_clicks_insert_anon" on public.affiliate_clicks
  for insert with check (true);  -- public tracking endpoint inserts

create policy "affiliate_referrals_select_own" on public.affiliate_referrals
  for select using (
    affiliate_id in (select id from public.affiliates where id = auth.uid())
  );

create policy "affiliate_payouts_select_own" on public.affiliate_payouts
  for select using (
    affiliate_id in (select id from public.affiliates where id = auth.uid())
  );
create policy "affiliate_payouts_insert_own" on public.affiliate_payouts
  for insert with check (
    affiliate_id in (select id from public.affiliates where id = auth.uid())
  );

-- ── Helper: grant affiliate access ────────────────────────────
-- Run this in Supabase SQL editor to make a user an affiliate:
--
-- SELECT public.grant_affiliate('user@email.com', 'MYCODE', 25.00);
--
create or replace function public.grant_affiliate(
  p_email        text,
  p_code         text,
  p_commission   numeric default 20.00
)
returns text
language plpgsql
security definer set search_path = public
as $$
declare
  v_user_id uuid;
begin
  select id into v_user_id from public.profiles where email = p_email;
  if v_user_id is null then
    return 'ERROR: user not found — make sure they have signed up first';
  end if;

  update public.profiles set is_verified_affiliate = true where id = v_user_id;

  insert into public.affiliates (id, code, commission_rate)
  values (v_user_id, upper(p_code), p_commission)
  on conflict (id) do update set
    code            = upper(p_code),
    commission_rate = p_commission;

  return 'OK: ' || p_email || ' is now an affiliate with code ' || upper(p_code);
end;
$$;
