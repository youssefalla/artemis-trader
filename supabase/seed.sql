-- Seed file: insert mock trade history for a test user
-- Run AFTER creating a test user via Supabase Auth dashboard
-- Replace 'YOUR_TEST_USER_UUID' with the actual UUID

/*
insert into public.trade_history (user_id, symbol, order_type, lot_size, open_price, close_price, profit, status, opened_at, closed_at)
values
  ('YOUR_TEST_USER_UUID', 'XAUUSD', 'BUY',  0.10, 2320.500, 2335.200,  147.00, 'closed', now() - interval '2 days', now() - interval '1 day 23 hours'),
  ('YOUR_TEST_USER_UUID', 'EURUSD', 'SELL', 0.05, 1.08520,  1.08310,   10.50, 'closed', now() - interval '1 day', now() - interval '20 hours'),
  ('YOUR_TEST_USER_UUID', 'XAUUSD', 'BUY',  0.10, 2341.100, null,      null,  'open',   now() - interval '3 hours', null);
*/
