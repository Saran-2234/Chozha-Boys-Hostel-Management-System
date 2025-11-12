import React from 'react';

// Modern date input that emits dob as YYYY-MM-DD
const DateOfBirthPicker = ({ dobValue, onChange, onBlur }) => {
  return (
    <input
      type="date"
      value={dobValue || ''}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      className="w-full px-4 py-3 glass-effect rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent border-0 text-black"
      max={new Date().toISOString().split('T')[0]} // Prevent future dates
      min="1900-01-01" // Set minimum date
    />
  );
};

const PersonalDetailsStep = ({
  formData,
  errors,
  touched,
  handleInputChange,
  handleBlur
}) => {
  return (
    <div className="registration-step">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-2xl">👤</span>
        </div>
        <p className="text-slate-400 text-sm sm:text-base">Enter your personal information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Full Name *</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            className={`w-full px-4 py-3 glass-effect rounded-lg placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent border-0
              ${errors.fullName ? 'border-red-500' : ''} text-black`}
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
          {touched.fullName && errors.fullName && (
            <p className={`text-red-600 text-xs mt-1`}>{errors.fullName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Father/Guardian Name *</label>
          <input
            type="text"
            id="fatherName"
            name="fatherName"
            className={`w-full px-4 py-3 glass-effect rounded-lg placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent border-0
              ${errors.fatherName ? 'border-red-500' : ''} text-black`}
            placeholder="Enter father/guardian name"
            value={formData.fatherName}
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
          {touched.fatherName && errors.fatherName && (
            <p className={`text-red-600 text-xs mt-1`}>{errors.fatherName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Date of Birth *</label>
          <DateOfBirthPicker
            dobValue={formData.dob}
            onChange={(dob) => handleInputChange({ target: { id: 'dob', value: dob } })}
            onBlur={() => handleBlur({ target: { id: 'dob', value: formData.dob } })}
          />
          {touched.dob && errors.dob && (
            <p className={`text-red-600 text-xs mt-1`}>{errors.dob}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Blood Group *</label>
          <select
            id="bloodGroup"
            name="bloodGroup"
            className={`w-full px-4 py-3 glass-effect rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent border-0
              ${errors.bloodGroup ? 'border-red-500' : ''}`}
            style={{
              backgroundColor: 'white',
              color: 'black'
            }}
            value={formData.bloodGroup}
            onChange={handleInputChange}
            onBlur={handleBlur}
          >
            <option value="" style={{ backgroundColor: 'white', color: 'black' }}>Select Blood Group</option>
            <option value="A+" style={{ backgroundColor: 'white', color: 'black' }}>A+</option>
            <option value="A-" style={{ backgroundColor: 'white', color: 'black' }}>A-</option>
            <option value="B+" style={{ backgroundColor: 'white', color: 'black' }}>B+</option>
            <option value="B-" style={{ backgroundColor: 'white', color: 'black' }}>B-</option>
            <option value="AB+" style={{ backgroundColor: 'white', color: 'black' }}>AB+</option>
            <option value="AB-" style={{ backgroundColor: 'white', color: 'black' }}>AB-</option>
            <option value="O+" style={{ backgroundColor: 'white', color: 'black' }}>O+</option>
            <option value="O-" style={{ backgroundColor: 'white', color: 'black' }}>O-</option>
          </select>
          {touched.bloodGroup && errors.bloodGroup && (
            <p className={`text-red-600 text-xs mt-1`}>{errors.bloodGroup}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Student Contact Number *</label>
          <input
            type="text"
            id="studentContact"
            name="studentContact"
            className={`w-full px-4 py-3 glass-effect rounded-lg placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent border-0
              ${errors.studentContact ? 'border-red-500' : ''} text-black`}
            placeholder="Enter student contact number"
            value={formData.studentContact}
            onChange={handleInputChange}
            onBlur={handleBlur}
            maxLength="10"
          />
          {touched.studentContact && errors.studentContact && (
            <p className={`text-red-600 text-xs mt-1`}>{errors.studentContact}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Parent Contact Number *</label>
          <input
            type="text"
            id="parentContact"
            name="parentContact"
            className={`w-full px-4 py-3 glass-effect rounded-lg placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent border-0
              ${errors.parentContact ? 'border-red-500' : ''} text-black`}
            placeholder="Enter parent contact number"
            value={formData.parentContact}
            onChange={handleInputChange}
            onBlur={handleBlur}
            maxLength="10"
          />
          {touched.parentContact && errors.parentContact && (
            <p className={`text-red-600 text-xs mt-1`}>{errors.parentContact}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Address *</label>
          <textarea
            id="address"
            name="address"
            rows="3"
            className={`w-full px-4 py-3 glass-effect rounded-lg placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent border-0
              ${errors.address ? 'border-red-500' : ''} text-black`}
            placeholder="Enter your full address"
            value={formData.address}
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
          {touched.address && errors.address && (
            <p className={`text-red-600 text-xs mt-1`}>{errors.address}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsStep;
