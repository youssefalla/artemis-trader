import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminUsersPage() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return (
      <div style={{ padding: "2rem", borderRadius: "1rem", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.25)", color: "#f87171", fontFamily: "monospace" }}>
        SUPABASE_SERVICE_ROLE_KEY missing — add it in Vercel env vars then redeploy.
      </div>
    );
  }

  let typedUsers: unknown[] = [];
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("profiles")
      .select("id, email, full_name, xm_account_id, subscription_status, is_verified_affiliate, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    typedUsers = data ?? [];
  } catch (e: unknown) {
    return (
      <div style={{ padding: "2rem", borderRadius: "1rem", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.25)", color: "#f87171", fontFamily: "monospace" }}>
        Error: {e instanceof Error ? e.message : String(e)}
      </div>
    );
  }

  const typedUsers = typedUsers as Array<{ id: string; email: string; full_name: string | null; xm_account_id: string | null; subscription_status: string; is_verified_affiliate: boolean; created_at: string }>;

  return (
    <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <h1 className="font-display" style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>All Users</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.35rem", fontSize: "0.9rem" }}>
            {typedUsers?.length ?? 0} total typedUsers on the platform.
          </p>
        </div>
      </div>

      <div className="bento" style={{ borderRadius: "1.25rem", overflow: "hidden" }}>
        {!typedUsers?.length ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-secondary)" }}>No typedUsers yet.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                  {["#", "Email", "Full Name", "XM Account", "Subscription", "Affiliate", "Joined"].map(h => (
                    <th key={h} style={{ padding: "0.875rem 1.125rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {typedUsers.map((u, i) => (
                  <tr key={u.id}
                    style={{ borderBottom: i < typedUsers.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", transition: "background 0.15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(212,175,55,0.03)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "0.8rem 1.125rem", fontSize: "0.75rem", color: "var(--text-secondary)", fontFamily: "monospace" }}>{i + 1}</td>
                    <td style={{ padding: "0.8rem 1.125rem", fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 500 }}>{u.email}</td>
                    <td style={{ padding: "0.8rem 1.125rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>{u.full_name ?? "—"}</td>
                    <td style={{ padding: "0.8rem 1.125rem", fontSize: "0.8rem", color: "var(--text-secondary)", fontFamily: "monospace" }}>{u.xm_account_id ?? "—"}</td>
                    <td style={{ padding: "0.8rem 1.125rem" }}>
                      <span style={{
                        fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
                        padding: "0.25rem 0.625rem", borderRadius: "9999px",
                        background: u.subscription_status === "active"   ? "rgba(5,150,105,0.12)"
                                  : u.subscription_status === "trial"    ? "rgba(99,102,241,0.12)"
                                  : u.subscription_status === "cancelled" ? "rgba(220,38,38,0.10)"
                                  : "rgba(255,255,255,0.07)",
                        color: u.subscription_status === "active"   ? "#34d399"
                             : u.subscription_status === "trial"    ? "#818cf8"
                             : u.subscription_status === "cancelled" ? "#f87171"
                             : "var(--text-secondary)",
                      }}>
                        {u.subscription_status}
                      </span>
                    </td>
                    <td style={{ padding: "0.8rem 1.125rem" }}>
                      {u.is_verified_affiliate
                        ? <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "0.25rem 0.625rem", borderRadius: "9999px", background: "rgba(212,175,55,0.12)", color: "#D4AF37" }}>✦ Yes</span>
                        : <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>No</span>}
                    </td>
                    <td style={{ padding: "0.8rem 1.125rem", fontSize: "0.8rem", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
