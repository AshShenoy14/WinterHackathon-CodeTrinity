import React from 'react';

const Card = ({ 
  children, 
  className = '',
  padding = 'md',
  shadow = 'md',
  rounded = 'lg',
  ...props 
}) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4 md:p-6',
    lg: 'p-6 md:p-8',
  };

  const shadows = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  const roundness = {
    none: 'rounded-none',
    sm: 'rounded',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    full: 'rounded-2xl',
  };

  return (
    <div
      className={`bg-white ${paddings[padding]} ${shadows[shadow]} ${roundness[rounded]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
