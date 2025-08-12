import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

interface Story {
  id: number;
  title: string;
  content: string;
  media_url: string;
  author: string;
}

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [featuredStories, setFeaturedStories] = useState<Story[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Sample featured products data for carousel
    setFeaturedProducts([
      {
        id: 1,
        name: "Traditional Ikat Blanket",
        price: 2500,
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
        description: "Handwoven with indigenous patterns passed down through generations",
        category: "Blankets"
      },
      {
        id: 2,
        name: "Cordillera Table Runner",
        price: 850,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
        description: "Elegant dining centerpiece with traditional motifs",
        category: "Home Decor"
      },
      {
        id: 3,
        name: "Woven Shoulder Bag",
        price: 1200,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
        description: "Durable traditional craftsmanship for everyday use",
        category: "Accessories"
      },
      {
        id: 4,
        name: "Mountain Pattern Shawl",
        price: 1800,
        image: "https://images.unsplash.com/photo-1594736797933-d0051ba0ff29?w=800",
        description: "Intricate geometric designs representing mountain landscapes",
        category: "Clothing"
      },
      {
        id: 5,
        name: "Ceremonial Wall Hanging",
        price: 3200,
        image: "https://images.unsplash.com/photo-1565084287938-0bcf4d4b90d8?w=800",
        description: "Sacred ceremonial weaving with spiritual significance",
        category: "Art"
      }
    ]);

    // Sample featured stories data
    setFeaturedStories([
      {
        id: 1,
        title: "Master Weaver Maria's Journey",
        content: "Discover how Maria preserves 300-year-old weaving techniques...",
        media_url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500",
        author: "Maria Santos"
      },
      {
        id: 2,
        title: "The Art of Natural Dyeing",
        content: "Learning traditional plant-based coloring methods...",
        media_url: "https://images.unsplash.com/photo-1582582494881-41e67beece72?w=500",
        author: "Carlos Mendoza"
      }
    ]);
  }, []);

  // Carousel auto-play functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => 
        prevSlide === featuredProducts.length - 1 ? 0 : prevSlide + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [featuredProducts.length]);

  const nextSlide = () => {
    setCurrentSlide(currentSlide === featuredProducts.length - 1 ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? featuredProducts.length - 1 : currentSlide - 1);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-cordillera-olive">
      {/* Hero Section - Full-width artisan weaving photo with gradient overlay */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image - Philippine Mountains */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1571816065864-c36e568cccdb?w=1920&h=1080&fit=crop"
            alt="Philippine Mountain Valley - Cordillera Landscape"
            className="w-full h-full object-cover"
          />
          {/* Enhanced Gradient Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-cordillera-olive via-cordillera-olive/85 to-cordillera-olive/40"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cordillera-olive/50"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-7xl md:text-9xl font-serif font-light text-cordillera-cream mb-8 tracking-wide leading-tight">
              Cordillera Heritage
            </h1>
            <h2 className="text-2xl md:text-4xl font-sans text-cordillera-cream/90 mb-8 leading-relaxed">
              Preserving Indigenous Weaving Through Digital Innovation
            </h2>
            
            <p className="text-xl text-cordillera-cream/90 mb-12 max-w-2xl font-light leading-relaxed">
              Discover authentic handwoven treasures, immerse yourself in cultural stories, 
              and support preservation initiatives that keep centuries-old traditions alive.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Link
                    to="/marketplace"
                className="group relative bg-cordillera-gold text-cordillera-olive px-12 py-5 text-lg font-semibold tracking-wide inline-block text-center overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                aria-label="Explore our marketplace of authentic handwoven products"
              >
                <span className="relative z-10 flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Explore Marketplace
                </span>
                <div className="absolute inset-0 bg-cordillera-olive transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <span className="absolute inset-0 flex items-center justify-center text-cordillera-cream opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 font-semibold">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Explore Marketplace
                </span>
                  </Link>
              
                  <Link
                    to="/stories"
                className="group relative border-2 border-cordillera-cream text-cordillera-cream px-12 py-5 text-lg font-medium tracking-wide inline-block text-center overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm bg-cordillera-cream/10"
                aria-label="Discover inspiring stories from artisans"
              >
                <span className="relative z-10 flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Discover Stories
                </span>
                <div className="absolute inset-0 bg-cordillera-cream transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <span className="absolute inset-0 flex items-center justify-center text-cordillera-olive opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 font-semibold">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                    Discover Stories
                </span>
                  </Link>
              
              <Link
                to="/media-creation"
                className="group relative border-2 border-cordillera-gold text-cordillera-gold px-12 py-5 text-lg font-semibold tracking-wide overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-cordillera-gold/20"
                aria-label="Learn about our media creation services"
              >
                <span className="relative z-10 flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Media Creation
                </span>
                <div className="absolute inset-0 bg-cordillera-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <span className="absolute inset-0 flex items-center justify-center text-cordillera-olive opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 font-semibold">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Media Creation
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Carousel Slideshow */}
      <section className="py-24 bg-cordillera-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
            <h2 className="text-5xl font-serif font-light text-cordillera-olive mb-4">
              Featured Collection
              </h2>
            <p className="text-cordillera-olive/70 text-lg max-w-2xl mx-auto">
              Handpicked masterpieces showcasing the finest in traditional Cordillera craftsmanship
            </p>
          </div>

          {/* Carousel Container */}
          <div className="relative max-w-5xl mx-auto">
            <div className="overflow-hidden relative">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {featuredProducts.map((product) => (
                  <div key={product.id} className="w-full flex-shrink-0">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                      {/* Product Image */}
                      <div className="aspect-square overflow-hidden bg-white shadow-lg">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="text-center md:text-left">
                        <span className="text-cordillera-gold text-sm font-medium uppercase tracking-wider">
                          {product.category}
                        </span>
                        <h3 className="text-4xl font-serif text-cordillera-olive mt-2 mb-4 leading-tight">
                          {product.name}
                        </h3>
                        <p className="text-cordillera-olive/70 text-lg mb-6 leading-relaxed">
                          {product.description}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mb-8">
                          <span className="text-3xl font-light text-cordillera-gold">
                            ₱{product.price.toLocaleString()}
                          </span>
                          <Link
                            to={`/product/${product.id}`}
                            className="group relative bg-cordillera-gold text-cordillera-olive px-8 py-4 font-semibold overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 border border-cordillera-gold"
                            aria-label={`View details for ${product.name}`}
                          >
                            <span className="relative z-10 flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View Details
                            </span>
                            <div className="absolute inset-0 bg-cordillera-olive transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                            <span className="absolute inset-0 flex items-center justify-center text-cordillera-cream opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 font-semibold">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View Details
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-cordillera-olive/90 backdrop-blur-sm text-cordillera-cream p-4 hover:bg-cordillera-gold hover:text-cordillera-olive transition-all duration-300 z-10 shadow-lg hover:shadow-xl rounded-full hover:scale-110"
              aria-label="Previous product"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-cordillera-olive/90 backdrop-blur-sm text-cordillera-cream p-4 hover:bg-cordillera-gold hover:text-cordillera-olive transition-all duration-300 z-10 shadow-lg hover:shadow-xl rounded-full hover:scale-110"
              aria-label="Next product"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Slide Indicators */}
            <div className="flex justify-center mt-8 space-x-4">
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 hover:scale-125 shadow-sm ${
                    index === currentSlide 
                      ? 'bg-cordillera-gold ring-2 ring-cordillera-gold/30 ring-offset-2 ring-offset-cordillera-cream' 
                      : 'bg-cordillera-sage hover:bg-cordillera-sage/70'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Touch/Swipe Support for Mobile */}
            <div 
              className="absolute inset-0 cursor-pointer"
              onTouchStart={(e) => {
                const touchStart = e.touches[0].clientX;
                e.currentTarget.addEventListener('touchend', (endEvent) => {
                  const touchEnd = (endEvent as TouchEvent).changedTouches[0].clientX;
                  const difference = touchStart - touchEnd;
                  if (Math.abs(difference) > 50) {
                    if (difference > 0) {
                      nextSlide();
                    } else {
                      prevSlide();
                    }
                  }
                }, { once: true });
              }}
            />
          </div>
        </div>
      </section>

      {/* Cultural Heritage Section - 3 feature cards */}
      <section className="py-24 bg-cordillera-sage">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-serif font-light text-cordillera-olive mb-4">
              Preserving Our Heritage
            </h2>
            <p className="text-cordillera-olive/70 text-lg max-w-3xl mx-auto leading-relaxed">
              Three pillars supporting the preservation and celebration of indigenous weaving traditions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* E-commerce Card */}
            <div className="bg-cordillera-sage p-8 text-center hover:bg-cordillera-sage/80 transition-colors duration-300">
              <div className="w-20 h-20 bg-cordillera-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-cordillera-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-2xl font-serif text-cordillera-olive mb-4">E-commerce</h3>
              <p className="text-cordillera-olive/70 leading-relaxed mb-6">
                Connect directly with master artisans and purchase authentic handwoven treasures, 
                supporting traditional craftsmanship and sustainable livelihoods.
              </p>
              <Link
                to="/marketplace"
                className="group relative inline-block bg-cordillera-gold text-cordillera-olive px-8 py-4 text-sm font-semibold hover:bg-cordillera-gold/90 transition-all duration-300 overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <span className="relative z-10 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Explore Marketplace
                </span>
                <div className="absolute inset-0 bg-cordillera-olive transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <span className="absolute inset-0 flex items-center justify-center text-cordillera-cream opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 font-semibold">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Explore Marketplace
                </span>
              </Link>
            </div>

            {/* Storytelling Card */}
            <div className="bg-cordillera-sage p-8 text-center hover:bg-cordillera-sage/80 transition-colors duration-300">
              <div className="w-20 h-20 bg-cordillera-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-cordillera-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-serif text-cordillera-olive mb-4">Storytelling</h3>
              <p className="text-cordillera-olive/70 leading-relaxed mb-6">
                Immerse yourself in the rich narratives of traditional weavers through blogs, 
                short films, and photo galleries that capture cultural heritage.
              </p>
              <Link
                to="/stories"
                className="group relative inline-block bg-cordillera-gold text-cordillera-olive px-8 py-4 text-sm font-semibold hover:bg-cordillera-gold/90 transition-all duration-300 overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <span className="relative z-10 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Read Stories
                </span>
                <div className="absolute inset-0 bg-cordillera-olive transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <span className="absolute inset-0 flex items-center justify-center text-cordillera-cream opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 font-semibold">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Read Stories
                </span>
              </Link>
            </div>

            {/* Fundraising Card */}
            <div className="bg-cordillera-sage p-8 text-center hover:bg-cordillera-sage/80 transition-colors duration-300">
              <div className="w-20 h-20 bg-cordillera-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-cordillera-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-serif text-cordillera-olive mb-4">Fundraising</h3>
              <p className="text-cordillera-olive/70 leading-relaxed mb-6">
                Support community initiatives and preservation projects through crowdfunding campaigns 
                that ensure cultural traditions survive for future generations.
              </p>
              <Link
                to="/fundraising"
                className="group relative inline-block bg-cordillera-gold text-cordillera-olive px-8 py-4 text-sm font-semibold hover:bg-cordillera-gold/90 transition-all duration-300 overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <span className="relative z-10 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  View Campaigns
                </span>
                <div className="absolute inset-0 bg-cordillera-olive transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <span className="absolute inset-0 flex items-center justify-center text-cordillera-cream opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 font-semibold">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  View Campaigns
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stories Section */}
      <section className="py-24 bg-cordillera-olive">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-serif font-light text-cordillera-cream mb-4">
              Stories of Heritage
            </h2>
            <p className="text-cordillera-cream/80 text-lg max-w-2xl mx-auto">
              Discover the personal journeys and cultural wisdom of master artisans
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredStories.map((story) => (
              <Link
                key={story.id}
                to={`/story/${story.id}`}
                className="group block bg-cordillera-olive hover:bg-cordillera-olive/80 transition-colors duration-300 overflow-hidden"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={story.media_url}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif text-cordillera-cream mb-2 group-hover:text-cordillera-cream/90">
                    {story.title}
                  </h3>
                  <p className="text-cordillera-cream/70 text-sm mb-3 leading-relaxed">
                    {story.content}
                  </p>
                  <p className="text-xs uppercase tracking-wider text-cordillera-gold">
                    By {story.author}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Media Creation Section */}
      <section id="media-creation-section" className="py-24 bg-cordillera-olive">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-serif font-light text-cordillera-cream mb-6">
              Media Creation Services
            </h2>
            <p className="text-xl text-cordillera-cream/90 max-w-4xl mx-auto leading-relaxed">
              Create visually compelling content that promotes indigenous weaving
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div>
              <h3 className="text-3xl font-serif text-cordillera-cream mb-6">
                Professional Visual Storytelling
              </h3>
              <div className="space-y-6 text-cordillera-cream/90 leading-relaxed">
                <p>
                  <strong className="text-cordillera-gold">Mobile Photography:</strong> Capture high-quality, 
                  well-lit images of weaving products that highlight their colors, patterns, and craftsmanship. 
                  Our mobile photography techniques ensure every thread and texture is beautifully showcased.
                </p>
                <p>
                  <strong className="text-cordillera-gold">Graphic Design:</strong> Enhance these images through 
                  creative graphic design—adding branding, storytelling elements, and layouts for posters, 
                  social media posts, and infographics that honor the cultural significance of each piece.
                </p>
                <p>
                  <strong className="text-cordillera-gold">Global Appeal:</strong> The goal is to make the products 
                  visually irresistible for both local and global audiences, bridging traditional craftsmanship 
                  with contemporary marketing needs.
                </p>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-6">
                <Link
                  to="/media-creation"
                  className="group relative bg-cordillera-gold text-cordillera-olive px-10 py-5 font-semibold overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <span className="relative z-10 flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Start Your Project
                  </span>
                  <div className="absolute inset-0 bg-cordillera-cream transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <span className="absolute inset-0 flex items-center justify-center text-cordillera-olive opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 font-semibold">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Start Your Project
                  </span>
                </Link>
                <Link
                  to="/media-creation"
                  className="group relative border-2 border-cordillera-cream text-cordillera-cream px-10 py-5 font-medium overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm bg-cordillera-cream/10"
                >
                  <span className="relative z-10 flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    View Portfolio
                  </span>
                  <div className="absolute inset-0 bg-cordillera-cream transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <span className="absolute inset-0 flex items-center justify-center text-cordillera-olive opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 font-semibold">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    View Portfolio
                  </span>
                </Link>
              </div>
            </div>

            {/* Visual Elements */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-square bg-cordillera-sage/20 rounded overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400"
                    alt="Mobile photography of weaving process"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="aspect-video bg-cordillera-sage/20 rounded overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1582582494881-41e67beece72?w=400"
                    alt="Traditional weaving patterns"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="aspect-video bg-cordillera-sage/20 rounded overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1594736797933-d0051ba0ff29?w=400"
                    alt="Graphic design elements"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="aspect-square bg-cordillera-sage/20 rounded overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1565084287938-0bcf4d4b90d8?w=400"
                    alt="Final marketing materials"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-cordillera-sage py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div>
              <h3 className="text-2xl font-serif text-cordillera-olive mb-6">Contact Us</h3>
              <div className="space-y-4 text-cordillera-olive/80">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-cordillera-gold mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:info@cordilleraweaving.ph" className="hover:text-cordillera-olive transition-colors">
                    info@cordilleraweaving.ph
                  </a>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-cordillera-gold mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+639171234567" className="hover:text-cordillera-olive transition-colors">
                    +63 917 123 4567
                  </a>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-cordillera-gold mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>
                    Banaue Rice Terraces<br />
                    Ifugao Province, Philippines
                  </span>
                </div>
              </div>
              </div>

            {/* Social Media Links */}
            <div>
              <h3 className="text-2xl font-serif text-cordillera-olive mb-6">Follow Us</h3>
              <div className="flex space-x-4">
                <a 
                  href="https://facebook.com/cordilleraweaving" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group bg-cordillera-olive text-cordillera-cream p-4 hover:bg-cordillera-gold hover:text-cordillera-olive transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 rounded-lg"
                  aria-label="Follow us on Facebook"
                >
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a 
                  href="https://instagram.com/cordilleraweaving" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group bg-cordillera-olive text-cordillera-cream p-4 hover:bg-cordillera-gold hover:text-cordillera-olive transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 rounded-lg"
                  aria-label="Follow us on Instagram"
                >
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.926 3.708 13.775 3.708 12.477s.49-2.448 1.418-3.323c.928-.875 2.079-1.365 3.323-1.365 1.297 0 2.448.49 3.323 1.365.875.875 1.365 2.026 1.365 3.323s-.49 2.449-1.365 3.324c-.875.807-2.026 1.297-3.323 1.297zm7.83-5.607c-.218.436-.566.764-1.002.984-.436.218-.895.327-1.365.327-.653 0-1.244-.218-1.679-.653-.436-.436-.653-1.026-.653-1.679 0-.653.218-1.244.653-1.679.436-.436 1.026-.653 1.679-.653.653 0 1.244.218 1.679.653.436.436.653 1.026.653 1.679 0 .327-.109.654-.327.981-.218.327-.436.546-.638.654z"/>
                  </svg>
                </a>
                <a 
                  href="https://youtube.com/cordilleraweaving" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group bg-cordillera-olive text-cordillera-cream p-4 hover:bg-cordillera-gold hover:text-cordillera-olive transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 rounded-lg"
                  aria-label="Subscribe to our YouTube channel"
                >
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
              <p className="mt-6 text-cordillera-olive/70 text-sm leading-relaxed">
                Stay connected with our community and get the latest updates on traditional weaving, 
                new products, and cultural preservation initiatives.
              </p>
            </div>

            {/* Mission Statement */}
            <div>
              <h3 className="text-2xl font-serif text-cordillera-olive mb-6">Our Mission</h3>
              <p className="text-cordillera-olive/80 leading-relaxed mb-6">
                Preserving indigenous weaving traditions through digital innovation, 
                connecting master artisans with global audiences while ensuring 
                cultural heritage thrives for future generations.
              </p>
              <div className="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=60&h=60&fit=crop&crop=face" 
                  alt="Traditional weaving"
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <p className="text-cordillera-olive font-medium">Heritage Preservation</p>
                  <p className="text-cordillera-olive/60 text-sm">Since 1850</p>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-cordillera-olive/20 mt-12 pt-8 text-center">
            <p className="text-cordillera-olive/60 text-sm">
              © 2024 Cordillera Weaving Heritage Platform. All rights reserved. 
              Built with respect for indigenous traditions and cultural preservation.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;