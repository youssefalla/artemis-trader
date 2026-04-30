import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SettingsView from "@/components/dashboard/SettingsView";
import type { Profile } from "@/types";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const profile = profileData as Profile | null;

  return <SettingsView profile={profile} />;
}
