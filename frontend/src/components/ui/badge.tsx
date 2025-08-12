import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'outline' | 'destructive';
  className?: string;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ 
  variant = 'default', 
  className = '', 
  children 
}) => {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors';
  
  const variants = {
    default: 'bg-blue-100 text-blue-800',
    outline: 'border border-gray-200 text-gray-700',
    destructive: 'bg-red-100 text-red-800'
  };

  const classes = `${baseClasses} ${variants[variant]} ${className}`;

  return (
    <div className={classes}>
      {children}
    </div>
  );
};