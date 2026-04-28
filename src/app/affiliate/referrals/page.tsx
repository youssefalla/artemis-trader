import { createClient } from "@/lib/supabase/server";

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

export default async function AffiliateReferralsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: referrals } = await supabase
    .from("affiliate_referrals")
    .select("*")
    .eq("affiliate_id", user!.id)
    .order("created_at", { ascending: false });

  const { data: affiliate } = await supabase
    .from("affiliates")
    .select("total_referrals, total_conversions, total_earned")
    .eq("id", user!.id)
    .single();

  const total      = affiliate?.total_referrals  ?? 0;
  const converted  = affiliate?.total_conversions ?? 0;
  const earned     = affiliate?.total_earned      ?? 0;
  const convRate   = total > 0 ? ((converted / total) * 100).toFixed(1) : "0.0";

  return (
    <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="font-display" style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Referrals</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "0.35rem", fontSize: "0.9rem" }}>Everyone who signed up through your link.</p>
      </div>

      {/* Summary row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Total Referrals",   value: total,               suffix: "" },
          { label: "Converted",         value: converted,           suffix: ` (${convRate}%)` },
          { label: "Commission Earned", value: `$${earned.toFixed(2)}`, suffix: "" },
        ].map(({ label, value, suffix }) => (
          <div key={label} className="bento" style={{ borderRadius: "1.25rem", padding: "1.25rem 1.5rem" }}>
            <p className="font-mono" style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)", margin: 0, marginBottom: "0.5rem" }}>{label}</p>
            <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
              {value}<span style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: 400 }}>{suffix}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bento" style={{ borderRadius: "1.25rem", overflow: "hidden" }}>
        {!referrals?.length ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-secondary)" }}>
            <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔗</p>
            <p style={{ fontWeight: 600, color: "var(--text-primary)" }}>No referrals yet</p>
            <p style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>Share your referral link to start tracking signups.</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Email", "Signed Up", "Plan", "Status", "Commission"].map((h) => (
                  <th key={h} style={{ padding: "0.875rem 1.25rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {referrals.map((r, i) => (
                <tr key={r.id} style={{ borderBottom: i < referrals.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", transition: "background 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(212,175,55,0.04)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "0.875rem 1.25rem", fontSize: "0.875rem", color: "var(--text-primary)" }}>{r.referred_email}</td>
                  <td style={{ padding: "0.875rem 1.25rem", fontSize: "0.8rem",   color: "var(--text-secondary)" }}>{new Date(r.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: "0.875rem 1.25rem", fontSize: "0.8rem",   color: "var(--text-secondary)" }}>{r.plan ?? "—"}</td>
                  <td style={{ padding: "0.875rem 1.25rem" }}><StatusBadge status={r.status} /></td>
                  <td style={{ padding: "0.875rem 1.25rem", fontSize: "0.875rem", fontWeight: 600, color: r.commission > 0 ? "#D4AF37" : "var(--text-secondary)" }}>
                    {r.commission > 0 ? `+$${r.commission.toFixed(2)}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
