import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { GoldGradientBg } from "@/components/ui/elegant-gold-pattern";
import GlassFilter from "@/components/landing/GlassFilter";

const ADMIN_EMAIL = "youssefalla674@gmail.com";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect("/dashboard");
  }

  return (
    <GoldGradientBg>
      <GlassFilter />
      <div style={{ minHeight: "100vh", display: "flex" }}>
        <AdminSidebar />
        <main style={{ flex: 1, marginLeft: "16rem", padding: "2rem", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </GoldGradientBg>
  );
}
