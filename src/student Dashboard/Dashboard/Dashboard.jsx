import React from 'react';
import QuickStats from './QuickStats';
import RecentActivities from './RecentActivities';
import QuickActions from './QuickActions';

const Dashboard = ({ studentData }) => {
  return (
    <div className="content-section">
      <QuickStats studentData={studentData} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <RecentActivities />
        <QuickActions />
      </div>
    </div>
  );
};

export default Dashboard;
