import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createClient();

    // Get all products
    const { data: products } = await supabase
      .from("products")
      .select("id, name, updated_at")
      .order("updated_at", { ascending: false });

    // Get all categories
    const { data: categories } = await supabase
      .from("categories")
      .select("id, name, updated_at")
      .order("updated_at", { ascending: false });

    // Base URL
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://freshbusket.vercel.app";

    // Static pages
    const staticPages = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: `${baseUrl}/products`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      },
    ];

    // Product pages
    const productPages =
      products?.map((product) => ({
        url: `${baseUrl}/products/${product.id}`,
        lastModified: new Date(product.updated_at),
        changeFrequency: "weekly",
        priority: 0.8,
      })) || [];

    // Category pages
    const categoryPages =
      categories?.map((category) => ({
        url: `${baseUrl}/products?category=${category.name}`,
        lastModified: new Date(category.updated_at),
        changeFrequency: "weekly",
        priority: 0.7,
      })) || [];

    const allPages = [...staticPages, ...productPages, ...categoryPages];

    // Generate XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified.toISOString()}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}
