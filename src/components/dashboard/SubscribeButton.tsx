"use client";

import { useState } from "react";
import { Loader2, Zap } from "lucide-react";

interface SubscribeButtonProps {
  plan: "trader" | "elite";
  label?: string;
}

export default function SubscribeButton({ plan, label }: SubscribeButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Something went wrong");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="btn-gold"
      style={{
        borderRadius: "9999px",
        padding: "0.75rem 1.5rem",
        fontSize: "0.9rem",
        fontWeight: 700,
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.7 : 1,
        border: "none",
      }}
    >
      {loading ? <Loader2 size={15} className="animate-spin" /> : <Zap size={15} />}
      {loading ? "Redirecting…" : (label ?? "Subscribe")}
    </button>
  );
}
