"use client";

import { useState, useRef } from "react";
import { Product } from "@/types";
import { Upload, X } from "lucide-react";

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: Omit<Product, "id" | "created_at" | "updated_at">) => void;
  isSubmitting: boolean;
}

const categories = [
  "Fruits",
  "Vegetables",
  "Dairy",
  "Meat & Seafood",
  "Pantry",
  "Snacks",
  "Food & Beverages",
];

export function ProductForm({
  product,
  onSubmit,
  isSubmitting,
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    category: product?.category || "",
    stock_quantity: product?.stock_quantity || 0,
    discount_type: product?.discount_type || "",
    discount_value: product?.discount_value || 0,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    product?.image_url || ""
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" ||
        name === "stock_quantity" ||
        name === "discount_value"
          ? Number(value)
          : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = product?.image_url || "";

    // Upload new image if one was selected
    if (imageFile) {
      try {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("path", `products/${Date.now()}-${imageFile.name}`);

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        console.log("Upload response status:", response.status);
        console.log("Upload response headers:", response.headers);

        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
            console.error("Upload error details:", errorData);
          } catch (parseError) {
            console.error("Failed to parse error response:", parseError);
            const textResponse = await response.text();
            console.error("Raw error response:", textResponse);
            errorData = { error: `HTTP ${response.status}: ${textResponse}` };
          }
          throw new Error(errorData.error || "Failed to upload image");
        }

        const { url } = await response.json();
        imageUrl = url;
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image");
        return;
      }
    }

    onSubmit({
      ...formData,
      image_url: imageUrl,
      discount_type: formData.discount_type as
        | "percentage"
        | "fixed"
        | undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-black"
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-400"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            value={formData.category}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-black"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleInputChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-black"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price (KES)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            step="1"
            min="0"
            required
            value={formData.price}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-black"
          />
        </div>

        <div>
          <label
            htmlFor="stock_quantity"
            className="block text-sm font-medium text-gray-700"
          >
            Stock Quantity
          </label>
          <input
            type="number"
            id="stock_quantity"
            name="stock_quantity"
            min="0"
            required
            value={formData.stock_quantity}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-black"
          />
        </div>
      </div>

      {/* Discount Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Discount Settings</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="discount_type"
              className="block text-sm font-medium text-gray-700"
            >
              Discount Type
            </label>
            <select
              id="discount_type"
              name="discount_type"
              value={formData.discount_type}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-black"
            >
              <option value="">No Discount</option>
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (KES)</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="discount_value"
              className="block text-sm font-medium text-gray-700"
            >
              Discount Value
            </label>
            <input
              type="number"
              id="discount_value"
              name="discount_value"
              min="0"
              step={formData.discount_type === "percentage" ? "1" : "0.01"}
              max={formData.discount_type === "percentage" ? "100" : undefined}
              value={formData.discount_value}
              onChange={handleInputChange}
              disabled={!formData.discount_type}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder={
                formData.discount_type === "percentage"
                  ? "Enter percentage (0-100)"
                  : "Enter amount in KES"
              }
            />
          </div>
        </div>

        {/* Discount Preview */}
        {formData.discount_type && formData.discount_value > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-green-800 mb-2">
              Discount Preview
            </h4>
            <div className="text-sm text-green-700">
              <div className="flex items-center space-x-2">
                <span className="line-through text-gray-500">
                  KES {formData.price.toFixed(2)}
                </span>
                <span className="font-semibold text-green-600">
                  KES{" "}
                  {(formData.discount_type === "percentage"
                    ? formData.price -
                      (formData.price * formData.discount_value) / 100
                    : Math.max(0, formData.price - formData.discount_value)
                  ).toFixed(2)}
                </span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                  {formData.discount_type === "percentage"
                    ? `${formData.discount_value}% OFF`
                    : `KES ${formData.discount_value} OFF`}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Image
        </label>
        <div className="space-y-4">
          {imagePreview && (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Product preview"
                className="h-32 w-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
            >
              <Upload className="h-4 w-4 mr-2" />
              {imagePreview ? "Change Image" : "Upload Image"}
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : product
            ? "Update Product"
            : "Create Product"}
        </button>
      </div>
    </form>
  );
}
