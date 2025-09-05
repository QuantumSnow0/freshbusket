"use client";

import { useState } from "react";
import { User } from "@/types";
import { Eye, Edit, Trash2, UserCheck, UserX } from "lucide-react";

interface UserActionsProps {
  user: {
    id: string;
    name: string;
    email: string;
    address: string | null;
    created_at: string;
    updated_at: string;
  };
}

export function UserActions({ user }: UserActionsProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleViewDetails = () => {
    // You can implement a modal or page to view user details
    const details = `
User Details:
- Name: ${user.name}
- Email: ${user.email}
- Address: ${user.address || "Not provided"}
- User ID: ${user.id}
- Joined: ${new Date(user.created_at).toLocaleDateString()}
- Last Updated: ${new Date(user.updated_at).toLocaleDateString()}
    `;
    alert(details);
  };

  const handleEditUser = () => {
    // You can implement user edit functionality here
    alert(`Edit functionality for ${user.name} - Coming soon!`);
  };

  const handleDeleteUser = async () => {
    if (
      !confirm(
        `Are you sure you want to delete user ${user.name}? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleStatus = async () => {
    setIsUpdating(true);
    try {
      // You can implement user status toggle here
      alert(`Toggle status for ${user.name} - Coming soon!`);
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("Failed to update user status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={handleViewDetails}
        className="text-blue-600 hover:text-blue-900 transition-colors"
        title="View Details"
      >
        <Eye className="h-4 w-4" />
      </button>

      <button
        onClick={handleEditUser}
        className="text-green-600 hover:text-green-900 transition-colors"
        title="Edit User"
      >
        <Edit className="h-4 w-4" />
      </button>

      <button
        onClick={handleToggleStatus}
        disabled={isUpdating}
        className="text-yellow-600 hover:text-yellow-900 transition-colors disabled:opacity-50"
        title="Toggle Status"
      >
        <UserCheck className="h-4 w-4" />
      </button>

      <button
        onClick={handleDeleteUser}
        disabled={isUpdating}
        className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
        title="Delete User"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}



