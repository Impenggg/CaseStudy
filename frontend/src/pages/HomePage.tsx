import React, { useState, useEffect } from 'react';
import { triggerAction } from '../lib/uiActions';
import { Link } from 'react-router-dom';
import api, { productsAPI } from '@/services/api';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [currentProductSlide, setCurrentProductSlide] = useState(0);

  // Helpers consistent with Marketplace/Stories pages
  const API_ORIGIN = React.useMemo(() => (api.defaults.baseURL || '').replace(/\/api\/?$/, ''), []);
  const PLACEHOLDER_IMG = '/api/placeholder/800/500';

  const resolveImageUrl = (image?: string) => {
    if (!image) return '';
    if (image.startsWith('http://') || image.startsWith('https://')) return image;
    return `${API_ORIGIN}/${image.replace(/^\/?/, '')}`;
  };

  // stories removed

  // Fetch live featured products and stories; poll periodically for near real-time updates
  useEffect(() => {
    let mounted = true;
    let timer: number | undefined;

    const fetchFeatured = async () => {
      try {
        // Products: prefer featured flag, fallback to recent if not supported by backend
        const pres = await productsAPI.getAll({ featured: true as any, per_page: 10 });
        const plist = Array.isArray(pres?.data) ? pres.data : (Array.isArray(pres) ? pres : pres?.data?.data || []);
        let mappedProducts: Product[] = plist.map((item: any) => {
          const rawImage = item.image || item.image_url || item.imagePath || item.image_path || item.thumbnail || item.media_url || '';
          return {
            id: item.id,
            name: item.name,
            price: Number(item.price ?? 0),
            image: resolveImageUrl(rawImage),
            description: item.description || '',
            category: item.category || 'General',
          };
        });
        // Fallback: if none marked featured, fetch latest items
        if ((!mappedProducts || mappedProducts.length === 0)) {
          const pAlt = await productsAPI.getAll({ per_page: 10, sort_by: 'latest' as any });
          const pAltList = Array.isArray(pAlt?.data) ? pAlt.data : (Array.isArray(pAlt) ? pAlt : pAlt?.data?.data || []);
          mappedProducts = pAltList.map((item: any) => {
            const rawImage = item.image || item.image_url || item.imagePath || item.image_path || item.thumbnail || item.media_url || '';
            return {
              id: item.id,
              name: item.name,
              price: Number(item.price ?? 0),
              image: resolveImageUrl(rawImage),
              description: item.description || '',
              category: item.category || 'General',
            };
          });
        }
        if (mounted) setFeaturedProducts(mappedProducts);
      } catch (e) {
        // Fail silently on homepage; keep current lists
        // Optionally could log: console.debug('[Home] fetchFeatured failed', e);
      }
    };

    fetchFeatured();
    // Poll every 30s
    timer = window.setInterval(fetchFeatured, 30000);

    return () => {
      mounted = false;
      if (timer) window.clearInterval(timer);
    };
  }, [API_ORIGIN]);

  // Carousel auto-play functionality (products only)
  useEffect(() => {
    const productTimer = featuredProducts.length > 1 ? setInterval(() => {
      setCurrentProductSlide((prevSlide) =>
        prevSlide === featuredProducts.length - 1 ? 0 : prevSlide + 1
      );
    }, 5000) : undefined;

    return () => {
      if (productTimer) clearInterval(productTimer);
    };
  }, [featuredProducts.length]);

  // Product carousel functions
  const nextProductSlide = () => {
    setCurrentProductSlide(currentProductSlide === featuredProducts.length - 1 ? 0 : currentProductSlide + 1);
  };

  const prevProductSlide = () => {
    setCurrentProductSlide(currentProductSlide === 0 ? featuredProducts.length - 1 : currentProductSlide - 1);
  };

  const goToProductSlide = (index: number) => {
    setCurrentProductSlide(index);
  };

  return (
    <div className="min-h-screen bg-heritage-100">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-center bg-cover"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1571816065864-c36e568cccdb?w=1920&h=1080&fit=crop")' }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-heritage-800/80"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-heritage-800/30"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl font-serif font-light text-heritage-100 mb-6 tracking-tight leading-tight">
              Cordillera Heritage
            </h1>
            <h2 className="text-xl sm:text-2xl font-sans text-heritage-100/95 mb-6 leading-relaxed font-medium">
              Preserving Indigenous Weaving Through Digital Innovation
            </h2>
            
            <p className="text-base sm:text-lg text-heritage-100/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Discover authentic handwoven treasures, immerse yourself in cultural stories, 
              and support preservation initiatives that keep centuries-old traditions alive.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link
                to="/marketplace"
                className="group relative border border-heritage-500 text-heritage-800 px-6 py-3 text-base font-medium inline-flex items-center justify-center rounded-md bg-heritage-500 hover:bg-heritage-500/90 transition-colors shadow-sm hover:shadow"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Explore Marketplace
                </span>
              </Link>

              <Link
                to="/stories"
                className="group relative border border-heritage-100 text-heritage-100 px-6 py-3 text-base font-medium inline-flex items-center justify-center rounded-md bg-transparent hover:bg-heritage-100/10 transition-colors shadow-sm hover:shadow"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Discover Stories
                </span>
              </Link>

              <Link
                to="/media-creation"
                className="group relative border border-heritage-100 text-heritage-100 px-6 py-3 text-base font-medium inline-flex items-center justify-center rounded-md bg-transparent hover:bg-heritage-100/10 transition-colors shadow-sm hover:shadow"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Media Creation
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 sm:py-20 bg-heritage-100">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-heritage-800 mb-2">
              Featured
            </h2>
            <p className="text-heritage-800/70">Handpicked products and campaigns</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Products Carousel */}
            <div>
              <h3 className="text-2xl font-serif font-light text-heritage-800 mb-4 text-center lg:text-left">
                Featured Products
              </h3>
              <div className="relative">
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentProductSlide * 100}%)` }}
                  >
                    {featuredProducts.map((product) => (
                      <div key={product.id} className="w-full flex-shrink-0 px-2">
                        <div className="card-surface rounded-lg overflow-hidden h-[360px]">
                          <div className="h-[220px] relative overflow-hidden">
                            <img
                              src={product.image || PLACEHOLDER_IMG}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement;
                                if (target.src !== PLACEHOLDER_IMG) {
                                  target.src = PLACEHOLDER_IMG;
                                }
                              }}
                            />
                            <div className="absolute inset-0 bg-black/10"></div>
                          </div>
                          <div className="p-4 flex flex-col h-[140px]">
                            <h3 className="text-lg font-serif text-heritage-800 mb-1 font-medium">
                              {product.name}
                            </h3>
                            <p className="text-heritage-800/70 mb-auto text-xs leading-relaxed line-clamp-2">
                              {product.description}
                            </p>
                            <div className="flex justify-between items-center pt-3 border-t border-brand-sage/30">
                              <span className="text-lg font-light text-heritage-500">
                                ₱{product.price.toLocaleString()}
                              </span>
                              <Link
                                to={`/products/${product.id}`}
                                className="border border-heritage-500 text-heritage-800 px-3 py-1.5 rounded-md hover:bg-heritage-500/10 transition-colors font-medium text-xs"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Product Carousel Controls */}
                <button
                  onClick={prevProductSlide}
                  className="absolute -left-3 top-1/2 -translate-y-1/2 bg-heritage-800 text-white p-2 rounded-full hover:bg-heritage-800/90 shadow"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextProductSlide}
                  className="absolute -right-3 top-1/2 -translate-y-1/2 bg-heritage-800 text-white p-2 rounded-full hover:bg-heritage-800/90 shadow"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Product Carousel Indicators */}
                <div className="flex justify-center mt-5 space-x-2.5">
                  {featuredProducts.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToProductSlide(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${
                        index === currentProductSlide
                          ? 'bg-heritage-500'
                          : 'bg-heritage-800/30 hover:bg-heritage-800/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Want to Support - Campaign Card (no image) */}
            <div>
              <h3 className="text-2xl font-serif font-light text-heritage-800 mb-4 text-center lg:text-left">
                Want to Support
              </h3>
              <div className="px-2">
                <div className="card-surface rounded-lg p-6 sm:p-7 h-[360px] flex flex-col overflow-hidden">
                  {/* Top badge */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-block text-xs font-semibold tracking-wide uppercase px-3 py-1 rounded-md bg-brand-sage text-heritage-800">
                      Campaign
                    </span>
                    <span className="text-xs font-semibold tracking-wide uppercase text-heritage-800/70">
                      Community
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-serif text-heritage-800 font-medium mb-2">
                  Cordillera Fashion for a Cause
                </h3>

                {/* Description */}
                <p className="text-heritage-800/80 mb-4 leading-relaxed line-clamp-3">
                  This campaign will host a cultural fashion show highlighting clothes and accessories made with authentic Cordillera weaves. Local designers will collaborate with artisans to showcase traditions with contemporary relevance.
                </p>

                {/* Progress */}
                <div className="mb-2 flex items-center justify-between text-sm text-heritage-800/80">
                  <span>0% funded</span>
                  <span>₱0</span>
                </div>
                <div className="h-2 w-full rounded-full bg-brand-sage/30 overflow-hidden mb-2">
                  <div className="h-full w-[0%] bg-heritage-500" />
                </div>
                <div className="text-xs text-heritage-800/70 mb-5">Goal: ₱250,000</div>

                {/* CTA and meta */}
                <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <button
                    disabled
                    className="px-4 py-2 rounded-md bg-brand-sage text-heritage-800 font-medium cursor-not-allowed"
                  >
                    Support Disabled
                  </button>
                  <div className="flex items-center gap-6 text-xs text-heritage-800/70">
                    <span>By Test Artisan</span>
                    <span>Ends 12/12/2025</span>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative overflow-hidden bg-heritage-800 text-heritage-100 py-16">
        {/* Layered wave divider to clearly separate from previous section */}
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 gap-6">
            {/* Contact Information */}
            <div className="max-w-5xl mx-auto">
              <h3 className="text-2xl font-serif font-light mb-4 text-center">Contact Us</h3>
              <div className="flex flex-col sm:flex-row justify-center items-start gap-6 sm:gap-12">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 mt-1 text-heritage-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-heritage-100/80">info@cordilleraheritage.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 mt-1 text-heritage-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-heritage-100/80">+63 912 345 6789</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 mt-1 text-heritage-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-heritage-100/80">Baguio City, Cordillera Administrative Region, Philippines</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form removed as requested */}
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-heritage-100/20 mt-12 pt-8 text-center">
            <p className="text-heritage-100/70">
              © 2024 Cordillera Heritage. All rights reserved. Preserving indigenous weaving through digital innovation.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
 
