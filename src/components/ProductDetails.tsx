"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/types";
import { useCart } from "@/contexts/CartContext";
import {
  ShoppingCart,
  Plus,
  Minus,
  Star,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { addToCart, removeFromCart, getItemQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const itemQuantity = getItemQuantity(product.id);
  const hasDiscount =
    product.discount_type &&
    product.discount_value &&
    product.discount_value > 0;
  const discountedPrice = hasDiscount
    ? product.discount_type === "percentage"
      ? product.price * (1 - product.discount_value / 100)
      : product.price - product.discount_value
    : product.price;

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a href="/" className="text-gray-700 hover:text-green-600">
                Home
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <a
                  href="/products"
                  className="ml-1 text-gray-700 hover:text-green-600 md:ml-2"
                >
                  Products
                </a>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ml-1 text-gray-500 md:ml-2">
                  {product.name}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-white">
              <Image
                src={product.image_url}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {product.name}
              </h1>
              <div className="mt-2 flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < 4 ? "text-yellow-400" : "text-gray-300"
                      }`}
                      fill="currentColor"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  (4.0) • 24 reviews
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                {hasDiscount && (
                  <span className="text-2xl text-gray-500 line-through">
                    KES {product.price.toLocaleString()}
                  </span>
                )}
                <span className="text-3xl font-bold text-green-600">
                  KES {discountedPrice.toLocaleString()}
                </span>
                {hasDiscount && (
                  <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {product.discount_type === "percentage"
                      ? `${product.discount_value}% OFF`
                      : `KES ${product.discount_value} OFF`}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {product.stock_quantity > 0
                  ? `${product.stock_quantity} in stock`
                  : "Out of stock"}
              </p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description ||
                  `Fresh, high-quality ${product.name} delivered to your doorstep. Perfect for your daily cooking needs.`}
              </p>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">
                  Quantity:
                </label>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
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

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Free Delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Quality Guarantee</span>
              </div>
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
