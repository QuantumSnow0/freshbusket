import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FreshBasket - Fresh Groceries & Organic Food",
    short_name: "FreshBasket",
    description:
      "Get fresh, organic groceries delivered to your doorstep. Shop from our wide selection of fruits, vegetables, dairy, and pantry essentials.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#10b981",
    orientation: "portrait-primary",
    categories: ["food", "shopping", "lifestyle"],
    icons: [
      {
        src: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/screenshot-mobile.png",
        sizes: "390x844",
        type: "image/png",
        form_factor: "narrow",
      },
      {
        src: "/screenshot-desktop.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
      },
    ],
  };
}
