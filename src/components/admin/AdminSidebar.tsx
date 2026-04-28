"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, UserCheck, LogOut, ChevronRight, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "@/lib/theme";

const navItems = [
  { href: "/admin",            icon: LayoutDashboard, label: "Overview"   },
  { href: "/admin/users",      icon: Users,           label: "Users"      },
  { href: "/admin/affiliates", icon: UserCheck,       label: "Affiliates" },
];

const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

export default function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside style={{
      position: "fixed", left: 0, top: 0, height: "100%", width: "16rem",
      display: "flex", flexDirection: "column", zIndex: 40,
      background: dark ? "rgba(10,7,0,0.92)" : "rgba(248,246,240,0.92)",
      backdropFilter: "blur(32px) saturate(180%)",
      WebkitBackdropFilter: "blur(32px) saturate(180%)",
      borderRight: dark ? "1px solid rgba(212,175,55,0.20)" : "1px solid rgba(212,175,55,0.25)",
      boxShadow: dark ? "4px 0 32px rgba(0,0,0,0.50)" : "4px 0 24px rgba(0,0,0,0.06)",
    }}>

      {/* Logo */}
      <div style={{ padding: "1.375rem 1.5rem", borderBottom: dark ? "1px solid rgba(212,175,55,0.15)" : "1px solid rgba(212,175,55,0.15)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none" }}>
          <img src="/logo.png" alt="Artemis" width={28} height={28} style={{ objectFit: "contain" }} />
          <div>
            <p className="font-display" style={{ fontSize: "1rem", color: "var(--text-primary)", lineHeight: 1.1 }}>
              Artemis<span style={{ color: "#D4AF37" }}>·</span>Trader
            </p>
            <p className="font-mono" style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#D4AF37", marginTop: "0.2rem" }}>Admin Panel</p>
          </div>
        </Link>

        {/* Admin badge */}
        <div style={{ marginTop: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.375rem 0.625rem", borderRadius: "0.625rem", background: "rgba(212,175,55,0.10)", border: "1px solid rgba(212,175,55,0.25)" }}>
          <Shield size={12} color="#D4AF37" />
          <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.06em" }}>YOUSSEF ALLA</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href}
              style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "0.625rem 0.875rem", borderRadius: "0.875rem",
                fontSize: "0.875rem", fontWeight: isActive ? 600 : 500,
                textDecoration: "none", transition: "all 0.2s",
                background: isActive ? "linear-gradient(135deg, rgba(212,175,55,0.22), rgba(212,175,55,0.10))" : "transparent",
                color: isActive ? "#D4AF37" : "var(--text-secondary)",
                border: isActive ? "1px solid rgba(212,175,55,0.30)" : "1px solid transparent",
                boxShadow: isActive ? "0 2px 12px rgba(212,175,55,0.12)" : "none",
              }}
              onMouseEnter={(e) => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"; (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; } }}
              onMouseLeave={(e) => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; } }}
            >
              <Icon size={17} />
              <span style={{ flex: 1 }}>{label}</span>
              {isActive && <ChevronRight size={13} />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "0.75rem", borderTop: dark ? "1px solid rgba(212,175,55,0.12)" : "1px solid rgba(212,175,55,0.12)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.25rem 0.375rem" }}>
          <span className="font-mono" style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Theme</span>
          <button onClick={toggle}
            style={{ width: "2rem", height: "2rem", borderRadius: "9999px", display: "grid", placeItems: "center", border: "1px solid rgba(212,175,55,0.25)", background: "transparent", cursor: "pointer", color: "var(--text-secondary)", transition: "border-color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#D4AF37")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(212,175,55,0.25)")}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
        <button onClick={handleLogout}
          style={{ display: "flex", alignItems: "center", gap: "0.625rem", width: "100%", padding: "0.625rem 0.875rem", borderRadius: "0.875rem", border: "1px solid rgba(220,38,38,0.20)", background: "rgba(220,38,38,0.06)", color: "#f87171", fontSize: "0.875rem", fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(220,38,38,0.12)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(220,38,38,0.40)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(220,38,38,0.06)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(220,38,38,0.20)"; }}
        >
          <LogOut size={15} /> Log Out
        </button>
      </div>
    </aside>
  );
}
