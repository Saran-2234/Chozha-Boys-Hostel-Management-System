import React from 'react';

const PasswordPhotoStep = ({
  formData,
  errors,
  touched,
  handleInputChange,
  handleBlur,
  isLight,
  photoPreview,
  handlePhotoUpload,
  fileInputRef,
  confirmPasswordSuccess,
}) => {
  return (
    <div className="registration-step">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-2xl">🔐</span>
        </div>
        <p className="text-slate-400 text-sm sm:text-base">Set your password and upload your photo</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Password *</label>
          <input
            type="password"
            id="password"
            name="password"
            className={`w-full px-4 py-3 glass-effect rounded-lg placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent border-0 ${
              errors.password ? 'border-red-500' : ''
            } ${isLight ? 'text-black' : 'text-white'}`}
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
          {touched.password && errors.password && (
            <p className={`${isLight ? 'text-red-600' : 'text-red-400'} text-xs mt-1`}>{errors.password}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Confirm Password *</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className={`w-full px-4 py-3 glass-effect rounded-lg placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent border-0 ${
              errors.confirmPassword ? 'border-red-500' : ''
            } ${isLight ? 'text-black' : 'text-white'}`}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
          {touched.confirmPassword && errors.confirmPassword && (
            <p className={`${isLight ? 'text-red-600' : 'text-red-400'} text-xs mt-1`}>{errors.confirmPassword}</p>
          )}
          {confirmPasswordSuccess && <p className="text-green-400 text-xs mt-1">✓ Passwords match</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Passport Size Photo *</label>

          <div className="flex flex-col items-center">
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/png,image/jpeg,image/jpg"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all mb-2"
            >
              Choose File
            </button>

            <span className="text-sm text-slate-400 mb-3">PNG, JPEG, JPG up to 2MB</span>

            {photoPreview ? (
              <div className="relative w-32 h-32">
                <img
                  src={photoPreview}
                  alt="Photo Preview"
                  className="w-32 h-32 object-cover rounded-full border-2 border-slate-600 shadow-md"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="absolute -bottom-1 right-0 bg-emerald-600 text-white rounded-full p-1 shadow-md"
                  title="Change photo"
                >
                  ✎
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">Preview</div>
            )}

            {touched.photo && errors.photo && (
              <p className={`${isLight ? 'text-red-600' : 'text-red-400'} text-xs mt-1`}>{errors.photo}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordPhotoStep;
