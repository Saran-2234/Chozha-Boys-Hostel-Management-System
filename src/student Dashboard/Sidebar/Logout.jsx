import React from 'react';

const Logout = () => {
  const handleLogout = () => {
    // Add logout logic here
    console.log('Logout clicked');
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all"
    >
      <span>🚪</span>
      <span>Logout</span>
    </button>
  );
};

export default Logout;
