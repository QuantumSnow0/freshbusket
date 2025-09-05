import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { generateProductSEO } from "@/lib/seo";
import ProductDetails from "@/components/ProductDetails";
import SEOHead from "@/components/SEOHead";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const supabase = createClient();
  const { id } = await params;

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  const seo = generateProductSEO(product);

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: seo.openGraph,
    twitter: seo.twitter,
    robots: seo.robots,
    alternates: seo.alternates,
    other: seo.other,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const supabase = createClient();
  const { id } = await params;

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) {
    notFound();
  }

  const seo = generateProductSEO(product);

  return (
    <>
      <SEOHead
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        image={seo.openGraph.images[0].url}
        url={`/products/${id}`}
        type="product"
        product={product}
        structuredData={seo.structuredData}
      />
      <ProductDetails product={product} />
    </>
  );
}
