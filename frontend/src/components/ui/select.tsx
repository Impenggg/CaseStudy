import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ 
  label, 
  error, 
  options,
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
      <select
        className={`w-full px-4 py-3 border border-cordillera-sage bg-cordillera-cream text-cordillera-olive focus:outline-none focus:ring-2 focus:ring-cordillera-gold focus:border-transparent transition-all duration-200 ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-600 font-light">{error}</p>
      )}
    </div>
  );
};