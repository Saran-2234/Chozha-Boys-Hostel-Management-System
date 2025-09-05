import React from 'react';
import ThemeToggle from './ThemeToggle';
import ProfileDropdown from './ProfileDropdown';

const Header = ({ isDarkMode, setIsDarkMode, onLogout }) => {
  return (
    <header className={`bg-transparent border-b px-6 py-4 flex items-center justify-between ${
      isDarkMode ? 'border-white border-opacity-10' : 'border-gray-300'
    }`}>
      <div className="flex items-center space-x-4">
        <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Admin Dashboard</h1>
      </div>

      <div className="flex items-center space-x-4">
        <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <ProfileDropdown onLogout={onLogout} isDarkMode={isDarkMode} />
      </div>
    </header>
  );
};

export default Header;
