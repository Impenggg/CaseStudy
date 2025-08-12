import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ImageGalleryProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  alt?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  alt = 'Gallery image'
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    onNavigate(newIndex);
    setIsZoomed(false);
  };

  const handleNext = () => {
    const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    onNavigate(newIndex);
    setIsZoomed(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') onClose();
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isZoomed) {
      setIsZoomed(true);
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPosition({ x, y });
    } else {
      setIsZoomed(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (isZoomed) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPosition({ x, y });
    }
  };

  if (!isOpen || images.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="max-w-7xl w-full h-[90vh] p-0 bg-black/95 border-none"
        onKeyDown={handleKeyPress}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close Button */}
          <Button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 bg-black/50 text-white hover:bg-black/70 rounded-full p-2"
            size="sm"
          >
            ✕
          </Button>

          {/* Previous Button */}
          {images.length > 1 && (
            <Button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-40 bg-black/50 text-white hover:bg-black/70 rounded-full p-3"
              size="sm"
            >
              ←
            </Button>
          )}

          {/* Next Button */}
          {images.length > 1 && (
            <Button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-40 bg-black/50 text-white hover:bg-black/70 rounded-full p-3"
              size="sm"
            >
              →
            </Button>
          )}

          {/* Main Image */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <img
              src={images[currentIndex]}
              alt={`${alt} ${currentIndex + 1}`}
              className={`max-w-full max-h-full object-contain cursor-pointer transition-transform duration-300 ${
                isZoomed ? 'scale-200' : 'scale-100'
              }`}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }
                  : {}
              }
              onClick={handleImageClick}
              onMouseMove={handleMouseMove}
              draggable={false}
            />
          </div>

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {/* Zoom Instructions */}
          <div className="absolute bottom-4 right-4 z-40 bg-black/70 text-white px-3 py-2 rounded text-xs">
            {isZoomed ? 'Click to zoom out' : 'Click to zoom in'}
          </div>

          {/* Thumbnail Strip (for multiple images) */}
          {images.length > 1 && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-40 flex space-x-2 bg-black/50 p-2 rounded-lg max-w-full overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onNavigate(index);
                    setIsZoomed(false);
                  }}
                  className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                    index === currentIndex
                      ? 'border-cordillera-gold'
                      : 'border-white/30 hover:border-white/60'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface ImageWithZoomProps {
  src: string;
  alt: string;
  className?: string;
  images?: string[];
  onOpenGallery?: (index: number) => void;
}

export const ImageWithZoom: React.FC<ImageWithZoomProps> = ({
  src,
  alt,
  className = '',
  images = [],
  onOpenGallery
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onOpenGallery && images.length > 0) {
      const currentIndex = images.indexOf(src);
      onOpenGallery(currentIndex >= 0 ? currentIndex : 0);
    }
  };

  return (
    <div 
      className={`relative overflow-hidden cursor-pointer group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      
      {/* Zoom Overlay */}
      <div className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="bg-white/90 rounded-full p-3">
          <svg 
            className="w-6 h-6 text-cordillera-olive" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" 
            />
          </svg>
        </div>
      </div>
      
      {/* Image counter badge for galleries */}
      {images.length > 1 && (
        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
          +{images.length - 1} more
        </div>
      )}
    </div>
  );
};
