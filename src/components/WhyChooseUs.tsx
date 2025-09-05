import { Truck, Shield, RotateCcw, Clock, Heart, Award } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Delivery",
    description:
      "Get free delivery on orders over KES 2,000. Fast, reliable delivery to your doorstep.",
  },
  {
    icon: Shield,
    title: "Quality Guarantee",
    description:
      "We guarantee the freshness and quality of all our products. 100% satisfaction or your money back.",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description:
      "Not satisfied? Return any product within 7 days for a full refund. No questions asked.",
  },
  {
    icon: Clock,
    title: "Fast Delivery",
    description:
      "Get your groceries delivered within 2-4 hours. Same-day delivery available in Nairobi.",
  },
  {
    icon: Heart,
    title: "Fresh & Organic",
    description:
      "We source directly from local farms to bring you the freshest, most organic produce.",
  },
  {
    icon: Award,
    title: "Best Prices",
    description:
      "Competitive prices with regular discounts and special offers. Save more on every order.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose FreshBasket?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're committed to providing you with the best grocery shopping
            experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
