import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mwangi",
    location: "Nairobi",
    rating: 5,
    text: "FreshBasket has completely changed how I shop for groceries. The quality is amazing and delivery is always on time. I love that I can get fresh, organic produce delivered right to my door.",
  },
  {
    name: "John Kimani",
    location: "Mombasa",
    rating: 5,
    text: "The best grocery delivery service in Kenya! The prices are competitive, the products are fresh, and the customer service is excellent. Highly recommended!",
  },
  {
    name: "Grace Wanjiku",
    location: "Kisumu",
    rating: 5,
    text: "I've been using FreshBasket for over a year now and I'm always impressed by the quality and freshness of their products. The delivery team is professional and friendly.",
  },
  {
    name: "David Ochieng",
    location: "Nakuru",
    rating: 5,
    text: "Convenient, reliable, and affordable. FreshBasket makes grocery shopping so much easier. The mobile app is user-friendly and the checkout process is smooth.",
  },
  {
    name: "Mary Akinyi",
    location: "Eldoret",
    rating: 5,
    text: "The variety of products available is impressive. From fresh fruits and vegetables to pantry essentials, they have everything I need. The quality is consistently excellent.",
  },
  {
    name: "Peter Mutua",
    location: "Thika",
    rating: 5,
    text: "Fast delivery, great prices, and excellent customer service. FreshBasket has become my go-to for all grocery needs. I can't imagine shopping anywhere else!",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers
            have to say
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5" fill="currentColor" />
                  ))}
                </div>
              </div>

              <div className="relative mb-4">
                <Quote className="w-8 h-8 text-green-200 absolute -top-2 -left-2" />
                <p className="text-gray-600 leading-relaxed pl-6">
                  "{testimonial.text}"
                </p>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-semibold text-gray-900">
                  {testimonial.name}
                </h4>
                <p className="text-sm text-gray-500">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
