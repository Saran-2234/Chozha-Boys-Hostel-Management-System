import React, { useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';
import MainContent from './Header/MainContent';
import Dashboard from './Dashboard/Dashboard';
import Students from './Students/Students';
import Attendance from './Attendance/Attendance';
import MessBills from './MessBills/MessBills';
import Complaints from './Complaints/Complaints';
import RoomManagement from './RoomManagement/RoomManagement';
import Visitors from './Visitors/Visitors';
import Messaging from './Messaging/Messaging';
import Reports from './Reports/Reports';
import Settings from './Settings/Settings';
import './styles/adminDashboard.css';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logout clicked');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard setActiveSection={setActiveSection} isDarkMode={isDarkMode} />;
      case 'students':
        return <Students isDarkMode={isDarkMode} />;
      case 'attendance':
        return <Attendance isDarkMode={isDarkMode} />;
      case 'messbills':
        return <MessBills isDarkMode={isDarkMode} />;
      case 'complaints':
        return <Complaints isDarkMode={isDarkMode} />;
      case 'rooms':
        return <RoomManagement isDarkMode={isDarkMode} />;
      case 'visitors':
        return <Visitors isDarkMode={isDarkMode} />;
      case 'messaging':
        return <Messaging isDarkMode={isDarkMode} />;
      case 'reports':
        return <Reports isDarkMode={isDarkMode} />;
      case 'settings':
        return <Settings isDarkMode={isDarkMode} />;
      default:
        return <Dashboard setActiveSection={setActiveSection} isDarkMode={isDarkMode} />;
    }
  };

  return (
    <div className={`${isDarkMode ? 'professional-bg' : 'light-mode'} flex h-screen ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <Sidebar setActiveSection={setActiveSection} activeSection={activeSection} onLogout={handleLogout} isDarkMode={isDarkMode} />
      <div className="flex-1 flex flex-col ml-0 md:ml-64 transition-all duration-300">
        <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} onLogout={handleLogout} />
        <MainContent>
          {renderSection()}
        </MainContent>
      </div>
    </div>
  );
};

export default AdminDashboard;
