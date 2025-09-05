"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { Edit, Trash2 } from "lucide-react";

interface ProductActionsProps {
  product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <Link
        href={`/admin/products/${product.id}/edit`}
        className="text-blue-600 hover:text-blue-900 transition-colors"
        title="Edit Product"
      >
        <Edit className="h-4 w-4" />
      </Link>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
        title="Delete Product"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
