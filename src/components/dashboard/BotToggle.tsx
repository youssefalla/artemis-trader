"use client";

import { useState, useTransition } from "react";
import { Bot, AlertTriangle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { RiskLevel } from "@/types";

interface BotToggleProps {
  initialActive: boolean;
  initialRisk: RiskLevel;
  isVerifiedAffiliate: boolean;
  subscriptionStatus: string;
}

const RISK_COLORS: Record<RiskLevel, string> = {
  Low: "var(--green)",
  Medium: "#D4AF37",
  High: "var(--red)",
};

export default function BotToggle({
  initialActive,
  initialRisk,
  isVerifiedAffiliate,
  subscriptionStatus,
}: BotToggleProps) {
  const [active, setActive] = useState(initialActive);
  const [risk, setRisk] = useState<RiskLevel>(initialRisk);
  const [isPending, startTransition] = useTransition();

  const canActivate = isVerifiedAffiliate && subscriptionStatus === "active";

  async function toggleBot() {
    if (!canActivate) return;
    const newValue = !active;
    startTransition(async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await supabase.from("bot_settings").update({ bot_active: newValue } as any).eq("user_id", user.id);
      setActive(newValue);
    });
  }

  async function updateRisk(level: RiskLevel) {
    setRisk(level);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await supabase.from("bot_settings").update({ risk_level: level } as any).eq("user_id", user.id);
  }

  return (
    <div className="bento" style={{ borderRadius: "1.125rem", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: "2.5rem", height: "2.5rem", borderRadius: "0.75rem",
            display: "grid", placeItems: "center",
            background: active ? "rgba(0,212,160,0.12)" : "rgba(136,136,170,0.08)",
            border: active ? "1px solid rgba(0,212,160,0.25)" : "1px solid rgba(136,136,170,0.15)",
          }}>
            <Bot size={18} style={{ color: active ? "var(--green)" : "var(--text-secondary)" }} />
          </div>
          <div>
            <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.9rem" }}>Trading Bot</p>
            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.1rem" }}>
              {active ? "Running — scanning markets" : "Stopped"}
            </p>
          </div>
        </div>

        {/* Toggle pill */}
        <button
          onClick={toggleBot}
          disabled={!canActivate || isPending}
          title={!canActivate ? "Requires active subscription & verified affiliate" : undefined}
          style={{
            position: "relative", width: "3.25rem", height: "1.75rem",
            borderRadius: "9999px", border: "none", cursor: canActivate ? "pointer" : "not-allowed",
            background: active ? "var(--green)" : "rgba(136,136,170,0.25)",
            opacity: !canActivate ? 0.5 : 1,
            transition: "background 0.3s",
            flexShrink: 0,
          }}
        >
          {isPending ? (
            <Loader2 size={13} style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", color: "#fff", animation: "spin 1s linear infinite" }} />
          ) : (
            <span style={{
              position: "absolute", top: "3px",
              width: "1.25rem", height: "1.25rem",
              background: "#fff", borderRadius: "9999px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
              transition: "left 0.25s cubic-bezier(.22,.61,.36,1)",
              left: active ? "calc(100% - 22px)" : "3px",
            }} />
          )}
        </button>
      </div>

      {/* Warning */}
      {!canActivate && (
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.20)", borderRadius: "0.75rem", padding: "0.75rem 0.875rem" }}>
          <AlertTriangle size={14} style={{ color: "#D4AF37", flexShrink: 0, marginTop: "0.1rem" }} />
          <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            {!isVerifiedAffiliate
              ? "Your XM affiliate account has not been verified yet. Contact support to verify."
              : "Your subscription is not active. Subscribe to enable the bot."}
          </p>
        </div>
      )}

      {/* Risk level */}
      <div>
        <p className="font-mono" style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-secondary)", marginBottom: "0.625rem" }}>Risk Level</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
          {(["Low", "Medium", "High"] as RiskLevel[]).map((level) => {
            const isSelected = risk === level;
            const color = RISK_COLORS[level];
            return (
              <button
                key={level}
                onClick={() => updateRisk(level)}
                style={{
                  padding: "0.5rem 0.25rem",
                  borderRadius: "0.75rem",
                  fontSize: "0.8125rem",
                  fontWeight: isSelected ? 600 : 500,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  border: isSelected ? `1px solid color-mix(in srgb, ${color} 40%, transparent)` : "1px solid rgba(0,0,0,0.08)",
                  background: isSelected ? `color-mix(in srgb, ${color} 12%, transparent)` : "rgba(255,255,255,0.30)",
                  color: isSelected ? color : "var(--text-secondary)",
                }}
              >
                {level}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
