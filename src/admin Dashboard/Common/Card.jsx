import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  const baseClasses = 'rounded-lg shadow-md transition-all duration-200 bg-white border border-gray-200 text-gray-900';

  const classes = `${baseClasses} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => {
  return (
    <div className={`p-6 pb-4 ${className}`}>
      {children}
    </div>
  );
};

const CardContent = ({ children, className = '' }) => {
  return (
    <div className={`p-6 pt-0 ${className}`}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className = '' }) => {
  return (
    <div className={`p-6 pt-4 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardContent, CardFooter };
export default Card;