import React, { useState, useEffect } from 'react';
import { triggerAction } from '../lib/uiActions';
import { useParams, Link } from 'react-router-dom';

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
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('story');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

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
      ]
    };
    setProduct(sampleProduct);
  }, [id]);

  // Auto-play carousel functionality
  useEffect(() => {
    if (!product || !isAutoPlaying) return;

    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % product.gallery.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [product, isAutoPlaying]);

  const nextImage = () => {
    if (!product) return;
    setSelectedImage((prev) => (prev + 1) % product.gallery.length);
    setIsAutoPlaying(false); // Stop auto-play when user manually navigates
  };

  const prevImage = () => {
    if (!product) return;
    setSelectedImage((prev) => (prev - 1 + product.gallery.length) % product.gallery.length);
    setIsAutoPlaying(false); // Stop auto-play when user manually navigates
  };

  const goToImage = (index: number) => {
    setSelectedImage(index);
    setIsAutoPlaying(false); // Stop auto-play when user manually selects
  };

  if (!product) {
    return <div className="min-h-screen bg-cordillera-olive flex items-center justify-center">
      <div className="text-cordillera-cream">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-cordillera-cream">
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
          <Link to="/marketplace" className="inline-flex items-center border-2 border-cordillera-olive text-cordillera-olive px-4 py-2 rounded-lg bg-cordillera-cream/40 hover:bg-cordillera-gold hover:border-cordillera-gold hover:text-cordillera-olive transition-all">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Marketplace
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Enhanced Slideshow Carousel */}
          <div className="space-y-6">
            {/* Main Carousel Container */}
            <div className="relative aspect-square overflow-hidden border-2 border-cordillera-gold/30 bg-white shadow-lg group">
              {/* Carousel Images */}
              <div className="relative w-full h-full">
                <img
                  src={product.gallery[selectedImage]}
                  alt={`${product.name} - Image ${selectedImage + 1}`}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                
                {/* Gradient Overlays for Navigation */}
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-cordillera-olive/80 hover:bg-cordillera-olive text-cordillera-cream p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-cordillera-olive/80 hover:bg-cordillera-olive text-cordillera-cream p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                aria-label="Next image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {product.gallery.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      selectedImage === index 
                        ? 'bg-cordillera-gold scale-125' 
                        : 'bg-cordillera-cream/60 hover:bg-cordillera-cream/80'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>

              {/* Image Counter */}
              <div className="absolute top-4 right-4 bg-cordillera-olive/80 text-cordillera-cream px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                {selectedImage + 1} / {product.gallery.length}
              </div>

              {/* Auto-play Toggle */}
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="absolute top-4 left-4 bg-cordillera-olive/80 hover:bg-cordillera-olive text-cordillera-cream p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
                aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
                title={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
              >
                {isAutoPlaying ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h1m4 0h1M9 6h6" />
                  </svg>
                )}
              </button>
            </div>
            
            {/* Enhanced Thumbnail Gallery */}
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {product.gallery.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`flex-shrink-0 w-20 h-20 overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                    selectedImage === index 
                      ? 'border-cordillera-gold shadow-lg scale-105' 
                      : 'border-cordillera-gold/30 hover:border-cordillera-gold/60'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Gallery Info */}
            <div className="flex items-center justify-between text-sm text-cordillera-olive/60">
              <span>View all {product.gallery.length} images</span>
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-cordillera-gold animate-pulse' : 'bg-cordillera-olive/30'}`}></span>
                <span>{isAutoPlaying ? 'Auto-playing' : 'Manual'}</span>
              </div>
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
              
              <div className="flex items-center justify-between mb-8">
                <span className="text-3xl font-light text-cordillera-gold">
                  ₱{product.price.toLocaleString()}
                </span>
                <span className="text-sm uppercase tracking-wider text-cordillera-olive/50 bg-cordillera-sage px-3 py-1">
                  {product.category}
                </span>
              </div>

               <button onClick={() => triggerAction(`Add ${product.name} to cart`)} className="w-full bg-cordillera-gold text-cordillera-olive py-4 text-lg font-medium hover:bg-cordillera-olive hover:text-cordillera-cream transition-all duration-200 tracking-wide">
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
    </div>
  );
};

export default ProductDetailPage;
