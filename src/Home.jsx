import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Notification from "./Notification.jsx";
import Navigation from "./Navigation.jsx";
import Herosection from "./Herosection.jsx";
import HostelShowcase from "./HostelShowcase.jsx";
import Features from "./Features.jsx";
import Stats from "./Stats.jsx";
import Footer from "./Footer.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";


function Home() {
  const location = useLocation();
  const [isLight, setIsLight] = useState(false);

  // login modal state
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [loginType, setLoginType] = useState("student");

  // register modal state
  const [isRegisterOpen, setRegisterOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("light-mode", isLight);
  }, [isLight]);

  useEffect(() => {
    if (location.state?.fromDashboard) {
      setLoginType(location.state.loginType || 'student');
      setLoginOpen(true);
    }
    // Check localStorage flag for student reload redirects
    if (localStorage.getItem('redirectFromDashboard') === 'true') {
      setLoginType('student');
      setLoginOpen(true);
      localStorage.removeItem('redirectFromDashboard');
    }
    // Check localStorage flag for admin reload redirects
    if (localStorage.getItem('redirectFromAdminDashboard') === 'true') {
      setLoginType('admin');
      setLoginOpen(true);
      localStorage.removeItem('redirectFromAdminDashboard');
    }
  }, [location.state]);

  return (
    <>
      <Notification />
      <Navigation
        isLight={isLight}
        onToggleTheme={() => setIsLight((v) => !v)}
        onOpenLogin={(type) => {
          setLoginType(type || "student");
          setLoginOpen(true);
        }}
        onOpenRegister={() => {
          setRegisterOpen(true);
          setLoginOpen(false); // Close login if open
        }}
      />
      <Herosection
        isLight={isLight}
        onOpenLogin={(type) => {
          setLoginType(type || "student");
          setLoginOpen(true);
        }}
      />
      <HostelShowcase isLight={isLight} />
      <Features isLight={isLight} />
      <Stats isLight={isLight} />
      <Footer isLight={isLight} />

      {/* Login Modal */}
      {isLoginOpen && (
        <Login
          loginType={loginType}
          onClose={() => setLoginOpen(false)}
          onOpenRegister={() => {
            setRegisterOpen(true);
            setLoginOpen(false);
          }}
        />
      )}

      {/* Register Modal */}
      {isRegisterOpen && (
        <Register
          onClose={() => setRegisterOpen(false)}
          onOpenLogin={() => {
            setLoginOpen(true);
            setRegisterOpen(false);
          }}
        />
      )}
    </>
  );
}

export default Home;
