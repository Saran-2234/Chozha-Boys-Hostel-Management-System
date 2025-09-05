import { useState, useEffect } from 'react';
import boysHostelImage from './assets/boys hostel.jpg';
import hostelImage from './assets/hostel image.jpg';

function HostelShowcase({isLight}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [boysHostelImage, hostelImage];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section id="about" className={isLight?"light-mode":""}>
    <div className="py-12 sm:py-16 md:py-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 px-2">
            Our <span className="text-gradient">Hostel Campus</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto px-4">
            Experience the modern facilities and comfortable living spaces at
            Chozha Boys Hostel
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 sm:p-8 professional-shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Main Building */}
            <div className="lg:col-span-2 lg:row-span-2">
              <div className="relative rounded-xl overflow-hidden hover-lift">
                <img
                  src={images[currentImageIndex]}
                  alt="Main Building"
                  className="w-full h-full object-cover transition-opacity duration-1000"
                />
              </div>
              <h3 className="text-center text-gray-300 text-xl font-bold mt-2">Main Building</h3>
            </div>

            {/* Dining Hall */}
            <div className="relative h-32 sm:h-40 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl overflow-hidden hover-lift">
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-2xl sm:text-3xl mb-2">🍽️</div>
                  <h3 className="text-sm sm:text-base font-bold">Dining Hall</h3>
                  <p className="text-xs text-slate-200">Spacious mess facility</p>
                </div>
              </div>
            </div>

            {/* Recreation Room */}
            <div className="relative h-32 sm:h-40 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl overflow-hidden hover-lift">
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-2xl sm:text-3xl mb-2">🎮</div>
                  <h3 className="text-sm sm:text-base font-bold">Recreation</h3>
                  <p className="text-xs text-slate-200">Games & TV room</p>
                </div>
              </div>
            </div>

            {/* Study Hall */}
            <div className="relative h-32 sm:h-40 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl overflow-hidden hover-lift">
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-2xl sm:text-3xl mb-2">📚</div>
                  <h3 className="text-sm sm:text-base font-bold">Study Hall</h3>
                  <p className="text-xs text-slate-200">24/7 study space</p>
                </div>
              </div>
            </div>

            {/* Laundry */}
            <div className="relative h-32 sm:h-40 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl overflow-hidden hover-lift">
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-2xl sm:text-3xl mb-2">👕</div>
                  <h3 className="text-sm sm:text-base font-bold">Laundry</h3>
                  <p className="text-xs text-slate-200">Modern facilities</p>
                </div>
              </div>
            </div>

            {/* Garden Area */}
            <div className="relative h-32 sm:h-40 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl overflow-hidden hover-lift">
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-2xl sm:text-3xl mb-2">🌳</div>
                  <h3 className="text-sm sm:text-base font-bold">Garden</h3>
                  <p className="text-xs text-slate-200">Green spaces</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 text-center">
            <button className="btn-primary text-white px-6 py-3 rounded-lg font-semibold hover-lift">
              📸 View Virtual Tour
            </button>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
}

export default HostelShowcase;
