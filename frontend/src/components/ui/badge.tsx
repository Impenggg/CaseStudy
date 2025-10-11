import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'outline' | 'destructive' | 'success' | 'warning' | 'info';
  className?: string;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ 
  variant = 'default', 
  className = '', 
  children 
}) => {
  const baseClasses = `
    inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold 
    transition-all duration-200
  `;
  
  const variants = {
    default: `
      bg-heritage-100 text-heritage-700
      border border-heritage-300
    `,
    outline: `
      border border-heritage-400 text-heritage-700
      bg-transparent hover:bg-heritage-50
    `,
    destructive: `
      bg-red-100 text-error
      border border-red-300
    `,
    success: `
      bg-emerald-100 text-success
      border border-emerald-300
    `,
    warning: `
      bg-amber-100 text-warning
      border border-amber-300
    `,
    info: `
      bg-sky-100 text-info
      border border-sky-300
    `
  };

  const classes = `${baseClasses} ${variants[variant]} ${className}`;

  return (
    <div className={classes}>
      {children}
    </div>
  );
};