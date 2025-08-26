import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'destructive' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'default', 
  size = 'default', 
  className = '', 
  children, 
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none shadow-sm hover:shadow-md';
  
  const variants = {
    // Primary CTA using cordillera gold
    default: 'bg-cordillera-gold text-cordillera-olive hover:bg-cordillera-gold/90 focus:ring-cordillera-gold',
    // Outline variant harmonized with olive background
    outline: 'border border-cordillera-gold text-cordillera-cream bg-transparent hover:bg-cordillera-cream/10 focus:ring-cordillera-gold',
    // Keep destructive semantic with standard red
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    // Ghost for subtle actions on dark backgrounds
    ghost: 'bg-transparent text-cordillera-cream hover:bg-cordillera-cream/10 focus:ring-cordillera-gold'
  };
  
  const sizes = {
    sm: 'h-8 px-3 text-sm',
    default: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 text-base'
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};