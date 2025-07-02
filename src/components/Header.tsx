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
} from "lucide-react";

interface HeaderProps {
  isLoggedIn: boolean;
  getTotalItems: () => number;
  onSearch: (query: string) => void;
}

export function Header({ isLoggedIn, getTotalItems, onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
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

          {/* Search Bar */}
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

          {/* Navigation Icons */}
          <div className="flex items-center space-x-4">
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
            >
              <Bot className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate("/cart")}
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
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            )}
          </div>
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
      </div>
    </header>
  );
}
