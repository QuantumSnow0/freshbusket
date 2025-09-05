import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface Category {
  id: string;
  name: string;
  image_url?: string;
  description?: string;
}

interface CategoriesProps {
  categories: Category[];
}

const defaultCategories = [
  {
    id: "fruits",
    name: "Fruits",
    image_url: "/categories/fruits.jpg",
    description: "Fresh, juicy fruits from local farms",
  },
  {
    id: "vegetables",
    name: "Vegetables",
    image_url: "/categories/vegetables.jpg",
    description: "Crisp, organic vegetables for healthy cooking",
  },
  {
    id: "dairy",
    name: "Dairy",
    image_url: "/categories/dairy.jpg",
    description: "Fresh milk, cheese, and dairy products",
  },
  {
    id: "pantry",
    name: "Pantry Essentials",
    image_url: "/categories/pantry.jpg",
    description: "Grains, spices, and cooking essentials",
  },
  {
    id: "meat",
    name: "Meat & Poultry",
    image_url: "/categories/meat.jpg",
    description: "Fresh, quality meat and poultry",
  },
  {
    id: "beverages",
    name: "Beverages",
    image_url: "/categories/beverages.jpg",
    description: "Fresh juices, teas, and healthy drinks",
  },
];

export default function Categories({ categories }: CategoriesProps) {
  const displayCategories =
    categories.length > 0 ? categories : defaultCategories;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find exactly what you need from our carefully organized categories
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCategories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.name}`}
              className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video relative overflow-hidden">
                <Image
                  src={category.image_url || "/categories/default.jpg"}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {category.name}
                  </h3>
                  <p className="text-green-200 text-sm">
                    {category.description}
                  </p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Shop now</span>
                  <ArrowRight className="w-4 h-4 text-green-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
