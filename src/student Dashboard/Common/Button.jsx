import React from 'react';

const Button = ({ children, variant = 'primary', onClick, type = 'button', className = '', ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-all';
  const variants = {
    primary: 'btn-primary text-white',
    secondary: 'btn-secondary text-white',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
