import React from 'react';

const NavigationMenu = ({ setActiveSection, activeSection, setSidebarOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'students', label: 'Students' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'messbills', label: 'Mess Bills' },
    { id: 'promotion', label: 'Promotion' },

    { id: 'complaints', label: 'Complaints' },
    { id: 'rooms', label: 'Rooms' },
    { id: 'messaging', label: 'Messaging' },
    { id: 'departments', label: 'Departments' },
    { id: 'settings', label: 'Settings' }
  ];

  const handleClick = (id) => {
    setActiveSection(id);
    setSidebarOpen(false);
  };

  return (
    <nav className="space-y-2">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => handleClick(item.id)}
          className={`nav-item flex items-center space-x-3 px-4 py-3 rounded-lg transition-all cursor-pointer text-gray-900 hover:bg-gray-100 hover:bg-opacity-80 ${activeSection === item.id ? 'bg-gray-100 bg-opacity-80' : ''}`}
          type="button"
        >
          <span className="font-medium">{item.label}</span>
          {item.badge && (
            <span className="notification-badge text-xs px-2 py-1 rounded-full bg-blue-400 text-gray-900">
              {item.badge}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
};

export default NavigationMenu;
