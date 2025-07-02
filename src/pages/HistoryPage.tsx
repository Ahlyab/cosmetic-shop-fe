import React, { useEffect, useState } from "react";

interface HistoryItem {
  id: number;
  product_name: string;
  product_image_url: string;
  product_price: number;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
}

export default function HistoryPage() {
  const [orders, setOrders] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/history", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch history");
        return res.json();
      })
      .then(setOrders)
      .catch(() => setError("Failed to load shopping history."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-pink-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-pink-700 mb-8">
          Shopping History
        </h1>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : orders.length === 0 ? (
          <div className="text-gray-600">No orders found.</div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow p-6 flex items-center"
              >
                <img
                  src={order.product_image_url || "/placeholder.svg"}
                  alt={order.product_name}
                  className="w-20 h-20 object-cover rounded-lg mr-6 border"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-lg">
                      {order.product_name}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mb-1 text-gray-700">
                    Price:{" "}
                    <span className="font-bold">
                      ${order.product_price?.toFixed(2)}
                    </span>
                  </div>
                  <div className="mb-1 text-gray-700">
                    Amount Paid:{" "}
                    <span className="font-bold">
                      ${order.amount?.toFixed(2)}{" "}
                      {order.currency?.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Status: {order.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Contact for complaints and refunds */}
        <div className="mt-12 text-center">
          <p className="text-gray-700 text-lg">
            For complaints or refund requests, please contact us at
            <a
              href="mailto:support@beautybloom.com"
              className="text-pink-600 font-semibold ml-1 hover:underline"
            >
              support@beautybloom.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
