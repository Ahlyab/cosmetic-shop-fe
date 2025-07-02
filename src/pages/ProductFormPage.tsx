import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";

const categoryOptions = [
  "skincare",
  "makeup",
  "hair care",
  "wellness",
  "fragrance",
  "men's care",
];
const badgeOptions = [
  { label: "", value: "" },
  { label: "Best Seller", value: "Best Seller" },
  { label: "New", value: "New" },
  { label: "Premium", value: "Premium" },
  { label: "Organic", value: "Organic" },
];
const badgeColorOptions = [
  { label: "", value: "" },
  { label: "Orange", value: "bg-orange-500" },
  { label: "Green", value: "bg-green-500" },
  { label: "Purple", value: "bg-purple-500" },
  { label: "Red", value: "bg-red-100" },
  { label: "Dark Green", value: "bg-green-600" },
];

export function ProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    brand: "",
    price: "",
    originalPrice: "",
    image_url: "",
    badge: "",
    badgeColor: "",
    category: "",
    concerns: "",
    description: "",
    ingredients: "",
    howToUse: "",
    benefits: "",
    skinType: "",
  });

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      fetch(`http://localhost:5000/api/products/${id}`)
        .then((res) => res.json())
        .then((product) => {
          setForm({
            name: product.name || "",
            brand: product.brand || "",
            price: String(product.price ?? ""),
            originalPrice: String(product.originalPrice ?? ""),
            image_url: product.image_url || "",
            badge: product.badge || "",
            badgeColor: product.badgeColor || "",
            category: product.category || "",
            concerns: (product.concerns || []).join(", "),
            description: product.description || "",
            ingredients: (product.ingredients || []).join(", "),
            howToUse: product.howToUse || "",
            benefits: (product.benefits || []).join(", "),
            skinType: product.skinType || "",
          });
        })
        .catch(() => setError("Failed to fetch product"))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      brand: form.brand,
      price: parseFloat(form.price),
      originalPrice: form.originalPrice
        ? parseFloat(form.originalPrice)
        : undefined,
      image_url: form.image_url,
      badge: form.badge,
      badgeColor: form.badgeColor,
      category: form.category,
      concerns: form.concerns
        ? form.concerns.split(",").map((s) => s.trim())
        : [],
      description: form.description,
      ingredients: form.ingredients
        ? form.ingredients.split(",").map((s) => s.trim())
        : [],
      howToUse: form.howToUse,
      benefits: form.benefits
        ? form.benefits.split(",").map((s) => s.trim())
        : [],
      skinType: form.skinType,
    };
    setError("");
    setLoading(true);
    const url = isEdit
      ? `http://localhost:5000/api/admin/products/${id}`
      : "http://localhost:5000/api/admin/products";
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    setLoading(false);
    if (res.ok) {
      navigate("/admin");
    } else {
      setError("Failed to save product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-xl w-full p-8">
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-pink-700">
            {isEdit ? "Edit Product" : "Add Product"}
          </h2>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Brand</label>
                <Input
                  name="brand"
                  value={form.brand}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <Input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Original Price
                </label>
                <Input
                  name="originalPrice"
                  type="number"
                  value={form.originalPrice}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Image URL
                </label>
                <Input
                  name="image_url"
                  value={form.image_url}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Badge</label>
                <select
                  name="badge"
                  value={form.badge}
                  onChange={handleSelectChange}
                  className="w-full border rounded px-2 py-1"
                >
                  {badgeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Badge Color
                </label>
                <select
                  name="badgeColor"
                  value={form.badgeColor}
                  onChange={handleSelectChange}
                  className="w-full border rounded px-2 py-1"
                >
                  {badgeColorOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleSelectChange}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">Select</option>
                  {categoryOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Concerns (comma separated)
                </label>
                <Input
                  name="concerns"
                  value={form.concerns}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Ingredients (comma separated)
                </label>
                <Input
                  name="ingredients"
                  value={form.ingredients}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  How to Use
                </label>
                <textarea
                  name="howToUse"
                  value={form.howToUse}
                  onChange={handleFormChange}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Benefits (comma separated)
                </label>
                <Input
                  name="benefits"
                  value={form.benefits}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Skin Type
                </label>
                <Input
                  name="skinType"
                  value={form.skinType}
                  onChange={handleFormChange}
                />
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <div className="flex space-x-2">
                <Button
                  type="submit"
                  className="bg-pink-600 hover:bg-pink-700 text-white"
                  disabled={loading}
                >
                  Save
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate("/admin")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
