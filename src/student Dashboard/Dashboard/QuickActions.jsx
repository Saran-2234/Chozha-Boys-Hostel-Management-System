import React from 'react';

const QuickActions = ({ setActiveSection }) => {
  const handleActionClick = (section) => {
    if (setActiveSection) {
      setActiveSection(section);
    }
  };

  const actions = [
    {
      label: 'Mark Attendance',
      section: 'attendance',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      label: 'Pay Mess Bill',
      section: 'messbill',
      color: 'from-orange-500 to-red-500'
    },
    {
      label: 'Raise Complaint',
      section: 'complaints',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      label: 'View Profile',
      section: 'profile',
      color: 'from-green-500 to-lime-600'
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

            <div className="text-sm font-medium">{action.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
