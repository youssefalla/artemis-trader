"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Circle, ExternalLink, ArrowRight, Loader2 } from "lucide-react";
import { GoldGradientBg } from "@/components/ui/elegant-gold-pattern";
import GlassFilter from "@/components/landing/GlassFilter";

const XM_AFFILIATE_LINK = "https://affs.click/aXCBi";

const steps = [
  {
    number: "01",
    title: "Account Created",
    description: "Your Artemis Trader account is active and your email is verified.",
    done: true,
  },
  {
    number: "02",
    title: "Create Your XM Broker Account",
    description:
      "Artemis connects directly to XM MT5. Click below to open your free XM account — takes less than 2 minutes.",
    done: false,
    action: true,
  },
  {
    number: "03",
    title: "Connect & Start Trading",
    description: "Enter your MT5 credentials in your dashboard and activate the bot.",
    done: false,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [brokerOpened, setBrokerOpened] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleOpenBroker() {
    window.open(XM_AFFILIATE_LINK, "_blank", "noopener,noreferrer");
    setBrokerOpened(true);
  }

  function handleContinue() {
    setLoading(true);
    // Set cookie so proxy knows onboarding is done — never redirect here again
    document.cookie = "onboarding_done=true;path=/;max-age=31536000;SameSite=Lax";
    router.push("/dashboard");
  }

  return (
    <GoldGradientBg>
      <GlassFilter />
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.625rem",
            textDecoration: "none",
            marginBottom: "2.5rem",
          }}
        >
          <img src="/logo.png" alt="Artemis" width={32} height={32} style={{ objectFit: "contain" }} />
          <span
            className="font-display"
            style={{ fontSize: "1.25rem", color: "var(--text-primary)" }}
          >
            Artemis<span style={{ color: "#D4AF37" }}>·</span>Trader
          </span>
        </Link>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem", maxWidth: "32rem" }}>
          <div
            className="font-mono"
            style={{
              fontSize: "0.6875rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#D4AF37",
              marginBottom: "0.75rem",
            }}
          >
            — Getting Started
          </div>
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            You&apos;re almost ready to trade
          </h1>
          <p
            style={{
              marginTop: "0.75rem",
              fontSize: "0.9375rem",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
            }}
          >
            Complete these steps to connect Artemis to your broker and start automating.
          </p>
        </div>

        {/* Steps */}
        <div
          style={{
            width: "100%",
            maxWidth: "36rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {steps.map((step, i) => {
            const isDone = step.done || (i === 1 && brokerOpened);
            return (
              <div
                key={step.number}
                style={{
                  borderRadius: "1.25rem",
                  padding: "1.5rem",
                  background: isDone
                    ? "rgba(212,175,55,0.06)"
                    : "rgba(255,255,255,0.04)",
                  border: isDone
                    ? "1px solid rgba(212,175,55,0.30)"
                    : "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  transition: "border-color 0.4s, background 0.4s",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                  {/* Icon */}
                  <div style={{ flexShrink: 0, marginTop: "0.1rem" }}>
                    {isDone ? (
                      <CheckCircle size={22} color="#D4AF37" />
                    ) : (
                      <Circle size={22} color="rgba(245,244,238,0.25)" />
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.375rem" }}>
                      <span
                        className="font-mono"
                        style={{
                          fontSize: "0.625rem",
                          letterSpacing: "0.14em",
                          color: isDone ? "#D4AF37" : "rgba(245,244,238,0.30)",
                        }}
                      >
                        {step.number}
                      </span>
                      <h3
                        className="font-display"
                        style={{
                          margin: 0,
                          fontSize: "1rem",
                          color: isDone ? "var(--text-primary)" : "var(--text-primary)",
                          fontWeight: 600,
                        }}
                      >
                        {step.title}
                      </h3>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.875rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.6,
                      }}
                    >
                      {step.description}
                    </p>

                    {/* Step 2 action */}
                    {step.action && (
                      <div style={{ marginTop: "1.25rem", display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                        <button
                          onClick={handleOpenBroker}
                          className="btn-gold"
                          style={{
                            borderRadius: "9999px",
                            padding: "0.625rem 1.25rem",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            cursor: "pointer",
                            border: "none",
                          }}
                        >
                          <ExternalLink size={14} />
                          Open XM Account
                        </button>
                        {brokerOpened && (
                          <span
                            style={{
                              fontSize: "0.8125rem",
                              color: "#D4AF37",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.375rem",
                            }}
                          >
                            <CheckCircle size={14} />
                            Link opened — complete your registration
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Gold divider */}
        <div
          style={{
            width: "100%",
            maxWidth: "36rem",
            height: "1px",
            margin: "2rem 0",
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.4) 30%, #D4AF37 50%, rgba(212,175,55,0.4) 70%, transparent)",
          }}
        />

        {/* CTA */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
          <button
            onClick={handleContinue}
            disabled={loading}
            className="btn-gold"
            style={{
              borderRadius: "9999px",
              padding: "0.875rem 2rem",
              fontSize: "0.9375rem",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.625rem",
              cursor: "pointer",
              border: "none",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
            {loading ? "Loading…" : "Go to Dashboard"}
          </button>
          <p style={{ fontSize: "0.8125rem", color: "rgba(245,244,238,0.35)", margin: 0 }}>
            You can connect your XM account later from the dashboard
          </p>
        </div>
      </div>
    </GoldGradientBg>
  );
}
