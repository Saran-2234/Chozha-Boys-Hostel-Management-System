import React from 'react';

const QuickStats = ({ isDarkMode }) => {
  const stats = [
    {
      title: 'Total Students',
      value: '1,247',
      change: '+12% from last month',
      changeColor: 'text-green-400',
      icon: '👥',
      bgColor: 'bg-blue-500'
    },
    {
      title: 'Attendance Today',
      value: '89%',
      change: '+5% from yesterday',
      changeColor: 'text-green-400',
      icon: '✅',
      bgColor: 'bg-green-500'
    },
    {
      title: 'Pending Bills',
      value: '₹45,230',
      change: '+8% from last week',
      changeColor: 'text-red-400',
      icon: '💰',
      bgColor: 'bg-yellow-500'
    },
    {
      title: 'Active Complaints',
      value: '23',
      change: '-15% from last week',
      changeColor: 'text-green-400',
      icon: '📝',
      bgColor: 'bg-red-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="stats-card glass-card rounded-xl p-6 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{stat.title}</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
              <p className={`${stat.changeColor} text-sm`}>{stat.change}</p>
            </div>
            <div className={`w-12 h-12 ${stat.bgColor} bg-opacity-20 rounded-lg flex items-center justify-center`}>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
