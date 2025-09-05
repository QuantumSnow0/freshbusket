import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://freshbusket.vercel.app";

  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /checkout/
Disallow: /profile/
Disallow: /orders/

Sitemap: ${baseUrl}/sitemap.xml`;

  return new NextResponse(robots, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
