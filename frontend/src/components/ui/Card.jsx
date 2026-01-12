import React from 'react';

const Card = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'md',
  rounded = 'lg',
  variant = 'default',
  ...props
}) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const shadows = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-soft',
    lg: 'shadow-soft-lg',
    xl: 'shadow-2xl',
  };

  const roundness = {
    none: 'rounded-none',
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    full: 'rounded-3xl',
  };

  const variants = {
    default: 'bg-white border border-gray-100',
    glass: 'bg-white/70 backdrop-blur-xl border border-white/50',
    outline: 'bg-transparent border border-gray-200',
    gradient: 'bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/30 border border-white/60'
  };

  return (
    <div
      className={`${variants[variant]} ${paddings[padding]} ${shadows[shadow]} ${roundness[rounded]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
