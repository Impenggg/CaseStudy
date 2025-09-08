import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api, { ordersAPI } from '../services/api';

type Product = {
  id: number;
  name: string;
  price: number | string;
  image?: string | null;
};

type Customer = {
  id: number;
  name?: string;
  email?: string;
};

export type Order = {
  id: number;
  product_id: number;
  buyer_id: number;
  quantity: number;
  total_price: number | string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  tracking_number?: string | null;
  created_at?: string;
  product?: Product;
  buyer?: Customer;
};

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Resolve API origin (http://localhost:8000) from axios baseURL (http://localhost:8000/api)
  const API_ORIGIN = useMemo(() => (api.defaults.baseURL || '').replace(/\/api\/?$/, ''), []);
  const resolveUrl = (u?: string | null) => {
    if (!u) return '';
    if (u.startsWith('http://') || u.startsWith('https://')) return u;
    return `${API_ORIGIN}/${u.replace(/^\/?/, '')}`;
  };
  const PLACEHOLDER_IMG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="100%" height="100%" fill="#e5e7eb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="12" fill="#6b7280">No Image</text></svg>`
  );

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await ordersAPI.getOne(Number(id));
        if (!mounted) return;
        setOrder(data);
      } catch (e: any) {
        console.error('[OrderDetail] failed to fetch', e);
        setError(e?.response?.data?.message || e?.message || 'Failed to load order');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false };
  }, [id]);

  const statusBadge = (status?: string) => {
    const base = 'px-3 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'pending': return `${base} bg-yellow-100 text-yellow-800`;
      case 'processing': return `${base} bg-blue-100 text-blue-800`;
      case 'shipped': return `${base} bg-indigo-100 text-indigo-800`;
      case 'delivered': return `${base} bg-green-100 text-green-800`;
      case 'cancelled': return `${base} bg-red-100 text-red-800`;
      default: return `${base} bg-gray-100 text-gray-700`;
    }
  };

  return (
    <div className="min-h-screen bg-cordillera-olive/5 py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6 flex items-center gap-3 text-cordillera-olive">
          <button
            onClick={() => navigate(-1)}
            className="text-sm hover:underline"
          >
            ← Back
          </button>
          <span className="opacity-50">/</span>
          <Link to="/orders" className="text-sm hover:underline">My Orders</Link>
          {id && (<>
            <span className="opacity-50">/</span>
            <span className="text-sm">Order</span>
          </>)}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-serif text-cordillera-olive">Order</h1>
              {order?.created_at && (
                <p className="text-sm text-cordillera-olive/70 mt-1">Placed on {new Date(order.created_at).toLocaleString()}</p>
              )}
            </div>
            {order?.status && (
              <span className={statusBadge(order.status)}>{order.status}</span>
            )}
          </div>

          {loading && (
            <div className="text-center py-12 text-cordillera-olive/70">Loading order…</div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="inline-block bg-red-50 text-red-700 px-4 py-2 rounded">{error}</div>
            </div>
          )}

          {!loading && !error && order && (
            <div className="space-y-6">
              {/* Product summary */}
              <div className="flex gap-4 items-start">
                <div className="w-24 h-24 bg-cordillera-sage/20 rounded overflow-hidden flex items-center justify-center">
                  {(() => {
                    const raw = (order.product as any)?.image_url || (order.product as any)?.image || null;
                    const src = resolveUrl(raw);
                    const finalSrc = src || PLACEHOLDER_IMG;
                    return (
                      <img
                        src={finalSrc}
                        alt={order.product?.name || `Product #${order.product_id}`}
                        className="w-full h-full object-cover"
                        title={finalSrc}
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          if (target.src !== PLACEHOLDER_IMG) target.src = PLACEHOLDER_IMG;
                        }}
                      />
                    );
                  })()}
                </div>
                <div className="flex-1">
                  <Link to={`/product/${order.product?.id ?? order.product_id}`} className="font-medium text-cordillera-olive hover:underline">
                    {order.product?.name || `Product #${order.product_id}`}
                  </Link>
                  <div className="text-sm text-cordillera-olive/80 mt-1">
                    Qty: {order.quantity}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-cordillera-olive">₱{Number(order.total_price ?? 0).toLocaleString()}</div>
                </div>
              </div>

              {/* Shipping and Tracking */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-cordillera-olive/5 rounded-lg p-4">
                  <h3 className="font-medium text-cordillera-olive mb-2">Order Info</h3>
                  <div className="space-y-1 text-sm text-cordillera-olive/80">
                    <div>Status: <span className={statusBadge(order.status)}>{order.status}</span></div>
                    {order.tracking_number && (
                      <div>Tracking #: {order.tracking_number}</div>
                    )}
                  </div>
                </div>
                <div className="bg-cordillera-olive/5 rounded-lg p-4">
                  <h3 className="font-medium text-cordillera-olive mb-2">Customer</h3>
                  <div className="space-y-1 text-sm text-cordillera-olive/80">
                    {order.buyer?.name && <div>Name: {order.buyer.name}</div>}
                    {order.buyer?.email && <div>Email: {order.buyer.email}</div>}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Link to="/orders" className="text-cordillera-olive hover:underline">Back to My Orders</Link>
                <Link to="/marketplace" className="text-cordillera-gold hover:text-cordillera-gold/80">Continue Shopping →</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
