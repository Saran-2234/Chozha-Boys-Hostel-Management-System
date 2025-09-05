import React from 'react';

const QuickActions = () => {
  const actions = [
    { icon: '✅', label: 'Mark Attendance', action: () => console.log('Mark Attendance') },
    { icon: '💳', label: 'Pay Mess Bill', action: () => console.log('Pay Mess Bill') },
    { icon: '📝', label: 'Raise Complaint', action: () => console.log('Raise Complaint') },
    { icon: '👥', label: 'Request Visitor', action: () => console.log('Request Visitor') },
  ];

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="btn-primary text-white p-4 rounded-lg text-center hover-lift"
          >
            <div className="text-2xl mb-2">{action.icon}</div>
            <div className="text-sm font-medium">{action.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
