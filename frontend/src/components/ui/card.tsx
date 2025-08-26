import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className = '', children, ...props }) => {
  return (
    <div className={`rounded-xl border border-cordillera-olive/10 bg-white text-cordillera-olive shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ${className}`} {...props}>
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
    <div className={`flex flex-col space-y-1.5 p-6 border-b border-cordillera-olive/15 ${className}`} {...props}>
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
    <h3 className={`text-2xl font-semibold leading-none tracking-tight text-cordillera-olive ${className}`} {...props}>
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