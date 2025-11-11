import React from 'react';

const TermsConfirmationStep = ({
  formData,
  errors,
  touched,
  handleInputChange
}) => {
  return (
    <div className="registration-step">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-2xl">✅</span>
        </div>
        <p className="text-slate-400 text-sm sm:text-base">Review and confirm your registration</p>
      </div>

      <div className="space-y-6">
        {/* Registration Summary */}
        <div className="glass-effect rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Registration Summary</h3>
          <div className="space-y-2 text-sm text-slate-300">
            <p><strong>Name:</strong> {formData.fullName}</p>
            <p><strong>Father/Guardian Name:</strong> {formData.fatherName}</p>
            <p><strong>Date of Birth:</strong> {formData.dob}</p>
            <p><strong>Blood Group:</strong> {formData.bloodGroup}</p>
            <p><strong>Student Contact:</strong> {formData.studentContact}</p>
            <p><strong>Parent Contact:</strong> {formData.parentContact}</p>
            <p><strong>Address:</strong> {formData.address}</p>
            <p><strong>Department:</strong> {formData.department}</p>
            <p><strong>Academic Year:</strong> {formData.academicYear}</p>
            <p><strong>Registration Number:</strong> {formData.registrationNumber}</p>
            <p><strong>Roll Number:</strong> {formData.rollNumber}</p>
            <p><strong>Room Number:</strong> {formData.roomNumber}</p>
            <p><strong>Email:</strong> {formData.emailId}</p>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="glass-effect rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Terms & Conditions</h3>
          <div className="max-h-40 overflow-y-auto text-sm text-slate-300 space-y-2 mb-4">
            <p><strong>1. Hostel Rules:</strong> Students must follow all hostel rules and regulations as prescribed by the administration.</p>
            <p><strong>2. Attendance:</strong> Regular attendance is mandatory. Unauthorized absence may result in disciplinary action.</p>
            <p><strong>3. Mess Charges:</strong> Mess bills must be paid on time. Late payment may incur additional charges.</p>
            <p><strong>4. Visitor Policy:</strong> All visitors must be registered and follow the prescribed visiting hours.</p>
            <p><strong>5. Damage Policy:</strong> Students are responsible for any damage to hostel property and will be charged accordingly.</p>
            <p><strong>6. Privacy:</strong> Personal information will be kept confidential and used only for hostel administration purposes.</p>
            <p><strong>7. Account Security:</strong> Students are responsible for maintaining the security of their login credentials.</p>
          </div>

          <div className="space-y-3">
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                className="mt-1 rounded border-slate-600 bg-slate-700 text-emerald-500 focus:ring-emerald-500"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
              />
              <span className="text-sm text-slate-300">I have read and agree to the <strong>Terms & Conditions</strong> of Chozha Boys Hostel</span>
            </label>
            {touched.agreeTerms && errors.agreeTerms && (
              <p className={`text-red-600 text-xs mt-1`}>{errors.agreeTerms}</p>
            )}

            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="agreePrivacy"
                name="agreePrivacy"
                className="mt-1 rounded border-slate-600 bg-slate-700 text-emerald-500 focus:ring-emerald-500"
                checked={formData.agreePrivacy}
                onChange={handleInputChange}
              />
              <span className="text-sm text-slate-300">I consent to the collection and processing of my personal data as per the <strong>Privacy Policy</strong></span>
            </label>
            {touched.agreePrivacy && errors.agreePrivacy && (
              <p className={`text-red-600 text-xs mt-1`}>{errors.agreePrivacy}</p>
            )}

            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="agreeRules"
                name="agreeRules"
                className="mt-1 rounded border-slate-600 bg-slate-700 text-emerald-500 focus:ring-emerald-500"
                checked={formData.agreeRules}
                onChange={handleInputChange}
              />
              <span className="text-sm text-slate-300">I agree to abide by all <strong>Hostel Rules and Regulations</strong></span>
            </label>
            {touched.agreeRules && errors.agreeRules && (
              <p className={`text-red-600 text-xs mt-1`}>{errors.agreeRules}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConfirmationStep;
