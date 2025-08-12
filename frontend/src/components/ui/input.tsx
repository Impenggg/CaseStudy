import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  icon, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-cordillera-olive">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cordillera-olive/60">
            {icon}
          </div>
        )}
        <input
          className={`w-full px-4 py-3 ${icon ? 'pl-11' : ''} border border-cordillera-sage bg-cordillera-cream text-cordillera-olive placeholder-cordillera-olive/50 focus:outline-none focus:ring-2 focus:ring-cordillera-gold focus:border-transparent transition-all duration-200 ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 font-light">{error}</p>
      )}
    </div>
  );
};