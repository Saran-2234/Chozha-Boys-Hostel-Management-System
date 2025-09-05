import React from 'react';

const RoomOccupancy = ({ isDarkMode }) => {
  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Room Occupancy</h3>
      <div className="chart-container">
        {/* Placeholder for chart - would need Chart.js or similar */}
        <div className={`flex items-center justify-center h-64 rounded-lg ${isDarkMode ? 'bg-slate-700 bg-opacity-50' : 'bg-gray-200'}`}>
          <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Room Occupancy Chart</p>
        </div>
      </div>
    </div>
  );
};

export default RoomOccupancy;
