import { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase";
import { generateProductsPageSEO } from "@/lib/seo";
import ProductsGrid from "@/components/ProductsGrid";
import ProductsFilters from "@/components/ProductsFilters";
import LoadingSpinner from "@/components/LoadingSpinner";

export const metadata: Metadata = generateProductsPageSEO();

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const supabase = createClient();
  const params = await searchParams;

  // Build query based on search params
  let query = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  // Apply filters
  if (params.category) {
    query = query.eq("category", params.category);
  }

  if (params.search) {
    query = query.or(
      `name.ilike.%${params.search}%,description.ilike.%${params.search}%`
    );
  }

  // Apply sorting
  if (params.sort) {
    switch (params.sort) {
      case "price-low":
        query = query.order("price", { ascending: true });
        break;
      case "price-high":
        query = query.order("price", { ascending: false });
        break;
      case "name":
        query = query.order("name", { ascending: true });
        break;
      case "newest":
        query = query.order("created_at", { ascending: false });
        break;
      default:
        query = query.order("created_at", { ascending: false });
    }
  }

  // Apply pagination
  const page = parseInt(params.page || "1");
  const limit = 12;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.range(from, to);

  const { data: products, count } = await query;

  // Get categories for filters
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  const totalPages = Math.ceil((count || 0) / limit);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
          <p className="mt-2 text-gray-600">
            Discover our complete selection of fresh groceries and organic food
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Suspense fallback={<LoadingSpinner />}>
              <ProductsFilters categories={categories || []} />
            </Suspense>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <Suspense fallback={<LoadingSpinner />}>
              <ProductsGrid
                products={products || []}
                currentPage={page}
                totalPages={totalPages}
                searchParams={params}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
