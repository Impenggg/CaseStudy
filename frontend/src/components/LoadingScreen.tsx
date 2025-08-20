import React from 'react';

interface LoadingScreenProps {
  title?: string;
  subtitle?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  title = 'Loading',
  subtitle = 'Please wait...'
}) => {
  return (
    <div className="min-h-screen bg-cordillera-olive flex items-center justify-center px-6">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-cordillera-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" aria-label="Loading" />
        <h2 className="text-2xl font-serif text-cordillera-cream mb-2">{title}</h2>
        <p className="text-cordillera-cream/70">{subtitle}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
