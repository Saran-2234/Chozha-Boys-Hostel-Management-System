import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  className = '', 
  isDarkMode = true,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: isDarkMode 
      ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500' 
      : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: isDarkMode 
      ? 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500' 
      : 'bg-gray-300 hover:bg-gray-400 text-gray-800 focus:ring-gray-500',
    success: isDarkMode 
      ? 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500' 
      : 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    danger: isDarkMode 
      ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500' 
      : 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    outline: isDarkMode 
      ? 'border border-gray-600 bg-transparent hover:bg-gray-700 text-white focus:ring-gray-500' 
      : 'border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700 focus:ring-gray-500',
  };

  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`;

  return (
    <button
      className={classes}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;