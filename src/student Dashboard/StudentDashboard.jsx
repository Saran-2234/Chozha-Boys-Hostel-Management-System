import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  const navigate = useNavigate();

  // Get student data from location.state (programmatic navigation) or localStorage (direct URL access)
  const getStudentData = () => {
    // First try location.state (for programmatic navigation)
    let studentData = location.state?.studentData || location.state?.data;

    // If not found in location.state, try localStorage (for direct URL access)
    if (!studentData) {
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        try {
          studentData = JSON.parse(storedData);
        } catch (e) {
          console.error('Error parsing stored user data:', e);
        }
      }
    }

    return studentData;
  };

  const studentData = getStudentData();
  console.log('Student data:', studentData);

  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [showLogoutModal, setShowLogoutModal] = useState(false); // Centralized modal state
  const [showRefreshModal, setShowRefreshModal] = useState(false); // Refresh modal state

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('studentToken') || localStorage.getItem('accessToken') || sessionStorage.getItem('studentToken');

    // If no student data and no token, redirect to login
    if (!studentData && !token) {
      console.log('No authentication data found, redirecting to login');
      navigate('/', { replace: true });
      return;
    }

    // If we have a token but no student data, we might need to fetch it
    // For now, we'll proceed and let components handle missing data gracefully
  }, [studentData, navigate]);



  // Handle logout click from both sidebar and header
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  // Handle logout confirmation
  // Handle logout confirmation
  const handleLogoutConfirm = async () => {
    try {
      // Call backend logout to clear HttpOnly cookies
      const storedUserData = localStorage.getItem('userData');
      const userData = storedUserData ? JSON.parse(storedUserData) : {};

      await axios.post("https://finalbackend1.vercel.app/students/logout", {
        user_id: userData.id,
        email: userData.email
      }, {
        withCredentials: true
      });
    } catch (error) {
      console.error("Logout endpoint failed", error);
    }

    // Clear any stored authentication data
    localStorage.removeItem('studentToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('studentId');
    sessionStorage.removeItem('studentToken');
    sessionStorage.removeItem('userData');

    // Clear authentication cookie (client side cleanup where possible)
    document.cookie = 'token=; path=/; max-age=0';
    document.cookie = 'studentToken=; path=/; max-age=0';
    document.cookie = 'refreshToken=; path=/; max-age=0';

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

      <div className="flex-1 flex flex-col md:ml-64 z-40">
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