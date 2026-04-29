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
      <style>{`
        .aff-main {
          flex: 1;
          margin-left: 16rem;
          padding: 2rem;
          overflow-y: auto;
          min-height: 100vh;
        }
        @media (max-width: 768px) {
          .aff-main {
            margin-left: 0 !important;
            padding: 1.25rem 1rem;
            padding-bottom: calc(5rem + env(safe-area-inset-bottom));
          }
        }
      `}</style>
      <div style={{ minHeight: "100vh", display: "flex" }}>
        <AffiliateSidebar />
        <main className="aff-main">
          {children}
        </main>
      </div>
    </GoldGradientBg>
  );
}
