import React from 'react';

const QuickActions = ({ setActiveSection }) => {
  const handleActionClick = (section) => {
    if (setActiveSection) {
      setActiveSection(section);
    }
  };

  const actions = [
    {
      icon: '✅',
      label: 'Mark Attendance',
      section: 'attendance',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: '💳',
      label: 'Pay Mess Bill',
      section: 'messbill',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: '📝',
      label: 'Raise Complaint',
      section: 'complaints',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: '👥',
      label: 'Request Visitor',
      section: 'visitors',
      color: 'from-purple-500 to-pink-500'
    },
  ];

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => handleActionClick(action.section)}
            className="btn-primary text-white p-4 rounded-lg text-center hover-lift transition-all duration-200 hover:scale-105"
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
              <span className="text-xl">{action.icon}</span>
            </div>
            <div className="text-sm font-medium">{action.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
