import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import type { Product, CartItem } from "../types";
import { featuredProducts } from "../data/products";
import { Header } from "./components/Header";
import { HomePage } from "./pages/HomePage";
import { AIRecommendationsPage } from "./pages/AIRecommendationsPage";
import { CartPage } from "./pages/CartPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { SearchPage } from "./pages/SearchPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { ProductFormPage } from "./pages/ProductFormPage";
import { useAuth } from "./lib/auth";
import HistoryPage from "./pages/HistoryPage";
import "./App.css";

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, loading } = useAuth();

  const addToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-pink-600 text-xl font-bold">Loading...</span>
      </div>
    );
  }

  return (
    <Router>
      <div>
        <Header
          isLoggedIn={!!user}
          getTotalItems={getTotalItems}
          onSearch={handleSearch}
        />

        <Routes>
          <Route path="/" element={<HomePage addToCart={addToCart} />} />

          <Route
            path="/search"
            element={
              <SearchPage
                featuredProducts={featuredProducts}
                addToCart={addToCart}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            }
          />

          <Route
            path="/ai-recommendations"
            element={
              <AIRecommendationsPage
                featuredProducts={featuredProducts}
                addToCart={addToCart}
              />
            }
          />

          <Route
            path="/cart"
            element={
              <CartPage
                cartItems={cartItems}
                updateCartQuantity={updateCartQuantity}
                removeFromCart={removeFromCart}
                getTotalPrice={getTotalPrice}
                getTotalItems={getTotalItems}
              />
            }
          />

          <Route
            path="/product/:id"
            element={<ProductDetailPage addToCart={addToCart} />}
          />

          <Route path="/login" element={<LoginPage />} />

          <Route path="/signup" element={<SignupPage />} />

          <Route
            path="/admin"
            element={user && user.is_admin ? <AdminDashboardPage /> : null}
          />

          <Route
            path="/admin/product/new"
            element={user && user.is_admin ? <ProductFormPage /> : null}
          />

          <Route
            path="/admin/product/:id/edit"
            element={user && user.is_admin ? <ProductFormPage /> : null}
          />

          <Route path="/history" element={user ? <HistoryPage /> : null} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
