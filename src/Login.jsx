import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ForgotPasswordModal from "./registration/ForgotPasswordModal";

function Login({ onClose, onOpenRegister, loginType }) {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [showForgotPassword, setShowForgotPassword] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState({
    email: "",
    password: ""
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
    // Clear errors when user starts typing
    if (error) setError("");
    if (fieldErrors[id]) {
      setFieldErrors(prev => ({
        ...prev,
        [id]: ""
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const errors = {
      email: "",
      password: ""
    };

    let isValid = true;

    if (!formData.email.trim()) {
      errors.email = "Email cannot be empty";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password) {
      errors.password = "Password cannot be empty";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Custom validation instead of HTML5 validation
    if (!validateForm()) {
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // Add login type to the request if your backend needs it
      const requestData = {
        ...formData,
        userType: loginType // Add this if your backend distinguishes between student/admin
      };

      const endpoint = loginType === "admin" ? "admin/adminslogin" : "students/studentslogin";

      const response = await axios.post(
        `https://finalbackend1.vercel.app/${endpoint}`,
        requestData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // allows sending cookies
        }
      );

      const data = response.data;

      if (!data.success) {
        throw new Error(data.message || "Invalid login credentials");
      }

      // Check if the user's role matches the login type they selected
      if (data.role && data.role !== loginType) {
        throw new Error(`You are not authorized to access the ${loginType} portal. Please use the ${data.role} login.`);
      }

      // For student logins: ensure the account is active/approved before proceeding.
      // Different backends use different field names/types for status, so check commonly used ones.
      const userData = data.data || {};
      const rawStatus = userData.status ?? userData.isActive ?? userData.active ?? userData.accountStatus ?? userData.account_status ?? userData.approved ?? userData.approvalStatus;
      const normalizeIsActive = (val) => {
        if (val === undefined || val === null) return true; // assume active if backend didn't provide a status
        if (typeof val === 'boolean') return Boolean(val);
        if (typeof val === 'number') return val === 1;
        const s = String(val).toLowerCase().trim();
        return ['active', 'approved', 'true', '1', 'yes'].includes(s);
      };

      if (loginType === 'student' && !normalizeIsActive(rawStatus)) {
        // Don't proceed with storing tokens or navigation.
        setIsLoading(false);
        setError('Your account is not active yet. Please wait until an administrator approves your account.');
        return;
      }

      console.log("Login successful!");
      console.log("User Role:", data.role);
      console.log("Access Token:", data.token);
      console.log("User Data:", data.data);
      console.log("Session Info:", {
        expires_at: data.session?.expires_at,
        user_id: data.session?.user?.id
      });

      // Determine user role
      const userRole = data.role || loginType;

      // Store authentication data
      if (data.token) {
        if (userRole === "student") {
          localStorage.setItem("studentToken", data.token);
        } else {
          localStorage.setItem("accessToken", data.token);
        }
        // Set cookie for backend authentication
        document.cookie = `token=${data.token}; path=/; max-age=86400; secure; samesite=lax`;
      }
      if (data.data) {
        localStorage.setItem("userData", JSON.stringify(data.data));
        if (data.data.id) {
          localStorage.setItem("studentId", data.data.id);
        }
      }
      if (data.session) {
        localStorage.setItem("sessionData", JSON.stringify(data.session));
      }
      if (data.role) {
        localStorage.setItem("userRole", data.role);
      }

      // Redirect based on user role from API response
      if (userRole === "admin") {
        navigate("/admin-dashboard", { state: { data } });
      } else {
        // Pass the student data to the student dashboard profile
        navigate("/dashboard", { state: { studentData: data.data || data } });
      }

    } catch (err) {
      console.error("Login error:", err);

      // Friendly error mapping for axios responses
      let userMessage = "Something went wrong. Please try again.";

      // If this is an axios error with a response from server
      if (err && err.response) {
        const status = err.response.status;
        const serverMsg = err.response.data?.message || err.response.data?.error || null;

        if (serverMsg) {
          const s = String(serverMsg).toLowerCase();
          if (s.includes('password') || s.includes('invalid') || status === 401) {
            userMessage = 'Incorrect email or password.';
          } else if (s.includes('inactive') || s.includes('not active') || status === 403) {
            userMessage = 'Your account is not active yet. Please wait until an administrator approves your account.';
          } else if (status === 404 || s.includes('not found') || s.includes('no user')) {
            userMessage = 'No account found with this email.';
          } else {
            // Use server message if it's descriptive enough
            userMessage = serverMsg;
          }
        } else {
          // Fallback mapping based on status code
          if (status === 401) userMessage = 'Incorrect email or password.';
          else if (status === 403) userMessage = 'Your account is not active yet. Please wait until an administrator approves your account.';
          else if (status === 404) userMessage = 'No account found with this email.';
          else if (status >= 500) userMessage = 'Server error. Please try again later.';
          else userMessage = `Request failed with status code ${status}`;
        }

      } else if (err && err.request) {
        // Request was made but no response (network error)
        userMessage = 'Network error. Please check your internet connection and try again.';
      } else if (err && err.message) {
        userMessage = err.message;
      }

      setError(userMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="loginModal"
      className="fixed inset-0 bg-black bg-opacity-60 login-modal z-50 flex items-center justify-center p-4"
    >
      <div className="glass-card rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all professional-shadow relative">
        <div className="p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
              <span className="text-xl sm:text-2xl">
                {loginType === "admin" ? "⚙️" : "🎓"}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {loginType === "student" ? "Student Portal" : loginType === "admin" ? "Admin Portal" : "Login"}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Secure access to your dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} noValidate>
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2 sm:mb-3">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 glass-effect rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent border-0 text-sm sm:text-base"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                {fieldErrors.email && (
                  <p className="text-red-400 text-xs mt-1 font-medium">{fieldErrors.email}</p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-slate-300 mb-2 sm:mb-3">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 glass-effect rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent border-0 text-sm sm:text-base pr-12"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors focus:outline-none p-1 bg-transparent border-none"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-red-400 text-xs mt-1 font-medium">{fieldErrors.password}</p>
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-900 bg-opacity-20 rounded-lg">
                  <p className="text-red-400 text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <label className="flex items-center text-slate-300">
                  <input
                    type="checkbox"
                    className="rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors text-center sm:text-right"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full text-white py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all ${isLoading
                  ? 'bg-blue-600 cursor-not-allowed opacity-75'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                  }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Logging in...
                  </div>
                ) : (
                  'Login'
                )}
              </button>
            </div>
          </form>

          <div className="mt-4 sm:mt-6 text-center space-y-2">
            <p className="text-xs sm:text-sm text-slate-400">
              {loginType === "admin" ? "New admin?" : "New student?"}{" "}
              <button
                onClick={onOpenRegister}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors underline"
              >
                Register here
              </button>
            </p>
            <p className="text-xs sm:text-sm text-slate-400">
              Need assistance?{" "}
              <button
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Contact Support
              </button>
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1"
        >
          <svg
            className="w-6 h-6"
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

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onLogin={() => {
          setShowForgotPassword(false);
        }}
      />
    </div>
  );
}

export default Login;