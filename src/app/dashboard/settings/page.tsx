import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MT5ConnectionForm from "@/components/dashboard/MT5ConnectionForm";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const profile = profileData as import("@/types").Profile | null;

  return (
    <div style={{ maxWidth: "32rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h1 className="font-display" style={{ fontSize: "2rem", letterSpacing: "-0.03em", color: "var(--text-primary)" }}>Settings</h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
          Manage your account and broker connection
        </p>
      </div>

      {/* Account Info */}
      <div className="bento" style={{ borderRadius: "1.125rem", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <p className="font-mono" style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#D4AF37" }}>Account Info</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {[
            ["Email", profile?.email],
            ["Full Name", profile?.full_name ?? "—"],
          ].map(([label, val]) => (
            <div key={label}>
              <p style={{ fontSize: "0.6875rem", color: "var(--text-secondary)", marginBottom: "0.2rem" }}>{label}</p>
              <p style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}>{val}</p>
            </div>
          ))}
          <div>
            <p style={{ fontSize: "0.6875rem", color: "var(--text-secondary)", marginBottom: "0.375rem" }}>Affiliate Status</p>
            <span style={{
              display: "inline-block", fontSize: "0.6875rem", fontWeight: 600,
              padding: "0.25rem 0.75rem", borderRadius: "9999px",
              background: profile?.is_verified_affiliate ? "rgba(0,212,160,0.10)" : "rgba(136,136,170,0.10)",
              color: profile?.is_verified_affiliate ? "var(--green)" : "var(--text-secondary)",
              border: profile?.is_verified_affiliate ? "1px solid rgba(0,212,160,0.25)" : "1px solid rgba(136,136,170,0.20)",
            }}>
              {profile?.is_verified_affiliate ? "Verified Affiliate" : "Not Verified"}
            </span>
          </div>
          <div>
            <p style={{ fontSize: "0.6875rem", color: "var(--text-secondary)", marginBottom: "0.375rem" }}>Subscription</p>
            <span style={{
              display: "inline-block", fontSize: "0.6875rem", fontWeight: 600,
              padding: "0.25rem 0.75rem", borderRadius: "9999px",
              background: profile?.subscription_status === "active" ? "rgba(0,212,160,0.10)" : "rgba(220,38,38,0.08)",
              color: profile?.subscription_status === "active" ? "var(--green)" : "var(--red)",
              border: profile?.subscription_status === "active" ? "1px solid rgba(0,212,160,0.25)" : "1px solid rgba(220,38,38,0.20)",
              textTransform: "capitalize",
            }}>
              {profile?.subscription_status ?? "inactive"}
            </span>
          </div>
        </div>
      </div>

      <MT5ConnectionForm currentXmAccountId={profile?.xm_account_id ?? null} />

      {/* Subscription */}
      <div className="bento" style={{ borderRadius: "1.125rem", padding: "1.5rem" }}>
        <p className="font-mono" style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#D4AF37", marginBottom: "0.5rem" }}>Subscription</p>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1rem" }}>
          Manage your $25/month plan. Payment via Stripe or Crypto.
        </p>
        <button
          disabled
          style={{
            width: "100%", padding: "0.75rem", borderRadius: "0.75rem",
            border: "1px solid rgba(212,175,55,0.20)",
            background: "rgba(212,175,55,0.06)",
            color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 500,
            cursor: "not-allowed", opacity: 0.7,
          }}
        >
          Payment Integration — Coming Soon
        </button>
      </div>
    </div>
  );
}
