import React from 'react'

function Footer({isLight}) {
  return (
    <>
      <section id="contact" className={isLight?"light-mode":""}>
      {/* Professional Footer */}
      <footer className={"py-8 sm:py-12 md:py-16 px-4 relative z-10"}>
        <div className={"max-w-6xl mx-auto"}>
          <div className={"glass-card rounded-2xl p-6 sm:p-8 md:p-10 professional-shadow"}>
            <div className={"flex flex-col md:flex-row items-center justify-between mb-6 sm:mb-8"}>
              <div className={"flex items-center space-x-3 sm:space-x-4 mb-6 md:mb-0"}>
                <div className={"w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"}>
                  <span className={"text-lg sm:text-2xl"}>🏛️</span>
                </div>
                <div>
                  <h3 className={"text-lg sm:text-xl font-bold text-white"}>Chozha Boys Hostel</h3>
                  <p className={"text-slate-400 text-xs sm:text-sm"}>
                    Government College of Engineering, Thanjavur
                  </p>
                </div>
              </div>

              <div className={"flex flex-wrap justify-center gap-4 sm:gap-6 text-slate-300"}>
                <a href="#" className={"hover:text-white transition-colors font-medium text-sm sm:text-base text-slate-300 hover:text-blue-400"}>About</a>
                <a href="#" className={"hover:text-white transition-colors font-medium text-sm sm:text-base text-slate-300 hover:text-blue-400"}>Contact</a>
                <a href="#" className={"hover:text-white transition-colors font-medium text-sm sm:text-base text-slate-300 hover:text-blue-400"}>Support</a>
                <a href="#" className={"hover:text-white transition-colors font-medium text-sm sm:text-base text-slate-300 hover:text-blue-400"}>Privacy</a>
              </div>
            </div>

            <div className={"border-t border-slate-600 pt-6 sm:pt-8"}>
              <div className={"flex flex-col md:flex-row justify-between items-center text-center md:text-left"}>
                <p className={"text-slate-300 text-xs sm:text-sm mb-4 md:mb-0 px-2"}>
                  © 2024 Chozha Boys Hostel Management System. All rights reserved.
                </p>
                <div className={"flex items-center justify-center space-x-2 sm:space-x-4 text-slate-300 text-xs sm:text-sm"}>
                  <span className={"hidden sm:inline text-slate-300"}>Powered by Advanced Technology</span>
                  <span className={"sm:hidden text-slate-300"}>System Status</span>
                  <div className={"w-2 h-2 bg-green-400 rounded-full animate-pulse"}></div>
                  <span className={"text-green-400 font-medium"}>Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      </section>
    </>
  )
}

export default Footer
