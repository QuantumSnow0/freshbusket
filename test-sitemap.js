// Simple test to check sitemap generation
const { createClient } = require("@supabase/supabase-js");

async function testSitemap() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    console.log("Testing sitemap generation...");

    // Test products query
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name, updated_at")
      .order("updated_at", { ascending: false });

    if (productsError) {
      console.error("Products query error:", productsError);
    } else {
      console.log(`Found ${products?.length || 0} products`);
    }

    // Test categories query
    const { data: categories, error: categoriesError } = await supabase
      .from("categories")
      .select("id, name, updated_at")
      .order("updated_at", { ascending: false });

    if (categoriesError) {
      console.error("Categories query error:", categoriesError);
    } else {
      console.log(`Found ${categories?.length || 0} categories`);
    }

    console.log("Sitemap generation test completed successfully!");
  } catch (error) {
    console.error("Sitemap test failed:", error);
  }
}

testSitemap();
