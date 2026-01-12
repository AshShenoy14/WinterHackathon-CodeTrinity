// src/components/ui/Button.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseStyles = 'relative inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transform active:scale-95 group overflow-hidden';

  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-button hover:shadow-button-hover focus:ring-primary-500 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity',
    secondary: 'bg-white text-secondary-700 border border-secondary-200 hover:bg-secondary-50 hover:border-primary-300 hover:text-primary-700 shadow-card hover:shadow-card-hover focus:ring-secondary-500',
    success: 'bg-gradient-to-r from-success-500 to-success-600 text-white hover:from-success-600 hover:to-success-700 shadow-button hover:shadow-button-hover focus:ring-success-500',
    warning: 'bg-gradient-to-r from-warning-500 to-warning-600 text-white hover:from-warning-600 hover:to-warning-700 shadow-button hover:shadow-button-hover focus:ring-warning-500',
    danger: 'bg-gradient-to-r from-error-500 to-error-600 text-white hover:from-error-600 hover:to-error-700 shadow-button hover:shadow-button-hover focus:ring-error-500',
    ghost: 'bg-transparent text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900 focus:ring-secondary-500',
    outline: 'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 shadow-glass focus:ring-white/50',
    gradient: 'bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500 text-white hover:from-primary-600 hover:via-primary-700 hover:to-accent-600 shadow-button hover:shadow-button-hover focus:ring-primary-500 bg-size-300 bg-pos-0 hover:bg-pos-100 transition-all duration-500',
  };

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
    xl: 'px-10 py-4 text-xl',
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  };

  const renderIcon = () => {
    if (!Icon) return null;
    return <Icon className={`${iconSizes[size]} ${iconPosition === 'left' ? 'mr-2' : 'ml-2'} transition-transform group-hover:scale-110`} />;
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-xl">
          <Loader2 className={`h-5 w-5 animate-spin ${iconSizes[size]}`} />
        </div>
      )}
      
      <span className={`flex items-center justify-center ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
        {iconPosition === 'left' && renderIcon()}
        {children}
        {iconPosition === 'right' && renderIcon()}
      </span>
    </button>
  );
};

export default Button;