"use client";

import { useState, useEffect } from "react";
import { Order } from "@/types";
import { Package, RefreshCw } from "lucide-react";
import { OrderActions } from "@/components/admin/OrderActions";
import { createClient } from "@/lib/supabase/client";

interface OrderWithUser extends Order {
  users: {
    name: string;
    email: string;
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderWithUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch orders");
      }

      setOrders(data.orders || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
  };

  useEffect(() => {
    fetchOrders();

    // Set up real-time subscription
    const supabase = createClient();

    const channel = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        async (payload) => {
          console.log("🔄 Real-time order update:", payload);

          if (payload.eventType === "INSERT") {
            // New order added - fetch with user data
            console.log("➕ New order detected:", payload.new);
            try {
              const response = await fetch(
                `/api/admin/orders/${payload.new.id}`
              );
              if (response.ok) {
                const orderData = await response.json();
                setOrders((prev) => [orderData, ...prev]);
                console.log("✅ New order added with user data:", orderData);
              } else {
                // Fallback: add without user data
                setOrders((prev) => [payload.new as OrderWithUser, ...prev]);
              }
            } catch (error) {
              console.error("Error fetching new order data:", error);
              setOrders((prev) => [payload.new as OrderWithUser, ...prev]);
            }
          } else if (payload.eventType === "UPDATE") {
            // Order updated - fetch with user data
            console.log("🔄 Order updated:", payload.new);
            try {
              const response = await fetch(
                `/api/admin/orders/${payload.new.id}`
              );
              if (response.ok) {
                const orderData = await response.json();
                setOrders((prev) =>
                  prev.map((order) =>
                    order.id === payload.new.id ? orderData : order
                  )
                );
                console.log("✅ Order updated with user data:", orderData);
              } else {
                // Fallback: update without user data
                setOrders((prev) =>
                  prev.map((order) =>
                    order.id === payload.new.id
                      ? (payload.new as OrderWithUser)
                      : order
                  )
                );
              }
            } catch (error) {
              console.error("Error fetching updated order data:", error);
              setOrders((prev) =>
                prev.map((order) =>
                  order.id === payload.new.id
                    ? (payload.new as OrderWithUser)
                    : order
                )
              );
            }
          } else if (payload.eventType === "DELETE") {
            // Order deleted
            console.log("🗑️ Order deleted:", payload.old);
            setOrders((prev) =>
              prev.filter((order) => order.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe((status) => {
        console.log("📡 Real-time subscription status:", status);
        if (status === "SUBSCRIBED") {
          console.log("✅ Successfully subscribed to orders changes");
        } else if (status === "CHANNEL_ERROR") {
          console.error("❌ Real-time subscription error");
        }
      });

    // Fallback: periodic refresh every 30 seconds if real-time fails
    const fallbackInterval = setInterval(() => {
      console.log("🔄 Fallback refresh triggered");
      fetchOrders();
    }, 30000);

    // Cleanup subscription and interval on unmount
    return () => {
      supabase.removeChannel(channel);
      clearInterval(fallbackInterval);
    };
  }, []);

  const getStatusColor = (status: string | undefined) => {
    const orderStatus = status || "pending";
    switch (orderStatus) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processed":
        return "bg-purple-100 text-purple-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Orders</h2>
          <p className="text-gray-600">
            Manage customer orders and fulfillment
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Orders</h2>
          <p className="text-gray-600">
            Manage customer orders and fulfillment
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <Package className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error Loading Orders
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Orders</h2>
          <p className="text-gray-600">
            Manage customer orders and fulfillment
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
          />
          <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
          <p className="mt-1 text-sm text-gray-500">
            No orders have been placed yet.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <Package className="h-5 w-5 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            #{order.id.slice(-8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.users?.name || "Unknown"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.users?.email || "No email"}
                      </div>
                      {order.customer_mobile && (
                        <div className="text-sm text-gray-500">
                          📞 {order.customer_mobile}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items.slice(0, 2).map((item, index) => (
                          <span key={index}>
                            {item.product_name}
                            {index < Math.min(order.items.length, 2) - 1
                              ? ", "
                              : ""}
                          </span>
                        ))}
                        {order.items.length > 2 && "..."}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      KES {order.total_price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          order.order_status
                        )}`}
                      >
                        {(order.order_status || "pending")
                          .charAt(0)
                          .toUpperCase() +
                          (order.order_status || "pending").slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.payment_status === "paid"
                            ? "bg-green-100 text-green-800"
                            : order.payment_status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.payment_status.charAt(0).toUpperCase() +
                          order.payment_status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <OrderActions order={order} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
