import React from 'react';
import ProfileDropdown from './ProfileDropdown';
import ThemeToggle from './ThemeToggle';

const Header = ({ isDarkMode, setIsDarkMode, onLogout, studentData, setActiveSection, sidebarOpen, setSidebarOpen }) => {
  // Extract student name from the studentData prop
  const getStudentName = () => {
    if (!studentData) return 'Student';
    
    // Check different possible structures of studentData
    if (studentData.userdata && studentData.userdata.length > 0) {
      return studentData.userdata[0].name || 'Student';
    }
    
    if (studentData.name) {
      return studentData.name;
    }
    
    return 'Student';
  };

  const studentName = getStudentName();

  return (
    <header className="glass-effect sticky top-0 z-30 ">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            className="md:hidden text-white hover:text-slate-300"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Student Dashboard</h1>
            <p className="text-sm text-slate-400">Welcome back, {studentName}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          <ProfileDropdown 
            onLogout={onLogout} 
            studentData={studentData}
            setActiveSection={setActiveSection}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;