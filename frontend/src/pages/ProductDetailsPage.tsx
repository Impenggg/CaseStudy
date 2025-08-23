import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Toast, useToast } from '../components/ui/toast';
import CartModal from '../components/CartModal';
import { useAuth } from '../contexts/AuthContext';
import api, { productsAPI } from '@/services/api';
import type { Product } from '@/types';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);
  const { toast, showToast, hideToast } = useToast();
  const { isAuthenticated, requireAuth, user } = useAuth();

  // Fetch product by ID
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await productsAPI.getById(Number(id));
        const API_ORIGIN = (api.defaults.baseURL || '').replace(/\/api\/?$/, '');
        const resolveUrl = (u?: string | null) => {
          if (!u) return '';
          if (u.startsWith('http://') || u.startsWith('https://')) return u;
          return `${API_ORIGIN}/${u.replace(/^\/?/, '')}`;
        };
        // Normalize images array and main image to absolute URLs
        const normalized: Product = {
          ...data,
          image: resolveUrl((data as any).image),
          images: Array.isArray((data as any).images) ? (data as any).images.map(resolveUrl) : [],
          seller: (data as any).seller,
        } as Product;
        if (mounted) setProduct(normalized);
      } catch (e) {
        console.error('[ProductDetailsPage] fetch failed', e);
        if (mounted) setProduct(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  // Cart state synced with localStorage (shared with Marketplace)
  type CartItem = { id: number; name: string; price: number; image: string; quantity: number; stock?: number };
  const [cartItems, setCartItems] = React.useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem('marketplace_cart');
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  React.useEffect(() => {
    localStorage.setItem('marketplace_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Reconcile cart item for this product with latest stock quantity
  React.useEffect(() => {
    if (!product) return;
    const stock = typeof product.stock_quantity === 'number' ? product.stock_quantity : undefined;
    if (stock === undefined) return;
    setCartItems(prev => {
      let changed = false;
      const next = prev.map(it => {
        if (it.id !== product.id) return it;
        const clamped = Math.min(it.quantity, Math.max(0, stock));
        const updated = { ...it, stock, quantity: clamped };
        if (updated.quantity !== it.quantity || updated.stock !== it.stock) changed = true;
        return updated;
      });
      if (changed) {
        try { localStorage.setItem('marketplace_cart', JSON.stringify(next)); } catch {}
      }
      return next;
    });
  }, [product?.id, product?.stock_quantity]);

  const addToCart = () => {
    if (!product) return;
    // Block artisans and admins from adding to cart
    const role = user && (user as any).role;
    if (role === 'artisan' || role === 'admin') {
      showToast('This account type cannot add items to the cart.', 'error');
      return;
    }
    try {
      const key = 'marketplace_cart';
      const raw = localStorage.getItem(key);
      const cart: Array<{ id: number; name: string; price: number; image: string; quantity: number; stock?: number }>
        = raw ? JSON.parse(raw) : [];
      const existing = cart.find((p) => p.id === product.id);
      const stock = typeof product.stock_quantity === 'number' ? product.stock_quantity : undefined;
      if (existing) {
        const nextQty = stock !== undefined ? Math.min(existing.quantity + quantity, stock) : Math.min(999, existing.quantity + quantity);
        existing.quantity = nextQty;
        if (stock !== undefined) existing.stock = stock;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: (product.images && product.images[0]) || product.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop',
          quantity: stock !== undefined ? Math.min(quantity, stock) : quantity,
          stock,
        });
      }
      localStorage.setItem(key, JSON.stringify(cart));
      setCartItems(cart);
      showToast(`Added ${quantity} ${product.name}(s) to cart!`, 'success');
    } catch (e) {
      console.error('Failed to add to cart', e);
      showToast('Failed to add to cart', 'error');
    }
  };

  // Cart operations
  const incrementItem = (pid: number) => {
    setCartItems(prev => {
      const next = prev.map(p => {
        if (p.id !== pid) return p;
        const max = typeof p.stock === 'number' ? p.stock : 999;
        return { ...p, quantity: Math.min(p.quantity + 1, max) };
      });
      localStorage.setItem('marketplace_cart', JSON.stringify(next));
      return next;
    });
  };
  const decrementItem = (pid: number) => {
    setCartItems(prev => {
      const next = prev
        .map(p => (p.id === pid ? { ...p, quantity: Math.max(1, p.quantity - 1) } : p))
        .filter(p => p.quantity > 0);
      localStorage.setItem('marketplace_cart', JSON.stringify(next));
      return next;
    });
  };
  const removeItem = (pid: number) => {
    setCartItems(prev => {
      const next = prev.filter(p => p.id !== pid);
      localStorage.setItem('marketplace_cart', JSON.stringify(next));
      return next;
    });
  };
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.quantity * i.price, 0);
  const handleCheckout = () => {
    if (!isAuthenticated) {
      sessionStorage.setItem('resume_checkout', '1');
      requireAuth('/login');
      return;
    }
    // Close cart and move to marketplace which owns the checkout steps
    sessionStorage.setItem('resume_checkout', '1');
    navigate('/marketplace');
  };

  if (isLoading || !product) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl text-yellow-100">Loading product...</h1>
      </div>
    );
  }

  return (
    <div className="py-8">
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
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="relative overflow-hidden rounded-lg mb-4">
              <img 
                src={(product.images && product.images[selectedImage]) || product.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop'} 
                alt={product.name}
                className="w-full h-96 object-cover"
              />
              {product.featured && (
                <Badge className="absolute top-4 left-4 bg-yellow-400 text-green-900">
                  Featured
                </Badge>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {product.images.slice(0, 3).map((img, index) => (
                  <img 
                    key={index}
                    src={img} 
                    alt={`${product.name} ${index + 1}`}
                    className={`w-full h-24 object-cover rounded cursor-pointer transition-all ${
                      selectedImage === index 
                        ? 'ring-2 ring-yellow-400 opacity-100' 
                        : 'hover:opacity-75'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="text-yellow-100">
            <h1 className="text-3xl font-serif font-bold mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-yellow-400">
                ₱{product.price.toLocaleString()}
              </span>
              <Badge variant="outline" className="border-yellow-400 text-yellow-400">
                {product.category || 'general'}
              </Badge>
            </div>

            <p className="text-yellow-200 mb-6 leading-relaxed">
              {product.description || ''}
            </p>

            {/* Cultural Background */}
            <Card className="bg-yellow-100 mb-6">
              <CardContent className="p-4">
                <h3 className="font-semibold text-green-900 mb-2">Cultural Background</h3>
                <p className="text-green-800 text-sm">{product.cultural_background || ''}</p>
              </CardContent>
            </Card>

            {/* Materials */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Materials Used</h3>
              <div className="flex flex-wrap gap-2">
                {(product.materials ?? []).map((material, index) => (
                  <Badge key={index} variant="outline" className="border-yellow-400 text-yellow-400">
                    {material}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Seller Info */}
            <Card className="bg-green-800 mb-6">
              <CardContent className="p-4">
                <h3 className="font-semibold text-yellow-100 mb-2">Artisan</h3>
                <div className="flex items-center gap-3">
                  <img 
                    src={product.seller?.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face'} 
                    alt={product.seller?.name || 'Artisan'}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-yellow-100">{product.seller?.name || 'Unknown'}</p>
                    <p className="text-yellow-200 text-sm">{product.seller?.location || ''}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Purchase */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {typeof product.stock_quantity === 'number' ? (
                  product.stock_quantity === 0 ? (
                    <span className="text-red-400 font-semibold">Out of stock</span>
                  ) : product.stock_quantity <= 5 ? (
                    <span className="text-orange-300">Only <span className="font-bold">{product.stock_quantity}</span> left</span>
                  ) : (
                    <span className="text-yellow-200">In stock: <span className="font-semibold">{product.stock_quantity}</span></span>
                  )
                ) : (
                  <span className="text-yellow-200">Stock: N/A</span>
                )}
              </div>
              
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-yellow-200">Quantity:</span>
                <div className="flex items-center border border-yellow-400 rounded">
                  <button 
                    className="px-3 py-1 text-yellow-400 hover:bg-yellow-400 hover:text-green-900"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-yellow-100">{quantity}</span>
                  <button 
                    className="px-3 py-1 text-yellow-400 hover:bg-yellow-400 hover:text-green-900"
                    onClick={() => setQuantity(Math.min(product.stock_quantity ?? 999, quantity + 1))}
                  >
                    +
                  </button>
                </div>
              </div>

              <Button 
                size="lg" 
                title={(typeof product.stock_quantity === 'number' && product.stock_quantity === 0)
                  ? 'Out of stock'
                  : ((user && ((user as any).role === 'artisan' || (user as any).role === 'admin'))
                    ? 'This account type cannot add items to the cart.'
                    : undefined)}
                className={`w-full bg-yellow-500 text-green-900 hover:bg-yellow-400 ${((typeof product.stock_quantity === 'number' && product.stock_quantity === 0) || Boolean(user && (((user as any).role === 'artisan') || ((user as any).role === 'admin')))) ? 'opacity-50 cursor-not-allowed hover:bg-yellow-500' : ''}`}
                disabled={(typeof product.stock_quantity === 'number' && product.stock_quantity === 0) || Boolean(user && (((user as any).role === 'artisan') || ((user as any).role === 'admin')))}
                onClick={addToCart}
              >
                Add to Cart - ₱{(product.price * quantity).toLocaleString()}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-green-900"
                onClick={() => showToast('Message sent to artisan!', 'success')}
              >
                Contact Artisan
              </Button>
            </div>
          </div>
        </div>
        
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />
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