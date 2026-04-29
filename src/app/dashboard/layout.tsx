import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/dashboard/Sidebar";
import { GoldGradientBg } from "@/components/ui/elegant-gold-pattern";
import GlassFilter from "@/components/landing/GlassFilter";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <GoldGradientBg>
      <GlassFilter />
      <style>{`
        .dash-main {
          flex: 1;
          margin-left: 16rem;
          padding: 2rem;
          overflow-y: auto;
          min-height: 100vh;
        }
        @media (max-width: 768px) {
          .dash-main {
            margin-left: 0 !important;
            padding: 1.25rem 1rem;
            padding-bottom: calc(5rem + env(safe-area-inset-bottom));
          }
        }
      `}</style>
      <div style={{ minHeight: "100vh", display: "flex" }}>
        <Sidebar />
        <main className="dash-main">
          {children}
        </main>
      </div>
    </GoldGradientBg>
  );
}
