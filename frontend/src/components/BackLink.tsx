import React from 'react';
import { Link } from 'react-router-dom';

interface BackLinkProps {
  to: string;
  children?: React.ReactNode;
  variant?: 'dark' | 'light'; // dark: olive text on light bg, light: cream text on dark bg
  className?: string;
}

const BackLink: React.FC<BackLinkProps> = ({ to, children = 'Back', variant = 'dark', className = '' }) => {
  const base = 'inline-flex items-center transition-colors';
  const color = variant === 'light'
    ? 'text-cordillera-cream hover:text-cordillera-gold'
    : 'text-cordillera-olive hover:text-cordillera-gold';

  return (
    <Link to={to} className={`${base} ${color} ${className}`.trim()}>
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      {children}
    </Link>
  );
};

export default BackLink;
