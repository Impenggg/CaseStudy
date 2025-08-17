import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'buttons' | 'dropdown' | 'compact';
}

export const SocialShare: React.FC<SocialShareProps> = ({
  url,
  title,
  description = '',
  image = '',
  className = '',
  size = 'default',
  variant = 'buttons'
}) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const encodedImage = encodeURIComponent(image);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}&media=${encodedImage}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    if (platform === 'email') {
      window.location.href = shareLinks[platform];
    } else {
      window.open(shareLinks[platform], '_blank', 'width=600,height=600');
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator && typeof (navigator as any).share === 'function') {
      try {
        await (navigator as any).share({
          title,
          text: description,
          url
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const buttonSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default';

  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <span className="text-sm text-cordillera-olive/70">Share:</span>
        <div className="flex items-center space-x-1">
          <Button
            size={buttonSize}
            variant="ghost"
            onClick={() => handleShare('facebook')}
            className="p-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            title="Share on Facebook"
          >
            📘
          </Button>
          <Button
            size={buttonSize}
            variant="ghost"
            onClick={() => handleShare('twitter')}
            className="p-2 text-blue-400 hover:bg-blue-50 hover:text-blue-500"
            title="Share on Twitter"
          >
            🐦
          </Button>
          <Button
            size={buttonSize}
            variant="ghost"
            onClick={() => handleShare('whatsapp')}
            className="p-2 text-green-600 hover:bg-green-50 hover:text-green-700"
            title="Share on WhatsApp"
          >
            💬
          </Button>
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <Button
              size={buttonSize}
              variant="ghost"
              onClick={handleNativeShare}
              className="p-2 text-cordillera-olive hover:bg-cordillera-olive/10"
              title="More sharing options"
            >
              📤
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <Button
          size={buttonSize}
          variant="outline"
          className="border-cordillera-gold text-cordillera-olive hover:bg-cordillera-gold hover:text-cordillera-olive"
        >
          📤 Share
        </Button>
        {/* Note: In a real implementation, you'd want to use a proper dropdown component */}
        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border p-2 space-y-1 z-10 hidden group-hover:block">
          <button onClick={() => handleShare('facebook')} className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">
            📘 Facebook
          </button>
          <button onClick={() => handleShare('twitter')} className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">
            🐦 Twitter
          </button>
          <button onClick={() => handleShare('linkedin')} className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">
            💼 LinkedIn
          </button>
          <button onClick={() => handleShare('whatsapp')} className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">
            💬 WhatsApp
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <h4 className="text-sm font-medium text-cordillera-olive">Share this:</h4>
      <div className="flex flex-wrap gap-2">
        <Button
          size={buttonSize}
          onClick={() => handleShare('facebook')}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          📘 Facebook
        </Button>
        <Button
          size={buttonSize}
          onClick={() => handleShare('twitter')}
          className="bg-blue-400 hover:bg-blue-500 text-white"
        >
          🐦 Twitter
        </Button>
        <Button
          size={buttonSize}
          onClick={() => handleShare('linkedin')}
          className="bg-blue-700 hover:bg-blue-800 text-white"
        >
          💼 LinkedIn
        </Button>
        <Button
          size={buttonSize}
          onClick={() => handleShare('whatsapp')}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          💬 WhatsApp
        </Button>
        <Button
          size={buttonSize}
          onClick={() => handleShare('telegram')}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          ✈️ Telegram
        </Button>
        <Button
          size={buttonSize}
          onClick={() => handleShare('pinterest')}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          📌 Pinterest
        </Button>
        <Button
          size={buttonSize}
          onClick={() => handleShare('email')}
          variant="outline"
          className="border-cordillera-olive text-cordillera-olive hover:bg-cordillera-olive hover:text-cordillera-cream"
        >
          ✉️ Email
        </Button>
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <Button
            size={buttonSize}
            onClick={handleNativeShare}
            className="bg-cordillera-gold text-cordillera-olive hover:bg-cordillera-gold/90"
          >
            📤 More Options
          </Button>
        )}
      </div>
    </div>
  );
};
