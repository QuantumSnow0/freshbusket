"use client";

import { useAuth } from "@/contexts/AuthContext";

export function useAdminCheck() {
  const { user, loading } = useAuth();

  const isAdmin = () => {
    if (!user || !user.email) return false;

    // Check against environment variable or hardcoded admin email
    const adminEmail =
      process.env.NEXT_PUBLIC_ADMIN_EMAIL || "bmuthuri93@gmail.com";
    return user.email === adminEmail;
  };

  return {
    user,
    loading,
    isAdmin: isAdmin(),
    isAdminUser: isAdmin(),
  };
}



