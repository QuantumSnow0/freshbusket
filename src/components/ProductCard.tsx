"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Plus, Minus, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, removeFromCart, getItemQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);

  const hasDiscount =
    product.discount_type &&
    product.discount_value &&
    product.discount_value > 0;
  const discountedPrice = hasDiscount
    ? product.discount_type === "percentage"
      ? product.price * (1 - product.discount_value / 100)
      : product.price - product.discount_value
    : product.price;

  const itemQuantity = getItemQuantity(product.id);
  const isInCart = itemQuantity > 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);
  };

  const handleIncrement = () => {
    if (quantity < product.stock_quantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleCartIncrement = () => {
    addToCart(product, 1);
  };

  const handleCartDecrement = () => {
    removeFromCart(product.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {product.discount_type === "percentage"
                ? `${product.discount_value}% OFF`
                : `KES ${product.discount_value} OFF`}
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-green-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < 4 ? "text-yellow-400" : "text-gray-300"
              }`}
              fill="currentColor"
            />
          ))}
          <span className="text-sm text-gray-600 ml-1">(4.0)</span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                KES {product.price.toLocaleString()}
              </span>
            )}
            <span className="text-xl font-bold text-green-600">
              KES {discountedPrice.toLocaleString()}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {product.stock_quantity} left
          </span>
        </div>

        <div className="mt-4">
          {isInCart ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={handleCartDecrement}
                  className="p-2 hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 py-2 border-x border-gray-300 min-w-[40px] text-center">
                  {itemQuantity}
                </span>
                <button
                  onClick={handleCartIncrement}
                  disabled={itemQuantity >= product.stock_quantity}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => removeFromCart(product.id)}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-2 border-x border-gray-300 min-w-[40px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    disabled={quantity >= product.stock_quantity}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
