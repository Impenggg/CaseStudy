import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Toast, useToast } from '../components/ui/toast';
import { sampleProducts } from '../data/placeholders';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = sampleProducts.find(p => p.id === parseInt(id || '1'));
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);
  const { toast, showToast, hideToast } = useToast();

  if (!product) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl text-yellow-100">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="relative overflow-hidden rounded-lg mb-4">
              <img 
                src={product.images ? product.images[selectedImage] : product.image} 
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
                {product.category}
              </Badge>
            </div>

            <p className="text-yellow-200 mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Cultural Background */}
            <Card className="bg-yellow-100 mb-6">
              <CardContent className="p-4">
                <h3 className="font-semibold text-green-900 mb-2">Cultural Background</h3>
                <p className="text-green-800 text-sm">{product.cultural_background}</p>
              </CardContent>
            </Card>

            {/* Materials */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Materials Used</h3>
              <div className="flex flex-wrap gap-2">
                {product.materials.map((material, index) => (
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
                    src={product.seller.avatar} 
                    alt={product.seller.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-yellow-100">{product.seller.name}</p>
                    <p className="text-yellow-200 text-sm">{product.seller.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Purchase */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-yellow-200">Stock: {product.stock_quantity} available</span>
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
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  >
                    +
                  </button>
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full bg-yellow-500 text-green-900 hover:bg-yellow-400"
                onClick={() => showToast(`Added ${quantity} ${product.name}(s) to cart!`, 'success')}
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
    </div>
  );
};