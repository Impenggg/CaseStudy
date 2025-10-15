import React, { useState } from 'react';
import api from '@/services/api';

interface ImageWithFallbackProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onError?: () => void;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc = '/api/placeholder/400/300',
  onError,
}) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src || undefined);
  const [hasError, setHasError] = useState(false);

  // Compute backend origin from configured API base (e.g., http://localhost:8000)
  const API_ORIGIN = (api.defaults.baseURL || '').replace(/\/api\/?$/, '');
  const resolveFallback = (u: string) => {
    if (!u) return '';
    if (u.startsWith('http://') || u.startsWith('https://')) return u;
    return `${API_ORIGIN}${u.startsWith('/') ? u : `/${u}`}`;
  };

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(resolveFallback(fallbackSrc));
      onError?.();
    }
  };

  // If no src provided, use fallback immediately
  if (!src) {
    return (
      <div className={`bg-heritage-200 flex items-center justify-center ${className}`}>
        <svg
          className="w-16 h-16 text-heritage-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default ImageWithFallback;
