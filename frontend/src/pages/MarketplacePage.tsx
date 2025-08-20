import React, { useState, useEffect, useRef } from 'react';
import { triggerAction } from '../lib/uiActions';
import { Link } from 'react-router-dom';
import CartModal from '../components/CartModal';
import { useAuth } from '../contexts/AuthContext';
import api, { productsAPI } from '@/services/api';
import LoadingScreen from '../components/LoadingScreen';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  artisan: string;
}

const MarketplacePage: React.FC = () => {
  const { isAuthenticated, requireAuth } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  // Simple marketplace cart state (local to this page)
  interface CartItem {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
  }
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem('marketplace_cart');
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'gcash' | 'card'>('cod');

  // Quick View modal state
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const quickViewRef = useRef<HTMLDivElement | null>(null);

  const openQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
    triggerAction(`Open Quick View for ${product.name}`);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearchTerm(searchTerm), 250);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Modal accessibility: Esc to close and basic focus trap
  useEffect(() => {
    if (!isQuickViewOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeQuickView();
      } else if (e.key === 'Tab') {
        // simple trap: keep focus within modal
        const root = quickViewRef.current;
        if (!root) return;
        const focusable = root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey) {
          if (active === first || !root.contains(active)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (active === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    document.addEventListener('keydown', onKey);
    // focus the first focusable on open
    setTimeout(() => {
      const root = quickViewRef.current;
      if (!root) return;
      const first = root.querySelector<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])');
      first?.focus();
    }, 0);
    return () => document.removeEventListener('keydown', onKey);
  }, [isQuickViewOpen]);

  // resolve API origin (http://localhost:8000) from axios baseURL (http://localhost:8000/api)
  const API_ORIGIN = React.useMemo(() => (api.defaults.baseURL || '').replace(/\/api\/?$/, ''), []);

  const resolveImageUrl = (image?: string) => {
    if (!image) return '';
    if (image.startsWith('http://') || image.startsWith('https://')) return image;
    // backend seeds use paths like "storage/products/....jpg"
    return `${API_ORIGIN}/${image.replace(/^\/?/, '')}`;
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        console.debug('[Marketplace] BaseURL:', api.defaults.baseURL);
        console.debug('[Marketplace] Fetching products...');
        const res = await productsAPI.getAll({ per_page: 100 });
        console.debug('[Marketplace] Products response:', res);
        // Support both paginated {data: [...]} and raw arrays
        const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : res?.data?.data || []);
        const mapped: Product[] = list.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price ?? 0),
          image: resolveImageUrl(item.image),
          description: item.description || '',
          category: item.category || 'General',
          artisan: item.seller?.name || item.user?.name || 'Artisan',
        }));
        if (mounted) {
          setProducts(mapped);
          setFilteredProducts(mapped);
          setErrorMsg(null);
        }
      } catch (e: any) {
        console.error('[Marketplace] Fetch error:', e?.response?.status, e?.response?.data || e);
        // fallback: empty list on error
        if (mounted) {
          setProducts([]);
          setFilteredProducts([]);
          const status = e?.response?.status;
          const msg = e?.response?.data?.message || e?.message || 'Failed to fetch products';
          setErrorMsg(`Products fetch error${status ? ` (${status})` : ''}: ${msg}`);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    localStorage.setItem('marketplace_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Cart helpers
  const addToCart = (product: Product) => {
    // Guests can add to cart; auth is only required at checkout
    setCartItems((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) => (p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p));
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 }];
    });
    triggerAction(`Add ${product.name} to cart (Marketplace)`);
    // Optionally show cart after adding
    setIsCartOpen(true);
  };

  const incrementItem = (id: number) => {
    setCartItems((prev) => prev.map((p) => (p.id === id ? { ...p, quantity: p.quantity + 1 } : p)));
  };

  const decrementItem = (id: number) => {
    setCartItems((prev) => prev
      .map((p) => (p.id === id ? { ...p, quantity: Math.max(1, p.quantity - 1) } : p))
      .filter((p) => p.quantity > 0));
  };

  const removeItem = (id: number) => {
    setCartItems((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('marketplace_cart');
  };

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.quantity * i.price, 0);

  const handleCheckout = () => {
    // Require auth to proceed to checkout
    if (!isAuthenticated) {
      sessionStorage.setItem('resume_checkout', '1');
      requireAuth('/login');
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
    setCheckoutStep('shipping');
  };

  const handleShippingSubmit = () => {
    setCheckoutStep('payment');
  };

  const handlePaymentSubmit = () => {
    setCheckoutStep('confirmation');
    triggerAction('Order placed successfully');
  };

  const handleCheckoutComplete = () => {
    setIsCheckoutOpen(false);
    setCheckoutStep('shipping');
    clearCart();
  };

  // Resume actions post-login
  useEffect(() => {
    // Resume add to cart
    if (isAuthenticated) {
      const pendingId = sessionStorage.getItem('pending_add_product_id');
      if (pendingId) {
        const product = products.find(p => p.id === Number(pendingId));
        if (product) {
          setCartItems((prev) => {
            const existing = prev.find((i) => i.id === product.id);
            if (existing) {
              return prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
            }
            return [...prev, { id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 }];
          });
          triggerAction(`Add ${product.name} to cart (Resumed)`);
        }
        sessionStorage.removeItem('pending_add_product_id');
        // Optionally open cart to show item
        setIsCartOpen(true);
      }

      // Resume checkout
      if (sessionStorage.getItem('resume_checkout') === '1') {
        sessionStorage.removeItem('resume_checkout');
        if (cartItems.length > 0) {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
          setCheckoutStep('shipping');
        }
      }
    }
  }, [isAuthenticated, products]);

  // Filter and search functionality
  useEffect(() => {
    let filtered = products;

    if (debouncedSearchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (sortBy) {
      switch (sortBy) {
        case 'price-low':
          filtered = [...filtered].sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered = [...filtered].sort((a, b) => b.price - a.price);
          break;
        case 'name':
          filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
          break;
      }
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, sortBy, products]);

  const categories = Array.from(new Set(products.map(p => p.category)));

  // Loading UI
  if (isLoading) {
    return <LoadingScreen title="Loading Marketplace" subtitle="Fetching products from artisans..." />;
  }

  return (
    <div className="min-h-screen bg-cordillera-cream">
      {errorMsg && (
        <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 text-sm">{errorMsg}</div>
      )}
             {/* Premium Cart Button */}
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
      {/* Enhanced Hero Section */}
      <section className="relative py-24 bg-cordillera-olive overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="mb-6">
            <span className="inline-block bg-cordillera-gold/20 text-cordillera-gold px-4 py-2 text-sm font-medium uppercase tracking-wider mb-4 backdrop-blur-sm">
              Authentic Collection
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-serif font-light text-cordillera-cream mb-8 tracking-wide">
            Marketplace
          </h1>
          <p className="text-xl md:text-2xl text-cordillera-cream/90 max-w-4xl mx-auto font-light leading-relaxed mb-8">
            Discover authentic handwoven treasures crafted by master artisans, 
            each piece carrying the soul of Cordillera heritage and generations of wisdom.
          </p>
          <div className="flex justify-center items-center space-x-8 text-cordillera-cream/70">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-cordillera-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium">Authentic Products</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-cordillera-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-sm font-medium">Master Artisans</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-cordillera-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Heritage Quality</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
                     {/* Enhanced Sidebar Filters - Sage Green Background */}
           <div className="lg:w-1/4">
             <div className="bg-cordillera-sage p-6 sticky top-8 shadow-lg">
               <div className="flex items-center mb-4">
                 <svg className="w-5 h-5 text-cordillera-gold mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                 </svg>
                 <h3 className="text-xl font-serif text-cordillera-olive">Refine Search</h3>
               </div>
               
               {/* Enhanced Search */}
               <div className="mb-4">
                 <label className="block text-cordillera-olive/80 text-sm font-semibold mb-2">
                   Search Products
                 </label>
                 <div className="relative">
                   <input
                     type="text"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     placeholder="Search by name or description..."
                     className="w-full px-3 py-2 pl-10 bg-white border-2 border-cordillera-olive/20 text-cordillera-olive placeholder-cordillera-olive/50 focus:outline-none focus:border-cordillera-gold focus:ring-2 focus:ring-cordillera-gold/20 transition-all duration-200 rounded-lg"
                   />
                   <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cordillera-olive/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                   </svg>
                 </div>
               </div>

               {/* Enhanced Category Filter */}
               <div className="mb-4">
                 <label className="block text-cordillera-olive/80 text-sm font-semibold mb-2">
                   Category
                 </label>
                 <div className="relative">
                   <select
                     value={selectedCategory}
                     onChange={(e) => setSelectedCategory(e.target.value)}
                     className="w-full px-3 py-2 bg-white border-2 border-cordillera-olive/20 text-cordillera-olive focus:outline-none focus:border-cordillera-gold focus:ring-2 focus:ring-cordillera-gold/20 transition-all duration-200 rounded-lg appearance-none cursor-pointer"
                   >
                     <option value="">All Categories</option>
                     {categories.map(category => (
                       <option key={category} value={category}>{category}</option>
                     ))}
                   </select>
                   <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cordillera-olive/40 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                   </svg>
                 </div>
               </div>

               {/* Enhanced Sort By */}
               <div className="mb-6">
                 <label className="block text-cordillera-olive/80 text-sm font-semibold mb-2">
                   Sort By
                 </label>
                 <div className="relative">
                   <select
                     value={sortBy}
                     onChange={(e) => setSortBy(e.target.value)}
                     className="w-full px-3 py-2 bg-white border-2 border-cordillera-olive/20 text-cordillera-olive focus:outline-none focus:border-cordillera-gold focus:ring-2 focus:ring-cordillera-gold/20 transition-all duration-200 rounded-lg appearance-none cursor-pointer"
                   >
                     <option value="">Default</option>
                     <option value="price-low">Price: Low to High</option>
                     <option value="price-high">Price: High to Low</option>
                     <option value="name">Name: A to Z</option>
                   </select>
                   <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cordillera-olive/40 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                   </svg>
                 </div>
               </div>

               {/* Enhanced Clear Filters Button */}
               <button
                 onClick={() => {
                   setSearchTerm('');
                   setSelectedCategory('');
                   setSortBy('');
                   triggerAction('Clear Marketplace Filters');
                 }}
                 className="group relative w-full bg-cordillera-gold text-cordillera-olive py-3 font-semibold hover:bg-cordillera-gold/90 transition-all duration-300 overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-0.5 rounded-lg"
               >
                 <span className="relative z-10 flex items-center justify-center">
                   <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                   </svg>
                   Clear All Filters
                 </span>
                 <div className="absolute inset-0 bg-cordillera-olive transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                 <span className="absolute inset-0 flex items-center justify-center text-cordillera-cream opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 font-semibold">
                   <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                   </svg>
                   Clear All Filters
                 </span>
               </button>

               {/* Filter Summary */}
               {(searchTerm || selectedCategory || sortBy) && (
                 <div className="mt-4 p-3 bg-cordillera-olive/10 rounded-lg">
                   <h4 className="text-sm font-semibold text-cordillera-olive mb-2">Active Filters:</h4>
                   <div className="space-y-1 text-xs text-cordillera-olive/70">
                     {searchTerm && <div>Search: "{searchTerm}"</div>}
                     {selectedCategory && <div>Category: {selectedCategory}</div>}
                     {sortBy && <div>Sort: {sortBy.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>}
                   </div>
                 </div>
               )}
             </div>
           </div>

          {/* Enhanced Product Grid - Cream Green Background */}
          <div className="lg:w-3/4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <p className="text-lg font-medium text-cordillera-olive">
                  {filteredProducts.length === products.length 
                    ? `All ${products.length} Products` 
                    : `${filteredProducts.length} of ${products.length} Products`}
                </p>
                <p className="text-sm text-cordillera-olive/60 mt-1">
                  Authentic handwoven treasures from master artisans
                </p>
              </div>
              {filteredProducts.length > 0 && (
                <div className="flex items-center text-sm text-cordillera-olive/60">
                  <svg className="w-4 h-4 mr-2 text-cordillera-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Curated Collection
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                >
                  <div className="group bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden flex flex-col h-full">
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {/* Top-left badge */}
                      <div className="absolute top-3 left-3 bg-cordillera-gold text-cordillera-olive text-xs font-semibold px-2 py-1 rounded">
                        {product.category}
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-grow text-center">
                      <h3 className="text-lg font-serif text-cordillera-olive mb-2 leading-tight group-hover:text-cordillera-gold transition-colors duration-300 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-cordillera-olive/60 text-sm mb-4 leading-relaxed line-clamp-2 flex-grow">
                        {product.description}
                      </p>
                      <div className="flex flex-col items-center mt-auto gap-3">
                        <div className="text-center">
                          <span className="text-xl font-light text-cordillera-gold block mb-1">
                            ₱{product.price.toLocaleString()}
                          </span>
                          <div className="flex items-center justify-center text-xs text-cordillera-olive/50">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="uppercase tracking-wider">
                              {product.artisan}
                            </span>
                          </div>
                        </div>
                        <div className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex gap-2 justify-center">
                          <button
                            onClick={(e) => { e.preventDefault(); addToCart(product); }}
                            className="bg-cordillera-olive text-cordillera-cream px-4 py-2 text-sm font-medium rounded hover:bg-cordillera-olive/90"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={(e) => { e.preventDefault(); openQuickView(product); }}
                            className="bg-cordillera-gold text-cordillera-olive px-4 py-2 text-sm font-medium rounded hover:bg-cordillera-gold/90"
                          >
                            Quick View
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Enhanced Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 bg-cordillera-sage/20 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-cordillera-olive/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-serif text-cordillera-olive mb-4">
                    No Products Found
                  </h3>
                  <p className="text-cordillera-olive/60 text-lg mb-8 leading-relaxed">
                    We couldn't find any products matching your search criteria. 
                    Try adjusting your filters or browse our full collection.
                  </p>
              <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('');
                      setSortBy('');
                  triggerAction('View All Products from Empty State');
                    }}
                    className="group relative bg-cordillera-gold text-cordillera-olive px-8 py-4 font-semibold hover:bg-cordillera-gold/90 transition-all duration-300 overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-0.5 rounded-lg"
                  >
                    <span className="relative z-10 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      View All Products
                    </span>
                    <div className="absolute inset-0 bg-cordillera-olive transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    <span className="absolute inset-0 flex items-center justify-center text-cordillera-cream opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 font-semibold">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      View All Products
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Cart Modal */}
      {/* Quick View Modal */}
      {isQuickViewOpen && quickViewProduct && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={closeQuickView}></div>
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h2 className="text-xl font-serif text-cordillera-olive">Quick View</h2>
                <button onClick={closeQuickView} className="text-cordillera-olive/60 hover:text-cordillera-olive" aria-label="Close quick view">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="h-72 md:h-full overflow-hidden">
                  <img
                    src={quickViewProduct.image}
                    alt={quickViewProduct.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col" ref={quickViewRef} role="dialog" aria-modal="true" aria-label="Quick View">
                  <div className="text-sm text-cordillera-olive/60 mb-1">{quickViewProduct.category}</div>
                  <h3 className="text-2xl font-serif text-cordillera-olive mb-2">{quickViewProduct.name}</h3>
                  <div className="text-cordillera-gold text-2xl font-light mb-4">₱{quickViewProduct.price.toLocaleString()}</div>
                  <div className="flex items-center text-xs text-cordillera-olive/60 mb-4">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="uppercase tracking-wider">{quickViewProduct.artisan}</span>
                  </div>
                  <p className="text-cordillera-olive/70 text-sm leading-relaxed mb-6 line-clamp-6">{quickViewProduct.description}</p>
                  <div className="mt-auto flex gap-3">
                    <button
                      onClick={() => { addToCart(quickViewProduct); closeQuickView(); }}
                      className="bg-cordillera-olive text-cordillera-cream px-5 py-2 rounded-lg font-medium hover:bg-cordillera-olive/90"
                    >
                      Add to Cart
                    </button>
                    <Link
                      to={`/product/${quickViewProduct.id}`}
                      className="border border-cordillera-olive/30 text-cordillera-olive px-5 py-2 rounded-lg font-medium hover:bg-cordillera-olive/5"
                      onClick={closeQuickView}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
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

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsCheckoutOpen(false)}></div>
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-serif text-cordillera-olive">Checkout</h2>
                <button onClick={() => setIsCheckoutOpen(false)} className="text-cordillera-olive/60 hover:text-cordillera-olive">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Progress Steps */}
              <div className="px-6 py-4 border-b">
                <div className="flex items-center justify-center space-x-8">
                  <div className={`flex items-center ${checkoutStep === 'shipping' ? 'text-cordillera-gold' : 'text-cordillera-olive/40'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${checkoutStep === 'shipping' ? 'bg-cordillera-gold text-cordillera-olive' : 'bg-cordillera-olive/20'}`}>
                      1
                    </div>
                    <span className="ml-2 font-medium">Shipping</span>
                  </div>
                  <div className={`flex items-center ${checkoutStep === 'payment' ? 'text-cordillera-gold' : 'text-cordillera-olive/40'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${checkoutStep === 'payment' ? 'bg-cordillera-gold text-cordillera-olive' : 'bg-cordillera-olive/20'}`}>
                      2
                    </div>
                    <span className="ml-2 font-medium">Payment</span>
                  </div>
                  <div className={`flex items-center ${checkoutStep === 'confirmation' ? 'text-cordillera-gold' : 'text-cordillera-olive/40'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${checkoutStep === 'confirmation' ? 'bg-cordillera-gold text-cordillera-olive' : 'bg-cordillera-olive/20'}`}>
                      3
                    </div>
                    <span className="ml-2 font-medium">Confirm</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {checkoutStep === 'shipping' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-serif text-cordillera-olive mb-4">Shipping Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-cordillera-olive mb-2">Full Name</label>
                        <input
                          type="text"
                          value={shippingDetails.fullName}
                          onChange={(e) => setShippingDetails(prev => ({ ...prev, fullName: e.target.value }))}
                          className="w-full px-4 py-3 border border-cordillera-olive/20 rounded-lg focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-cordillera-olive mb-2">Email</label>
                        <input
                          type="email"
                          value={shippingDetails.email}
                          onChange={(e) => setShippingDetails(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-4 py-3 border border-cordillera-olive/20 rounded-lg focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                          placeholder="Enter your email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-cordillera-olive mb-2">Phone</label>
                        <input
                          type="tel"
                          value={shippingDetails.phone}
                          onChange={(e) => setShippingDetails(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-4 py-3 border border-cordillera-olive/20 rounded-lg focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-cordillera-olive mb-2">City</label>
                        <input
                          type="text"
                          value={shippingDetails.city}
                          onChange={(e) => setShippingDetails(prev => ({ ...prev, city: e.target.value }))}
                          className="w-full px-4 py-3 border border-cordillera-olive/20 rounded-lg focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                          placeholder="Enter your city"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-cordillera-olive mb-2">Address</label>
                        <textarea
                          value={shippingDetails.address}
                          onChange={(e) => setShippingDetails(prev => ({ ...prev, address: e.target.value }))}
                          className="w-full px-4 py-3 border border-cordillera-olive/20 rounded-lg focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                          rows={3}
                          placeholder="Enter your complete address"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-cordillera-olive mb-2">Postal Code</label>
                        <input
                          type="text"
                          value={shippingDetails.postalCode}
                          onChange={(e) => setShippingDetails(prev => ({ ...prev, postalCode: e.target.value }))}
                          className="w-full px-4 py-3 border border-cordillera-olive/20 rounded-lg focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                          placeholder="Enter postal code"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <button
                        onClick={handleShippingSubmit}
                        className="bg-cordillera-gold text-cordillera-olive px-8 py-3 rounded-lg font-medium hover:bg-cordillera-gold/90 transition-colors"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </div>
                )}

                {checkoutStep === 'payment' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-serif text-cordillera-olive mb-4">Payment Method</h3>
                    <div className="space-y-4">
                      <label className="flex items-center p-4 border border-cordillera-olive/20 rounded-lg cursor-pointer hover:bg-cordillera-olive/5">
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={(e) => setPaymentMethod(e.target.value as 'cod')}
                          className="mr-3"
                        />
                        <div>
                          <div className="font-medium text-cordillera-olive">Cash on Delivery</div>
                          <div className="text-sm text-cordillera-olive/60">Pay when you receive your order</div>
                        </div>
                      </label>
                      <label className="flex items-center p-4 border border-cordillera-olive/20 rounded-lg cursor-pointer hover:bg-cordillera-olive/5">
                        <input
                          type="radio"
                          name="payment"
                          value="gcash"
                          checked={paymentMethod === 'gcash'}
                          onChange={(e) => setPaymentMethod(e.target.value as 'gcash')}
                          className="mr-3"
                        />
                        <div>
                          <div className="font-medium text-cordillera-olive">GCash</div>
                          <div className="text-sm text-cordillera-olive/60">Pay using GCash mobile wallet</div>
                        </div>
                      </label>
                      <label className="flex items-center p-4 border border-cordillera-olive/20 rounded-lg cursor-pointer hover:bg-cordillera-olive/5">
                        <input
                          type="radio"
                          name="payment"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                          className="mr-3"
                        />
                        <div>
                          <div className="font-medium text-cordillera-olive">Credit/Debit Card</div>
                          <div className="text-sm text-cordillera-olive/60">Pay securely with your card</div>
                        </div>
                      </label>
                    </div>
                    <div className="flex justify-between pt-4">
                      <button
                        onClick={() => setCheckoutStep('shipping')}
                        className="px-6 py-3 border border-cordillera-olive/20 rounded-lg text-cordillera-olive hover:bg-cordillera-olive/5 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={handlePaymentSubmit}
                        className="bg-cordillera-gold text-cordillera-olive px-8 py-3 rounded-lg font-medium hover:bg-cordillera-gold/90 transition-colors"
                      >
                        Place Order
                      </button>
                    </div>
                  </div>
                )}

                {checkoutStep === 'confirmation' && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-serif text-cordillera-olive mb-2">Order Confirmed!</h3>
                      <p className="text-cordillera-olive/60">Thank you for your purchase. Your order has been successfully placed.</p>
                    </div>
                    
                    <div className="bg-cordillera-olive/5 rounded-lg p-6">
                      <h4 className="font-medium text-cordillera-olive mb-4">Order Summary</h4>
                      <div className="space-y-3">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                              <div>
                                <div className="font-medium text-cordillera-olive">{item.name}</div>
                                <div className="text-sm text-cordillera-olive/60">Qty: {item.quantity}</div>
                              </div>
                            </div>
                            <div className="text-cordillera-olive font-medium">₱{(item.price * item.quantity).toLocaleString()}</div>
                          </div>
                        ))}
                        <div className="border-t pt-3">
                          <div className="flex justify-between font-medium text-cordillera-olive">
                            <span>Total</span>
                            <span>₱{cartTotal.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-cordillera-olive/5 rounded-lg p-6">
                      <h4 className="font-medium text-cordillera-olive mb-4">Shipping Details</h4>
                      <div className="space-y-2 text-sm text-cordillera-olive/80">
                        <div>{shippingDetails.fullName}</div>
                        <div>{shippingDetails.address}</div>
                        <div>{shippingDetails.city}, {shippingDetails.postalCode}</div>
                        <div>{shippingDetails.phone}</div>
                        <div>{shippingDetails.email}</div>
                      </div>
                    </div>

                    <div className="text-center pt-4">
                      <button
                        onClick={handleCheckoutComplete}
                        className="bg-cordillera-gold text-cordillera-olive px-8 py-3 rounded-lg font-medium hover:bg-cordillera-gold/90 transition-colors"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;