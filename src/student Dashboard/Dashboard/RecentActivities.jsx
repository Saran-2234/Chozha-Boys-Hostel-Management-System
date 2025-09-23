import React from 'react';
import Card from '../Common/Card';

const RecentActivities = ({ setActiveSection }) => {
  const handleActivityClick = (section) => {
    if (setActiveSection) {
      setActiveSection(section);
    }
  };

  const activities = [
    {
      icon: '✅',
      iconBg: 'bg-emerald-500',
      title: 'Attendance marked for today',
      time: '2 hours ago',
      section: 'attendance'
    },
    {
      icon: '📝',
      iconBg: 'bg-blue-500',
      title: 'Complaint #C001 updated',
      time: '5 hours ago',
      section: 'complaints'
    },
    {
      icon: '🍽️',
      iconBg: 'bg-orange-500',
      title: 'December mess bill generated',
      time: '1 day ago',
      section: 'messbill'
    },
  ];

  return (
    <Card>
      <h3 className="text-lg font-semibold text-white mb-4">Recent Activities</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 p-3 glass-effect rounded-lg cursor-pointer transition-all duration-200 hover:bg-white hover:bg-opacity-5"
            onClick={() => handleActivityClick(activity.section)}
          >
            <div className={`w-8 h-8 ${activity.iconBg} rounded-full flex items-center justify-center`}>
              <span className="text-sm">{activity.icon}</span>
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{activity.title}</p>
              <p className="text-slate-400 text-xs">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentActivities;
