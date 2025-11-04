import React from 'react';
import ProfileDropdown from './ProfileDropdown';

const Header = ({ onLogout, sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="bg-transparent border-b border-gray-300 px-6 py-4 flex items-center justify-between z-60 relative">
      <div className="flex items-center space-x-4">
        {/* Hamburger menu button for mobile */}
        <button
          className="md:hidden text-gray-900 focus:outline-none z-50"
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
        <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      <div className="flex items-center space-x-4">
        <ProfileDropdown onLogout={onLogout} />
      </div>
    </header>
  );
};

export default Header;
