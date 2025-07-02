import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Star, Plus, Minus, Heart } from "lucide-react";
import type { Product } from "../../types";
import { ProductCard } from "../components/ProductCard";

interface ProductDetailPageProps {
  addToCart: (product: Product, quantity?: number) => void;
}

export function ProductDetailPage({ addToCart }: ProductDetailPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [relatedError, setRelatedError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch product");
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setRelatedLoading(true);
    setRelatedError(null);
    fetch(`http://localhost:5000/api/products/${id}/related`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch related products");
        return res.json();
      })
      .then((data) => {
        setRelatedProducts(data);
        setRelatedLoading(false);
      })
      .catch((err) => {
        setRelatedError(err.message || "Failed to fetch related products");
        setRelatedLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-pink-600 text-xl font-bold">Loading...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Product not found"}
          </h1>
          <Button
            onClick={() => navigate("/")}
            className="bg-pink-600 hover:bg-pink-700"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-pink-600 hover:text-pink-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                className="w-full rounded-lg shadow-lg"
              />
              {product.badge && (
                <Badge
                  className={`absolute top-4 left-4 ${product.badgeColor} text-white`}
                >
                  {product.badge}
                </Badge>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-pink-600 font-medium text-lg">
                {product.brand}
              </p>
              <h1 className="text-4xl font-bold text-gray-900 mt-2">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 font-medium text-lg">
                  {product.rating}
                </span>
              </div>
              <span className="text-gray-500">({product.reviews} reviews)</span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-gray-900">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-2xl text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
              {product.originalPrice && (
                <Badge className="bg-red-100 text-red-700">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </Badge>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>

            {/* Skin Type */}
            {product.skinType && (
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">Best for:</span>
                <Badge className="bg-pink-100 text-pink-700">
                  {product.skinType}
                </Badge>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="font-medium text-lg">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-12 w-12"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="px-6 py-3 font-medium text-lg">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-12 w-12"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex space-x-4">
              <Button
                onClick={() => addToCart(product, quantity)}
                className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-4 text-lg font-semibold"
              >
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-pink-300 text-pink-600 hover:bg-pink-50 bg-transparent h-14 w-14"
              >
                <Heart className="w-6 h-6" />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center space-x-6 py-4 border-t border-b">
              <div className="text-center">
                <div className="text-green-600 font-semibold">
                  ✓ Free Shipping
                </div>
                <div className="text-sm text-gray-500">Orders over $50</div>
              </div>
              <div className="text-center">
                <div className="text-green-600 font-semibold">
                  ✓ 30-Day Returns
                </div>
                <div className="text-sm text-gray-500">
                  Money back guarantee
                </div>
              </div>
              <div className="text-center">
                <div className="text-green-600 font-semibold">
                  ✓ Secure Payment
                </div>
                <div className="text-sm text-gray-500">SSL encrypted</div>
              </div>
            </div>

            {/* Ingredients */}
            {product.ingredients && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Ingredients
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    {product.ingredients.join(", ")}
                  </p>
                </div>
              </div>
            )}

            {/* How to Use */}
            {product.howToUse && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  How to Use
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{product.howToUse}</p>
                </div>
              </div>
            )}

            {/* Benefits */}
            {product.benefits && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Benefits
                </h3>
                <ul className="space-y-2">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            You might also like
          </h2>
          {relatedLoading ? (
            <div className="text-gray-500">Loading related products...</div>
          ) : relatedError ? (
            <div className="text-red-500">{relatedError}</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  onProductClick={handleProductClick}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
