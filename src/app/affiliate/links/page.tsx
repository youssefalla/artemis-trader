import { createClient } from "@/lib/supabase/server";
import LinksClient from "./_LinksClient";

export default async function AffiliateLinksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: affiliate } = await supabase
    .from("affiliates")
    .select("code, commission_rate, tier")
    .eq("id", user!.id)
    .single();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://artemis-trader.com";
  const baseLink = `${siteUrl}/ref/${affiliate?.code ?? ""}`;

  return (
    <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="font-display" style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>My Links</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "0.35rem", fontSize: "0.9rem" }}>
          Share these links to earn {affiliate?.commission_rate ?? 20}% commission on every conversion.
        </p>
      </div>
      <LinksClient code={affiliate?.code ?? ""} baseLink={baseLink} />
    </div>
  );
}
