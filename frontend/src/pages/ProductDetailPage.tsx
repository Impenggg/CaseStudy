import React, { useState, useEffect } from 'react';
import { triggerAction } from '../lib/uiActions';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CartModal from '../components/CartModal';
import { useAuth } from '../contexts/AuthContext';
import BackLink from '@/components/BackLink';
 

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

  useEffect(() => {
    // Sample product data - in real app, fetch from API
    const sampleProduct: Product = {
      id: parseInt(id || '1'),
      name: "Traditional Ikat Blanket",
      price: 2500,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
      description: "Handwoven with indigenous patterns passed down through generations",
      category: "Blankets",
      culturalBackground: "This traditional Ikat blanket represents centuries of Cordillera weaving heritage. The intricate patterns tell stories of mountain spirits and natural elements, woven with techniques preserved by master artisans in the remote villages of Northern Luzon.",
      materials: ["100% Natural Cotton", "Plant-based Dyes", "Traditional Hand-spun Threads"],
      careInstructions: ["Hand wash in cold water", "Air dry away from direct sunlight", "Store in cool, dry place", "Iron on low heat if needed"],
      artisan: "Maria Santos - Master Weaver from Bontoc",
      gallery: [
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
        "https://images.unsplash.com/photo-1607081692251-5bb4c0940e1e?w=800"
      ],
      stockQuantity: 7,
    };
    setProduct(sampleProduct);
  }, []);

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

  if (!product) {
    return <div className="min-h-screen bg-cordillera-olive flex items-center justify-center">
      <div className="text-cordillera-cream">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-cordillera-cream">
      {/* Floating Cart Button */}
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
                <span className="text-sm uppercase tracking-wider text-cordillera-olive/50 bg-cordillera-sage px-3 py-1">
                  {product.category}
                </span>
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
          <h2 className="text-3xl font-serif text-cordillera-olive mb-8">
            More from this Collection
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <Link
                key={item}
                to={`/product/${item + 10}`}
                className="group block bg-white shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400"
                    alt="Related Product"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-serif text-cordillera-olive mb-2">
                    Related Weaving Item {item}
                  </h3>
                  <span className="text-xl font-light text-cordillera-gold">
                    ₱{(1000 + item * 500).toLocaleString()}
                  </span>
                </div>
              </Link>
            ))}
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
      />
    </div>
  );
};

export default ProductDetailPage;
