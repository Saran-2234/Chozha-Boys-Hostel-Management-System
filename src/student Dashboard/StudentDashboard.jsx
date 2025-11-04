import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';
import MainContent from './Header/MainContent';
import Dashboard from './Dashboard/Dashboard';
import Profile from './Profile/Profile';
import Attendance from './Attendance/Attendance';
import MessBill from './MessBill/MessBill';
import Complaints from './Complaints/Complaints';
import Notifications from './Notifications/Notifications';
import Settings from './Settings/Settings';
import LogoutModal from './components/LogoutModal'; // Import the modal
import RefreshConfirmationModal from './components/RefreshConfirmationModal'; // Import the refresh modal
import Reduction from './Reduction/Reduction';

import './styles/studentDashboard.css';
import { useLocation, useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const location = useLocation();
  const studentData = location.state?.studentData || location.state?.data;
  console.log('Student data:', studentData);
  
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [showLogoutModal, setShowLogoutModal] = useState(false); // Centralized modal state
  const [showRefreshModal, setShowRefreshModal] = useState(false); // Refresh modal state
  
  const navigate = useNavigate();

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // No returnValue to avoid native alert; custom modal for keyboard only
      e.preventDefault();
      e.returnValue = '';
    };

    const handleKeyDown = (e) => {
      // Detect F5 or Ctrl+R
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r') || (e.ctrlKey && e.key === 'R')) {
        e.preventDefault();
        setShowRefreshModal(true);
      }
    };

    const handleUnload = () => {
      localStorage.removeItem('studentToken');
      localStorage.removeItem('studentData');
      sessionStorage.removeItem('studentToken');
      sessionStorage.removeItem('studentData');
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

  // Handle logout click from both sidebar and header
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  // Handle logout confirmation
  const handleLogoutConfirm = () => {
    // Clear any stored authentication data
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentData');
    sessionStorage.removeItem('studentToken');
    sessionStorage.removeItem('studentData');

    // Clear authentication cookie
    document.cookie = 'token=; path=/; max-age=0';

    // Close modal
    setShowLogoutModal(false);

    // Redirect to login page
    navigate('/', { replace: true });
  };

  // Handle refresh confirmation
  const handleRefreshConfirm = () => {
    // Clear any stored authentication data
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentData');
    sessionStorage.removeItem('studentToken');
    sessionStorage.removeItem('studentData');

    // Clear authentication cookie
    document.cookie = 'token=; path=/; max-age=0';

    // Close modal
    setShowRefreshModal(false);

    // Redirect to home page (will trigger loader and auto-open modal)
    window.location.href = '/';
  };

  const handleRefreshCancel = () => {
    setShowRefreshModal(false);
  };

  // Handle logout cancellation
  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard studentData={studentData} setActiveSection={setActiveSection} />;
      case 'profile':
        return <Profile studentData={studentData} />;
      case 'attendance':
        return <Attendance />;
      case 'messbill':
        return <MessBill />;
      case 'complaints':
        return <Complaints />;
      case 'notifications':
        return <Notifications />;
      case 'settings':
        return <Settings />;
      case 'reduction':
        return <Reduction />;
      default:
        return <Dashboard studentData={studentData} setActiveSection={setActiveSection} />;
    }
  };

  const handleSetActiveSection = (section) => {
    setActiveSection(section);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  return (
    <div className="light-mode flex h-screen text-gray-900">
      <Sidebar
        setActiveSection={handleSetActiveSection}
        activeSection={activeSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogoutClick={handleLogoutClick} // Pass click handler instead of direct logout
      />

      <div className="flex-1 flex flex-col md:ml-64">
        <Header
          onLogoutClick={handleLogoutClick} // Pass click handler instead of direct logout
          studentData={studentData}
          setActiveSection={handleSetActiveSection}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        
        <MainContent>
          {renderSection()}
        </MainContent>
      </div>

      {/* Centralized Logout Modal - This will appear in the center of the page */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />

      {/* Refresh Confirmation Modal */}
      <RefreshConfirmationModal
        isOpen={showRefreshModal}
        onClose={handleRefreshCancel}
        onConfirm={handleRefreshConfirm}
      />
    </div>
  );
};

export default StudentDashboard;