"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { UserProfile, Address } from "@/types";
import { useAuth } from "./AuthContext";

interface UserProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  updateAddress: (
    type: "shipping" | "billing",
    address: Address
  ) => Promise<boolean>;
  uploadProfilePicture: (file: File) => Promise<string | null>;
  refreshProfile: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(
  undefined
);

export function UserProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const { user: authUser, loading: authLoading } = useAuth();
  const supabase = createClient();

  const fetchProfile = async () => {
    if (isFetching || !authUser) return; // Prevent multiple simultaneous fetches

    try {
      setIsFetching(true);
      setLoading(true);
      setError(null);

      // Fetch user profile with addresses
      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select(
          `
          *,
          addresses:user_addresses(*)
        `
        )
        .eq("id", authUser.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        setError("Failed to fetch profile");
        return;
      }

      // Transform addresses
      const addresses = profileData.addresses || [];
      const shippingAddress = addresses.find(
        (addr: any) => addr.type === "shipping"
      );
      const billingAddress = addresses.find(
        (addr: any) => addr.type === "billing"
      );

      const userProfile: UserProfile = {
        id: profileData.id,
        user_id: profileData.id,
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        profile_picture: profileData.profile_picture,
        shipping_address: shippingAddress,
        billing_address: billingAddress,
        created_at: profileData.created_at,
        updated_at: profileData.updated_at,
      };

      setProfile(userProfile);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to fetch profile");
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };

  const updateProfile = async (
    updates: Partial<UserProfile>
  ): Promise<boolean> => {
    try {
      if (!profile) return false;

      const { error } = await supabase
        .from("users")
        .update({
          name: updates.name,
          phone: updates.phone,
          profile_picture: updates.profile_picture,
        })
        .eq("id", profile.user_id);

      if (error) {
        console.error("Error updating profile:", error);
        setError("Failed to update profile");
        return false;
      }

      // Update local state
      setProfile((prev) => (prev ? { ...prev, ...updates } : null));
      return true;
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile");
      return false;
    }
  };

  const updateAddress = async (
    type: "shipping" | "billing",
    address: Address
  ): Promise<boolean> => {
    try {
      if (!profile) return false;

      const addressData = {
        ...address,
        user_id: profile.user_id,
        type,
      };

      // Upsert address
      const { error } = await supabase
        .from("user_addresses")
        .upsert(addressData, {
          onConflict: "user_id,type",
        });

      if (error) {
        console.error("Error updating address:", error);
        setError("Failed to update address");
        return false;
      }

      // Update local state
      setProfile((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          [`${type}_address`]: address,
        };
      });

      return true;
    } catch (err) {
      console.error("Error updating address:", err);
      setError("Failed to update address");
      return false;
    }
  };

  const uploadProfilePicture = async (file: File): Promise<string | null> => {
    try {
      if (!profile) return null;

      const fileExt = file.name.split(".").pop();
      const fileName = `${profile.user_id}-${Date.now()}.${fileExt}`;
      const filePath = `profile-pictures/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("user-assets")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Error uploading profile picture:", uploadError);
        setError("Failed to upload profile picture");
        return null;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("user-assets").getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      setError("Failed to upload profile picture");
      return null;
    }
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) return;

    // If no user, clear profile
    if (!authUser) {
      setProfile(null);
      setLoading(false);
      return;
    }

    // Fetch profile for authenticated user
    fetchProfile();
  }, [authUser, authLoading]);

  useEffect(() => {
    if (!profile?.user_id) return;

    // Set up real-time subscription for profile changes
    const channel = supabase
      .channel("user-profile-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "users",
          filter: `id=eq.${profile.user_id}`,
        },
        (payload) => {
          console.log("🔄 Profile update detected:", payload);
          if (payload.eventType === "UPDATE") {
            fetchProfile();
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_addresses",
          filter: `user_id=eq.${profile.user_id}`,
        },
        (payload) => {
          console.log("🔄 Address update detected:", payload);
          fetchProfile();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.user_id]);

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        loading: loading || authLoading,
        error,
        updateProfile,
        updateAddress,
        uploadProfilePicture,
        refreshProfile,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
}
