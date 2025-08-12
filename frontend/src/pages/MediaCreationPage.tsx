import React, { useState, useEffect } from 'react';

interface FeaturedCreation {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  artist: string;
}

const MediaCreationPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<'photo' | 'design'>('photo');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Sample featured creations data
  const featuredCreations: FeaturedCreation[] = [
    {
      id: 1,
      title: "Traditional Ikat Pattern Photography",
      description: "Professional product photography showcasing the intricate details of traditional Ikat patterns",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800",
      category: "Product Photography",
      artist: "Maria Santos"
    },
    {
      id: 2,
      title: "Weaving Process Documentary",
      description: "A series of photographs documenting the traditional weaving process from start to finish",
      image: "https://images.unsplash.com/photo-1582582494881-41e67beece72?w=800",
      category: "Documentary",
      artist: "Juan dela Cruz"
    },
    {
      id: 3,
      title: "Modern Marketing Campaign",
      description: "Contemporary social media campaign featuring traditional weaving in modern contexts",
      image: "https://images.unsplash.com/photo-1594736797933-d0051ba0ff29?w=800",
      category: "Marketing",
      artist: "Ana Rivera"
    },
    {
      id: 4,
      title: "Heritage Collection Lookbook",
      description: "Professional lookbook photography for the latest heritage collection",
      image: "https://images.unsplash.com/photo-1565084287938-0bcf4d4b90d8?w=800",
      category: "Fashion",
      artist: "Pedro Reyes"
    }
  ];

  // Carousel controls
  const nextSlide = () => {
    setCurrentSlide(currentSlide === featuredCreations.length - 1 ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? featuredCreations.length - 1 : currentSlide - 1);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto-play functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => 
        prevSlide === featuredCreations.length - 1 ? 0 : prevSlide + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [featuredCreations.length]);

  // File handling functions
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="min-h-screen bg-cordillera-cream">
      {/* Hero Section */}
      <section className="relative py-24 bg-cordillera-olive">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-6xl md:text-7xl font-serif font-light text-cordillera-cream mb-8">
            Media Creation Studio
          </h1>
          <p className="text-xl text-cordillera-cream/80 max-w-3xl mx-auto leading-relaxed">
            Create stunning visuals that showcase your weaving craftsmanship. 
            Learn photography techniques and use our design tools to make your products shine.
          </p>
        </div>
      </section>

      {/* Featured Creations Carousel */}
      <section className="py-16 bg-cordillera-olive/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-serif text-cordillera-olive text-center mb-12">
            Featured Creations
          </h2>

          {/* Carousel Container */}
          <div className="relative max-w-5xl mx-auto">
            <div className="overflow-hidden relative rounded-lg shadow-xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {featuredCreations.map((creation) => (
                  <div key={creation.id} className="w-full flex-shrink-0">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      {/* Creation Image */}
                      <div className="aspect-square overflow-hidden bg-white">
                        <img
                          src={creation.image}
                          alt={creation.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Creation Details */}
                      <div className="p-8 text-center md:text-left">
                        <span className="text-cordillera-gold text-sm font-medium uppercase tracking-wider">
                          {creation.category}
                        </span>
                        <h3 className="text-3xl font-serif text-cordillera-olive mt-2 mb-4">
                          {creation.title}
                        </h3>
                        <p className="text-cordillera-olive/70 text-lg mb-6 leading-relaxed">
                          {creation.description}
                        </p>
                        <div className="flex items-center justify-center md:justify-start space-x-2 text-cordillera-olive/60">
                          <span className="text-sm">By {creation.artist}</span>
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
              aria-label="Previous creation"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-cordillera-olive/90 backdrop-blur-sm text-cordillera-cream p-4 hover:bg-cordillera-gold hover:text-cordillera-olive transition-all duration-300 z-10 shadow-lg hover:shadow-xl rounded-full hover:scale-110"
              aria-label="Next creation"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Slide Indicators */}
            <div className="flex justify-center mt-8 space-x-4">
              {featuredCreations.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-cordillera-gold scale-125' 
                      : 'bg-cordillera-olive/20 hover:bg-cordillera-olive/40'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-12">
            <div className="bg-cordillera-sage/20 p-1 rounded-lg inline-flex">
              <button
                onClick={() => setActiveTab('photo')}
                className={`px-8 py-3 rounded-md transition-all duration-300 ${
                  activeTab === 'photo'
                    ? 'bg-cordillera-gold text-cordillera-olive shadow-md'
                    : 'text-cordillera-olive hover:bg-cordillera-gold/20'
                }`}
              >
                Photography Guide
              </button>
              <button
                onClick={() => setActiveTab('design')}
                className={`px-8 py-3 rounded-md transition-all duration-300 ${
                  activeTab === 'design'
                    ? 'bg-cordillera-gold text-cordillera-olive shadow-md'
                    : 'text-cordillera-olive hover:bg-cordillera-gold/20'
                }`}
              >
                Design Tools
              </button>
            </div>
          </div>

          {/* Enhanced Upload Area */}
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Upload Box */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 h-full flex flex-col justify-center ${
                  isDragging 
                    ? 'border-cordillera-gold bg-cordillera-gold/5 scale-102' 
                    : 'border-cordillera-sage hover:border-cordillera-gold bg-white hover:shadow-lg'
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setSelectedImage(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                
                {!selectedImage && (
                  <div className="space-y-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-cordillera-gold/10 rounded-full flex items-center justify-center mx-auto">
                        <svg
                          className="w-10 h-10 text-cordillera-gold"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif text-cordillera-olive mb-3">
                        Upload your product photo
                      </h3>
                      <p className="text-cordillera-olive/60 mb-6 text-lg">
                        Drag and drop your image here, or click to select a file
                      </p>
                      <div className="flex flex-col items-center space-y-3">
                        <p className="text-sm text-cordillera-olive/40 px-4 py-2 bg-cordillera-sage/10 rounded-full inline-block">
                          Supported formats: JPG, PNG, GIF (max 10MB)
                        </p>
                        <div className="flex items-center space-x-2 text-cordillera-olive/40 text-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Click anywhere in this area to browse files</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Preview and Actions */}
              <div className={`bg-white rounded-lg shadow-sm p-6 ${!selectedImage && 'opacity-50'}`}>
                <div className="h-full flex flex-col">
                  <h4 className="text-xl font-serif text-cordillera-olive mb-4">Image Preview</h4>
                  {selectedImage ? (
                    <>
                      <div className="flex-grow relative rounded-lg overflow-hidden bg-cordillera-sage/10 mb-4">
                        <img
                          src={selectedImage}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex justify-between gap-4">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(null);
                          }}
                          className="flex-1 bg-cordillera-gold text-cordillera-olive px-4 py-3 rounded-md hover:bg-cordillera-gold/90 transition-colors flex items-center justify-center group"
                        >
                          <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          New Image
                        </button>
                        <button 
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 border-2 border-cordillera-gold text-cordillera-olive px-4 py-3 rounded-md hover:bg-cordillera-gold/10 transition-colors flex items-center justify-center group"
                        >
                          <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          Save Image
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex-grow flex items-center justify-center border-2 border-dashed border-cordillera-sage/20 rounded-lg">
                      <div className="text-center text-cordillera-olive/40">
                        <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p>No image selected</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="w-12 h-12 bg-cordillera-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-cordillera-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h5 className="text-cordillera-olive font-medium mb-1">High Resolution</h5>
                <p className="text-sm text-cordillera-olive/60">Upload high-quality images for best results</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="w-12 h-12 bg-cordillera-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-cordillera-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h5 className="text-cordillera-olive font-medium mb-1">Good Lighting</h5>
                <p className="text-sm text-cordillera-olive/60">Natural lighting works best for product photos</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="w-12 h-12 bg-cordillera-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-cordillera-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h5 className="text-cordillera-olive font-medium mb-1">Clean Background</h5>
                <p className="text-sm text-cordillera-olive/60">Use simple backgrounds to highlight your product</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MediaCreationPage;