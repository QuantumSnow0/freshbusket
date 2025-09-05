"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Bell, Search } from "lucide-react";

export function AdminHeader() {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex h-16 items-center justify-between px-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back, {user?.name || "Admin"}!
          </h1>
          <p className="text-sm text-gray-600">Manage your FreshBasket store</p>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Search className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}



