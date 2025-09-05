import React from 'react';
import Logo from './Logo';
import NavigationMenu from './NavigationMenu';
import Logout from './Logout';

const Sidebar = ({ setActiveSection, activeSection, sidebarOpen, setSidebarOpen }) => {
  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className={`fixed left-0 top-0 h-full w-64 glass-effect z-40 p-6 transition-transform duration-300 ease-in-out md:block ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="flex items-center space-x-3 mb-8">
          <Logo />
          <div>
            <h2 className="text-lg font-bold text-white">Chozha Boys</h2>
            <p className="text-xs text-slate-400">Student Portal</p>
          </div>
        </div>
        <NavigationMenu setActiveSection={setActiveSection} activeSection={activeSection} />
        <div className="absolute bottom-6 left-6 right-6">
          <Logout />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
