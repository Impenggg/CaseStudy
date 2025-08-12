import React from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <div className="bg-cordillera-olive border-b border-cordillera-gold/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif font-light text-cordillera-cream mb-4 tracking-wide">
          {title}
        </h1>
        <p className="text-cordillera-cream/80 text-lg max-w-3xl font-light">
          {description}
        </p>
      </div>
    </div>
  );
};

export default PageHeader;
