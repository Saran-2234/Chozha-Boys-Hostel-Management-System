import React from "react";
import { useNavigate } from "react-router-dom";

function Login({ onClose, onOpenRegister, loginType }) {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Add login type to the request if your backend needs it
      const requestData = {
        ...formData,
        userType: loginType // Add this if your backend distinguishes between student/admin
      };

      const response = await fetch(
        "https://finalbackend-mauve.vercel.app/login/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid login credentials");
      }

      console.log("User data after login:", data);

      // Store authentication data
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }
      if (data.user) {
        localStorage.setItem("userData", JSON.stringify(data.user));
      }

      // Redirect based on login type
      if (loginType === "admin") {
        navigate("/admin-dashboard", { state: { data } });
      } else {
        navigate("/dashboard", { state: { data } });
      }
      
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Something went wrong. Please try again.");
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

          <form onSubmit={handleLogin}>
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
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2 sm:mb-3">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 glass-effect rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent border-0 text-sm sm:text-base"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
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
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors text-center sm:text-right"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full text-white py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all ${
                  isLoading
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
    </div>
  );
}

export default Login;