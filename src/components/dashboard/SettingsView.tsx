"use client";

import { useT } from "@/lib/i18n";
import MT5ConnectionForm from "@/components/dashboard/MT5ConnectionForm";
import type { Profile } from "@/types";

export default function SettingsView({ profile }: { profile: Profile | null }) {
  const { T } = useT();
  const isAffiliate = profile?.is_verified_affiliate;
  const isActive = profile?.subscription_status === "active";

  return (
    <div style={{ maxWidth: "32rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h1 className="font-display" style={{ fontSize: "2rem", letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
          {T.settingsPage.title}
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
          {T.settingsPage.subtitle}
        </p>
      </div>

      <div className="bento" style={{ borderRadius: "1.125rem", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <p className="font-mono" style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#D4AF37" }}>
          {T.settingsPage.accountInfo}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {[
            [T.settingsPage.email, profile?.email],
            [T.settingsPage.fullName, profile?.full_name ?? "—"],
          ].map(([label, val]) => (
            <div key={label}>
              <p style={{ fontSize: "0.6875rem", color: "var(--text-secondary)", marginBottom: "0.2rem" }}>{label}</p>
              <p style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}>{val}</p>
            </div>
          ))}
          <div>
            <p style={{ fontSize: "0.6875rem", color: "var(--text-secondary)", marginBottom: "0.375rem" }}>
              {T.settingsPage.affiliateStatus}
            </p>
            <span style={{
              display: "inline-block", fontSize: "0.6875rem", fontWeight: 600,
              padding: "0.25rem 0.75rem", borderRadius: "9999px",
              background: isAffiliate ? "rgba(0,212,160,0.10)" : "rgba(136,136,170,0.10)",
              color: isAffiliate ? "var(--green)" : "var(--text-secondary)",
              border: isAffiliate ? "1px solid rgba(0,212,160,0.25)" : "1px solid rgba(136,136,170,0.20)",
            }}>
              {isAffiliate ? T.settingsPage.verifiedAffiliate : T.settingsPage.notVerified}
            </span>
          </div>
          <div>
            <p style={{ fontSize: "0.6875rem", color: "var(--text-secondary)", marginBottom: "0.375rem" }}>
              {T.settingsPage.subscription}
            </p>
            <span style={{
              display: "inline-block", fontSize: "0.6875rem", fontWeight: 600,
              padding: "0.25rem 0.75rem", borderRadius: "9999px",
              background: isActive ? "rgba(0,212,160,0.10)" : "rgba(220,38,38,0.08)",
              color: isActive ? "var(--green)" : "var(--red)",
              border: isActive ? "1px solid rgba(0,212,160,0.25)" : "1px solid rgba(220,38,38,0.20)",
              textTransform: "capitalize",
            }}>
              {profile?.subscription_status ?? "inactive"}
            </span>
          </div>
        </div>
      </div>

      <MT5ConnectionForm currentXmAccountId={profile?.xm_account_id ?? null} />

      <div className="bento" style={{ borderRadius: "1.125rem", padding: "1.5rem" }}>
        <p className="font-mono" style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#D4AF37", marginBottom: "0.5rem" }}>
          {T.settingsPage.subscription}
        </p>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1rem" }}>
          {T.settingsPage.subscriptionManage}
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
          {T.settingsPage.paymentComingSoon}
        </button>
      </div>
    </div>
  );
}
