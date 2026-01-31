import React from 'react';

const LogoutModal = ({ isOpen, onClose, onConfirm, isLoggingOut }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="glass-card rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all professional-shadow">
        <div className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-900 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚪</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Confirm Logout</h2>
            <p className="text-slate-400 text-sm">
              Are you sure you want to logout? You'll need to login again to access your dashboard.
            </p>
          </div>

          <div className="flex space-x-3">
            {isLoggingOut ? (
              <div className="w-full py-3 flex items-center justify-center space-x-2 text-white">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Logging out...</span>
              </div>
            ) : (
              <>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 glass-effect rounded-lg text-white font-medium hover:bg-white hover:bg-opacity-10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;