import React from 'react';
import QuickStats from './QuickStats';
import QuickActions from './QuickActions';
import RoomOccupancy from './RoomOccupancy';
import RecentActivities from './RecentActivities';

const Dashboard = ({ setActiveSection, isDarkMode }) => {
  return (
    <section id="dashboard" className="section active">
      <div className="mb-8">
        <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Dashboard Overview</h2>
        <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Welcome back, Admin! Here's what's happening today.</p>
      </div>

      <QuickStats isDarkMode={isDarkMode} />

      <QuickActions setActiveSection={setActiveSection} isDarkMode={isDarkMode} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RoomOccupancy isDarkMode={isDarkMode} />
      </div>

      <RecentActivities isDarkMode={isDarkMode} />
    </section>
  );
};

export default Dashboard;
