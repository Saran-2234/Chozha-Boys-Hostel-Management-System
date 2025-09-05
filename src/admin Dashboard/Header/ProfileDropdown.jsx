import React, { useState } from 'react';

const ProfileDropdown = ({ onLogout, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className={`flex items-center space-x-3 p-2 rounded-lg transition-all ${
          isDarkMode ? 'hover:bg-white hover:bg-opacity-10' : 'hover:bg-gray-200'
        }`}
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-sm font-bold text-white">A</span>
        </div>
        <div className="hidden md:block">
          <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Admin User</p>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Administrator</p>
        </div>
        <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className={`profile-dropdown absolute right-0 mt-2 w-48 glass-card rounded-lg py-2 z-50 ${
          isDarkMode ? '' : 'bg-white shadow-lg'
        }`}>
          <a href="#" className={`block px-4 py-2 text-sm ${isDarkMode ? 'text-white hover:bg-white hover:bg-opacity-10' : 'text-gray-900 hover:bg-gray-200'}`}>Profile</a>
          <a href="#" className={`block px-4 py-2 text-sm ${isDarkMode ? 'text-white hover:bg-white hover:bg-opacity-10' : 'text-gray-900 hover:bg-gray-200'}`}>Settings</a>
          <hr className={`my-2 ${isDarkMode ? 'border-slate-600' : 'border-gray-300'}`} />
          <a href="#" onClick={onLogout} className={`block px-4 py-2 text-sm ${isDarkMode ? 'text-red-400 hover:bg-red-500 hover:bg-opacity-10' : 'text-red-600 hover:bg-red-200'}`}>Logout</a>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
