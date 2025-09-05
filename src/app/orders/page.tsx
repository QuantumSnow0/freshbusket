"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Order } from "@/types";
import { Package, Clock, CheckCircle, Truck, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      fetchOrders();

      // Set up real-time subscription for user's orders
      const supabase = createClient();

      const channel = supabase
        .channel("user-orders-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "orders",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log("🔄 Real-time order update for user:", payload);

            if (payload.eventType === "INSERT") {
              // New order added
              setOrders((prev) => [payload.new as Order, ...prev]);
            } else if (payload.eventType === "UPDATE") {
              // Order updated
              setOrders((prev) =>
                prev.map((order) =>
                  order.id === payload.new.id ? (payload.new as Order) : order
                )
              );
            } else if (payload.eventType === "DELETE") {
              // Order deleted
              setOrders((prev) =>
                prev.filter((order) => order.id !== payload.old.id)
              );
            }
          }
        )
        .subscribe();

      // Cleanup subscription on unmount
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, authLoading, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
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
    }
  };

  const getStatusIcon = (status: string | undefined) => {
    const orderStatus = status || "pending";
    switch (orderStatus) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-blue-600" />;
      case "processed":
        return <Package className="h-5 w-5 text-purple-600" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600">Track your order history and status</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircle className="h-5 w-5 text-red-400" />
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
          )}

          {orders.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No orders
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't placed any orders yet.
              </p>
              <div className="mt-6">
                <a
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  Start Shopping
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white shadow rounded-lg overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Package className="h-5 w-5 text-gray-400" />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            Order #{order.id.slice(-8)}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Placed on {formatDate(order.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.order_status)}
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
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                          Order Items
                        </h4>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-3"
                            >
                              <img
                                src={item.image_url}
                                alt={item.product_name}
                                className="h-10 w-10 rounded-md object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {item.product_name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Qty: {item.quantity} × KES{" "}
                                  {item.product_price.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                          Order Details
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Total:</span>
                            <span className="font-medium text-gray-900">
                              KES {order.total_price.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">
                              Payment Status:
                            </span>
                            <span
                              className={`font-medium ${
                                order.payment_status === "paid"
                                  ? "text-green-600"
                                  : order.payment_status === "pending"
                                  ? "text-yellow-600"
                                  : "text-red-600"
                              }`}
                            >
                              {order.payment_status.charAt(0).toUpperCase() +
                                order.payment_status.slice(1)}
                            </span>
                          </div>
                          {order.customer_mobile && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">Mobile:</span>
                              <span className="font-medium text-gray-900">
                                {order.customer_mobile}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-gray-900 mb-1">
                            Delivery Address:
                          </h5>
                          <p className="text-sm text-gray-600">
                            {order.delivery_address}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
