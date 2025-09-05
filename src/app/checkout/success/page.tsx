"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle, ArrowRight } from "lucide-react";

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const success = searchParams.get("success");
    const orderIdParam = searchParams.get("order_id");

    if (success === "true" && sessionId) {
      // Clear cart on successful payment
      clearCart();
      setOrderId(orderIdParam);
      setLoading(false);
    } else {
      // Redirect to orders page if no success parameter
      router.push("/orders");
    }
  }, [searchParams, clearCart, router]);

  // Send confirmation email when order ID is available
  useEffect(() => {
    if (orderId && user) {
      // Send order confirmation email
      fetch("/api/send-order-confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          customerEmail: user.email,
          customerName: user.name || "Customer",
          orderTotal: 0, // This would be fetched from the order
          orderItems: [], // This would be fetched from the order
        }),
      }).catch(console.error);
    }
  }, [orderId, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            Thank you for your order. We'll send you a confirmation email
            shortly.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => router.push("/orders")}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            View Your Orders
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
