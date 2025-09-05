import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://freshbusket.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/api/",
        "/_next/",
        "/checkout/",
        "/profile/",
        "/orders/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
