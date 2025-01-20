import { redirect } from "next/navigation";
import ProfileForm from "@/components/ProfileForm/ProfileForm";
import { createClient } from "@/utils/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let { data: profile } = await supabase.from("profiles").select("*, addresses(*)").eq("user_id", user.id).single();

  return <ProfileForm profile={profile} />;
}
