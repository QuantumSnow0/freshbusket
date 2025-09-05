import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { UserProfileProvider } from "@/contexts/UserProfileContext";
import { Navbar } from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FreshBasket - Your Online Grocery Store",
  description:
    "Fresh groceries delivered to your doorstep. Shop fresh fruits, vegetables, dairy, meat, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <CartProvider>
            <UserProfileProvider>
              <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main>{children}</main>
              </div>
            </UserProfileProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
