import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';
import MainContent from './Header/MainContent';

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
  const [activeSection, setActiveSection] = useState('students');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [showRefreshModal, setShowRefreshModal] = useState(false); // Refresh modal state

  const handleLogout = async () => {
    try {
      const storedUserData = localStorage.getItem('userData');
      const userData = storedUserData ? JSON.parse(storedUserData) : {};

      await axios.post("https://finalbackend1.vercel.app/admin/logout", {
        user_id: userData.id,
        email: userData.email
      }, {
        withCredentials: true
      });
    } catch (error) {
      console.error("Logout failed", error);
    }

    // Handle logout logic here
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('accessToken');

    document.cookie = 'token=; path=/; max-age=0';
    document.cookie = 'accessToken=; path=/; max-age=0';
    document.cookie = 'refreshToken=; path=/; max-age=0';

    console.log('Logout clicked');
    // Redirect to landing page
    window.location.href = '/';
  };

  useEffect(() => {
    // Set active section based on location state
    if (location.state && location.state.activeSection) {
      setActiveSection(location.state.activeSection);
    }
  }, [location.state]);

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
        return <Students />;
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