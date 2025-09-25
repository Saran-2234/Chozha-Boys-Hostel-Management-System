import React, { useState } from 'react';
import LogoutModal from '../Common/LogoutModal';

const Logout = ({ onLogout }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    // Close modal
    setShowLogoutModal(false);

    // Clear authentication data from localStorage
    localStorage.removeItem('accessToken');

    // Call the logout function passed from parent
    if (onLogout) {
      onLogout();
    }
  };

  const handleLogoutCancel = () => {
    // Close modal
    setShowLogoutModal(false);
  };

  return (
    <>
      <div className="p-6">
        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
};

export default Logout;
