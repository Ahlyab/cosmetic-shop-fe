import React, { useEffect, useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";

interface HistoryItem {
  id: number;
  product_name: string;
  product_image_url: string;
  product_price: number;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  stripe_session_id: string;
}

interface OrderGroup {
  sessionId: string;
  created_at: string;
  items: HistoryItem[];
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

  // Group by stripe_session_id
  const groupedOrders: OrderGroup[] = React.useMemo(() => {
    const groups: { [sessionId: string]: OrderGroup } = {};
    for (const item of orders) {
      if (!groups[item.stripe_session_id]) {
        groups[item.stripe_session_id] = {
          sessionId: item.stripe_session_id,
          created_at: item.created_at,
          items: [],
        };
      }
      groups[item.stripe_session_id].items.push(item);
    }
    // Sort by created_at desc
    return Object.values(groups).sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [orders]);

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
        ) : groupedOrders.length === 0 ? (
          <div className="text-gray-600">No orders found.</div>
        ) : (
          <Accordion.Root type="multiple" className="space-y-4">
            {groupedOrders.map((order) => (
              <Accordion.Item
                key={order.sessionId}
                value={order.sessionId}
                className="bg-white rounded-lg shadow"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="w-full flex justify-between items-center px-6 py-4 bg-pink-50 hover:bg-pink-100 rounded-t-lg border-b border-pink-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold text-pink-700">
                        Order
                      </span>
                      <span className="inline-block bg-pink-100 text-pink-700 font-mono text-base font-semibold px-3 py-1 rounded-full shadow-sm border border-pink-200">
                        #{order.items[0]?.id}
                      </span>
                    </div>
                    <span className="text-gray-500 text-sm font-medium">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="px-6 pb-6 pt-2 border-t">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center">
                        <img
                          src={item.product_image_url || "/placeholder.svg"}
                          alt={item.product_name}
                          className="w-20 h-20 object-cover rounded-lg mr-6 border"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-lg">
                              {item.product_name}
                            </span>
                            <span className="text-gray-500 text-sm">
                              {new Date(item.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="mb-1 text-gray-700">
                            Price:{" "}
                            <span className="font-bold">
                              ${item.product_price?.toFixed(2)}
                            </span>
                          </div>
                          <div className="mb-1 text-gray-700">
                            Amount Paid:{" "}
                            <span className="font-bold">
                              ${item.amount?.toFixed(2)}{" "}
                              {item.currency?.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Status: {item.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
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
