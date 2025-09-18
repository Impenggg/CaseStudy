import React, { useState, useEffect } from 'react';
import { triggerAction } from '../lib/uiActions';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CartModal from '../components/CartModal';
import { useAuth } from '../contexts/AuthContext';
import BackLink from '@/components/BackLink';
import api, { productsAPI, favoritesAPI } from '@/services/api';
 

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  culturalBackground: string;
  materials: string[];
  careInstructions: string[];
  artisan: string;
  gallery: string[];
  stockQuantity?: number;
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, requireAuth, user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState('story');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [related, setRelated] = useState<Array<{ id: number; name: string; price: number; image?: string }>>([]);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);

  // Helper: resolve relative URLs coming from the API
  const API_ORIGIN = (api.defaults.baseURL || '').replace(/\/api\/?$/, '');
  const resolveUrl = React.useCallback((u?: string | null) => {
    if (!u) return '';
    if (u.startsWith('http://') || u.startsWith('https://')) return u;
    return `${API_ORIGIN}/${u.replace(/^\/?/, '')}`;
  }, [API_ORIGIN]);

  // Local cart state (shared via localStorage with marketplace)
  interface CartItem { id: number; name: string; price: number; image: string; quantity: number; stock?: number }
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem('marketplace_cart');
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!id) return;
      setIsLoading(true);
      setLoadError(null);
      try {
        const data = await productsAPI.getById(Number(id));
        // Resolve image URLs if backend returns relative paths
        const gallery = Array.isArray((data as any).images) ? (data as any).images.map(resolveUrl).filter(Boolean) : [];
        const careStr = (data as any).care_instructions as string | undefined;
        const careInstructions = careStr
          ? careStr.split(/\r?\n|;|,/).map(s => s.trim()).filter(Boolean)
          : [];
        const mapped: Product = {
          id: data.id,
          name: data.name,
          price: Number((data as any).price ?? 0),
          image: resolveUrl((data as any).image),
          description: (data as any).description || '',
          category: (data as any).category || 'general',
          culturalBackground: (data as any).cultural_background || '',
          materials: Array.isArray((data as any).materials) ? (data as any).materials : [],
          careInstructions,
          artisan: (data as any).seller?.name || 'Artisan',
          gallery,
          stockQuantity: typeof (data as any).stock_quantity === 'number' ? (data as any).stock_quantity : undefined,
        };
        if (mounted) setProduct(mapped);
      } catch (e) {
        console.error('[ProductDetail] Fetch failed', e);
        if (mounted) {
          setProduct(null);
          setLoadError('not_found');
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  // Initialize favorite state when authenticated and product is loaded
  useEffect(() => {
    let active = true;
    (async () => {
      if (!isAuthenticated || !product?.id) { setIsFavorited(false); return; }
      try {
        const favs = await favoritesAPI.list();
        if (!active) return;
        setIsFavorited(Array.isArray(favs) && favs.some((f) => f.product_id === product.id));
      } catch (e) {
        // ignore
      }
    })();
    return () => { active = false; };
  }, [isAuthenticated, product?.id]);

  // Resume pending favorite after login
  useEffect(() => {
    (async () => {
      if (!isAuthenticated || !product?.id) return;
      try {
        const pending = sessionStorage.getItem('pending_favorite_product_id');
        if (pending && Number(pending) === product.id) {
          const res = await favoritesAPI.toggle(product.id);
          setIsFavorited(Boolean(res?.favorited));
          sessionStorage.removeItem('pending_favorite_product_id');
        }
      } catch {}
    })();
  }, [isAuthenticated, product?.id]);

  const toggleFavorite = async () => {
    if (!product) return;
    if (!isAuthenticated) {
      try { sessionStorage.setItem('pending_favorite_product_id', String(product.id)); } catch {}
      requireAuth('/login');
      return;
    }
    const prev = isFavorited;
    setIsFavorited(!prev); // optimistic
    try {
      const res = await favoritesAPI.toggle(product.id);
      setIsFavorited(Boolean(res?.favorited));
    } catch (e) {
      setIsFavorited(prev);
    }
  };

  // Determine single image to display: prefer first of gallery, else main image
  const displayImage: string | '' = React.useMemo(() => {
    if (!product) return '';
    const g = Array.isArray(product.gallery) ? product.gallery.filter(Boolean) : [];
    if (g.length > 0) return g[0];
    return product.image || '';
  }, [product]);

  // Ensure we always render a non-empty src with a graceful fallback
  const fallbackImage = React.useMemo(() => `https://source.unsplash.com/800x800/?${encodeURIComponent(product?.category || 'handicraft')}`,[product?.category]);
  const [imageSrc, setImageSrc] = React.useState<string>(displayImage || '');
  useEffect(() => {
    setImageSrc(displayImage || fallbackImage);
  }, [displayImage, fallbackImage]);

  // Reconcile cart item with latest product stock when product loads/changes
  useEffect(() => {
    if (!product) return;
    const stock = typeof product.stockQuantity === 'number' ? product.stockQuantity : undefined;
    if (stock === undefined) return;
    setCartItems((prev) => {
      let changed = false;
      const next = prev.map((it) => {
        if (it.id !== product.id) return it;
        const clampedQty = Math.min(it.quantity, Math.max(0, stock));
        const updated = { ...it, stock, quantity: clampedQty };
        if (updated.quantity !== it.quantity || updated.stock !== it.stock) changed = true;
        return updated;
      });
      if (changed) {
        try { localStorage.setItem('marketplace_cart', JSON.stringify(next)); } catch {}
      }
      return next;
    });
  }, [product?.stockQuantity, product?.id]);

  useEffect(() => {
    localStorage.setItem('marketplace_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // No carousel behavior: static image only

  const addToCart = (qty: number = 1) => {
    if (!product) return;
    // Block artisans and admins from adding to cart
    const role = user && (user as any).role;
    if (role === 'artisan' || role === 'admin') {
      triggerAction('Restricted role attempted to add to cart on ProductDetailPage');
      return;
    }
    try {
      const key = 'marketplace_cart';
      const raw = localStorage.getItem(key);
      const cart: Array<{ id: number; name: string; price: number; image: string; quantity: number; stock?: number }>
        = raw ? JSON.parse(raw) : [];
      const existing = cart.find((p) => p.id === product.id);
      const stock = typeof product.stockQuantity === 'number' ? product.stockQuantity : undefined;
      if (existing) {
        const nextQty = stock !== undefined ? Math.min(existing.quantity + qty, stock) : (existing.quantity + qty);
        existing.quantity = nextQty;
        if (stock !== undefined) existing.stock = stock;
      } else {
        const initialQty = stock !== undefined ? Math.min(qty, stock) : qty;
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.gallery?.[0] || product.image,
          quantity: initialQty,
          stock,
        });
      }
      localStorage.setItem(key, JSON.stringify(cart));
      // Update local state for UI and badge
      setCartItems(cart);
      triggerAction(`Add ${qty} ${product.name} to cart (Details)`);
    } catch (e) {
      console.error('Failed to add to cart', e);
    }
  };

  // Cart item operations
  const incrementItem = (id: number) => {
    const stock = product && product.id === id && typeof product.stockQuantity === 'number' ? product.stockQuantity : undefined;
    setCartItems((prev) => {
      const next = prev.map((p) => {
        if (p.id !== id) return p;
        const nextQty = stock !== undefined ? Math.min(p.quantity + 1, stock) : p.quantity + 1;
        return { ...p, quantity: nextQty };
      });
      localStorage.setItem('marketplace_cart', JSON.stringify(next));
      return next;
    });
  };

  const decrementItem = (id: number) => {
    setCartItems((prev) => {
      const next = prev
        .map((p) => (p.id === id ? { ...p, quantity: Math.max(1, p.quantity - 1) } : p))
        .filter((p) => p.quantity > 0);
      localStorage.setItem('marketplace_cart', JSON.stringify(next));
      return next;
    });
  };

  const removeItem = (id: number) => {
    setCartItems((prev) => {
      const next = prev.filter((p) => p.id !== id);
      localStorage.setItem('marketplace_cart', JSON.stringify(next));
      return next;
    });
  };

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.quantity * i.price, 0);

  const handleCheckout = () => {
    // If not logged in, trigger auth and remember intent
    if (!isAuthenticated) {
      sessionStorage.setItem('resume_checkout', '1');
      requireAuth('/login');
      return;
    }
    // Close cart modal here and navigate to marketplace which owns the checkout modal
    setIsCartOpen(false);
    sessionStorage.setItem('resume_checkout', '1');
    navigate('/marketplace');
  };

  // Fetch related products from same category when product loads
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!product?.category) { setRelated([]); return; }
      try {
        const res = await productsAPI.getAll({ category: product.category, per_page: 6 });
        const items: any[] = Array.isArray((res as any).data) ? (res as any).data : (Array.isArray(res) ? (res as any) : []);
        const mapped = items
          .filter((p: any) => p && p.id !== product.id)
          .slice(0, 3)
          .map((p: any) => {
            const rawImg: string | undefined = p.image || p.image_url || p.thumbnail || (Array.isArray(p.images) ? p.images[0] : undefined);
            const img = resolveUrl(rawImg);
            return { id: p.id, name: p.name, price: Number(p.price ?? 0), image: img };
          });
        if (mounted) setRelated(mapped);
      } catch (err) {
        if (mounted) setRelated([]);
      }
    })();
    return () => { mounted = false; };
  }, [product?.id, product?.category]);

  if (isLoading) {
    return <div className="min-h-screen bg-cordillera-olive flex items-center justify-center">
      <div className="text-cordillera-cream">Loading...</div>
    </div>;
  }

  if (loadError === 'not_found' || !product) {
    return (
      <div className="min-h-screen bg-cordillera-olive flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-serif text-cordillera-cream mb-4">Product Not Found</h1>
          <button onClick={() => navigate('/marketplace')} className="text-cordillera-gold hover:text-cordillera-gold/80 transition-colors">Back to Marketplace</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cordillera-cream">
      {/* Floating Cart Button (hidden for admin) */}
      {!(user && (user as any).role === 'admin') && (
      <div className="fixed right-6 bottom-6 z-50">
        <button
          onClick={() => setIsCartOpen(true)}
          className="group relative bg-gradient-to-r from-cordillera-gold to-cordillera-gold/90 text-cordillera-olive px-6 py-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 flex items-center gap-3 border-2 border-cordillera-olive/20 hover:border-cordillera-olive transform hover:scale-110 backdrop-blur-sm"
          aria-label="Open cart"
        >
          <div className="relative">
            <svg className="w-6 h-6 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9m-6-9v9" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse shadow-lg border border-white">
                {cartCount}
              </span>
            )}
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-bold tracking-wide">Cart</span>
            <span className="text-xs opacity-90 font-medium">
              {cartCount === 0 ? 'Empty' : `${cartCount} item${cartCount !== 1 ? 's' : ''}`}
            </span>
          </div>
          {cartTotal > 0 && (
            <div className="ml-2 pl-3 border-l border-cordillera-olive/30">
              <span className="text-sm font-bold text-cordillera-olive">₱{cartTotal.toLocaleString()}</span>
            </div>
          )}
        </button>
      </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center text-sm text-cordillera-olive/60">
            <Link to="/" className="hover:text-cordillera-olive">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/marketplace" className="hover:text-cordillera-olive">Marketplace</Link>
            <span className="mx-2">/</span>
            <span className="text-cordillera-olive">{product.name}</span>
          </div>
        </nav>

        {/* Return Button */}
        <div className="mb-6">
          <BackLink to="/marketplace">Back to Marketplace</BackLink>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Static product image (no carousel) */}
          <div className="space-y-6">
            <div className="relative aspect-square overflow-hidden border-2 border-cordillera-gold/30 bg-white shadow-lg">
              <img
                src={imageSrc || fallbackImage}
                onError={() => setImageSrc(fallbackImage)}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: Product info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-serif text-cordillera-cream bg-cordillera-olive px-6 py-3 mb-4">
                {product.name}
              </h1>
              <p className="text-lg text-cordillera-olive/70 mb-6 leading-relaxed">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl font-light text-cordillera-gold">
                  ₱{product.price.toLocaleString()}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={toggleFavorite}
                    className="group inline-flex items-center justify-center w-10 h-10 rounded-full border border-cordillera-olive/30 hover:border-cordillera-gold transition-colors bg-white"
                    aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                    title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={isFavorited ? 'currentColor' : 'none'}
                      className={`w-5 h-5 ${isFavorited ? 'text-red-500' : 'text-cordillera-olive'} group-hover:text-red-500`}
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                  </button>
                  <span className="text-sm uppercase tracking-wider text-cordillera-olive/50 bg-cordillera-sage px-3 py-1">
                    {product.category}
                  </span>
                </div>
              </div>
              {typeof product.stockQuantity === 'number' && (
                <div className="mb-6 text-sm">
                  {product.stockQuantity === 0 ? (
                    <span className="text-red-600 font-medium">Out of stock</span>
                  ) : product.stockQuantity <= 5 ? (
                    <span className="text-orange-600">Only <span className="font-semibold">{product.stockQuantity}</span> left</span>
                  ) : (
                    <span className="text-cordillera-olive/70">In stock: <span className="font-medium text-cordillera-olive">{product.stockQuantity}</span></span>
                  )}
                </div>
              )}

              <button
                onClick={() => addToCart(1)}
                disabled={(typeof product.stockQuantity === 'number' && product.stockQuantity === 0) || Boolean(user && ((user as any).role === 'artisan' || (user as any).role === 'admin'))}
                title={(typeof product.stockQuantity === 'number' && product.stockQuantity === 0)
                  ? 'Out of stock'
                  : (user && ((user as any).role === 'artisan' || (user as any).role === 'admin'))
                    ? 'This account type cannot add items to the cart.'
                    : undefined}
                className={`w-full bg-cordillera-gold text-cordillera-olive py-4 text-lg font-medium hover:bg-cordillera-olive hover:text-cordillera-cream transition-all duration-200 tracking-wide ${((typeof product.stockQuantity === 'number' && product.stockQuantity === 0) || Boolean(user && ((user as any).role === 'artisan' || (user as any).role === 'admin'))) ? 'opacity-50 cursor-not-allowed hover:bg-cordillera-gold' : ''}`}
              >
                Add to Cart
              </button>
            </div>

            {/* Tabs for Story, Materials, Care Instructions */}
            <div>
              <div className="flex border-b border-cordillera-sage">
                {[
                  { key: 'story', label: 'Cultural Story' },
                  { key: 'materials', label: 'Materials' },
                  { key: 'care', label: 'Care Instructions' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-6 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab.key
                        ? 'text-cordillera-olive border-b-2 border-cordillera-gold'
                        : 'text-cordillera-olive/60 hover:text-cordillera-olive'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="pt-6">
                {activeTab === 'story' && (
                  <div className="space-y-4">
                    <p className="text-cordillera-olive/80 leading-relaxed">
                      {product.culturalBackground}
                    </p>
                    <p className="text-sm text-cordillera-gold font-medium">
                      Crafted by: {product.artisan}
                    </p>
                  </div>
                )}

                {activeTab === 'materials' && (
                  <ul className="space-y-2">
                    {product.materials.map((material, index) => (
                      <li key={index} className="flex items-center text-cordillera-olive/80">
                        <span className="w-2 h-2 bg-cordillera-gold rounded-full mr-3"></span>
                        {material}
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === 'care' && (
                  <ul className="space-y-2">
                    {product.careInstructions.map((instruction, index) => (
                      <li key={index} className="flex items-center text-cordillera-olive/80">
                        <span className="w-2 h-2 bg-cordillera-gold rounded-full mr-3"></span>
                        {instruction}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-20">
          <h2 className="text-3xl font-serif text-cordillera-olive mb-8">More from this Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(related.length > 0 ? related : []).map((rp) => (
              <Link key={rp.id} to={`/product/${rp.id}`} className="group block bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={rp.image || `https://source.unsplash.com/600x600/?${encodeURIComponent(product.category)}`}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://source.unsplash.com/600x600/?${encodeURIComponent(product.category)}`; }}
                    alt={rp.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-serif text-cordillera-olive mb-2">{rp.name}</h3>
                  <span className="text-xl font-light text-cordillera-gold">₱{rp.price.toLocaleString()}</span>
                </div>
              </Link>
            ))}
            {related.length === 0 && (
              <div className="text-cordillera-olive/60">No related items found.</div>
            )}
          </div>
        </section>
      </div>
      {/* Cart Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onIncrement={incrementItem}
        onDecrement={decrementItem}
        onRemove={removeItem}
        onCheckout={handleCheckout}
        disableCheckout={Boolean(user && (((user as any).role === 'artisan') || ((user as any).role === 'admin')))}
        disabledReason="This account type cannot place marketplace orders."
      />
    </div>
  );
};

export default ProductDetailPage;
