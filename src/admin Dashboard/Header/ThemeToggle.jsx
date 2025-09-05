import React from 'react';

const ThemeToggle = ({ isDarkMode, setIsDarkMode }) => {
  const toggleTheme = () => {
    console.log('Theme toggle clicked, current mode:', isDarkMode);
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle p-3 rounded-lg transition-all duration-300 cursor-pointer border-2 ${
        isDarkMode
          ? 'bg-white bg-opacity-10 hover:bg-opacity-20 text-white border-white border-opacity-20'
          : 'bg-gray-200 hover:bg-gray-300 text-gray-900 border-gray-300'
      }`}
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      style={{ position: 'relative', zIndex: 10 }}
    >
      <span className="text-xl">{isDarkMode ? '🌙' : '☀️'}</span>
    </button>
  );
};

export default ThemeToggle;
