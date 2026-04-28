import { createClient } from "@/lib/supabase/server";
import { MousePointerClick, Users, TrendingUp, DollarSign, Star } from "lucide-react";

const TIER_COLORS: Record<string, string> = {
  starter: "#9ca3af",
  pro:     "#D4AF37",
  elite:   "#f0d060",
};
const TIER_LABELS: Record<string, string> = {
  starter: "Starter",
  pro:     "Pro",
  elite:   "Elite ✦",
};

function StatCard({
  icon: Icon, label, value, sub, color = "#D4AF37",
}: { icon: React.ElementType; label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="bento" style={{ borderRadius: "1.25rem", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)" }}>
          {label}
        </span>
        <div style={{ width: "2.25rem", height: "2.25rem", borderRadius: "0.75rem", background: `rgba(212,175,55,0.12)`, display: "grid", placeItems: "center" }}>
          <Icon size={16} style={{ color }} />
        </div>
      </div>
      <p style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1, margin: 0 }}>{value}</p>
      {sub && <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: 0 }}>{sub}</p>}
    </div>
  );
}

export default async function AffiliateDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: affiliate } = await supabase
    .from("affiliates")
    .select("*")
    .eq("id", user!.id)
    .single();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user!.id)
    .single();

  // Clicks last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { count: recentClicks } = await supabase
    .from("affiliate_clicks")
    .select("*", { count: "exact", head: true })
    .eq("affiliate_id", user!.id)
    .gte("created_at", thirtyDaysAgo);

  // Recent referrals
  const { data: recentReferrals } = await supabase
    .from("affiliate_referrals")
    .select("referred_email, status, commission, created_at")
    .eq("affiliate_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const available = (affiliate?.total_earned ?? 0) - (affiliate?.total_paid ?? 0);
  const tier = affiliate?.tier ?? "starter";

  return (
    <div style={{ maxWidth: "64rem", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: "2rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 className="font-display" style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
            Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""} 👋
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.35rem", fontSize: "0.9rem" }}>
            Your affiliate performance at a glance.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", borderRadius: "9999px", background: "rgba(212,175,55,0.10)", border: "1px solid rgba(212,175,55,0.25)" }}>
          <Star size={13} style={{ color: TIER_COLORS[tier] }} />
          <span className="font-mono" style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: TIER_COLORS[tier] }}>
            {TIER_LABELS[tier]} Tier
          </span>
          <span className="font-mono" style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            · {affiliate?.commission_rate ?? 20}% commission
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <StatCard icon={MousePointerClick} label="Total Clicks"      value={(affiliate?.total_clicks ?? 0).toLocaleString()}    sub={`${recentClicks ?? 0} in last 30 days`} />
        <StatCard icon={Users}           label="Total Referrals"    value={(affiliate?.total_referrals ?? 0).toLocaleString()}   sub="Signed-up users" />
        <StatCard icon={TrendingUp}      label="Conversions"        value={(affiliate?.total_conversions ?? 0).toLocaleString()} sub="Paying customers" />
        <StatCard icon={DollarSign}      label="Total Earned"       value={`$${(affiliate?.total_earned ?? 0).toFixed(2)}`}      sub={`$${available.toFixed(2)} available`} />
      </div>

      {/* Referral link quick-copy */}
      <div className="bento" style={{ borderRadius: "1.25rem", padding: "1.5rem", marginBottom: "2rem" }}>
        <p className="font-mono" style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
          Your Referral Link
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <code style={{ flex: 1, padding: "0.75rem 1rem", borderRadius: "0.875rem", background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.18)", fontSize: "0.875rem", color: "var(--text-primary)", wordBreak: "break-all" }}>
            {`${process.env.NEXT_PUBLIC_SITE_URL ?? "https://artemis-trader.com"}/ref/${affiliate?.code ?? "…"}`}
          </code>
          <CopyButton text={`${process.env.NEXT_PUBLIC_SITE_URL ?? "https://artemis-trader.com"}/ref/${affiliate?.code ?? ""}`} />
        </div>
      </div>

      {/* Recent referrals */}
      <div className="bento" style={{ borderRadius: "1.25rem", padding: "1.5rem" }}>
        <p className="font-mono" style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)", marginBottom: "1rem" }}>
          Recent Referrals
        </p>
        {!recentReferrals?.length ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            No referrals yet — share your link to get started!
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {recentReferrals.map((r) => (
              <div key={r.created_at} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1rem", borderRadius: "0.875rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-primary)" }}>{r.referred_email}</p>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>
                    {new Date(r.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#D4AF37" }}>
                    +${r.commission.toFixed(2)}
                  </span>
                  <StatusBadge status={r.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    signed_up: { bg: "rgba(99,102,241,0.12)", color: "#818cf8", label: "Signed Up" },
    converted: { bg: "rgba(5,150,105,0.12)",  color: "#34d399", label: "Converted" },
    churned:   { bg: "rgba(220,38,38,0.10)",  color: "#f87171", label: "Churned"   },
  };
  const s = map[status] ?? map.signed_up;
  return (
    <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "0.25rem 0.625rem", borderRadius: "9999px", background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

// Client copy button — needs to be inline since this is a server component page
function CopyButton({ text }: { text: string }) {
  // Rendered as a plain button; JS handled inline via dangerouslySetInnerHTML trick
  // Instead, export a small client component below
  return <_CopyBtn text={text} />;
}

import _CopyBtn from "./_CopyBtn";
