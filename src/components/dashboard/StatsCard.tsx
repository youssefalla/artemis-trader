import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  accentColor?: string;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  accentColor = "#D4AF37",
}: StatsCardProps) {
  return (
    <div className="bento" style={{ borderRadius: "1.125rem", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p className="font-mono" style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-secondary)" }}>{title}</p>
        <div
          style={{
            width: "2.5rem", height: "2.5rem", borderRadius: "0.75rem",
            display: "grid", placeItems: "center",
            background: `color-mix(in srgb, ${accentColor} 12%, transparent)`,
            border: `1px solid color-mix(in srgb, ${accentColor} 25%, transparent)`,
          }}
        >
          <Icon size={16} style={{ color: accentColor }} />
        </div>
      </div>

      <div>
        <p className="font-display" style={{ fontSize: "2rem", lineHeight: 1, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>{value}</p>
        {subtitle && (
          <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.3rem" }}>{subtitle}</p>
        )}
      </div>

      {trendValue && trend && (
        <div
          style={{
            fontSize: "0.75rem", fontWeight: 500,
            display: "inline-flex", alignItems: "center", gap: "0.25rem",
            color: trend === "up" ? "var(--green)" : trend === "down" ? "var(--red)" : "var(--text-secondary)",
          }}
        >
          {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
        </div>
      )}
    </div>
  );
}
