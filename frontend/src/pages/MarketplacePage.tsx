import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    // Sample products data with high-quality images
    const sampleProducts: Product[] = [
      {
        id: 1,
        name: "Traditional Ikat Blanket",
        price: 2500,
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600",
        description: "Handwoven with indigenous patterns",
        category: "Blankets",
        artisan: "Maria Santos"
      },
      {
        id: 2,
        name: "Cordillera Table Runner",
        price: 850,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
        description: "Elegant dining centerpiece",
        category: "Home Decor",
        artisan: "Carlos Mendoza"
      },
      {
        id: 3,
        name: "Woven Shoulder Bag",
        price: 1200,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
        description: "Durable traditional craftsmanship",
        category: "Accessories",
        artisan: "Ana Bautista"
      },
      {
        id: 4,
        name: "Mountain Pattern Shawl",
        price: 1800,
        image: "https://images.unsplash.com/photo-1594736797933-d0051ba0ff29?w=600",
        description: "Intricate geometric designs",
        category: "Clothing",
        artisan: "Roberto Calam"
      },
      {
        id: 5,
        name: "Traditional Placemats Set",
        price: 650,
        image: "https://images.unsplash.com/photo-1558618666-fcd25b9cd7db?w=600",
        description: "Set of 6 handwoven placemats",
        category: "Home Decor",
        artisan: "Elena Cruz"
      },
      {
        id: 6,
        name: "Cordillera Wall Hanging",
        price: 1400,
        image: "https://images.unsplash.com/photo-1582582494881-41e67beece72?w=600",
        description: "Decorative cultural art piece",
        category: "Art",
        artisan: "Jose Dagdag"
      },
      {
        id: 7,
        name: "Traditional Backpack",
        price: 2200,
        image: "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=600",
        description: "Sturdy mountain-style backpack",
        category: "Accessories",
        artisan: "Maria Santos"
      },
      {
        id: 8,
        name: "Ceremonial Textile",
        price: 3500,
        image: "https://images.unsplash.com/photo-1565084287938-0bcf4d4b90d8?w=600",
        description: "Sacred ceremonial weaving",
        category: "Ceremonial",
        artisan: "Elder Aniceto"
      }
    ];
    setProducts(sampleProducts);
    setFilteredProducts(sampleProducts);
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <div className="min-h-screen bg-cordillera-cream">
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
            <div className="bg-cordillera-sage p-8 sticky top-8 shadow-lg">
              <div className="flex items-center mb-6">
                <svg className="w-6 h-6 text-cordillera-gold mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <h3 className="text-2xl font-serif text-cordillera-olive">Refine Search</h3>
              </div>
              
              {/* Enhanced Search */}
              <div className="mb-6">
                <label className="block text-cordillera-olive/80 text-sm font-semibold mb-3">
                  Search Products
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or description..."
                    className="w-full px-4 py-3 pl-12 bg-white border-2 border-cordillera-olive/20 text-cordillera-olive placeholder-cordillera-olive/50 focus:outline-none focus:border-cordillera-gold focus:ring-2 focus:ring-cordillera-gold/20 transition-all duration-200 rounded-lg"
                  />
                  <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cordillera-olive/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Enhanced Category Filter */}
              <div className="mb-6">
                <label className="block text-cordillera-olive/80 text-sm font-semibold mb-3">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-cordillera-olive/20 text-cordillera-olive focus:outline-none focus:border-cordillera-gold focus:ring-2 focus:ring-cordillera-gold/20 transition-all duration-200 rounded-lg appearance-none cursor-pointer"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cordillera-olive/40 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Enhanced Sort By */}
              <div className="mb-8">
                <label className="block text-cordillera-olive/80 text-sm font-semibold mb-3">
                  Sort By
                </label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-cordillera-olive/20 text-cordillera-olive focus:outline-none focus:border-cordillera-gold focus:ring-2 focus:ring-cordillera-gold/20 transition-all duration-200 rounded-lg appearance-none cursor-pointer"
                  >
                    <option value="">Default</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cordillera-olive/40 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                }}
                className="group relative w-full bg-cordillera-gold text-cordillera-olive py-4 font-semibold hover:bg-cordillera-gold/90 transition-all duration-300 overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-0.5 rounded-lg"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Clear All Filters
                </span>
                <div className="absolute inset-0 bg-cordillera-olive transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <span className="absolute inset-0 flex items-center justify-center text-cordillera-cream opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 font-semibold">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Clear All Filters
                </span>
              </button>

              {/* Filter Summary */}
              {(searchTerm || selectedCategory || sortBy) && (
                <div className="mt-6 p-4 bg-cordillera-olive/10 rounded-lg">
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
                  className="group block"
                >
                  {/* Enhanced Nikitin-style Product Card */}
                  <div className="bg-white shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden rounded-lg border border-cordillera-sage/20">
                    <div className="aspect-square overflow-hidden relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-cordillera-olive/0 group-hover:bg-cordillera-olive/10 transition-colors duration-300"></div>
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 bg-cordillera-gold/90 text-cordillera-olive px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                        {product.category}
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="text-xl font-serif text-cordillera-olive mb-3 leading-tight group-hover:text-cordillera-gold transition-colors duration-300">
                        {product.name}
                      </h3>
                      <p className="text-cordillera-olive/60 text-sm mb-6 leading-relaxed line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-end">
                        <div>
                          <span className="text-2xl font-light text-cordillera-gold block mb-1">
                            ₱{product.price.toLocaleString()}
                          </span>
                          <div className="flex items-center text-xs text-cordillera-olive/50">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="uppercase tracking-wider">
                              {product.artisan}
                            </span>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-cordillera-gold text-cordillera-olive px-4 py-2 text-sm font-medium rounded">
                            View Details
                          </div>
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
    </div>
  );
};

export default MarketplacePage;