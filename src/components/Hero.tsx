import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-green-600 to-green-700 text-white">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Fresh Groceries
                <span className="block text-green-200">
                  Delivered to Your Door
                </span>
              </h1>
              <p className="text-xl text-green-100 mt-6 leading-relaxed">
                Get the freshest, highest-quality groceries delivered right to
                your doorstep. From farm to table, we bring you the best of
                Kenya's produce.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors group"
              >
                Shop Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-600 transition-colors"
              >
                Learn More
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              <div className="flex items-center space-x-3">
                <Truck className="w-6 h-6 text-green-200" />
                <span className="text-sm">Free Delivery</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-green-200" />
                <span className="text-sm">Quality Guarantee</span>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCcw className="w-6 h-6 text-green-200" />
                <span className="text-sm">Easy Returns</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square relative">
              <Image
                src="/hero-image.jpg"
                alt="Fresh groceries and organic food"
                fill
                className="object-cover rounded-2xl shadow-2xl"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white text-gray-900 p-6 rounded-xl shadow-lg">
              <div className="flex items-center space-x-3">
                <ShoppingCart className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Order now</p>
                  <p className="text-lg font-bold">Get 10% off</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
