import React from 'react';
import QuickStats from './QuickStats';
import RecentActivities from './RecentActivities';
import QuickActions from './QuickActions';

const Dashboard = ({ studentData, setActiveSection }) => {
  return (
    <div className="content-section">
      <QuickStats studentData={studentData} setActiveSection={setActiveSection} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <RecentActivities setActiveSection={setActiveSection} />
        <QuickActions setActiveSection={setActiveSection} />
      </div>
    </div>
  );
};

export default Dashboard;
