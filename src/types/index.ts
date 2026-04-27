export type RiskLevel = "Low" | "Medium" | "High";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  xm_account_id: string | null;
  is_verified_affiliate: boolean;
  subscription_status: string;
  created_at: string;
  updated_at: string;
}

export interface BotSettings {
  id: string;
  user_id: string;
  bot_active: boolean;
  risk_level: RiskLevel;
  created_at: string;
  updated_at: string;
}

export interface TradeHistory {
  id: string;
  user_id: string;
  symbol: string;
  order_type: "BUY" | "SELL";
  lot_size: number;
  open_price: number;
  close_price: number | null;
  profit: number | null;
  status: "open" | "closed";
  opened_at: string;
  closed_at: string | null;
}
