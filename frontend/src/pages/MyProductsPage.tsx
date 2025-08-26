import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BackLink from '@/components/BackLink';
import api, { productsAPI } from '@/services/api';
import type { Product } from '@/types';

const MyProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  // Resolve image URL helper and placeholder
  const API_ORIGIN = useMemo(() => (api.defaults.baseURL || '').replace(/\/api\/?$/, ''), []);
  const resolveImageUrl = (image?: string) => {
    if (!image) return '';
    if (image.startsWith('http://') || image.startsWith('https://')) return image;
    return `${API_ORIGIN}/${image.replace(/^\/?/, '')}`;
  };
  const PLACEHOLDER_IMG = 'https://via.placeholder.com/48?text=%20';

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await productsAPI.getMyProducts();
      const data: Product[] = res?.data || res || [];
      setProducts(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load your products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const totalActive = useMemo(() => products.length, [products]);

  const onDelete = async (id: number) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    try {
      await productsAPI.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <div className="min-h-screen bg-cordillera-cream">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Return Button */}
        <div className="mb-4">
          <BackLink to="/marketplace">Back to Marketplace</BackLink>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif text-cordillera-olive">My Products</h1>
            <p className="text-cordillera-olive/70">Manage your listings. Total: <span className="font-medium text-cordillera-olive">{totalActive}</span></p>
          </div>
          <Link to="/create-product" className="bg-cordillera-olive text-cordillera-cream px-4 py-2 rounded hover:bg-cordillera-olive/90">Create Product</Link>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded border border-red-200 text-red-700 bg-red-50">{error}</div>
        )}

        {loading ? (
          <div className="text-cordillera-olive">Loading…</div>
        ) : products.length === 0 ? (
          <div className="text-cordillera-olive/70">You have no products yet. Create your first one.</div>
        ) : (
          <div className="overflow-x-auto bg-white border border-cordillera-olive/10 rounded">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-cordillera-olive/70 border-b border-cordillera-olive/10">
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b last:border-b-0 border-cordillera-olive/10">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            resolveImageUrl(
                              (p as any).image || (p as any).image_url || (p as any).image_path || (p as any).imagePath || (p as any).thumbnail || ''
                            ) || PLACEHOLDER_IMG
                          }
                          alt={p.name}
                          className="w-12 h-12 object-cover rounded"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            if (target.src !== PLACEHOLDER_IMG) target.src = PLACEHOLDER_IMG;
                          }}
                        />
                        <div>
                          <Link to={`/product/${p.id}`} className="text-cordillera-olive font-medium hover:underline">{p.name}</Link>
                          <div className="text-xs text-cordillera-olive/60 line-clamp-1">{p.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-cordillera-olive">₱{Number(p.price).toFixed(2)}</td>
                    <td className="px-4 py-3 text-cordillera-olive">{(p as any).stock_quantity ?? (p as any).stockQuantity ?? '-'}</td>
                    <td className="px-4 py-3 text-cordillera-olive/80">{p.category}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => navigate(`/products/${p.id}/edit`)} className="px-3 py-1 rounded border border-cordillera-olive/30 text-cordillera-olive hover:bg-cordillera-olive/5">Edit</button>
                        <button onClick={() => onDelete(p.id)} className="px-3 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProductsPage;
