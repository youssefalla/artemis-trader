"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, Bot, Copy, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";

type User = {
  id: string;
  email: string;
  full_name: string | null;
  broker: string | null;
  mt5_login: string | null;
  mt5_server: string | null;
  xm_account_id: string | null;
  subscription_status: string;
  is_verified_affiliate: boolean;
  bot_access_granted: boolean;
  copy_trading_enabled: boolean;
  created_at: string;
};

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    active:    { bg: "rgba(5,150,105,0.12)",   color: "#34d399" },
    trial:     { bg: "rgba(99,102,241,0.12)",  color: "#818cf8" },
    cancelled: { bg: "rgba(220,38,38,0.10)",   color: "#f87171" },
    inactive:  { bg: "rgba(255,255,255,0.07)", color: "var(--text-secondary)" },
  };
  const s = colors[status] ?? colors.inactive;
  return (
    <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "0.25rem 0.625rem", borderRadius: "9999px", background: s.bg, color: s.color }}>
      {status}
    </span>
  );
}

function Toggle({ value, onChange, disabled }: { value: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      onClick={() => !disabled && onChange(!value)}
      disabled={disabled}
      style={{
        position: "relative", width: "2.75rem", height: "1.5rem",
        borderRadius: "9999px", border: "none", cursor: disabled ? "not-allowed" : "pointer",
        background: value ? "var(--green, #00d4a0)" : "rgba(136,136,170,0.25)",
        opacity: disabled ? 0.5 : 1,
        transition: "background 0.3s", flexShrink: 0,
      }}
    >
      <span style={{
        position: "absolute", top: "3px",
        width: "1.1rem", height: "1.1rem",
        background: "#fff", borderRadius: "9999px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        transition: "left 0.25s cubic-bezier(.22,.61,.36,1)",
        left: value ? "calc(100% - 19px)" : "3px",
      }} />
    </button>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button onClick={handleCopy} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", padding: "0.2rem", display: "inline-flex", alignItems: "center" }}>
      {copied ? <CheckCircle size={12} style={{ color: "var(--green, #00d4a0)" }} /> : <Copy size={12} />}
    </button>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/users")
      .then(r => r.json())
      .then(data => { if (data.error) setError(data.error); else setUsers(data); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  async function updateField(userId: string, field: string, value: boolean | string) {
    setUpdating(userId + field);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, field, value }),
      });
      const data = await res.json();
      if (data.error) { alert(data.error); return; }
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, [field]: value } : u));
    } catch (e: any) {
      alert(e.message);
    } finally {
      setUpdating(null);
    }
  }

  const totalActive = users.filter(u => u.subscription_status === "active").length;
  const totalBot = users.filter(u => u.bot_access_granted).length;
  const totalCopy = users.filter(u => u.copy_trading_enabled).length;

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "3rem", color: "var(--text-secondary)" }}>
      <Loader2 size={20} className="animate-spin" /> Loading users…
    </div>
  );

  if (error) return (
    <div style={{ padding: "2rem", borderRadius: "1rem", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.25)", color: "#f87171", fontFamily: "monospace" }}>
      Error: {error}
    </div>
  );

  return (
    <div style={{ maxWidth: "90rem", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 className="font-display" style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Users</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "0.35rem", fontSize: "0.9rem" }}>{users.length} total users</p>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Total Users", value: users.length, color: "#D4AF37" },
          { label: "Active Subs", value: totalActive, color: "#34d399" },
          { label: "Bot Access", value: totalBot, color: "#818cf8" },
          { label: "Copy Trading", value: totalCopy, color: "#00d4a0" },
        ].map(stat => (
          <div key={stat.label} className="bento" style={{ borderRadius: "1rem", padding: "1.25rem" }}>
            <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)", margin: 0 }}>{stat.label}</p>
            <p style={{ fontSize: "1.75rem", fontWeight: 700, color: stat.color, margin: "0.25rem 0 0" }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bento" style={{ borderRadius: "1.25rem", overflow: "hidden" }}>
        {!users.length ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-secondary)" }}>No users yet.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                  {["#", "User", "Broker / MT5", "Subscription", "Bot Access", "Copy Trading", "Joined", ""].map(h => (
                    <th key={h} style={{ padding: "0.875rem 1rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <>
                    <tr
                      key={u.id}
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s", cursor: "pointer" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(212,175,55,0.03)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      {/* # */}
                      <td style={{ padding: "0.9rem 1rem", fontSize: "0.75rem", color: "var(--text-secondary)", fontFamily: "monospace" }}>{i + 1}</td>

                      {/* User */}
                      <td style={{ padding: "0.9rem 1rem" }}>
                        <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>{u.full_name ?? "—"}</p>
                        <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-secondary)" }}>{u.email}</p>
                      </td>

                      {/* Broker / MT5 */}
                      <td style={{ padding: "0.9rem 1rem" }}>
                        {u.mt5_login ? (
                          <div>
                            <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", padding: "0.15rem 0.5rem", borderRadius: "9999px", background: "rgba(212,175,55,0.12)", color: "#D4AF37", marginRight: "0.4rem" }}>
                              {u.broker ?? "—"}
                            </span>
                            <span style={{ fontSize: "0.8rem", fontFamily: "monospace", color: "var(--text-primary)" }}>{u.mt5_login}</span>
                            <CopyBtn text={u.mt5_login} />
                            <p style={{ margin: "0.1rem 0 0", fontSize: "0.7rem", color: "var(--text-secondary)" }}>{u.mt5_server ?? "—"}</p>
                          </div>
                        ) : (
                          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Not connected</span>
                        )}
                      </td>

                      {/* Subscription */}
                      <td style={{ padding: "0.9rem 1rem" }}>
                        <StatusBadge status={u.subscription_status} />
                      </td>

                      {/* Bot Access */}
                      <td style={{ padding: "0.9rem 1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <Toggle
                            value={u.bot_access_granted}
                            onChange={(v) => updateField(u.id, "bot_access_granted", v)}
                            disabled={updating === u.id + "bot_access_granted"}
                          />
                          {updating === u.id + "bot_access_granted" && <Loader2 size={12} className="animate-spin" style={{ color: "var(--text-secondary)" }} />}
                        </div>
                      </td>

                      {/* Copy Trading */}
                      <td style={{ padding: "0.9rem 1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <Toggle
                            value={u.copy_trading_enabled}
                            onChange={(v) => updateField(u.id, "copy_trading_enabled", v)}
                            disabled={updating === u.id + "copy_trading_enabled" || !u.bot_access_granted}
                          />
                          {updating === u.id + "copy_trading_enabled" && <Loader2 size={12} className="animate-spin" style={{ color: "var(--text-secondary)" }} />}
                        </div>
                      </td>

                      {/* Joined */}
                      <td style={{ padding: "0.9rem 1rem", fontSize: "0.8rem", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>

                      {/* Expand */}
                      <td style={{ padding: "0.9rem 1rem" }}>
                        <button
                          onClick={() => setExpandedId(expandedId === u.id ? null : u.id)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", display: "flex", alignItems: "center" }}
                        >
                          {expandedId === u.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded row — credentials + quick actions */}
                    {expandedId === u.id && (
                      <tr key={u.id + "-expanded"} style={{ background: "rgba(212,175,55,0.02)" }}>
                        <td colSpan={8} style={{ padding: "1rem 1.5rem 1.25rem" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>

                            {/* MT5 Credentials */}
                            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "0.75rem", padding: "0.875rem", border: "1px solid rgba(255,255,255,0.07)" }}>
                              <p className="font-mono" style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-secondary)", margin: "0 0 0.625rem" }}>MT5 Credentials</p>
                              <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                                <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--text-secondary)" }}>Broker: <strong style={{ color: "var(--text-primary)" }}>{u.broker?.toUpperCase() ?? "—"}</strong></p>
                                <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                  Login: <strong style={{ color: "var(--text-primary)", fontFamily: "monospace" }}>{u.mt5_login ?? "—"}</strong>
                                  {u.mt5_login && <CopyBtn text={u.mt5_login} />}
                                </p>
                                <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--text-secondary)" }}>Server: <strong style={{ color: "var(--text-primary)" }}>{u.mt5_server ?? "—"}</strong></p>
                              </div>
                            </div>

                            {/* Quick Actions */}
                            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "0.75rem", padding: "0.875rem", border: "1px solid rgba(255,255,255,0.07)" }}>
                              <p className="font-mono" style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-secondary)", margin: "0 0 0.625rem" }}>Quick Actions</p>
                              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <button
                                  onClick={() => updateField(u.id, "bot_access_granted", !u.bot_access_granted)}
                                  style={{
                                    padding: "0.5rem 0.875rem", borderRadius: "0.625rem", fontSize: "0.8rem", fontWeight: 600,
                                    cursor: "pointer", border: "none", textAlign: "left",
                                    background: u.bot_access_granted ? "rgba(220,38,38,0.10)" : "rgba(0,212,160,0.10)",
                                    color: u.bot_access_granted ? "#f87171" : "#00d4a0",
                                  }}
                                >
                                  <Bot size={12} style={{ marginRight: "0.375rem", display: "inline" }} />
                                  {u.bot_access_granted ? "Revoke Bot Access" : "Grant Bot Access"}
                                </button>
                                <button
                                  onClick={() => updateField(u.id, "subscription_status", u.subscription_status === "active" ? "inactive" : "active")}
                                  style={{
                                    padding: "0.5rem 0.875rem", borderRadius: "0.625rem", fontSize: "0.8rem", fontWeight: 600,
                                    cursor: "pointer", border: "none", textAlign: "left",
                                    background: u.subscription_status === "active" ? "rgba(220,38,38,0.10)" : "rgba(5,150,105,0.10)",
                                    color: u.subscription_status === "active" ? "#f87171" : "#34d399",
                                  }}
                                >
                                  {u.subscription_status === "active" ? "Deactivate Sub" : "Activate Sub"}
                                </button>
                              </div>
                            </div>

                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
