import React from 'react';
import Logo from './Logo';
import NavigationMenu from './NavigationMenu';
import Logout from './Logout';

const Sidebar = ({ setActiveSection, activeSection, onLogout, isDarkMode }) => {
  return (
    <aside className={`sidebar fixed left-0 top-0 h-full w-64 z-30 flex flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} shadow-lg`}>
      <div className="p-6 flex-grow overflow-y-auto">
        <Logo isDarkMode={isDarkMode} />
        <NavigationMenu setActiveSection={setActiveSection} activeSection={activeSection} isDarkMode={isDarkMode} />
      </div>
      <Logout onLogout={onLogout} isDarkMode={isDarkMode} />
    </aside>
  );
};

export default Sidebar;
