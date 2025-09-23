import React from 'react';

const AcademicDetailsStep = ({
  formData,
  errors,
  touched,
  handleInputChange,
  handleBlur,
  isLight
}) => {
  return (
    <div className="registration-step">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-2xl">🎓</span>
        </div>
        <p className="text-slate-400 text-sm sm:text-base">Enter your academic information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="relative z-50">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Department *</label>
          <select
            id="department"
            name="department"
            className={`w-full px-4 py-3 glass-effect rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent border-0
              ${errors.department ? 'border-red-500' : ''}`}
            style={{
              zIndex: 50,
              position: 'relative',
              backgroundColor: isLight ? 'white' : 'rgba(51, 65, 85, 0.8)',
              color: isLight ? 'black' : 'white'
            }}
            value={formData.department}
            onChange={handleInputChange}
            onBlur={handleBlur}
          >
            <option value="" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>Select Department</option>
            <option value="CSE" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>Computer Science & Engineering</option>
            <option value="ECE" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>Electronics & Communication Engineering</option>
            <option value="ME" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>Mechanical Engineering</option>
            <option value="CE" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>Civil Engineering</option>
            <option value="EE" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>Electrical Engineering</option>
            <option value="IT" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>Information Technology</option>
            <option value="CHEM" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>Chemical Engineering</option>
            <option value="BIO" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>Biotechnology</option>
          </select>
          {touched.department && errors.department && (
            <p className={`${isLight ? 'text-red-600' : 'text-red-400'} text-xs mt-1`}>{errors.department}</p>
          )}
        </div>

        <div className="relative z-50">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Academic Year *</label>
          <select
            id="academicYear"
            name="academicYear"
            className={`w-full px-4 py-3 glass-effect rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent border-0
              ${errors.academicYear ? 'border-red-500' : ''}`}
            style={{
              zIndex: 50,
              position: 'relative',
              backgroundColor: isLight ? 'white' : 'rgba(51, 65, 85, 0.8)',
              color: isLight ? 'black' : 'white'
            }}
            value={formData.academicYear}
            onChange={handleInputChange}
            onBlur={handleBlur}
          >
            <option value="" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>Select Academic Year</option>
            <option value="1" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>1st Year</option>
            <option value="2" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>2nd Year</option>
            <option value="3" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>3rd Year</option>
            <option value="4" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>4th Year</option>
          </select>
          {touched.academicYear && errors.academicYear && (
            <p className={`${isLight ? 'text-red-600' : 'text-red-400'} text-xs mt-1`}>{errors.academicYear}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Registration Number *</label>
          <input
            type="text"
            id="registrationNumber"
            name="registrationNumber"
            className={`w-full px-4 py-3 glass-effect rounded-lg placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent border-0
              ${errors.registrationNumber ? 'border-red-500' : ''} ${isLight ? 'text-black' : 'text-white'}`}
            placeholder="Enter registration number"
            value={formData.registrationNumber}
            onChange={handleInputChange}
            onBlur={handleBlur}
            maxLength="15"
          />
          {touched.registrationNumber && errors.registrationNumber && (
            <p className={`${isLight ? 'text-red-600' : 'text-red-400'} text-xs mt-1`}>{errors.registrationNumber}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Roll Number *</label>
          <input
            type="text"
            id="rollNumber"
            name="rollNumber"
            className={`w-full px-4 py-3 glass-effect rounded-lg placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent border-0
              ${errors.rollNumber ? 'border-red-500' : ''} ${isLight ? 'text-black' : 'text-white'}`}
            placeholder="Enter roll number"
            value={formData.rollNumber}
            onChange={handleInputChange}
            onBlur={handleBlur}
            maxLength="12"
          />
          {touched.rollNumber && errors.rollNumber && (
            <p className={`${isLight ? 'text-red-600' : 'text-red-400'} text-xs mt-1`}>{errors.rollNumber}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Room Number *</label>
          <input
            type="text"
            id="roomNumber"
            name="roomNumber"
            className={`w-full px-4 py-3 glass-effect rounded-lg placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent border-0
              ${errors.roomNumber ? 'border-red-500' : ''} ${isLight ? 'text-black' : 'text-white'}`}
            placeholder="Enter room number (3 digits)"
            value={formData.roomNumber}
            onChange={handleInputChange}
            onBlur={handleBlur}
            maxLength="3"
          />
          {touched.roomNumber && errors.roomNumber && (
            <p className={`${isLight ? 'text-red-600' : 'text-red-400'} text-xs mt-1`}>{errors.roomNumber}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcademicDetailsStep;
