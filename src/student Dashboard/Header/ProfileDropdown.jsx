import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRoomInfo } from '../../Common/roomUtils';

const ProfileDropdown = ({ onLogoutClick, studentData, setActiveSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Extract student information from the studentData prop
  const getStudentInfo = () => {
    if (!studentData) {
      return {
        initials: 'U',
        name: 'User',
        department: 'Department',
        year: 'Year'
      };
    }
    
    // Check different possible structures of studentData
    let student = {};
    
    // Handle the structure from your console log: {success: true, message: '...', session: {...}, data: {...}}
    if (studentData.data) {
      student = studentData.data;
    } 
    // Handle the old structure with userdata array
    else if (studentData.userdata && studentData.userdata.length > 0) {
      student = studentData.userdata[0];
    } 
    // Handle direct student data
    else if (studentData.name) {
      student = studentData;
    }
    
    // Get initials from name
    const initials = student.name 
      ? student.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
      : 'U';
    
    // Get department and year
    const department = student.department || 'Department';
    const year = student.academic_year 
      ? student.academic_year.replace('Year', '').trim() + ' Year'
      : 'Year';
    
    return {
      initials,
      name: student.name || 'User',
      department,
      year
    };
  };

  const { initials, name, department, year } = getStudentInfo();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogoutClick = () => {
    // Close dropdown and call parent handler to show modal
    setIsOpen(false);
    onLogoutClick(); // This will trigger the centralized modal
  };

  const handleViewProfile = () => {
    // Close dropdown
    setIsOpen(false);
    
    // Navigate to profile section
    if (setActiveSection) {
      setActiveSection('profile');
    }
  };

  const handleSettings = () => {
    // Close dropdown
    setIsOpen(false);
    
    // Navigate to settings section
    if (setActiveSection) {
      setActiveSection('settings');
    }
  };

  return (
    <div className="relative" style={{ zIndex: 40, position: 'relative' }}>
      <button onClick={toggleDropdown} className="flex items-center space-x-3 glass-effect px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-sm font-bold text-white">{initials}</span>
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-white">{name}</p>
          <p className="text-xs text-slate-400">{department} - {year}</p>
        </div>
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 glass-card rounded-lg shadow-lg z-10">
          <div className="py-2">
            <button
              onClick={handleViewProfile}
              className="w-full text-left block px-4 py-2 text-sm text-white hover:bg-white hover:bg-opacity-10"
            >
              👤 View Profile
            </button>
            <button
              onClick={handleSettings}
              className="w-full text-left block px-4 py-2 text-sm text-white hover:bg-white hover:bg-opacity-10"
            >
              ⚙️ Settings
            </button>
            <hr className="my-2 border-slate-600" />
            <button
              onClick={handleLogoutClick}
              className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-white hover:bg-opacity-10"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;