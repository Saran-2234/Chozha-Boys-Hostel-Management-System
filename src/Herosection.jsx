import React from 'react';

function Herosection({ isLight, onOpenLogin }) {
  return (
    <section className={isLight?"light-mode":""}>
      <div className="relative min-h-screen flex items-center justify-center px-4 py-8 sm:py-12 md:py-20">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="fade-in-up">
            <div className="mb-4 sm:mb-6 md:mb-8 hero-glow">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl float-animation professional-shadow">
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">🏢</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
              Welcome to<br />
              <span className="text-gradient">Chozha Boys Hostel</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-3 sm:mb-4 max-w-3xl mx-auto font-medium px-4">
              Government College of Engineering, Thanjavur
            </p>

            <p className="text-base sm:text-lg text-slate-400 mb-6 sm:mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed px-4">
              Experience seamless hostel management with our comprehensive digital platform.
              Streamline attendance, billing, complaints, and administrative processes with professional-grade tools.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center items-center px-4">
              <button
                onClick={() => onOpenLogin("student")}
                className="w-full sm:w-auto btn-primary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover-lift"
              >
                🎓 Student Portal
              </button>
              <button
                onClick={() => onOpenLogin("admin")}
                className="w-full sm:w-auto btn-secondary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover-lift"
              >
                👨‍💼 Admin Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Herosection;
