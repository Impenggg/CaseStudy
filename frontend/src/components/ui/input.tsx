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
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-heritage-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-heritage-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full px-4 py-2.5 ${icon ? 'pl-11' : ''} 
            border border-heritage-300
            bg-white
            text-heritage-900
            placeholder:text-heritage-400
            rounded-lg
            focus:outline-none focus:ring-2 focus:ring-heritage-500 focus:border-heritage-500
            hover:border-heritage-400
            transition-all duration-200
            shadow-sm focus:shadow-md
            ${error ? 'border-error focus:ring-error focus:border-error' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-error font-medium flex items-center gap-1.5">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};