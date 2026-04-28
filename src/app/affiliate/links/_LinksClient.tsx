"use client";
import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";

const LANDING_PAGES = [
  { label: "Home",     path: ""          },
  { label: "Pricing",  path: "#pricing"  },
  { label: "Features", path: "#features" },
];

function useCopy(text: string) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return { copied, copy };
}

function LinkRow({ label, url, description }: { label: string; url: string; description: string }) {
  const { copied, copy } = useCopy(url);
  return (
    <div style={{ borderRadius: "1.25rem", border: "1px solid rgba(212,175,55,0.18)", background: "rgba(212,175,55,0.03)", padding: "1.25rem 1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <div>
          <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>{label}</span>
          <span style={{ marginLeft: "0.75rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}>{description}</span>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.5rem 0.875rem", borderRadius: "0.75rem", border: "1px solid rgba(212,175,55,0.25)", background: "transparent", color: "var(--text-secondary)", fontSize: "0.8rem", textDecoration: "none", cursor: "pointer", transition: "all 0.2s" }}>
            <ExternalLink size={13} /> Preview
          </a>
          <button onClick={copy} style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.5rem 1rem", borderRadius: "0.75rem", border: "none", background: copied ? "rgba(5,150,105,0.12)" : "linear-gradient(135deg,#D4AF37,#f0d060)", color: copied ? "#34d399" : "#0a0700", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", transition: "all 0.2s", boxShadow: copied ? "none" : "0 2px 10px rgba(212,175,55,0.25)" }}>
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
      <code style={{ display: "block", padding: "0.625rem 0.875rem", borderRadius: "0.75rem", background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.12)", fontSize: "0.8rem", color: "#D4AF37", wordBreak: "break-all" }}>
        {url}
      </code>
    </div>
  );
}

export default function LinksClient({ code, baseLink }: { code: string; baseLink: string }) {
  const siteBase = baseLink.replace(`/ref/${code}`, "");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Info banner */}
      <div style={{ borderRadius: "1.25rem", padding: "1.25rem 1.5rem", background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.20)", display: "flex", alignItems: "center", gap: "1rem" }}>
        <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.875rem", background: "rgba(212,175,55,0.15)", display: "grid", placeItems: "center", flexShrink: 0, fontSize: "1.25rem" }}>🔑</div>
        <div>
          <p style={{ margin: 0, fontWeight: 700, color: "var(--text-primary)", fontSize: "0.9rem" }}>Your referral code: <span style={{ color: "#D4AF37", fontFamily: "monospace", fontSize: "1rem" }}>{code}</span></p>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>Anyone who visits any link below and signs up gets tracked under your account.</p>
        </div>
      </div>

      {/* Landing page links */}
      <div className="bento" style={{ borderRadius: "1.25rem", padding: "1.5rem" }}>
        <p className="font-mono" style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)", marginBottom: "1rem" }}>
          Landing Page Links
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {LANDING_PAGES.map(({ label, path }) => (
            <LinkRow
              key={label}
              label={label}
              url={`${siteBase}/ref/${code}${path}`}
              description={`→ ${path || "homepage"}`}
            />
          ))}
        </div>
      </div>

      {/* UTM links */}
      <div className="bento" style={{ borderRadius: "1.25rem", padding: "1.5rem" }}>
        <p className="font-mono" style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)", marginBottom: "1rem" }}>
          UTM Tracking Links (for campaigns)
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {[
            { label: "Instagram",  source: "instagram",  medium: "social"  },
            { label: "TikTok",     source: "tiktok",     medium: "social"  },
            { label: "YouTube",    source: "youtube",    medium: "video"   },
            { label: "Twitter/X",  source: "twitter",    medium: "social"  },
            { label: "Email",      source: "email",      medium: "email"   },
          ].map(({ label, source, medium }) => (
            <LinkRow
              key={source}
              label={label}
              url={`${siteBase}/ref/${code}?utm_source=${source}&utm_medium=${medium}&utm_campaign=${code.toLowerCase()}`}
              description={`utm_source=${source}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
