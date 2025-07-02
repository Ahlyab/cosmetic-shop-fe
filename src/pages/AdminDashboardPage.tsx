import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  Pencil,
  Trash2,
  RotateCcw,
  Plus,
  Search,
  Package,
  CreditCard,
  Calendar,
  User,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  image_url?: string;
  badge?: string;
  badgeColor?: string;
  category?: string;
  concerns?: string[];
  description?: string;
  ingredients?: string[];
  howToUse?: string;
  benefits?: string[];
  skinType?: string;
  created_at?: string;
}

interface Transaction {
  id: number;
  user_email: string;
  product_name: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  refunded_at: string | null;
  refund_id: string | null;
  product_image_url?: string;
  product_category?: string;
  product_brand?: string;
  product_badge?: string;
}

export function AdminDashboardPage() {
  const [tab, setTab] = useState<"products" | "transactions">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refundLoading, setRefundLoading] = useState<number | null>(null);
  const [refundError, setRefundError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const navigate = useNavigate();

  useEffect(() => {
    if (tab === "products") {
      setLoading(true);
      fetch("http://localhost:5000/api/products")
        .then((res) => res.json())
        .then(setProducts)
        .catch(() => setError("Failed to fetch products"))
        .finally(() => setLoading(false));
    } else if (tab === "transactions") {
      setLoading(true);
      fetch("http://localhost:5000/api/admin/transactions", {
        credentials: "include",
      })
        .then((res) => res.json())
        .then(setTransactions)
        .catch(() => setError("Failed to fetch transactions"))
        .finally(() => setLoading(false));
    }
  }, [tab]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this product?")) return;
    const res = await fetch(`http://localhost:5000/api/admin/products/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) setProducts(products.filter((p) => p.id !== id));
  };

  const handleEdit = (product: Product) => {
    navigate(`/admin/product/${product.id}/edit`);
  };

  const handleAdd = () => {
    navigate("/admin/product/new");
  };

  const handleRefund = async (transactionId: number) => {
    setRefundLoading(transactionId);
    setRefundError(null);
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/transactions/${transactionId}/refund`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Refund failed");
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === transactionId
            ? {
                ...t,
                status: "refunded",
                refunded_at: new Date().toISOString(),
                refund_id: data.refund_id,
              }
            : t
        )
      );
    } catch (err: unknown) {
      let message = "Refund failed";
      if (err instanceof Error) message = err.message;
      setRefundError(message);
    } finally {
      setRefundLoading(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "succeeded":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "refunded":
        return <RotateCcw className="w-4 h-4 text-blue-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses =
      "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1";
    switch (status.toLowerCase()) {
      case "completed":
      case "succeeded":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "refunded":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "failed":
        return `${baseClasses} bg-red-100 text-red-800`;
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalTransactions: transactions.length,
    totalRevenue: transactions.reduce(
      (sum, t) => (t.status !== "refunded" ? sum + t.amount : sum),
      0
    ),
    refundedCount: transactions.filter((t) => t.status === "refunded").length,
    completedCount: transactions.filter(
      (t) => t.status === "completed" || t.status === "succeeded"
    ).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-500 mt-1">
                Manage your products and transactions
              </p>
            </div>
            <div className="flex space-x-2 bg-gray-50 rounded-lg p-1 shadow-sm border">
              <Button
                variant={tab === "products" ? "default" : "ghost"}
                className={`flex items-center gap-2 transition-colors duration-150 font-semibold shadow-sm ${
                  tab === "products"
                    ? "bg-pink-600 text-white hover:bg-pink-700 hover:text-white"
                    : "bg-transparent text-gray-700 hover:text-pink-600"
                }`}
                onClick={() => setTab("products")}
              >
                <Package className="w-4 h-4" />
                Products
              </Button>
              <Button
                variant={tab === "transactions" ? "default" : "ghost"}
                className={`flex items-center gap-2 transition-colors duration-150 font-semibold shadow-sm ${
                  tab === "transactions"
                    ? "bg-pink-600 text-white hover:bg-pink-700 hover:text-white"
                    : "bg-transparent text-gray-700 hover:text-pink-600"
                }`}
                onClick={() => setTab("transactions")}
              >
                <CreditCard className="w-4 h-4" />
                Transactions
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          </div>
        ) : error ? (
          <Card className="p-8 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error Loading Data
            </h3>
            <p className="text-red-600">{error}</p>
          </Card>
        ) : tab === "products" ? (
          // Products Tab
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Products Management
              </h2>
              <Button
                className="bg-pink-600 hover:bg-pink-700 text-white flex items-center gap-2"
                onClick={handleAdd}
              >
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </div>

            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-16 w-16">
                              {product.image_url ? (
                                <img
                                  className="h-16 w-16 rounded-lg object-cover"
                                  src={product.image_url}
                                  alt={product.name}
                                />
                              ) : (
                                <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center">
                                  <Package className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {product.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            <div className="font-medium">
                              {product.brand || "No Brand"}
                            </div>
                            <div className="text-gray-500">
                              {product.category || "Uncategorized"}
                            </div>
                            {product.badge ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800 mt-1">
                                {product.badge}
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ${product.price}
                          </div>
                          {product.originalPrice &&
                            product.originalPrice !== product.price && (
                              <div className="text-sm text-gray-500 line-through">
                                ${product.originalPrice}
                              </div>
                            )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(product)}
                              className="flex items-center gap-1"
                            >
                              <Pencil className="w-3 h-3" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(product.id)}
                              className="flex items-center gap-1 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        ) : (
          // Transactions Tab
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CreditCard className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Transactions
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.totalTransactions}
                      </dd>
                    </dl>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Revenue
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        ${stats.totalRevenue.toFixed(2)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-8 w-8 text-emerald-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Completed
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.completedCount}
                      </dd>
                    </dl>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <RotateCcw className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Refunded
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.refundedCount}
                      </dd>
                    </dl>
                  </div>
                </div>
              </Card>
            </div>

            {/* Filters */}
            <Card className="p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search transactions..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full sm:w-48">
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="succeeded">Succeeded</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Transactions Table */}
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTransactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{transaction.id}
                          </div>
                          {transaction.refund_id && (
                            <div className="text-xs text-gray-500">
                              Refund: {transaction.refund_id}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            <div className="text-sm text-gray-900 break-all">
                              {transaction.user_email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 mr-3">
                              {transaction.product_image_url ? (
                                <img
                                  className="h-10 w-10 rounded object-cover"
                                  src={transaction.product_image_url}
                                  alt={transaction.product_name}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
                                  <Package className="h-4 w-4 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {transaction.product_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {transaction.product_brand} •{" "}
                                {transaction.product_category}
                              </div>
                              {transaction.product_badge && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                                  {transaction.product_badge}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.amount}{" "}
                            {transaction.currency.toUpperCase()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusBadge(transaction.status)}>
                            {getStatusIcon(transaction.status)}
                            {transaction.status.charAt(0).toUpperCase() +
                              transaction.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            {new Date(
                              transaction.created_at
                            ).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(
                              transaction.created_at
                            ).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            {transaction.status !== "refunded" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRefund(transaction.id)}
                                disabled={refundLoading === transaction.id}
                                className="flex items-center gap-1 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                              >
                                {refundLoading === transaction.id ? (
                                  <div className="animate-spin">
                                    <RotateCcw className="w-3 h-3" />
                                  </div>
                                ) : (
                                  <RotateCcw className="w-3 h-3" />
                                )}
                                Refund
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {refundError && (
                <div className="px-6 py-4 bg-red-50 border-t border-red-200">
                  <div className="flex items-center">
                    <XCircle className="h-5 w-5 text-red-400 mr-2" />
                    <span className="text-sm text-red-600">{refundError}</span>
                  </div>
                </div>
              )}

              {filteredTransactions.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No transactions found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your search or filter criteria."
                      : "No transactions have been created yet."}
                  </p>
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
