import React from 'react';
import Card from '../Common/Card';

const RecentActivities = () => {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-white mb-4">Recent Activities</h3>
      <div className="space-y-4">
        <div className="flex items-center space-x-3 p-3 glass-effect rounded-lg">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
            <span className="text-sm">✅</span>
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">Attendance marked for today</p>
            <p className="text-slate-400 text-xs">2 hours ago</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 glass-effect rounded-lg">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-sm">📝</span>
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">Complaint #C001 updated</p>
            <p className="text-slate-400 text-xs">5 hours ago</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 glass-effect rounded-lg">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-sm">🍽️</span>
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">December mess bill generated</p>
            <p className="text-slate-400 text-xs">1 day ago</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RecentActivities;
