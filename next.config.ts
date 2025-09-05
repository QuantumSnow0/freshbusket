import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "egrjbrbgzzjzhufedaav.supabase.co", // Supabase storage domain
      "*.supabase.co", // Allow all Supabase subdomains
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "egrjbrbgzzjzhufedaav.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
