import { createAdminClient } from "@/lib/supabase/admin";
import InviteClient from "./_InviteClient";

export default async function AdminAffiliatesPage() {
  const admin = createAdminClient();

  const { data: affiliates } = await admin
    .from("affiliates")
    .select("id, code, commission_rate, tier, total_clicks, total_referrals, total_conversions, total_earned, total_paid, profiles(email, full_name)")
    .order("total_earned", { ascending: false });

  return (
    <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="font-display" style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Affiliates</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "0.35rem", fontSize: "0.9rem" }}>
          Manage influencers and send invites.
        </p>
      </div>

      {/* Invite form */}
      <div style={{ marginBottom: "2rem" }}>
        <InviteClient />
      </div>

      {/* Affiliates table */}
      <div className="bento" style={{ borderRadius: "1.25rem", overflow: "hidden" }}>
        <p className="font-mono" style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)", padding: "1.25rem 1.5rem 0.875rem" }}>
          All Affiliates — {affiliates?.length ?? 0} total
        </p>
        {!affiliates?.length ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-secondary)" }}>No affiliates yet. Send your first invite above.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                  {["Email", "Code", "Commission", "Tier", "Clicks", "Referrals", "Conversions", "Earned", "Paid", "Available"].map(h => (
                    <th key={h} style={{ padding: "0.875rem 1.125rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {affiliates.map((a, i) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const profile = a.profiles as any;
                  const available = (a.total_earned ?? 0) - (a.total_paid ?? 0);
                  return (
                    <tr key={a.id}
                      style={{ borderBottom: i < affiliates.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", transition: "background 0.15s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(212,175,55,0.03)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "0.8rem 1.125rem", fontSize: "0.85rem", color: "var(--text-primary)" }}>{profile?.email ?? "—"}</td>
                      <td style={{ padding: "0.8rem 1.125rem" }}>
                        <span style={{ fontSize: "0.8rem", fontFamily: "monospace", fontWeight: 700, color: "#D4AF37", padding: "0.2rem 0.5rem", borderRadius: "0.5rem", background: "rgba(212,175,55,0.10)" }}>{a.code}</span>
                      </td>
                      <td style={{ padding: "0.8rem 1.125rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>{a.commission_rate}%</td>
                      <td style={{ padding: "0.8rem 1.125rem", fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "capitalize" }}>{a.tier ?? "standard"}</td>
                      <td style={{ padding: "0.8rem 1.125rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>{a.total_clicks ?? 0}</td>
                      <td style={{ padding: "0.8rem 1.125rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>{a.total_referrals ?? 0}</td>
                      <td style={{ padding: "0.8rem 1.125rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>{a.total_conversions ?? 0}</td>
                      <td style={{ padding: "0.8rem 1.125rem", fontSize: "0.875rem", fontWeight: 700, color: "#D4AF37" }}>${(a.total_earned ?? 0).toFixed(2)}</td>
                      <td style={{ padding: "0.8rem 1.125rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>${(a.total_paid ?? 0).toFixed(2)}</td>
                      <td style={{ padding: "0.8rem 1.125rem", fontSize: "0.875rem", fontWeight: 600, color: available > 0 ? "#34d399" : "var(--text-secondary)" }}>${available.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
