import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Bot,
  Sparkles,
  Palette,
  Scissors,
  Leaf,
  Flower,
  User,
} from "lucide-react";
import type { Product } from "../../types";
import { categories } from "../../data/products";
import { ProductCard } from "../components/ProductCard";

export function HomePage({
  addToCart,
}: {
  addToCart: (product: Product) => void;
}) {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  // Filter products by selected category if set
  const displayedProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Hero Section */}
      <section className="relative bg-pink-200 py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Discover Your
                <span className="block text-pink-600">Natural Glow</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Premium beauty and wellness products crafted with natural
                ingredients for your radiant skin and healthy lifestyle.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3"
                >
                  Shop Now
                </Button>
                <Button
                  onClick={() => navigate("/ai-recommendations")}
                  variant="outline"
                  size="lg"
                  className="border-pink-300 text-pink-600 hover:bg-pink-50 px-8 py-3 bg-transparent"
                >
                  <Bot className="w-5 h-5 mr-2" />
                  Get AI Recommendations
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://domf5oio6qrcr.cloudfront.net/medialibrary/7544/conversions/724cf5e2-e067-445d-9665-2eb9a0a12c86-thumb.jpg"
                alt="Beauty Products"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* AI Recommendation CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <Card className="bg-pink-600 text-white p-8 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-pink-800 bg-opacity-20 rounded-full flex items-center justify-center">
                  <Bot className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Not sure what products are right for you?
              </h2>
              <p className="text-xl text-pink-100 mb-6">
                Our AI Beauty Consultant analyzes your skin type, concerns, and
                preferences to recommend the perfect products just for you.
              </p>
              <Button
                onClick={() => navigate("/ai-recommendations")}
                size="lg"
                className="bg-white text-pink-600 hover:bg-pink-50 px-8 py-3 font-semibold"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Try AI Recommendations
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our curated collection of premium beauty and wellness
              products
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Card
                key={index}
                className={`group cursor-pointer hover:shadow-lg transition-all duration-300 ${
                  selectedCategory === category.name
                    ? "ring-2 ring-pink-500"
                    : ""
                }`}
                onClick={() => setSelectedCategory(category.name)}
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {category.name === "Skincare" && (
                      <Sparkles className="w-8 h-8" />
                    )}
                    {category.name === "Makeup" && (
                      <Palette className="w-8 h-8" />
                    )}
                    {category.name === "Hair Care" && (
                      <Scissors className="w-8 h-8" />
                    )}
                    {category.name === "Wellness" && (
                      <Leaf className="w-8 h-8" />
                    )}
                    {category.name === "Fragrance" && (
                      <Flower className="w-8 h-8" />
                    )}
                    {category.name === "Men's Care" && (
                      <User className="w-8 h-8" />
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                    {category.name}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most loved products, carefully selected for their
              quality and effectiveness
            </p>
            {selectedCategory && (
              <div className="mt-4 flex flex-col items-center">
                <span className="text-pink-600 font-semibold text-lg">
                  Showing: {selectedCategory}
                </span>
                <Button
                  size="sm"
                  className="mt-2 bg-pink-100 text-pink-700 hover:bg-pink-200"
                  onClick={() => setSelectedCategory(null)}
                >
                  Clear Filter
                </Button>
              </div>
            )}
          </div>
          {loading ? (
            <div>Loading products...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onProductClick={handleProductClick}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">BeautyBloom</span>
              </div>
              <p className="text-gray-400 max-w-md">
                Your trusted partner in beauty and wellness, bringing you the
                finest products for your natural glow. We believe everyone
                deserves to feel confident and beautiful in their own skin.
              </p>
              <div className="flex space-x-4">
                {/* Social Media Icons */}
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors cursor-pointer">
                  <span className="text-sm">📘</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors cursor-pointer">
                  <span className="text-sm">📷</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors cursor-pointer">
                  <span className="text-sm">🐦</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-pink-400 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-400 transition-colors">
                    Our Story
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-400 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-400 transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Customer Service</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-pink-400 transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-400 transition-colors">
                    Shipping Info
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-400 transition-colors">
                    Returns
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-400 transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-pink-400 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-400 transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-400 transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BeautyBloom. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
