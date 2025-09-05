import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { UserProfileProvider } from "@/contexts/UserProfileContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { generateHomepageSEO } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  ...generateHomepageSEO(),
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://freshbusket.vercel.app"
  ),
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://freshbusket.vercel.app",
    siteName: "FreshBasket",
    title: "FreshBasket - Fresh Groceries & Organic Food",
    description:
      "Get fresh, organic groceries delivered to your doorstep. Shop from our wide selection of fruits, vegetables, dairy, and pantry essentials.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FreshBasket - Fresh Groceries & Organic Food",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FreshBasket - Fresh Groceries & Organic Food",
    description:
      "Get fresh, organic groceries delivered to your doorstep. Shop from our wide selection of fruits, vegetables, dairy, and pantry essentials.",
    images: ["/og-image.jpg"],
    creator: "@freshbasket",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "googleaaa8e9a0129e3818",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#10b981" />
        <meta name="msapplication-TileColor" content="#10b981" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link
          rel="canonical"
          href={
            process.env.NEXT_PUBLIC_SITE_URL || "https://freshbusket.vercel.app"
          }
        />
      </head>
      <body className={`${inter.className} h-full bg-gray-50`}>
        <AuthProvider>
          <UserProfileProvider>
            <CartProvider>
              <div className="min-h-full flex flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </CartProvider>
          </UserProfileProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
