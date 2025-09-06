function Features({isLight}) {
  return (
    <>
      <section id="features" className={isLight?"light-mode":""}>
      {/* Professional Features Section */}
      <div className="py-12 sm:py-16 md:py-24 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 px-2">
              Professional <span className="text-gradient">Management Suite</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-3xl mx-auto px-4">
              Comprehensive tools designed for efficient hostel administration and
              student services
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Professional Feature Cards with 3D Effects */}
            <div className="feature-card-3d glass-card rounded-2xl p-6 sm:p-8 text-center hover-lift">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                <span className="text-xl sm:text-2xl">✅</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
                Smart Attendance
              </h3>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                Automated attendance tracking with real-time verification and
                comprehensive reporting for administrators
              </p>
            </div>

            <div className="feature-card-3d glass-card rounded-2xl p-6 sm:p-8 text-center hover-lift">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                <span className="text-xl sm:text-2xl">🍽️</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
                Mess Management
              </h3>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                Digital billing system with online payments, receipt generation, and
                detailed consumption analytics
              </p>
            </div>

            <div className="feature-card-3d glass-card rounded-2xl p-6 sm:p-8 text-center hover-lift">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                <span className="text-xl sm:text-2xl">📝</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
                Issue Resolution
              </h3>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                Streamlined complaint management system with priority handling and
                status tracking capabilities
              </p>
            </div>

            <div className="feature-card-3d glass-card rounded-2xl p-6 sm:p-8 text-center hover-lift">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                <span className="text-xl sm:text-2xl">👥</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
                Visitor Management
              </h3>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                Comprehensive visitor tracking with digital logs, security protocols,
                and entry management
              </p>
            </div>*

            <div className="feature-card-3d glass-card rounded-2xl p-6 sm:p-8 text-center hover-lift">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                <span className="text-xl sm:text-2xl">🔔</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
                Notifications
              </h3>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                Real-time notification system for important updates, announcements,
                and administrative alerts
              </p>
            </div>

            <div className="feature-card-3d glass-card rounded-2xl p-6 sm:p-8 text-center hover-lift">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                <span className="text-xl sm:text-2xl">📊</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
                Analytics Dashboard
              </h3>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                Advanced reporting and analytics with insights for better
                decision-making and resource optimization
              </p>
            </div>
          </div>
        </div>
      </div>
      </section>
    </>
  );
}

export default Features;
