import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-14 h-14 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3 animate-fade-in">
      <div className={`${sizeClasses[size]} border-heritage-200 border-t-heritage-500 rounded-full animate-spin`}></div>
      {text && (
        <p className="text-heritage-600 font-medium">
          {text}
        </p>
      )}
    </div>
  );
};

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'sm' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3'
  };

  return (
    <div className={`${sizeClasses[size]} border-heritage-200 border-t-heritage-500 rounded-full animate-spin`}></div>
  );
};
