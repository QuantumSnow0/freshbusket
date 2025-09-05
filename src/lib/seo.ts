import { Product } from "@/types";

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  product?: Product;
  noIndex?: boolean;
}

export function generateSEO({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  product,
  noIndex = false,
}: SEOProps) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://freshbusket.vercel.app";
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const fullImage = image
    ? image.startsWith("http")
      ? image
      : `${baseUrl}${image}`
    : `${baseUrl}/og-image.jpg`;

  // Generate keywords from product if available
  const generatedKeywords = product
    ? `${product.name}, ${
        product.category || "groceries"
      }, fresh, organic, delivery, online shopping, ${keywords || ""}`
    : keywords ||
      "fresh groceries, organic food, online shopping, delivery, healthy food";

  // Generate structured data for products
  const structuredData = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: product.image_url
          ? product.image_url.startsWith("http")
            ? product.image_url
            : `${baseUrl}${product.image_url}`
          : undefined,
        brand: {
          "@type": "Brand",
          name: "FreshBasket",
        },
        offers: {
          "@type": "Offer",
          price: (() => {
            const hasDiscount =
              product.discount_type &&
              product.discount_value &&
              product.discount_value > 0;
            return hasDiscount
              ? product.discount_type === "percentage"
                ? product.price * (1 - (product.discount_value || 0) / 100)
                : product.price - (product.discount_value || 0)
              : product.price;
          })(),
          priceCurrency: "KES",
          availability:
            product.stock_quantity > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          seller: {
            "@type": "Organization",
            name: "FreshBasket",
          },
        },
        category: product.category || "Groceries",
        sku: product.id,
      }
    : {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "FreshBasket",
        description:
          "Fresh groceries and organic food delivered to your doorstep",
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        sameAs: [
          "https://facebook.com/freshbasket",
          "https://twitter.com/freshbasket",
          "https://instagram.com/freshbasket",
        ],
      };

  return {
    title: `${title} | FreshBasket`,
    description,
    keywords: generatedKeywords,
    openGraph: {
      title: `${title} | FreshBasket`,
      description,
      url: fullUrl,
      type,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: "FreshBasket",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | FreshBasket`,
      description,
      images: [fullImage],
      creator: "@freshbasket",
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large" as const,
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: fullUrl,
    },
    other: {
      "application-name": "FreshBasket",
      "apple-mobile-web-app-title": "FreshBasket",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "default",
      "format-detection": "telephone=no",
      "mobile-web-app-capable": "yes",
      "msapplication-TileColor": "#10b981",
      "msapplication-config": "/browserconfig.xml",
      "theme-color": "#10b981",
    },
    structuredData: JSON.stringify(structuredData),
  };
}

export function generateProductSEO(product: Product) {
  return generateSEO({
    title: product.name,
    description:
      product.description ||
      `Buy ${product.name} online. Fresh, high-quality ${
        product.category || "groceries"
      } delivered to your doorstep.`,
    keywords: `${product.name}, ${
      product.category || "groceries"
    }, fresh, organic, delivery`,
    image: product.image_url,
    url: `/products/${product.id}`,
    type: "product",
    product,
  });
}

export function generateHomepageSEO() {
  return generateSEO({
    title: "Fresh Groceries & Organic Food Delivery",
    description:
      "Get fresh, organic groceries delivered to your doorstep. Shop from our wide selection of fruits, vegetables, dairy, and pantry essentials. Fast delivery, great prices!",
    keywords:
      "fresh groceries, organic food, online shopping, delivery, healthy food, fruits, vegetables, dairy, pantry essentials",
    url: "/",
    type: "website",
  });
}

export function generateProductsPageSEO() {
  return generateSEO({
    title: "All Products - Fresh Groceries",
    description:
      "Browse our complete selection of fresh groceries, organic food, and pantry essentials. Find everything you need for healthy cooking and eating.",
    keywords:
      "all products, fresh groceries, organic food, fruits, vegetables, dairy, pantry essentials, online shopping",
    url: "/products",
    type: "website",
  });
}
