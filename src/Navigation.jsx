import { useState, useRef, useEffect } from 'react';

function Navigation({ isLight, onToggleTheme, onOpenLogin, onOpenRegister }) {
  // Theme toggle is disabled, always light mode
  // local state for mobile menu toggle
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => {
    const menu = document.getElementById("mobileMenu");
    const hamburgerIcon = document.getElementById("hamburgerIcon");
    const closeIcon = document.getElementById("closeIcon");

    if (menu.classList.contains("hidden")) {
      menu.classList.remove("hidden");
      hamburgerIcon.classList.add("hidden");
      closeIcon.classList.remove("hidden");
    } else {
      menu.classList.add("hidden");
      hamburgerIcon.classList.remove("hidden");
      closeIcon.classList.add("hidden");
    }
  };

  return (
    <>
      {/* Professional Navigation */}
      <div className="glass-effect sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            <div className="flex items-center space-x-4 mr-6">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg float-animation">
                  <span className="text-2xl">🏛️</span>
                </div>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white drop-shadow-lg">
                  Chozha Boys Hostel
                </h1>
                <p className="text-xs text-white text-opacity-80 hidden sm:block drop-shadow-md">
                  Government College of Engineering, Thanjavur
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
              <a
                href="#features"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#features').scrollIntoView({ behavior: 'smooth' });
                }}
                className={`${isLight ? "text-black hover:text-gray-700" : "text-white hover:text-gray-300"} transition-colors font-medium drop-shadow-md cursor-pointer`}
              >
                Features
              </a>
              <a
                href="#about"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
                }}
                className={`${isLight ? "text-black hover:text-gray-700" : "text-white hover:text-gray-300"} transition-colors font-medium drop-shadow-md cursor-pointer`}
              >
                About
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
                }}
                className={`${isLight ? "text-black hover:text-gray-700" : "text-white hover:text-gray-300"} transition-colors font-medium drop-shadow-md cursor-pointer`}
              >
                Support
              </a>
            </div>



            {/* Mobile Navigation Menu */}
            <div
              id="mobileMenu"
              className="hidden absolute top-full left-0 right-0 glass-effect border-t border-slate-600"
            >
              <div className="px-4 py-4 space-y-3">
                <a
                  href="#features"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector('#features').scrollIntoView({ behavior: 'smooth' });
                    toggleMobileMenu(); // Close mobile menu after clicking
                  }}
                  className="block text-white text-opacity-90 hover:text-white transition-colors font-medium py-2 drop-shadow-md cursor-pointer"
                >
                  Features
                </a>
                <a
                  href="#about"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
                    toggleMobileMenu(); // Close mobile menu after clicking
                  }}
                  className="block text-white text-opacity-90 hover:text-white transition-colors font-medium py-2 drop-shadow-md cursor-pointer"
                >
                  About
                </a>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
                    toggleMobileMenu(); // Close mobile menu after clicking
                  }}
                  className="block text-white text-opacity-90 hover:text-white transition-colors font-medium py-2 drop-shadow-md cursor-pointer"
                >
                  Support
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Theme toggle removed - always light mode */}

              {/* Desktop Dropdown */}
                <div ref={dropdownRef} className={`dropdown ${isDropdownOpen ? 'open' : ''}`}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="btn-primary text-white px-6 py-2.5 rounded-lg font-semibold text-sm flex items-center space-x-2"
                >
                  <span>Access Portal</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div className="dropdown-content">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onOpenLogin("student");
                    }}
                    className="flex items-center space-x-2"
                  >
                    <span>🎓</span>
                    <span>Student Login</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onOpenLogin("admin");
                    }}
                    className="flex items-center space-x-2"
                  >
                    <span>👨‍💼</span>
                    <span>Admin Login</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onOpenRegister();
                    }}
                    className="flex items-center space-x-2 border-t border-white border-opacity-10"
                  >
                    <span>📝</span>
                    <span>Student Register</span>
                  </button>
                </div>
              </div>



              <button
                onClick={toggleMobileMenu}
                className="text-white hover:text-slate-300 transition-colors md:hidden"
              >
                <svg
                  id="hamburgerIcon"
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  id="closeIcon"
                  className="w-6 h-6 hidden"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navigation;
