import React from 'react';

const NavigationMenu = ({ setActiveSection, activeSection }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'attendance', label: 'Attendance', icon: '✅' },
    { id: 'messbill', label: 'Mess Bill', icon: '🍽️' },
    { id: 'complaints', label: 'Complaints', icon: '📝' },
    { id: 'notifications', label: 'Notifications', icon: '🔔'},
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <nav className="space-y-2">
      {menuItems.map((item) => (
        <a
          key={item.id}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setActiveSection(item.id);
          }}
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-900 hover:bg-gray-200 transition-all ${
            activeSection === item.id ? 'bg-gray-200' : ''
          }`}
        >
          <span className="text-lg">{item.icon}</span>
          <span className="font-medium">{item.label}</span>
          {item.badge && (
            <span className="notification-badge bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {item.badge}
            </span>
          )}
        </a>
      ))}
    </nav>
  );
};

export default NavigationMenu;
