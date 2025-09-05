import { Metadata } from "next";
import { generateSEO } from "@/lib/seo";
import Image from "next/image";
import { Heart, Users, Award, Truck } from "lucide-react";

export const metadata: Metadata = generateSEO({
  title: "About Us - FreshBasket",
  description:
    "Learn about FreshBasket, Kenya's leading online grocery store. We deliver fresh, organic food directly from local farms to your doorstep.",
  keywords:
    "about freshbasket, online grocery store kenya, fresh food delivery, organic groceries, local farms",
  url: "/about",
  type: "website",
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About FreshBasket
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              We're passionate about bringing you the freshest, highest-quality
              groceries directly from local farms to your doorstep.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                At FreshBasket, we believe that everyone deserves access to
                fresh, healthy food. Our mission is to connect local farmers
                with consumers by providing a convenient, reliable platform for
                grocery delivery.
              </p>
              <p className="text-lg text-gray-600">
                We're committed to supporting local agriculture, promoting
                sustainable farming practices, and ensuring that our customers
                receive the highest quality products at competitive prices.
              </p>
            </div>
            <div className="relative">
              <Image
                src="/about-mission.jpg"
                alt="Fresh vegetables and fruits from local farms"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do at FreshBasket
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Quality
              </h3>
              <p className="text-gray-600">
                We source only the freshest, highest-quality products from
                trusted local suppliers.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Community
              </h3>
              <p className="text-gray-600">
                We support local farmers and build strong relationships within
                our community.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Excellence
              </h3>
              <p className="text-gray-600">
                We strive for excellence in every aspect of our service, from
                sourcing to delivery.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Convenience
              </h3>
              <p className="text-gray-600">
                We make grocery shopping convenient and accessible for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <Image
                src="/about-story.jpg"
                alt="FreshBasket team and local farmers"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                FreshBasket was founded in 2024 with a simple vision: to make
                fresh, healthy food accessible to everyone in Kenya. We started
                as a small team of food enthusiasts who were frustrated by the
                limited options for quality grocery delivery.
              </p>
              <p className="text-lg text-gray-600">
                Today, we work directly with over 100 local farmers and
                suppliers to bring you the best products available. Our
                commitment to quality, sustainability, and customer satisfaction
                has made us Kenya's leading online grocery store.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">By the Numbers</h2>
            <p className="text-xl text-green-100">Our impact in numbers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-green-100">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-green-100">Local Farmers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-green-100">Orders Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-green-100">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
