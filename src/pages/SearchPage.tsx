import type React from "react";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { ArrowLeft, Search, SlidersHorizontal } from "lucide-react";
import type { Product } from "../../types";
import { ProductCard } from "../components/ProductCard";
import { searchProducts } from "../../utils/search";

interface SearchPageProps {
  addToCart: (product: Product) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function SearchPage({
  addToCart,
  searchQuery,
  setSearchQuery,
}: SearchPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [filteredResults, setFilteredResults] = useState<Product[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: "all",
    category: "all",
    brand: "all",
    rating: "all",
  });
  const [sortBy, setSortBy] = useState("relevance");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch(() => setError("Failed to load products."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const results = searchProducts(products, searchQuery);
      setSearchResults(results);
      setFilteredResults(results);
    } else {
      setSearchResults(products);
      setFilteredResults(products);
    }
  }, [searchQuery, products]);

  useEffect(() => {
    let filtered = [...searchResults];

    // Apply filters
    if (filters.priceRange !== "all") {
      filtered = filtered.filter((product) => {
        switch (filters.priceRange) {
          case "under-25":
            return product.price < 25;
          case "25-50":
            return product.price >= 25 && product.price <= 50;
          case "50-75":
            return product.price >= 50 && product.price <= 75;
          case "over-75":
            return product.price > 75;
          default:
            return true;
        }
      });
    }

    if (filters.category !== "all") {
      filtered = filtered.filter(
        (product) => product.category === filters.category
      );
    }

    if (filters.brand !== "all") {
      filtered = filtered.filter((product) => product.brand === filters.brand);
    }

    if (filters.rating !== "all") {
      const minRating = Number.parseFloat(filters.rating);
      filtered = filtered.filter((product) => product.rating >= minRating);
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Keep original order for relevance
        break;
    }

    setFilteredResults(filtered);
  }, [searchResults, filters, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const results = searchProducts(products, searchQuery);
      setSearchResults(results);
      setFilteredResults(results);
    }
  };

  const clearFilters = () => {
    setFilters({
      priceRange: "all",
      category: "all",
      brand: "all",
      rating: "all",
    });
    setSortBy("relevance");
  };

  const getUniqueValues = (key: keyof Product) => {
    const values = new Set<string>();
    products.forEach((product) => {
      const value = product[key];
      if (value && typeof value === "string") {
        values.add(value);
      }
    });
    return Array.from(values);
  };

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-pink-700 mb-8">
          Search Products
        </h1>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="text-pink-600 hover:text-pink-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden border-pink-300 text-pink-600"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Search Bar */}
            <Card className="p-6 mb-8">
              <form onSubmit={handleSearch} className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search for products, brands, ingredients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border-gray-200 focus:border-pink-300 focus:ring-pink-200"
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-pink-600 hover:bg-pink-700 text-white"
                >
                  Search
                </Button>
              </form>
            </Card>

            <div className="grid lg:grid-cols-4 gap-8">
              {/* Filters Sidebar */}
              <div
                className={`lg:col-span-1 ${
                  showFilters ? "block" : "hidden lg:block"
                }`}
              >
                <Card className="p-6 sticky top-24">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Filters
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-pink-600"
                    >
                      Clear All
                    </Button>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Price Range
                    </h4>
                    <div className="space-y-2">
                      {[
                        { value: "all", label: "All Prices" },
                        { value: "under-25", label: "Under $25" },
                        { value: "25-50", label: "$25 - $50" },
                        { value: "50-75", label: "$50 - $75" },
                        { value: "over-75", label: "Over $75" },
                      ].map((option) => (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="radio"
                            name="priceRange"
                            value={option.value}
                            checked={filters.priceRange === option.value}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                priceRange: e.target.value,
                              })
                            }
                            className="mr-2 text-pink-600 focus:ring-pink-500"
                          />
                          <span className="text-sm text-gray-700">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Category */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Category</h4>
                    <select
                      value={filters.category}
                      onChange={(e) =>
                        setFilters({ ...filters, category: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                    >
                      <option value="all">All Categories</option>
                      {getUniqueValues("category").map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Brand */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Brand</h4>
                    <select
                      value={filters.brand}
                      onChange={(e) =>
                        setFilters({ ...filters, brand: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                    >
                      <option value="all">All Brands</option>
                      {getUniqueValues("brand").map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Rating */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Minimum Rating
                    </h4>
                    <select
                      value={filters.rating}
                      onChange={(e) =>
                        setFilters({ ...filters, rating: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                    >
                      <option value="all">Any Rating</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="4.0">4.0+ Stars</option>
                      <option value="3.5">3.5+ Stars</option>
                      <option value="3.0">3.0+ Stars</option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Sort By</h4>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="name">Name: A to Z</option>
                    </select>
                  </div>
                </Card>
              </div>

              {/* Search Results */}
              <div className="lg:col-span-3">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Search Results
                  </h2>
                  <p className="text-gray-600">
                    {filteredResults.length} product
                    {filteredResults.length !== 1 ? "s" : ""} found
                  </p>
                </div>

                {filteredResults.length === 0 ? (
                  <div className="text-center py-16">
                    <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your search terms or filters
                    </p>
                    <Button
                      onClick={clearFilters}
                      className="bg-pink-600 hover:bg-pink-700 text-white"
                    >
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResults.map((product) => (
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
            </div>
          </>
        )}
      </div>
    </div>
  );
}
