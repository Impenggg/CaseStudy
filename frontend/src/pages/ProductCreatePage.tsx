import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackLink from '@/components/BackLink';
import { productsAPI } from '@/services/api';

const ProductCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    cultural_background: '',
    materials: '', // comma-separated
    care_instructions: '',
    stock_quantity: '0',
    tags: '', // comma-separated
  });
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setImage(f);
  };

  const validate = (): string | null => {
    if (!form.name.trim()) return 'Name is required';
    const price = Number(form.price);
    if (!Number.isFinite(price) || price < 0) return 'Valid price is required';
    if (!form.category.trim()) return 'Category is required';
    if (!form.description.trim()) return 'Description is required';
    if (!form.care_instructions.trim()) return 'Care instructions are required';
    const stock = Number(form.stock_quantity);
    if (!Number.isInteger(stock) || stock < 0) return 'Stock quantity must be a non-negative integer';
    if (!image) return 'Product image is required';
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) { setError(v); return; }
    if (!image) { setError('Product image is required'); return; }

    try {
      setSubmitting(true);

      const materials = form.materials
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      const tags = form.tags
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const created = await productsAPI.createWithImage({
        name: form.name.trim(),
        price: Number(form.price),
        category: form.category.trim(),
        description: form.description.trim(),
        cultural_background: form.cultural_background.trim() || undefined,
        materials,
        care_instructions: form.care_instructions.trim(),
        stock_quantity: Number(form.stock_quantity),
        tags: tags.length ? tags : undefined,
        image,
      });

      // Navigate to product detail if id exists, else to marketplace
      if (created?.id) {
        navigate(`/product/${created.id}`);
      } else {
        navigate('/marketplace');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to create product';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cordillera-olive text-cordillera-cream py-10">
      <div className="max-w-3xl mx-auto bg-cordillera-olive/40 border border-cordillera-cream/20 p-6">
        <div className="mb-4">
          <BackLink
            to="/marketplace"
            variant="dark"
            className="bg-cordillera-gold text-cordillera-olive px-4 py-1.5 hover:bg-cordillera-gold/90"
          >
            ← Back to Marketplace
          </BackLink>
        </div>
        <h1 className="text-3xl font-serif mb-6">Create Product</h1>
        {/* Removed signed-in role display per request */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/40 border border-red-700 text-red-100">{error}</div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Name</label>
            <input name="name" value={form.name} onChange={onChange} className="w-full p-2 bg-cordillera-cream text-cordillera-olive" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1">Price</label>
              <input name="price" value={form.price} onChange={onChange} className="w-full p-2 bg-cordillera-cream text-cordillera-olive" />
            </div>
            <div>
              <label className="block mb-1">Category</label>
              <input name="category" value={form.category} onChange={onChange} className="w-full p-2 bg-cordillera-cream text-cordillera-olive" />
            </div>
            <div>
              <label className="block mb-1">Stock Quantity</label>
              <input name="stock_quantity" value={form.stock_quantity} onChange={onChange} className="w-full p-2 bg-cordillera-cream text-cordillera-olive" />
            </div>
          </div>
          <div>
            <label className="block mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={onChange} rows={4} className="w-full p-2 bg-cordillera-cream text-cordillera-olive" />
          </div>
          <div>
            <label className="block mb-1">Cultural Background (optional)</label>
            <input name="cultural_background" value={form.cultural_background} onChange={onChange} className="w-full p-2 bg-cordillera-cream text-cordillera-olive" />
          </div>
          <div>
            <label className="block mb-1">Materials (comma-separated)</label>
            <input name="materials" value={form.materials} onChange={onChange} className="w-full p-2 bg-cordillera-cream text-cordillera-olive" />
          </div>
          <div>
            <label className="block mb-1">Care Instructions</label>
            <textarea name="care_instructions" value={form.care_instructions} onChange={onChange} rows={3} className="w-full p-2 bg-cordillera-cream text-cordillera-olive" />
          </div>
          {/* Dimensions removed by request */}
          <div>
            <label className="block mb-1">Tags (comma-separated)</label>
            <input name="tags" value={form.tags} onChange={onChange} className="w-full p-2 bg-cordillera-cream text-cordillera-olive" />
          </div>
          {/* Removed 'Featured' checkbox; featuring is admin-controlled */}
          <div>
            <label className="block mb-1">Product Image</label>
            <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp,image/jfif" onChange={onFile} className="w-full" />
            <p className="text-xs text-cordillera-cream/70 mt-1">Max 4MB. Allowed: jpg, jpeg, png, webp, jfif.</p>
          </div>
          <div className="pt-2">
            <button disabled={submitting} className="bg-cordillera-gold text-cordillera-olive px-6 py-2 font-medium hover:bg-cordillera-gold/90 disabled:opacity-60">
              {submitting ? 'Creating…' : 'Create Product'}
            </button>
            <button type="button" onClick={() => navigate('/marketplace')} className="ml-3 px-6 py-2 border border-cordillera-cream/40 hover:bg-cordillera-cream/10">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductCreatePage;
