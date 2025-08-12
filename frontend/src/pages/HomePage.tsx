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
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => 
        prevSlide === featuredProducts.length - 1 ? 0 : prevSlide + 1
      );
    }, 5000);

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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1571816065864-c36e568cccdb?w=1920&h=1080&fit=crop"
            alt="Philippine Mountain Valley - Cordillera Landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cordillera-olive via-cordillera-olive/85 to-cordillera-olive/40"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/50"></div>
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

            <div className="flex flex-col sm:flex-row gap-6">
              <Link
                to="/marketplace"
                className="group relative bg-cordillera-gold text-cordillera-olive px-12 py-5 text-lg font-semibold tracking-wide inline-block text-center overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Explore Marketplace
                </span>
              </Link>

              <Link
                to="/stories"
                className="group relative border-2 border-cordillera-cream text-cordillera-cream px-12 py-5 text-lg font-medium tracking-wide inline-block text-center overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm bg-cordillera-cream/10"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Discover Stories
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 bg-cordillera-olive">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-serif font-light text-cordillera-cream mb-4">
              Featured Collection
            </h2>
            <p className="text-cordillera-cream/80 text-lg max-w-2xl mx-auto">
              Handpicked masterpieces showcasing the finest in traditional Cordillera craftsmanship
            </p>
          </div>

          {/* Product Carousel */}
          <div className="relative max-w-5xl mx-auto">
            <div className="overflow-hidden relative">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {featuredProducts.map((product) => (
                  <div key={product.id} className="w-full flex-shrink-0 px-4">
                    <div className="bg-cordillera-cream rounded-lg shadow-lg overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-cover"
                      />
                      <div className="p-6">
                        <h3 className="text-2xl font-serif text-cordillera-olive mb-2">
                          {product.name}
                        </h3>
                        <p className="text-cordillera-olive/70 mb-4">
                          {product.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-light text-cordillera-gold">
                            ₱{product.price.toLocaleString()}
                          </span>
                          <Link
                            to={`/product/${product.id}`}
                            className="bg-cordillera-olive text-cordillera-cream px-6 py-2 rounded-md hover:bg-cordillera-olive/90 transition-colors"
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

            {/* Carousel Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-cordillera-olive/50 text-white p-2 rounded-full hover:bg-cordillera-olive transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-cordillera-olive/50 text-white p-2 rounded-full hover:bg-cordillera-olive transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Carousel Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-cordillera-gold' : 'bg-cordillera-olive/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stories Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-serif font-light text-cordillera-olive mb-4">
              Stories of Heritage
            </h2>
            <p className="text-cordillera-olive/80 text-lg max-w-2xl mx-auto">
              Discover the personal journeys and cultural wisdom of master artisans
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredStories.map((story) => (
              <Link
                key={story.id}
                to={`/story/${story.id}`}
                className="group block bg-cordillera-olive/10 rounded-lg overflow-hidden hover:bg-cordillera-olive/20 transition-colors"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={story.media_url}
                    alt={story.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-serif text-cordillera-olive mb-2">
                    {story.title}
                  </h3>
                  <p className="text-cordillera-olive/70 mb-4">
                    {story.content}
                  </p>
                  <p className="text-cordillera-gold text-sm font-medium">
                    By {story.author}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;