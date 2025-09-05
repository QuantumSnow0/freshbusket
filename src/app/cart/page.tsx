"use client";

import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import {
  calculateDiscountedPrice,
  hasDiscount,
  formatDiscountPercentage,
  calculateTotalSavings,
} from "@/lib/discount-utils";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleCheckout = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    router.push("/checkout");
  };

  if (cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h1>
          <p className="text-gray-600 mb-8">Add some items to get started!</p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            <button
              onClick={clearCart}
              className="text-sm text-red-600 hover:text-red-500"
            >
              Clear Cart
            </button>
          </div>

          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
              >
                <div className="relative h-20 w-20 flex-shrink-0">
                  <Image
                    src={item.product.image_url}
                    alt={item.product.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {item.product.category}
                  </p>
                  <div className="text-lg font-semibold">
                    {hasDiscount(item.product) ? (
                      <div className="flex items-center space-x-2">
                        <span className="line-through text-gray-500">
                          KES{" "}
                          {calculateDiscountedPrice(
                            item.product
                          ).originalPrice.toFixed(2)}
                        </span>
                        <span className="text-green-600">
                          KES{" "}
                          {calculateDiscountedPrice(
                            item.product
                          ).discountedPrice.toFixed(2)}
                        </span>
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                          {formatDiscountPercentage(
                            calculateDiscountedPrice(item.product)
                              .discountPercentage
                          )}
                        </span>
                      </div>
                    ) : (
                      <span className="text-green-600">
                        KES {item.product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity - 1)
                    }
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <Minus className="h-4 w-4" />
                  </button>

                  <span className="w-8 text-center font-medium">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity + 1)
                    }
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    KES{" "}
                    {(
                      calculateDiscountedPrice(item.product).discountedPrice *
                      item.quantity
                    ).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-red-600 hover:text-red-500 mt-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            {(() => {
              const totalSavings = calculateTotalSavings(cart.items);
              const originalTotal = cart.items.reduce(
                (sum, item) => sum + item.product.price * item.quantity,
                0
              );

              return (
                <>
                  {totalSavings > 0 && (
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                      <span>Original Total:</span>
                      <span className="line-through">
                        KES {originalTotal.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {totalSavings > 0 && (
                    <div className="flex justify-between items-center text-sm text-green-600 mb-2">
                      <span>You Save:</span>
                      <span>KES {totalSavings.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total ({cart.itemCount} items)</span>
                    <span className="text-green-600">
                      KES {cart.total.toFixed(2)}
                    </span>
                  </div>
                </>
              );
            })()}

            <div className="mt-6 flex space-x-4">
              <Link
                href="/"
                className="flex-1 text-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Continue Shopping
              </Link>
              <button
                onClick={handleCheckout}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                {user ? "Proceed to Checkout" : "Login to Checkout"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
