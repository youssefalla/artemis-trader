"use client";

import { useEffect, useState } from "react";
import { Users, UserCheck, TrendingUp, DollarSign, Loader2 } from "lucide-react";

type Profile   = { id: string; email: string; full_name: string | null; subscription_status: string; is_verified_affiliate: boolean; created_at: string };
type Affiliate = { id: string; code: string; total_earned: number; total_clicks: number; total_referrals: number; total_conversions: number };

function StatCard({ label, value, sub, icon: Icon, gold }: { label: string; value: string | number; sub?: string; icon: React.ElementType; gold?: boolean }) {
  return (
    <div className="bento" style={{ borderRadius: "1.25rem", padding: "1.25rem 1.5rem", border: gold ? "1px solid rgba(212,175,55,0.35)" : undefined, background: gold ? "rgba(212,175,55,0.06)" : undefined }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
        <p className="font-mono" style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)", margin: 0 }}>{label}</p>
        <div style={{ width: "2rem", height: "2rem", borderRadius: "0.625rem", background: gold ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.07)", display: "grid", placeItems: "center" }}>
          <Icon size={14} color={gold ? "#D4AF37" : "var(--text-secondary)"} />
        </div>
      </div>
      <p style={{ fontSize: "2rem", fontWeight: 700, color: gold ? "#D4AF37" : "var(--text-primary)", margin: 0, lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: 0, marginTop: "0.375rem" }}>{sub}</p>}
    </div>
  );
}

export default function AdminOverviewPage() {
  const [profiles,   setProfiles]   = useState<Profile[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error);
        else { setProfiles(data.profiles ?? []); setAffiliates(data.affiliates ?? []); }
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "3rem", color: "var(--text-secondary)" }}>
      <Loader2 size={20} className="animate-spin" /> Loading…
    </div>
  );

  if (error) return (
    <div style={{ padding: "2rem", borderRadius: "1rem", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.25)", color: "#f87171", fontFamily: "monospace" }}>
      Admin Error: {error}
    </div>
  );

  const totalUsers      = profiles.length;
  const activeUsers     = profiles.filter(p => p.subscription_status === "active").length;
  const totalAffiliates = affiliates.length;
  const totalEarned     = affiliates.reduce((s, a) => s + (a.total_earned ?? 0), 0);
  const totalReferrals  = affiliates.reduce((s, a) => s + (a.total_referrals ?? 0), 0);
  const recentUsers     = [...profiles].slice(0, 8);

  return (
    <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="font-display" style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Admin Overview</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "0.35rem", fontSize: "0.9rem" }}>Full platform visibility — everything in one place.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        <StatCard label="Total Users"       value={totalUsers}      sub={`${activeUsers} active`}   icon={Users}      />
        <StatCard label="Affiliates"        value={totalAffiliates} sub={`${affiliates.reduce((s,a)=>s+(a.total_clicks??0),0)} clicks`} icon={UserCheck} gold />
        <StatCard label="Total Referrals"   value={totalReferrals}  icon={TrendingUp} />
        <StatCard label="Commission Paid"   value={`$${totalEarned.toFixed(2)}`} icon={DollarSign} gold />
      </div>

      <div className="bento" style={{ borderRadius: "1.25rem", overflow: "hidden" }}>
        <p className="font-mono" style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)", padding: "1.25rem 1.5rem 0.875rem" }}>
          Recent Signups
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Email", "Name", "Status", "Affiliate", "Joined"].map(h => (
                <th key={h} style={{ padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentUsers.map((u, i) => (
              <tr key={u.id} style={{ borderBottom: i < recentUsers.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                <td style={{ padding: "0.8rem 1.25rem", fontSize: "0.85rem", color: "var(--text-primary)" }}>{u.email}</td>
                <td style={{ padding: "0.8rem 1.25rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>{u.full_name ?? "—"}</td>
                <td style={{ padding: "0.8rem 1.25rem" }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "0.2rem 0.5rem", borderRadius: "9999px",
                    background: u.subscription_status === "active" ? "rgba(5,150,105,0.12)" : "rgba(255,255,255,0.07)",
                    color: u.subscription_status === "active" ? "#34d399" : "var(--text-secondary)" }}>
                    {u.subscription_status}
                  </span>
                </td>
                <td style={{ padding: "0.8rem 1.25rem" }}>
                  {u.is_verified_affiliate
                    ? <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "0.2rem 0.5rem", borderRadius: "9999px", background: "rgba(212,175,55,0.12)", color: "#D4AF37" }}>✦ Affiliate</span>
                    : <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>—</span>}
                </td>
                <td style={{ padding: "0.8rem 1.25rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}>{new Date(u.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
