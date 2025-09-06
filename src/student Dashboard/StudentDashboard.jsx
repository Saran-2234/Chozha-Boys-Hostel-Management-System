import React, { useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';
import MainContent from './Header/MainContent';
import Dashboard from './Dashboard/Dashboard';
import Profile from './Profile/Profile';
import Attendance from './Attendance/Attendance';
import MessBill from './MessBill/MessBill';
import Complaints from './Complaints/Complaints';
import Visitors from './Visitors/Visitors';
import Notifications from './Notifications/Notifications';
import Settings from './Settings/Settings';
import './styles/studentDashboard.css';
import { useLocation, useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const location = useLocation();
  const studentData = location.state?.studentData || location.state?.data;
  console.log('Student data:', studentData);
  
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentData');
    sessionStorage.removeItem('studentToken');
    sessionStorage.removeItem('studentData');

    // Redirect to login page
    navigate('/', { replace: true });
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard studentData={studentData} />;
      case 'profile':
        return <Profile studentData={studentData} />;
      case 'attendance':
        return <Attendance />;
      case 'messbill':
        return <MessBill />;
      case 'complaints':
        return <Complaints />;
      case 'visitors':
        return <Visitors />;
      case 'notifications':
        return <Notifications />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  const handleSetActiveSection = (section) => {
    setActiveSection(section);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  return (
    <div className={`${isDarkMode ? 'professional-bg' : 'light-mode'} flex h-screen ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <Sidebar
        setActiveSection={handleSetActiveSection}
        activeSection={activeSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Pass setActiveSection to Header */}
        <Header
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          onLogout={handleLogout}
          studentData={studentData}
          setActiveSection={handleSetActiveSection}
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

export default StudentDashboard;