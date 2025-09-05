"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { ProfilePicture } from "./ProfilePicture";
import { User, Settings, LogOut, Package, TestTube } from "lucide-react";

export function ProfileDropdown() {
  const { signOut } = useAuth();
  const { profile } = useUserProfile();
  const [isOpen, setIsOpen] = useState(false);
  const [testing, setTesting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTestSetup = async () => {
    setTesting(true);
    try {
      const response = await fetch("/api/test-profile-setup");
      const data = await response.json();

      if (data.success) {
        alert("✅ Profile system is properly set up!");
      } else {
        let message = "❌ Setup incomplete:\n\n";
        message += data.error + "\n\n";
        message += "Instructions:\n";
        data.instructions.forEach((instruction: string, index: number) => {
          message += `${instruction}\n`;
        });
        alert(message);
      }
    } catch (error) {
      alert("Test failed: " + error);
    } finally {
      setTesting(false);
      setIsOpen(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors"
      >
        <ProfilePicture size="md" />
        <span className="hidden sm:block text-sm font-medium">
          {profile.name || profile.email}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{profile.name}</p>
            <p className="text-xs text-gray-500">{profile.email}</p>
          </div>

          <Link
            href="/profile"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <User className="w-4 h-4 mr-3" />
            Profile & Settings
          </Link>

          <Link
            href="/orders"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <Package className="w-4 h-4 mr-3" />
            My Orders
          </Link>

          <button
            onClick={handleTestSetup}
            disabled={testing}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <TestTube className="w-4 h-4 mr-3" />
            {testing ? "Testing..." : "Test Setup"}
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              signOut();
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
