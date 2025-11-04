import React from 'react';
import Logo from './Logo';
import NavigationMenu from './NavigationMenu';
import Logout from './Logout';

const Sidebar = ({ setActiveSection, activeSection, onLogout, sidebarOpen, setSidebarOpen }) => {
  return (
    <aside className="sidebar fixed left-0 top-0 h-full w-64 z-50 flex flex-col transition-transform duration-300 bg-gray-100 text-gray-900 shadow-lg translate-x-0 md:translate-x-0">
      <div className="p-6 flex-grow overflow-y-auto">
        <Logo />
        <NavigationMenu setActiveSection={setActiveSection} activeSection={activeSection} setSidebarOpen={setSidebarOpen} />
      </div>
      <Logout onLogout={onLogout} />
    </aside>
  );
};

export default Sidebar;
