import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';
import MainContent from './Header/MainContent';
import Dashboard from './Dashboard/Dashboard';
import Students from './Students/Students';
import Attendance from './Attendance/Attendance';
import MessBills from './MessBills/MessBills';
import Complaints from './Complaints/Complaints';
import RoomManagement from './RoomManagement/RoomManagement';
import Messaging from './Messaging/Messaging';
import Departments from './Departments/Departments';
import Settings from './Settings/Settings';
import Reduction from './Reduction/Reduction';
import Promotion from './Promotion/Promotion';
import RefreshConfirmationModal from './components/RefreshConfirmationModal'; // Import the refresh modal
import './styles/adminDashboard.css';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showRefreshModal, setShowRefreshModal] = useState(false); // Refresh modal state

  const handleLogout = () => {
    // Handle logout logic here
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    document.cookie = 'token=; path=/; max-age=0';
    console.log('Logout clicked');
    // Redirect to landing page
    window.location.href = '/';
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // Suppress native dialog if confirmed via custom modal
      if (window.adminRefreshConfirmed) {
        e.returnValue = '';
        return;
      }
      e.preventDefault();
      e.returnValue = "You're refreshing or reloading the page. You need to login again.";
    };

    const handleKeyDown = (e) => {
      // Detect F5 or Ctrl+R
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r') || (e.ctrlKey && e.key === 'R')) {
        e.preventDefault();
        setShowRefreshModal(true);
      }
    };

    const handleUnload = () => {
      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('accessToken');
      document.cookie = 'token=; path=/; max-age=0';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('unload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('unload', handleUnload);
    };
  }, []);

  // Handle refresh confirmation
  const handleRefreshConfirm = () => {
    // Set flag for auto-open modal
    localStorage.setItem('redirectFromAdminDashboard', 'true');

    // Clear any stored authentication data
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    document.cookie = 'token=; path=/; max-age=0';

    // Set flag to suppress native dialog
    window.adminRefreshConfirmed = true;

    // Close modal
    setShowRefreshModal(false);

    // Redirect to home page (will trigger loader and auto-open modal)
    window.location.href = '/';
  };

  const handleRefreshCancel = () => {
    setShowRefreshModal(false);
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
      case 'promotion':
        return <Promotion isDarkMode={isDarkMode} />;
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
      case 'reduction':
        return <Reduction isDarkMode={isDarkMode} />;
      case 'settings':
        return <Settings isDarkMode={isDarkMode} />;
      default:
        return <Dashboard setActiveSection={setActiveSection} isDarkMode={isDarkMode} />;
    }
  };

  return (
    <div className={`${isDarkMode ? 'professional-bg' : 'light-mode'} flex min-h-screen ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <Sidebar 
        setActiveSection={setActiveSection} 
        activeSection={activeSection} 
        onLogout={handleLogout} 
        isDarkMode={isDarkMode} 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      {/* Backdrop overlay for mobile sidebar - removed to fix overlay issue */}
      <div className={`flex-1 min-w-0 flex flex-col transition-transform duration-300 pointer-events-auto md:ml-64 ${sidebarOpen ? 'translate-x-64 md:translate-x-0' : 'translate-x-0'}`}>
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

      {/* Refresh Confirmation Modal */}
      <RefreshConfirmationModal
        isOpen={showRefreshModal}
        onClose={handleRefreshCancel}
        onConfirm={handleRefreshConfirm}
      />
    </div>
  );
};

export default AdminDashboard;