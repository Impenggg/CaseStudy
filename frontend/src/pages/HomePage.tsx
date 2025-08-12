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
  const [currentProductSlide, setCurrentProductSlide] = useState(0);
  const [currentStorySlide, setCurrentStorySlide] = useState(0);

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
        name: "Mountain Pattern Shawl",
        price: 1800,
        image: "https://images.unsplash.com/photo-1594736797933-d0051ba0ff29?w=800",
        description: "Intricate geometric designs representing mountain landscapes",
        category: "Clothing"
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
    const productTimer = setInterval(() => {
      setCurrentProductSlide((prevSlide) => 
        prevSlide === featuredProducts.length - 1 ? 0 : prevSlide + 1
      );
    }, 5000);

    const storyTimer = setInterval(() => {
      setCurrentStorySlide((prevSlide) => 
        prevSlide === featuredStories.length - 1 ? 0 : prevSlide + 1
      );
    }, 6000);

    return () => {
      clearInterval(productTimer);
      clearInterval(storyTimer);
    };
  }, [featuredProducts.length, featuredStories.length]);

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

  // Story carousel functions
  const nextStorySlide = () => {
    setCurrentStorySlide(currentStorySlide === featuredStories.length - 1 ? 0 : currentStorySlide + 1);
  };

  const prevStorySlide = () => {
    setCurrentStorySlide(currentStorySlide === 0 ? featuredStories.length - 1 : currentStorySlide - 1);
  };

  const goToStorySlide = (index: number) => {
    setCurrentStorySlide(index);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1571816065864-c36e568cccdb?w=1920&h=1080&fit=crop"
            alt=""
            className="w-full h-full object-cover select-none"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cordillera-olive/95 via-cordillera-olive/90 to-cordillera-olive/85"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cordillera-olive/20"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-light text-cordillera-cream mb-8 tracking-wide leading-none">
              Cordillera Heritage
            </h1>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-sans text-cordillera-cream/95 mb-8 leading-relaxed font-medium">
              Preserving Indigenous Weaving Through Digital Innovation
            </h2>
            
            <p className="text-base sm:text-lg md:text-xl text-cordillera-cream/90 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
              Discover authentic handwoven treasures, immerse yourself in cultural stories, 
              and support preservation initiatives that keep centuries-old traditions alive.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <Link
                to="/marketplace"
                className="group relative bg-cordillera-gold text-cordillera-olive px-6 sm:px-8 lg:px-10 py-4 sm:py-5 text-base sm:text-lg font-semibold tracking-wide inline-block text-center overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-lg"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Explore Marketplace
                </span>
              </Link>

              <Link
                to="/stories"
                className="group relative border-2 border-cordillera-cream text-cordillera-cream px-6 sm:px-8 lg:px-10 py-4 sm:py-5 text-base sm:text-lg font-medium tracking-wide inline-block text-center overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm bg-cordillera-cream/10 rounded-lg"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Discover Stories
                </span>
              </Link>

              <Link
                to="/media-creation"
                className="group relative border-2 border-cordillera-cream text-cordillera-cream px-6 sm:px-8 lg:px-10 py-4 sm:py-5 text-base sm:text-lg font-medium tracking-wide inline-block text-center overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm bg-cordillera-cream/10 rounded-lg"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Media Creation
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections & Stories Section */}
      <section className="py-16 sm:py-20 bg-cordillera-olive">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-cordillera-cream mb-4">
              Featured Collections & Stories
            </h2>
            <p className="text-cordillera-cream/90 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
              Discover handpicked masterpieces and the personal journeys of master artisans
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Products Carousel */}
            <div>
              <h3 className="text-2xl font-serif font-light text-cordillera-cream mb-6 text-center lg:text-left">
                Featured Products
              </h3>
              <div className="relative">
            <div className="overflow-hidden relative">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentProductSlide * 100}%)` }}
              >
                {featuredProducts.map((product) => (
                      <div key={product.id} className="w-full flex-shrink-0 px-2">
                        <div className="bg-cordillera-cream rounded-xl shadow-2xl overflow-hidden h-[450px] transform transition-all duration-300 hover:scale-[1.02]">
                          <div className="h-[315px] relative overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          </div>
                          <div className="p-4 flex flex-col h-[135px]">
                            <h3 className="text-lg sm:text-xl font-serif text-cordillera-olive mb-2 font-medium">
                          {product.name}
                        </h3>
                            <p className="text-cordillera-olive/70 mb-auto text-xs leading-relaxed line-clamp-2">
                          {product.description}
                        </p>
                            <div className="flex justify-between items-center pt-3 border-t border-cordillera-olive/20">
                              <span className="text-lg sm:text-xl font-light text-cordillera-gold">
                            ₱{product.price.toLocaleString()}
                          </span>
                          <Link
                            to={`/product/${product.id}`}
                                className="bg-cordillera-olive text-cordillera-cream px-3 py-1.5 rounded-lg hover:bg-cordillera-olive/90 transition-all duration-300 font-medium shadow-lg hover:shadow-xl text-xs"
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
                  className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-cordillera-olive/80 text-white p-3 rounded-full hover:bg-cordillera-olive transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
                  onClick={nextProductSlide}
                  className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-cordillera-olive/80 text-white p-3 rounded-full hover:bg-cordillera-olive transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

                {/* Product Carousel Indicators */}
                <div className="flex justify-center mt-6 space-x-3">
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                      onClick={() => goToProductSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentProductSlide ? 'bg-cordillera-gold shadow-lg' : 'bg-cordillera-olive/30 hover:bg-cordillera-olive/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

            {/* Stories Carousel */}
            <div>
              <h3 className="text-2xl font-serif font-light text-cordillera-cream mb-6 text-center lg:text-left">
              Stories of Heritage
              </h3>
              <div className="relative">
                <div className="overflow-hidden relative">
                  <div 
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentStorySlide * 100}%)` }}
                  >
            {featuredStories.map((story) => (
                      <div key={story.id} className="w-full flex-shrink-0 px-2">
              <Link
                to={`/story/${story.id}`}
                          className="group block bg-cordillera-cream rounded-xl overflow-hidden hover:bg-cordillera-cream/95 transition-all duration-300 shadow-2xl transform hover:-translate-y-2 h-[450px]"
              >
                          <div className="h-[288px] overflow-hidden relative">
                  <img
                    src={story.media_url}
                    alt={story.title}
                              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                </div>
                          <div className="p-6 flex flex-col h-[162px]">
                            <h3 className="text-xl sm:text-2xl font-serif text-cordillera-olive mb-3 font-medium">
                    {story.title}
                  </h3>
                            <p className="text-cordillera-olive/70 mb-auto text-sm leading-relaxed line-clamp-2">
                    {story.content}
                  </p>
                            <div className="pt-4 border-t border-cordillera-olive/20">
                              <p className="text-cordillera-gold text-sm font-semibold uppercase tracking-wide">
                    By {story.author}
                  </p>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Story Carousel Controls */}
                <button
                  onClick={prevStorySlide}
                  className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-cordillera-olive/80 text-white p-3 rounded-full hover:bg-cordillera-olive transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextStorySlide}
                  className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-cordillera-olive/80 text-white p-3 rounded-full hover:bg-cordillera-olive transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Story Carousel Indicators */}
                <div className="flex justify-center mt-6 space-x-3">
                  {featuredStories.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToStorySlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentStorySlide ? 'bg-cordillera-gold shadow-lg' : 'bg-cordillera-olive/30 hover:bg-cordillera-olive/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-cordillera-olive text-cordillera-cream py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Information */}
            <div>
              <h3 className="text-2xl font-serif font-light mb-6">Contact Us</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 mt-1 text-cordillera-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-cordillera-cream/80">info@cordilleraheritage.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 mt-1 text-cordillera-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-cordillera-cream/80">+63 912 345 6789</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 mt-1 text-cordillera-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-cordillera-cream/80">Baguio City, Cordillera Administrative Region, Philippines</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form removed as requested */}
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-cordillera-cream/20 mt-12 pt-8 text-center">
            <p className="text-cordillera-cream/70">
              © 2024 Cordillera Heritage. All rights reserved. Preserving indigenous weaving through digital innovation.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
 
