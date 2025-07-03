"use client";

import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ShoppingCart,
  User,
  UserCheck,
  Sparkles,
  Bot,
  LogOut,
  History,
  Menu,
  X,
} from "lucide-react";

interface HeaderProps {
  isLoggedIn: boolean;
  getTotalItems: () => number;
  onSearch: (query: string) => void;
}

export function Header({ isLoggedIn, getTotalItems, onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      navigate("/search");
    }
  };

  const handleLogout = async () => {
    await fetch("http://localhost:5000/api/logout", {
      method: "POST",
      credentials: "include",
    });
    window.location.reload();
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-pink-600">
              BeautyBloom
            </span>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search for products, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-gray-200 focus:border-pink-300 focus:ring-pink-200"
              />
            </form>
          </div>

          {/* Desktop Navigation Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              aria-label={isLoggedIn ? "Account" : "Login"}
              title={isLoggedIn ? "Account" : "Login"}
              onClick={() => navigate(isLoggedIn ? "/" : "/login")}
              className={
                isLoggedIn
                  ? "text-green-600 hover:text-green-700"
                  : "text-pink-600 hover:text-pink-700"
              }
            >
              {isLoggedIn ? (
                <UserCheck className="w-5 h-5" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate("/ai-recommendations")}
              title="AI Consultant"
            >
              <Bot className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate("/cart")}
              title="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs bg-pink-500">
                  {getTotalItems()}
                </Badge>
              )}
            </Button>
            {isLoggedIn && (
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => navigate("/history")}
                aria-label="Shopping History"
                title="Shopping History"
              >
                <History className="w-5 h-5" />
              </Button>
            )}
            {isLoggedIn && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            )}
          </div>

          {/* Mobile Hamburger Menu Button */}
          <button
            className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-300"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Open menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-pink-600" />
            ) : (
              <Menu className="w-6 h-6 text-pink-600" />
            )}
          </button>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mt-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search for products, brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border-gray-200 focus:border-pink-300 focus:ring-pink-200"
            />
          </form>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 bg-white rounded-lg shadow-lg border p-4 flex flex-col space-y-2 animate-fade-in z-50">
            <Button
              variant="ghost"
              size="icon"
              aria-label={isLoggedIn ? "Account" : "Login"}
              title={isLoggedIn ? "Account" : "Login"}
              onClick={() => {
                setMobileMenuOpen(false);
                navigate(isLoggedIn ? "/" : "/login");
              }}
              className={
                isLoggedIn
                  ? "text-green-600 hover:text-green-700 justify-start gap-2"
                  : "text-pink-600 hover:text-pink-700 justify-start gap-2"
              }
            >
              {isLoggedIn ? (
                <UserCheck className="w-5 h-5" />
              ) : (
                <User className="w-5 h-5" />
              )}
              <span className="md:hidden text-base font-medium">
                {isLoggedIn ? "Account" : "Login"}
              </span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative justify-start gap-2"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/ai-recommendations");
              }}
              title="AI Consultant"
            >
              <Bot className="w-5 h-5" />
              <span className="md:hidden text-base font-medium">
                AI Consultant
              </span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative justify-start gap-2"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/cart");
              }}
              title="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs bg-pink-500">
                  {getTotalItems()}
                </Badge>
              )}
              <span className="md:hidden text-base font-medium">Cart</span>
            </Button>
            {isLoggedIn && (
              <Button
                variant="ghost"
                size="icon"
                className="relative justify-start gap-2"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/history");
                }}
                aria-label="Shopping History"
                title="Shopping History"
              >
                <History className="w-5 h-5" />
                <span className="md:hidden text-base font-medium">History</span>
              </Button>
            )}
            {isLoggedIn && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                title="Logout"
                className="justify-start gap-2"
              >
                <LogOut className="w-5 h-5" />
                <span className="md:hidden text-base font-medium">Logout</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
