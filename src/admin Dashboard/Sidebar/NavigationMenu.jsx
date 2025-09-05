import React from 'react';

const NavigationMenu = ({ setActiveSection, activeSection, isDarkMode }) => {
  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'students', icon: '👥', label: 'Students', badge: '3' },
    { id: 'attendance', icon: '✅', label: 'Attendance' },
    { id: 'messbills', icon: '🍽️', label: 'Mess Bills' },
    { id: 'complaints', icon: '📝', label: 'Complaints', badge: '5' },
    { id: 'rooms', icon: '🏠', label: 'Room Management' },
    { id: 'visitors', icon: '👥', label: 'Visitors' },
    { id: 'messaging', icon: '📢', label: 'Messaging' },
    { id: 'reports', icon: '📈', label: 'Reports' },
    { id: 'settings', icon: '⚙️', label: 'Settings' }
  ];

  return (
    <nav className="space-y-2">
      {menuItems.map((item) => (
        <a
          key={item.id}
          onClick={() => setActiveSection(item.id)}
          className={`nav-item flex items-center space-x-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
            isDarkMode
              ? `text-white hover:bg-white hover:bg-opacity-10 ${activeSection === item.id ? 'bg-white bg-opacity-10' : ''}`
              : `text-gray-900 hover:bg-gray-100 hover:bg-opacity-80 ${activeSection === item.id ? 'bg-gray-100 bg-opacity-80' : ''}`
          }`}
        >
          <span className="text-lg">{item.icon}</span>
          <span className="font-medium">{item.label}</span>
          {item.badge && (
            <span className={`notification-badge text-xs px-2 py-1 rounded-full ${
              isDarkMode ? 'bg-blue-500 text-white' : 'bg-blue-400 text-gray-900'
            }`}>
              {item.badge}
            </span>
          )}
        </a>
      ))}
    </nav>
  );
};

export default NavigationMenu;
