import React, { useState } from 'react';
import LogoutModal from '../Common/LogoutModal';

const ProfileDropdown = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogoutClick = () => {
    setIsOpen(false); // Close dropdown
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    if (onLogout) {
      onLogout();
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-3 p-2 rounded-lg transition-all hover:bg-gray-200"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-sm font-bold text-white">A</span>
        </div>
        <div className="hidden md:block">
          <p className="text-sm font-medium text-gray-900">Admin User</p>
          <p className="text-xs text-gray-600">Administrator</p>
        </div>
        <span className="text-gray-900">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="profile-dropdown absolute right-0 mt-2 w-48 glass-card rounded-lg py-2 z-50 bg-white shadow-lg">
          <a href="#" className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-200">Profile</a>
          <a href="#" className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-200">Settings</a>
          <hr className="my-2 border-gray-300" />
          <a href="#" onClick={handleLogoutClick} className="block px-4 py-2 text-sm text-red-600 hover:bg-red-200">Logout</a>
        </div>
      )}

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
};

export default ProfileDropdown;
