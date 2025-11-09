import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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

import Promotion from './Promotion/Promotion';
import RefreshConfirmationModal from './components/RefreshConfirmationModal'; // Import the refresh modal
import './styles/adminDashboard.css';

const AdminDashboard = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    // Set active section based on location state
    if (location.state && location.state.activeSection) {
      setActiveSection(location.state.activeSection);
    }

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
        return <Dashboard setActiveSection={setActiveSection} />;
      case 'students':
        return <Students />;
      case 'attendance':
        return <Attendance />;
      case 'messbills':
        return <MessBills />;
      case 'promotion':
        return <Promotion />;
      case 'complaints':
        return <Complaints />;
      case 'rooms':
        return <RoomManagement />;
      case 'visitors':
        return <Visitors />;
      case 'messaging':
        return <Messaging />;
      case 'departments':
        return <Departments />;
      case 'reports':
        return <Reports />;

      case 'settings':
        return <Settings />;
      default:
        return <Dashboard setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="light-mode flex min-h-screen text-gray-900">
      <Sidebar
        setActiveSection={setActiveSection}
        activeSection={activeSection}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      {/* Backdrop overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      <div className={`flex-1 min-w-0 flex flex-col transition-transform duration-300 pointer-events-auto md:ml-64 ${sidebarOpen ? 'translate-x-64 md:translate-x-0' : 'translate-x-0'}`}>
        <Header
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