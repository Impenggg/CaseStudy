import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import BackLink from '@/components/BackLink';
import { productsAPI } from '@/services/api';
import type { Product } from '@/types';

const ProductEditPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [materials, setMaterials] = useState<string>('');
  const [care, setCare] = useState('');
  const [stock, setStock] = useState<number | ''>('');
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    (async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const p = await productsAPI.getById(Number(id));
        setProduct(p);
        // Pre-fill form
        setName(p.name || '');
        setPrice((p as any).price ?? '');
        setCategory(p.category || '');
        setDescription((p as any).description || '');
        const mats = Array.isArray((p as any).materials) ? (p as any).materials.join(', ') : '';
        setMaterials(mats);
        setCare((p as any).care_instructions || '');
        setStock((p as any).stock_quantity ?? (p as any).stockQuantity ?? '');
        setFeatured(Boolean((p as any).featured));
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const disabled = useMemo(() => saving || loading, [saving, loading]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      setSaving(true);
      setError(null);
      const payload: any = {
        name,
        price: typeof price === 'string' ? undefined : price,
        category,
        description,
        care_instructions: care,
        featured,
      };
      if (materials.trim()) {
        payload.materials = materials.split(',').map(m => m.trim()).filter(Boolean);
      }
      if (stock !== '') payload.stock_quantity = stock;

      const updated = await productsAPI.update(Number(id), payload);
      navigate(`/products/${updated.id}`);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-heritage-100">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-4">
          <BackLink to="/my-products">Back to My Products</BackLink>
        </div>
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-serif text-heritage-800">Edit Product</h1>
          <p className="text-heritage-800/70">Update your product details</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded border border-error/30 text-error-dark bg-error/10">{error}</div>
        )}

        {loading || !product ? (
          <div className="text-heritage-800">Loading…</div>
        ) : (
          <form onSubmit={onSubmit} className="bg-white border border-heritage-800/10 rounded p-4 space-y-4">
            <div>
              <label className="block text-sm text-heritage-800/70 mb-1">Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full border px-3 py-2 rounded" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-heritage-800/70 mb-1">Price</label>
                <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))} className="w-full border px-3 py-2 rounded" required />
              </div>
              <div>
                <label className="block text-sm text-heritage-800/70 mb-1">Stock Quantity</label>
                <input type="number" value={stock} onChange={e => setStock(e.target.value === '' ? '' : Number(e.target.value))} className="w-full border px-3 py-2 rounded" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-heritage-800/70 mb-1">Category</label>
              <input value={category} onChange={e => setCategory(e.target.value)} className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label className="block text-sm text-heritage-800/70 mb-1">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border px-3 py-2 rounded min-h-[120px]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-heritage-800/70 mb-1">Materials (comma-separated)</label>
                <input value={materials} onChange={e => setMaterials(e.target.value)} className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm text-heritage-800/70 mb-1">Care Instructions</label>
                <input value={care} onChange={e => setCare(e.target.value)} className="w-full border px-3 py-2 rounded" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input id="featured" type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} />
              <label htmlFor="featured" className="text-heritage-800/80">Featured</label>
            </div>

            <div className="flex items-center gap-3 justify-end pt-2">
              <Link to={`/products/${product.id}`} className="px-4 py-2 rounded border border-heritage-800/30 text-heritage-800 hover:bg-heritage-800/5">Cancel</Link>
              <button type="submit" disabled={disabled} className="px-4 py-2 rounded bg-heritage-800 text-white hover:bg-heritage-800/90 disabled:opacity-50">
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductEditPage;
