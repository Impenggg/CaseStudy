import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'pattern';
}

export const Card: React.FC<CardProps> = ({ className = '', children, variant = 'default', ...props }) => {
  const variants = {
    default: 'card-surface',
    elevated: `
      card-surface
      shadow-xl hover:shadow-2xl
    `,
    outlined: `
      bg-white border-2 border-heritage-300 rounded-2xl
      shadow-sm hover:shadow-lg hover:border-heritage-400
      transition-all duration-300
    `,
    pattern: `
      card-surface pattern-weave
    `
  };
  
  return (
    <div 
      className={`
        ${variants[variant]} 
        transition-all duration-300 ease-out
        hover:-translate-y-1
        ${className}
      `} 
      {...props}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ className = '', children, ...props }) => {
  return (
    <div 
      className={`
        flex flex-col space-y-3 p-6 
        border-b border-heritage-200
        ${className}
      `} 
      {...props}
    >
      {children}
    </div>
  );
};

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
  children: React.ReactNode;
}

export const CardTitle: React.FC<CardTitleProps> = ({ className = '', children, ...props }) => {
  return (
    <h3 
      className={`
        text-2xl font-bold leading-tight
        text-heritage-900
        font-display
        ${className}
      `} 
      {...props}
    >
      {children}
    </h3>
  );
};

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({ className = '', children, ...props }) => {
  return (
    <div className={`p-6 pt-4 ${className}`} {...props}>
      {children}
    </div>
  );
};