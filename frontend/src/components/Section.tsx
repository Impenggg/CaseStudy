import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  bgColor?: string;
  containerWidth?: 'max-w-5xl' | 'max-w-7xl';
}

const Section: React.FC<SectionProps> = ({ 
  children, 
  className = '', 
  bgColor = 'bg-cordillera-cream',
  containerWidth = 'max-w-7xl'
}) => {
  return (
    <section className={`py-16 md:py-24 ${bgColor} ${className}`}>
      <div className={`${containerWidth} mx-auto px-4 sm:px-6 lg:px-8`}>
        {children}
      </div>
    </section>
  );
};

export default Section;

