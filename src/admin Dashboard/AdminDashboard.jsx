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
import Departments from './Departments/Departments';
import Reports from './Reports/Reports';
import Settings from './Settings/Settings';
import './styles/adminDashboard.css';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleLogout = () => {
    // Handle logout logic here
    localStorage.removeItem('authToken');
    console.log('Logout clicked');
    // Redirect to login page
    window.location.href = '/login';
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
      case 'departments':
        return <Departments isDarkMode={isDarkMode} />;
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
      <Sidebar 
        setActiveSection={setActiveSection} 
        activeSection={activeSection} 
        onLogout={handleLogout} 
        isDarkMode={isDarkMode} 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      {/* Backdrop overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
  <div className={`flex-1 min-w-0 flex flex-col ml-0 md:ml-64 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}>
        <Header 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode} 
          onLogout={handleLogout} 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <MainContent>
          {renderSection()}
        </MainContent>
      </div>
    </div>
  );
};

export default AdminDashboard;