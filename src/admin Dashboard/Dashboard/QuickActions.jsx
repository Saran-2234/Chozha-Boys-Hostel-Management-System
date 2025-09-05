import React from 'react';

const QuickActions = ({ setActiveSection, isDarkMode }) => {
  const actions = [
    {
      title: 'Manage Students',
      description: 'Add, edit, or remove student records',
      icon: '👥',
      bgColor: 'bg-blue-500',
      section: 'students'
    },
    {
      title: 'View Attendance',
      description: 'Check daily attendance reports',
      icon: '✅',
      bgColor: 'bg-green-500',
      section: 'attendance'
    },
    {
      title: 'Process Bills',
      description: 'Generate and send mess bills',
      icon: '💰',
      bgColor: 'bg-yellow-500',
      section: 'messbills'
    },
    {
      title: 'Handle Complaints',
      description: 'Review and resolve student complaints',
      icon: '📝',
      bgColor: 'bg-red-500',
      section: 'complaints'
    },
    {
      title: 'Room Management',
      description: 'Assign and manage room allocations',
      icon: '🏠',
      bgColor: 'bg-purple-500',
      section: 'rooms'
    },
    {
      title: 'Send Announcements',
      description: 'Broadcast messages to all students',
      icon: '📢',
      bgColor: 'bg-indigo-500',
      section: 'messaging'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {actions.map((action, index) => (
        <div
          key={index}
          className="glass-card rounded-xl p-6 hover-lift cursor-pointer"
          onClick={() => setActiveSection(action.section)}
        >
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 ${action.bgColor} bg-opacity-20 rounded-lg flex items-center justify-center`}>
              <span className="text-2xl">{action.icon}</span>
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{action.title}</h3>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{action.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickActions;
