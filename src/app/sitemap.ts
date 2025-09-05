import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://freshbusket.vercel.app";

  // Static pages (always include these)
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];

  try {
    const supabase = createClient();

    // Get all products
    const { data: products } = await supabase
      .from("products")
      .select("id, name, updated_at")
      .order("updated_at", { ascending: false });

    // Get all categories (if you have a categories table)
    const { data: categories } = await supabase
      .from("categories")
      .select("id, name, updated_at")
      .order("updated_at", { ascending: false });

    // Product pages
    const productPages =
      products?.map((product: any) => ({
        url: `${baseUrl}/products/${product.id}`,
        lastModified: new Date(product.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })) || [];

    // Category pages
    const categoryPages =
      categories?.map((category: any) => ({
        url: `${baseUrl}/categories/${category.id}`,
        lastModified: new Date(category.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })) || [];

    return [...staticPages, ...productPages, ...categoryPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return static pages if database fails
    return staticPages;
  }
}
