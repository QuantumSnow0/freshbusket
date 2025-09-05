import { createClient } from "@/lib/supabase/server";

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "bmuthuri93@gmail.com";

export async function isAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return false;
    }

    return user.email === ADMIN_EMAIL;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

export async function requireAdmin() {
  const isAdminUser = await isAdmin();
  if (!isAdminUser) {
    throw new Error("Unauthorized: Admin access required");
  }
}



