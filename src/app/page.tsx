import { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase";
import { generateHomepageSEO } from "@/lib/seo";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import Categories from "@/components/Categories";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import LoadingSpinner from "@/components/LoadingSpinner";

export const metadata: Metadata = generateHomepageSEO();

export default async function HomePage() {
  const supabase = createClient();

  // Fetch featured products
  const { data: featuredProducts } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .limit(8)
    .order("created_at", { ascending: false });

  // Fetch categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .limit(6)
    .order("name");

  return (
    <div className="min-h-screen">
      <Hero />

      <Suspense fallback={<LoadingSpinner />}>
        <FeaturedProducts products={featuredProducts || []} />
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
        <Categories categories={categories || []} />
      </Suspense>

      <WhyChooseUs />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
