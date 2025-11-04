import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center space-x-3 mb-8">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
        <span className="text-xl">🏛️</span>
      </div>
      <div>
        <h2 className="text-lg font-bold text-gray-900">Chozha Boys</h2>
        <p className="text-xs text-gray-600">Admin Portal</p>
      </div>
    </div>
  );
};

export default Logo;
