import React from 'react';

const Logout = ({ onLogout, isDarkMode }) => {
  return (
    <div className="absolute bottom-6 left-6 right-6">
      <button
        onClick={onLogout}
        className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
          isDarkMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-400 hover:bg-red-500 text-gray-900'
        }`}
      >
        <span>🚪</span>
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Logout;
