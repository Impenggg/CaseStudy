import React from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  titleColor?: string;
  subtitleColor?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  align = 'center',
  titleColor = 'text-cordillera-olive',
  subtitleColor = 'text-cordillera-olive/70'
}) => {
  const alignment = align === 'center' ? 'text-center' : 'text-left';
  
  return (
    <div className={`${alignment} mb-16`}>
      <h2 className={`text-4xl md:text-5xl font-serif font-light ${titleColor} mb-4 tracking-wide`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg md:text-xl ${subtitleColor} max-w-3xl mx-auto leading-relaxed`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;

