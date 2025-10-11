import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'destructive' | 'ghost' | 'terracotta' | 'earth';
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
  const baseClasses = `
    inline-flex items-center justify-center gap-2 
    font-semibold tracking-wide
    transition-all duration-250 ease-out
    focus:outline-none focus-visible:ring-3 focus-visible:ring-offset-2 
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    relative overflow-hidden
    before:absolute before:inset-0
    before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent 
    before:-translate-x-full
    before:transition-transform before:duration-500 hover:before:translate-x-full
  `;
  
  const variants = {
    // Primary - Professional heritage gold
    default: `
      bg-gradient-to-br from-heritage-500 to-accent-terracotta
      text-white
      rounded-lg
      shadow-md hover:shadow-xl
      focus-visible:ring-heritage-500 focus-visible:ring-offset-heritage-50
      hover:-translate-y-1 active:translate-y-0
    `,
    // Outline - Clean and minimal
    outline: `
      border-2 border-heritage-300
      text-heritage-700
      bg-white hover:bg-heritage-50
      rounded-lg
      shadow-sm hover:shadow-md
      hover:border-heritage-400
      focus-visible:ring-heritage-500 focus-visible:ring-offset-heritage-50
    `,
    // Destructive - Clear warning
    destructive: `
      bg-gradient-to-br from-error to-red-700
      text-white
      rounded-lg
      shadow-md hover:shadow-xl
      focus-visible:ring-error focus-visible:ring-offset-heritage-50
      hover:-translate-y-1 active:translate-y-0
    `,
    // Ghost - Subtle interaction
    ghost: `
      bg-transparent hover:bg-heritage-100
      text-heritage-700 hover:text-heritage-800
      rounded-lg
      focus-visible:ring-heritage-500 focus-visible:ring-offset-heritage-50
    `,
    // Terracotta - Warm accent
    terracotta: `
      bg-gradient-to-br from-accent-terracotta to-accent-rust
      text-white
      rounded-lg
      shadow-md hover:shadow-xl
      focus-visible:ring-accent-terracotta focus-visible:ring-offset-heritage-50
      hover:-translate-y-1 active:translate-y-0
    `,
    // Earth - Natural tone
    earth: `
      bg-gradient-to-br from-heritage-600 to-accent-moss
      text-white
      rounded-lg
      shadow-md hover:shadow-xl
      focus-visible:ring-heritage-600 focus-visible:ring-offset-heritage-50
      hover:-translate-y-1 active:translate-y-0
    `
  };
  
  const sizes = {
    sm: 'h-9 px-4 text-sm',
    default: 'h-11 px-6 text-base',
    lg: 'h-13 px-8 text-lg'
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      <span className="relative z-10">
        {children}
      </span>
    </button>
  );
};