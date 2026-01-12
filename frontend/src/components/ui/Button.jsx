// src/components/ui/Button.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ children, variant = 'primary', size = 'md', isLoading = false, className = '', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:pointer-events-none transform active:scale-95';
  
  const variants = {
    // Added gradients and hover shadow effects
    primary: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-green-200/50',
    secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-green-300',
    danger: 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 shadow-md hover:shadow-red-200/50',
    ghost: 'bg-transparent hover:bg-green-50 text-green-700',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} disabled={isLoading} {...props}>
      {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</> : children}
    </button>
  );
};

export default Button;