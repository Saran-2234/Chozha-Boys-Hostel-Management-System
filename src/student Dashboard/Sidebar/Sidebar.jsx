import React, { useEffect } from 'react';
import Logo from './Logo';
import NavigationMenu from './NavigationMenu';

const Sidebar = ({ setActiveSection, activeSection, sidebarOpen, setSidebarOpen, onLogoutClick }) => {
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [sidebarOpen]);

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className={`sidebar fixed left-0 top-0 h-full w-64 glass-effect z-50 p-6 transition-transform duration-300 ease-in-out md:block ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="flex items-center space-x-3 mb-8">
          <Logo />
          <div>
            <h2 className="text-lg font-bold text-gray-900">Chozha Boys</h2>
            <p className="text-xs text-gray-600">Student Portal</p>
          </div>
        </div>
        <NavigationMenu setActiveSection={setActiveSection} activeSection={activeSection} />

        {/* Logout button */}
        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={onLogoutClick}
            className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all flex items-center justify-center space-x-2"
          >
            <span>🔒</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;