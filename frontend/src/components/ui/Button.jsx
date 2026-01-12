// src/components/ui/Button.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'relative inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transform active:scale-95';

  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 outline-none ring-primary-500',
    secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-primary-300 hover:text-primary-700 shadow-sm hover:shadow-md ring-gray-200',
    danger: 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 ring-red-500',
    ghost: 'bg-transparent hover:bg-primary-50 text-primary-600 hover:text-primary-700 hover:shadow-none ring-transparent',
    glass: 'bg-white/20 backdrop-blur-md border border-white/40 text-white hover:bg-white/30 shadow-glass'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : children}
    </button>
  );
};

export default Button;