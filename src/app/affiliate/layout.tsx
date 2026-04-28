import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AffiliateSidebar from "@/components/affiliate/AffiliateSidebar";
import { GoldGradientBg } from "@/components/ui/elegant-gold-pattern";
import GlassFilter from "@/components/landing/GlassFilter";

export default async function AffiliateLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_verified_affiliate")
    .eq("id", user.id)
    .single();

  if (!profile?.is_verified_affiliate) redirect("/dashboard");

  return (
    <GoldGradientBg>
      <GlassFilter />
      <div style={{ minHeight: "100vh", display: "flex" }}>
        <AffiliateSidebar />
        <main style={{ flex: 1, marginLeft: "16rem", padding: "2rem", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </GoldGradientBg>
  );
}
