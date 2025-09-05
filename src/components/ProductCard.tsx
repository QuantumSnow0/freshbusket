"use client";

import { Product } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { Plus, Minus } from "lucide-react";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, updateQuantity, cart } = useCart();

  const cartItem = cart.items.find((item) => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  const handleIncrement = () => {
    if (quantity === 0) {
      addToCart(product, 1);
    } else {
      updateQuantity(product.id, quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      updateQuantity(product.id, 0);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover"
        />
        {product.stock_quantity === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-green-600">
            KES {product.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">
            {product.stock_quantity} in stock
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.category}
          </span>

          {quantity === 0 ? (
            <button
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0}
              className="flex items-center space-x-1 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDecrement}
                className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium text-gray-900 min-w-[20px] text-center">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                disabled={quantity >= product.stock_quantity}
                className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
