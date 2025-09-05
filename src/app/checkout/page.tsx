"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  CheckoutForm,
  MpesaSTKPushRequest,
  MpesaSTKPushResponse,
} from "@/types";
import { CreditCard, User, Smartphone, CheckCircle } from "lucide-react";
import {
  calculateDiscountedPrice,
  hasDiscount,
  formatDiscountPercentage,
  calculateTotalSavings,
} from "@/lib/discount-utils";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const router = useRouter();

  const [formData, setFormData] = useState<CheckoutForm>({
    email: user?.email || "",
    name: user?.name || "",
    mobile: "",
    address: "",
    city: "",
    postalCode: "",
    country: "KE",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "mpesa">(
    "stripe"
  );
  const [mpesaLoading, setMpesaLoading] = useState(false);
  const [mpesaSuccess, setMpesaSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (cart.items.length === 0) {
      router.push("/cart");
      return;
    }
  }, [user, cart.items.length, router]);

  // Auto-populate form with profile data
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        email: profile.email || prev.email,
        name: profile.name || prev.name,
        mobile: profile.phone || prev.mobile,
        address: profile.shipping_address?.street || prev.address,
        city: profile.shipping_address?.city || prev.city,
        postalCode: profile.shipping_address?.postal_code || prev.postalCode,
        country: profile.shipping_address?.country || prev.country,
      }));
    }
  }, [profile]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMpesaPayment = async () => {
    setMpesaLoading(true);
    setError("");

    try {
      // Create order first
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart.items.map((item) => ({
            product_id: item.product.id,
            product_name: item.product.name,
            product_price: item.product.price,
            quantity: item.quantity,
            image_url: item.product.image_url,
          })),
          total_price: cart.total,
          payment_status: "pending",
          delivery_address: `${formData.address}, ${formData.city}, ${formData.postalCode}, ${formData.country}`,
          customer_mobile: formData.mobile,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create order");
      }

      const order = await orderResponse.json();

      // Initiate M-Pesa STK Push
      const mpesaRequest: MpesaSTKPushRequest = {
        phone_number: formData.mobile,
        amount: cart.total,
        order_id: order.data.id,
      };

      const mpesaResponse = await fetch("/api/mpesa/stkpush", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mpesaRequest),
      });

      if (!mpesaResponse.ok) {
        const errorData = await mpesaResponse.json();
        throw new Error(errorData.error || "Failed to initiate M-Pesa payment");
      }

      const mpesaData: MpesaSTKPushResponse = await mpesaResponse.json();

      if (mpesaData.success) {
        setMpesaSuccess(true);
        // Clear cart after successful payment initiation
        clearCart();
        // Redirect to success page after a delay
        setTimeout(() => {
          router.push("/checkout/success");
        }, 3000);
      } else {
        throw new Error(mpesaData.error || "M-Pesa payment failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setMpesaLoading(false);
    }
  };

  const handleStripePayment = async () => {
    setLoading(true);
    setError("");

    try {
      // Create order first
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart.items.map((item) => ({
            product_id: item.product.id,
            product_name: item.product.name,
            product_price: item.product.price,
            quantity: item.quantity,
            image_url: item.product.image_url,
          })),
          total_price: cart.total,
          payment_status: "pending",
          delivery_address: `${formData.address}, ${formData.city}, ${formData.postalCode}, ${formData.country}`,
          customer_mobile: formData.mobile,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create order");
      }

      const order = await orderResponse.json();

      // Create Stripe Checkout Session
      const paymentResponse = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: cart.total,
          orderId: order.data.id,
          items: cart.items.map((item) => ({
            product_id: item.product.id,
            product_name: item.product.name,
            product_price: item.product.price,
            quantity: item.quantity,
            image_url: item.product.image_url,
          })),
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await paymentResponse.json();

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === "mpesa") {
      await handleMpesaPayment();
    } else {
      await handleStripePayment();
    }
  };

  if (!user || cart.items.length === 0) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Delivery Information
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none text-black focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none text-black placeholder-gray-500 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label
                  htmlFor="mobile"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mobile Number
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  required
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none text-black placeholder-gray-500 focus:ring-green-500 focus:border-green-500"
                  placeholder="+254 700 123 456"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none text-black placeholder-gray-500 focus:ring-green-500 focus:border-green-500"
                placeholder="Street address, estate, building"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  County
                </label>
                <select
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none text-black focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select County</option>
                  <option value="Nairobi">Nairobi</option>
                  <option value="Mombasa">Mombasa</option>
                  <option value="Kisumu">Kisumu</option>
                  <option value="Nakuru">Nakuru</option>
                  <option value="Eldoret">Eldoret</option>
                  <option value="Thika">Thika</option>
                  <option value="Malindi">Malindi</option>
                  <option value="Kitale">Kitale</option>
                  <option value="Garissa">Garissa</option>
                  <option value="Kakamega">Kakamega</option>
                  <option value="Nyeri">Nyeri</option>
                  <option value="Meru">Meru</option>
                  <option value="Machakos">Machakos</option>
                  <option value="Kisii">Kisii</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="postalCode"
                  className="block text-sm font-medium text-gray-700"
                >
                  Postal Code (Optional)
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none text-black placeholder-gray-500 focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., 00100"
                />
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700"
                >
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none text-black placeholder-gray-500 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="KE">Kenya</option>
                  <option value="UG">Uganda</option>
                  <option value="TZ">Tanzania</option>
                  <option value="RW">Rwanda</option>
                </select>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Payment Method
              </h3>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="stripe"
                    name="paymentMethod"
                    type="radio"
                    value="stripe"
                    checked={paymentMethod === "stripe"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as "stripe" | "mpesa")
                    }
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                  />
                  <label htmlFor="stripe" className="ml-3 flex items-center">
                    <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-700">
                      Credit/Debit Card (Stripe)
                    </span>
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="mpesa"
                    name="paymentMethod"
                    type="radio"
                    value="mpesa"
                    checked={paymentMethod === "mpesa"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as "stripe" | "mpesa")
                    }
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                  />
                  <label htmlFor="mpesa" className="ml-3 flex items-center">
                    <Smartphone className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-700">
                      M-Pesa Mobile Money
                    </span>
                  </label>
                </div>
              </div>

              {paymentMethod === "mpesa" && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex">
                    <Smartphone className="h-5 w-5 text-blue-400 mr-2" />
                    <div className="text-sm text-blue-700">
                      <p className="font-medium">M-Pesa Payment</p>
                      <p>
                        You will receive an STK Push notification on your phone
                        to complete the payment.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* M-Pesa Success Message */}
            {mpesaSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <div>
                  <p className="font-medium">Payment request sent!</p>
                  <p className="text-sm">
                    Check your phone for the M-Pesa STK Push notification.
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || mpesaLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Processing..."
                : mpesaLoading
                ? "Sending M-Pesa request..."
                : paymentMethod === "mpesa"
                ? "Pay with M-Pesa"
                : "Pay with Stripe"}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Order Summary
          </h2>

          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center space-x-4"
              >
                <div className="relative h-16 w-16 flex-shrink-0">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="h-16 w-16 object-cover rounded-md"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {hasDiscount(item.product) ? (
                    <div className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span className="line-through text-gray-500">
                          KES{" "}
                          {(
                            calculateDiscountedPrice(item.product)
                              .originalPrice * item.quantity
                          ).toFixed(2)}
                        </span>
                        <span className="text-green-600">
                          KES{" "}
                          {(
                            calculateDiscountedPrice(item.product)
                              .discountedPrice * item.quantity
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="text-xs text-red-600 mt-1">
                        {formatDiscountPercentage(
                          calculateDiscountedPrice(item.product)
                            .discountPercentage
                        )}
                      </div>
                    </div>
                  ) : (
                    <span>
                      KES {(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            {(() => {
              const totalSavings = calculateTotalSavings(cart.items);
              const originalTotal = cart.items.reduce(
                (sum, item) => sum + item.product.price * item.quantity,
                0
              );

              return (
                <>
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Original Total:</span>
                      <span className="line-through">
                        KES {originalTotal.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-sm text-green-600 mb-2">
                      <span>You Save:</span>
                      <span>KES {totalSavings.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-green-600">
                      KES {cart.total.toFixed(2)}
                    </span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
