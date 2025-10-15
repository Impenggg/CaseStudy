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
    <div className="min-h-screen bg-heritage-800 flex items-center justify-center px-6">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-heritage-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" aria-label="Loading" />
        <h2 className="text-2xl font-serif text-heritage-100 mb-2">{title}</h2>
        <p className="text-heritage-100/70">{subtitle}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
