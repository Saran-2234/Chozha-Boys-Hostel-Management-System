import React from 'react';
import ThemeToggle from './ThemeToggle';
import ProfileDropdown from './ProfileDropdown';

const Header = ({ isDarkMode, setIsDarkMode, onLogout, sidebarOpen, setSidebarOpen }) => {
  return (
    <header className={`bg-transparent border-b px-6 py-4 flex items-center justify-between z-60 relative ${
      isDarkMode ? 'border-white border-opacity-10' : 'border-gray-300'
    }`}>
      <div className="flex items-center space-x-4">
        {/* Hamburger menu button for mobile */}
        <button
          className={`md:hidden text-white focus:outline-none z-50 ${sidebarOpen ? 'hidden' : ''}`}
          onClick={() => {
            console.log('Hamburger clicked, sidebarOpen:', !sidebarOpen);
            setSidebarOpen(!sidebarOpen);
          }}
          aria-label="Toggle sidebar"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
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
