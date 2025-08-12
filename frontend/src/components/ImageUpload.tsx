import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ImageUploadProps {
  onImagesUploaded: (imageUrls: string[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  maxSizePerFile?: number; // in MB
  preview?: boolean;
  className?: string;
}

interface UploadedImage {
  file: File;
  preview: string;
  url?: string;
  uploading?: boolean;
  progress?: number;
  error?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImagesUploaded,
  maxFiles = 5,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  maxSizePerFile = 5, // 5MB default
  preview = true,
  className = ''
}) => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported. Please use: ${acceptedTypes.join(', ')}`;
    }
    
    if (file.size > maxSizePerFile * 1024 * 1024) {
      return `File size exceeds ${maxSizePerFile}MB limit`;
    }
    
    return null;
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const remainingSlots = maxFiles - images.length;
    const filesToProcess = fileArray.slice(0, remainingSlots);

    const newImages: UploadedImage[] = [];

    filesToProcess.forEach((file) => {
      const error = validateFile(file);
      
      if (error) {
        // Show error for invalid files
        const errorImage: UploadedImage = {
          file,
          preview: '',
          error,
        };
        newImages.push(errorImage);
      } else {
        // Create preview for valid files
        const reader = new FileReader();
        reader.onload = (e) => {
          const validImage: UploadedImage = {
            file,
            preview: e.target?.result as string,
            uploading: false,
          };
          
          setImages(prev => {
            const updated = [...prev];
            const index = updated.findIndex(img => img.file === file);
            if (index !== -1) {
              updated[index] = validImage;
            }
            return updated;
          });
        };
        reader.readAsDataURL(file);
        
        // Add placeholder initially
        const placeholderImage: UploadedImage = {
          file,
          preview: '',
          uploading: false,
        };
        newImages.push(placeholderImage);
      }
    });

    setImages(prev => [...prev, ...newImages]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    const imagesToUpload = images.filter(img => !img.error && !img.url);
    
    // Simulate upload process (replace with actual API call)
    for (let i = 0; i < imagesToUpload.length; i++) {
      const image = imagesToUpload[i];
      const imageIndex = images.findIndex(img => img.file === image.file);
      
      // Update uploading state
      setImages(prev => {
        const updated = [...prev];
        updated[imageIndex] = { ...updated[imageIndex], uploading: true, progress: 0 };
        return updated;
      });

      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setImages(prev => {
          const updated = [...prev];
          updated[imageIndex] = { ...updated[imageIndex], progress };
          return updated;
        });
      }

      // Simulate successful upload
      const mockUrl = `https://images.unsplash.com/photo-${Date.now() + i}?w=800&h=600&fit=crop`;
      setImages(prev => {
        const updated = [...prev];
        updated[imageIndex] = { 
          ...updated[imageIndex], 
          uploading: false, 
          url: mockUrl,
          progress: 100 
        };
        return updated;
      });
    }

    // Return uploaded URLs
    const uploadedUrls = images
      .filter(img => img.url)
      .map(img => img.url!);
    
    onImagesUploaded(uploadedUrls);
  };

  const hasValidImages = images.some(img => !img.error);
  const hasUnuploadedImages = images.some(img => !img.error && !img.url);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
      <Card
        className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-cordillera-gold bg-cordillera-gold/10'
            : 'border-cordillera-olive/30 hover:border-cordillera-gold/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-cordillera-olive/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-cordillera-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-medium text-cordillera-olive">
              Drop images here or click to browse
            </p>
            <p className="text-sm text-cordillera-olive/60">
              Support: {acceptedTypes.join(', ')} • Max {maxSizePerFile}MB per file • Up to {maxFiles} files
            </p>
          </div>
        </div>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Image Previews */}
      {images.length > 0 && preview && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <Card key={index} className="relative overflow-hidden">
              {image.error ? (
                <div className="aspect-square bg-red-50 border border-red-200 p-4 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-red-600 text-xs font-medium mb-1">{image.file.name}</p>
                    <p className="text-red-500 text-xs">{image.error}</p>
                  </div>
                </div>
              ) : (
                <div className="aspect-square relative">
                  {image.preview && (
                    <img
                      src={image.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                  
                  {/* Upload Progress */}
                  {image.uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="w-16 h-16 rounded-full border-4 border-white/30 border-t-white animate-spin mx-auto mb-2"></div>
                        <p className="text-xs">Uploading...</p>
                        {image.progress !== undefined && (
                          <Progress value={image.progress} className="w-20 mx-auto mt-2" />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Success Indicator */}
                  {image.url && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              )}

              {/* Remove Button */}
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-2 left-2 p-1 h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
              >
                ✕
              </Button>

              {/* File Name */}
              <div className="p-2">
                <p className="text-xs text-cordillera-olive truncate">
                  {image.file.name}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {hasValidImages && (
        <div className="flex justify-center">
          <Button
            onClick={uploadImages}
            disabled={!hasUnuploadedImages}
            className="bg-cordillera-gold text-cordillera-olive hover:bg-cordillera-gold/90"
          >
            {hasUnuploadedImages ? 'Upload Images' : 'All Images Uploaded'}
          </Button>
        </div>
      )}
    </div>
  );
};
