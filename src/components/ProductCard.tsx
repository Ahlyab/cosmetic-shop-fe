"use client";

import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Star, Heart } from "lucide-react";
import type { Product } from "../../types";

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({
  product,
  onProductClick,
  onAddToCart,
}: ProductCardProps) {
  return (
    <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative" onClick={() => onProductClick(product)}>
        <img
          src={product.image_url || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.badge && (
          <Badge
            className={`absolute top-3 left-3 ${product.badgeColor} text-white`}
          >
            {product.badge}
          </Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-white/80 hover:bg-white"
        >
          <Heart className="w-4 h-4" />
        </Button>
      </div>
      <CardContent className="p-6">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500 font-medium">{product.brand}</p>
            <h3
              className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors cursor-pointer"
              onClick={() => onProductClick(product)}
            >
              {product.name}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium ml-1">{product.rating}</span>
            </div>
            <span className="text-sm text-gray-500">
              ({product.reviews} reviews)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
          </div>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white"
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
