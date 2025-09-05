"use client";

import { useState } from "react";
import Image from "next/image";
import { User } from "lucide-react";
import { useUserProfile } from "@/contexts/UserProfileContext";

interface ProfilePictureProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}

export function ProfilePicture({
  size = "md",
  className = "",
  onClick,
}: ProfilePictureProps) {
  const { profile, loading } = useUserProfile();
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  if (loading) {
    return (
      <div
        className={`${sizeClasses[size]} ${className} bg-gray-200 rounded-full animate-pulse`}
      />
    );
  }

  if (!profile?.profile_picture || imageError) {
    return (
      <div
        className={`${sizeClasses[size]} ${className} bg-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-400 transition-colors`}
        onClick={onClick}
      >
        <User size={iconSizes[size]} className="text-gray-600" />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} ${className} rounded-full overflow-hidden cursor-pointer hover:opacity-80 transition-opacity`}
      onClick={onClick}
    >
      <Image
        src={profile.profile_picture}
        alt={`${profile.name}'s profile picture`}
        width={iconSizes[size] * 2}
        height={iconSizes[size] * 2}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
}

