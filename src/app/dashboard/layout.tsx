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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <GoldGradientBg>
      <GlassFilter />
      <div style={{ minHeight: "100vh", display: "flex" }}>
        <Sidebar />
        <main style={{ flex: 1, marginLeft: "16rem", padding: "2rem", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </GoldGradientBg>
  );
}
