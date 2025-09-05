"use client";

import { useState } from "react";
import { Order } from "@/types";
import { Eye } from "lucide-react";

interface OrderActionsProps {
  order: Order;
}

export function OrderActions({ order }: OrderActionsProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async (
    newStatus: string,
    type: "order" | "payment"
  ) => {
    setIsUpdating(true);
    try {
      const updateData =
        type === "order"
          ? { order_status: newStatus }
          : { payment_status: newStatus };

      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Error updating ${type} status:`, errorData);
        throw new Error(errorData.error || `Failed to update ${type} status`);
      }

      // No need to refresh - real-time updates will handle this
    } catch (error) {
      console.error(`Error updating ${type} status:`, error);
      alert(
        `Failed to update ${type} status: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={() => {
          // You can implement a modal or page to view order details
          alert(`Order details for ${order.id}`);
        }}
        className="text-blue-600 hover:text-blue-900 transition-colors"
        title="View Details"
      >
        <Eye className="h-4 w-4" />
      </button>

      <div className="flex space-x-2">
        {/* Order Status Dropdown */}
        <select
          value={order.order_status || "pending"}
          onChange={(e) => handleStatusUpdate(e.target.value, "order")}
          disabled={isUpdating}
          className="text-xs border text-black border-gray-300 rounded px-2 py-1 disabled:opacity-50"
        >
          <option value="pending">Pending</option>
          <option value="processed">Processed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* Payment Status Dropdown */}
        <select
          value={order.payment_status}
          onChange={(e) => handleStatusUpdate(e.target.value, "payment")}
          disabled={isUpdating}
          className="text-xs border text-black border-gray-300 rounded px-2 py-1 disabled:opacity-50"
        >
          <option value="pending">Payment Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
          <option value="expired">Expired</option>
        </select>
      </div>
    </div>
  );
}
