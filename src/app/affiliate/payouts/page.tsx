import { createClient } from "@/lib/supabase/server";
import PayoutsClient from "./_PayoutsClient";

export default async function AffiliatePayoutsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: affiliate } = await supabase
    .from("affiliates")
    .select("total_earned, total_paid, payout_method, payout_details")
    .eq("id", user!.id)
    .single();

  const { data: payouts } = await supabase
    .from("affiliate_payouts")
    .select("*")
    .eq("affiliate_id", user!.id)
    .order("requested_at", { ascending: false });

  const available = (affiliate?.total_earned ?? 0) - (affiliate?.total_paid ?? 0);

  return (
    <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="font-display" style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Payouts</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "0.35rem", fontSize: "0.9rem" }}>
          Track your earnings and request withdrawals.
        </p>
      </div>

      {/* Balance cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Available Balance",  value: `$${available.toFixed(2)}`,                    gold: true  },
          { label: "Total Earned",       value: `$${(affiliate?.total_earned ?? 0).toFixed(2)}`, gold: false },
          { label: "Total Paid Out",     value: `$${(affiliate?.total_paid   ?? 0).toFixed(2)}`, gold: false },
        ].map(({ label, value, gold }) => (
          <div key={label} className="bento" style={{ borderRadius: "1.25rem", padding: "1.25rem 1.5rem", border: gold ? "1px solid rgba(212,175,55,0.35)" : undefined, background: gold ? "rgba(212,175,55,0.06)" : undefined }}>
            <p className="font-mono" style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)", margin: 0, marginBottom: "0.5rem" }}>{label}</p>
            <p style={{ fontSize: "1.75rem", fontWeight: 700, color: gold ? "#D4AF37" : "var(--text-primary)", margin: 0 }}>{value}</p>
          </div>
        ))}
      </div>

      <PayoutsClient available={available} payouts={payouts ?? []} affiliateId={user!.id} />
    </div>
  );
}
