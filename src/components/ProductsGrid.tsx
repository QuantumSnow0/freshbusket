"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { useCart } from "@/contexts/CartContext";
import {
  ShoppingCart,
  Plus,
  Minus,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface ProductsGridProps {
  products: Product[];
  currentPage: number;
  totalPages: number;
  searchParams: {
    category?: string;
    search?: string;
    sort?: string;
    page?: string;
  };
}

export default function ProductsGrid({
  products,
  currentPage,
  totalPages,
  searchParams,
}: ProductsGridProps) {
  const { addToCart, removeFromCart, getItemQuantity } = useCart();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1;
    addToCart(product, quantity);
    setQuantities((prev) => ({ ...prev, [product.id]: 1 }));
  };

  const handleIncrement = (product: Product) => {
    const currentQuantity = quantities[product.id] || 1;
    if (currentQuantity < product.stock_quantity) {
      setQuantities((prev) => ({ ...prev, [product.id]: currentQuantity + 1 }));
    }
  };

  const handleDecrement = (product: Product) => {
    const currentQuantity = quantities[product.id] || 1;
    if (currentQuantity > 1) {
      setQuantities((prev) => ({ ...prev, [product.id]: currentQuantity - 1 }));
    }
  };

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (searchParams.category) params.append("category", searchParams.category);
    if (searchParams.search) params.append("search", searchParams.search);
    if (searchParams.sort) params.append("sort", searchParams.sort);
    params.append("page", page.toString());
    return `/products?${params.toString()}`;
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">No products found</div>
        <p className="text-gray-400">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const hasDiscount =
            product.discount_type &&
            product.discount_value &&
            product.discount_value > 0;
          const discountedPrice = hasDiscount
            ? product.discount_type === "percentage"
              ? product.price * (1 - (product.discount_value || 0) / 100)
              : product.price - (product.discount_value || 0)
            : product.price;

          const itemQuantity = getItemQuantity(product.id);
          const isInCart = getItemQuantity(product.id) > 0;

          return (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Link href={`/products/${product.id}`}>
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
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
                          onClick={() => handleDecrement(product)}
                          disabled={itemQuantity <= 1}
                          className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 py-2 border-x border-gray-300 min-w-[40px] text-center">
                          {itemQuantity}
                        </span>
                        <button
                          onClick={() => handleIncrement(product)}
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
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock_quantity === 0}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <Link
              href={createPageUrl(currentPage - 1)}
              className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Previous
            </Link>
            <Link
              href={createPageUrl(currentPage + 1)}
              className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Next
            </Link>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{currentPage}</span>{" "}
                of <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <Link
                  href={createPageUrl(currentPage - 1)}
                  className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                    currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Link>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Link
                      key={page}
                      href={createPageUrl(page)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        page === currentPage
                          ? "z-10 bg-green-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                          : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      }`}
                    >
                      {page}
                    </Link>
                  );
                })}

                <Link
                  href={createPageUrl(currentPage + 1)}
                  className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
