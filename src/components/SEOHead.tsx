"use client";

import Head from "next/head";
import { SEOProps } from "@/lib/seo";

interface SEOHeadProps extends SEOProps {
  structuredData?: string;
}

export default function SEOHead({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  product,
  noIndex = false,
  structuredData,
}: SEOHeadProps) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://freshbusket.vercel.app";
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const fullImage = image
    ? image.startsWith("http")
      ? image
      : `${baseUrl}${image}`
    : `${baseUrl}/og-image.jpg`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta
        name="robots"
        content={noIndex ? "noindex,nofollow" : "index,follow"}
      />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="FreshBasket" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:creator" content="@freshbasket" />

      {/* Additional Meta Tags */}
      <meta name="application-name" content="FreshBasket" />
      <meta name="apple-mobile-web-app-title" content="FreshBasket" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-TileColor" content="#10b981" />
      <meta name="theme-color" content="#10b981" />

      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredData }}
        />
      )}

      {/* Favicon and Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/manifest.json" />
    </Head>
  );
}
