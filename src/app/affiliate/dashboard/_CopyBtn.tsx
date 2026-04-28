"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <button onClick={copy} style={{
      display: "flex", alignItems: "center", gap: "0.375rem",
      padding: "0.75rem 1.25rem", borderRadius: "0.875rem",
      background: copied ? "rgba(5,150,105,0.12)" : "linear-gradient(135deg,#D4AF37,#f0d060)",
      border: copied ? "1px solid rgba(5,150,105,0.3)" : "none",
      color: copied ? "#34d399" : "#0a0700",
      fontSize: "0.875rem", fontWeight: 700, cursor: "pointer",
      transition: "all 0.2s", whiteSpace: "nowrap",
      boxShadow: copied ? "none" : "0 2px 12px rgba(212,175,55,0.30)",
    }}>
      {copied ? <Check size={15} /> : <Copy size={15} />}
      {copied ? "Copied!" : "Copy Link"}
    </button>
  );
}
