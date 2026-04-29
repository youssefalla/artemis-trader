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
      <style>{`
        .admin-main {
          flex: 1;
          margin-left: 16rem;
          padding: 2rem;
          overflow-y: auto;
          min-height: 100vh;
        }
        @media (max-width: 768px) {
          .admin-main {
            margin-left: 0 !important;
            padding: 1.25rem 1rem;
            padding-bottom: calc(5rem + env(safe-area-inset-bottom));
          }
        }
      `}</style>
      <div style={{ minHeight: "100vh", display: "flex" }}>
        <AdminSidebar />
        <main className="admin-main">
          {children}
        </main>
      </div>
    </GoldGradientBg>
  );
}
