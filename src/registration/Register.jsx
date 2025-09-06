import React, { useState, useRef, useEffect } from 'react';
import { validateField, isStepValid, isFormValid } from './validations.js';
import { sendOTP, verifyOTP, registerUser } from './api.js';
import EmailOtpStep from './steps/EmailOtpStep.jsx';
import PersonalDetailsStep from './steps/PersonalDetailsStep.jsx';
import AcademicDetailsStep from './steps/AcademicDetailsStep.jsx';
import PasswordPhotoStep from './steps/PasswordPhotoStep.jsx';
import TermsConfirmationStep from './steps/TermsConfirmationStep.jsx';

function Register({ onClose, onOpenLogin, isLight }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);

  const [formData, setFormData] = useState({
    // Step 1: Email & OTP
    emailId: '',
    otpCode: '',

    // Step 2: Personal Details
    fullName: '',
    fatherName: '',
    dob: '',
    bloodGroup: '',
    studentContact: '',
    parentContact: '',
    address: '',

    // Step 3: Academic Details
    department: '',
    academicYear: '',
    registrationNumber: '',
    rollNumber: '',
    roomNumber: '',

    // Step 4: Password & Photo
    password: '',
    confirmPassword: '',
    photo: '',

    // Step 5: Terms & Confirmation
    agreeTerms: false,
    agreePrivacy: false,
    agreeRules: false
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [confirmPasswordSuccess, setConfirmPasswordSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const currentYear = new Date().getFullYear();

  // Handle resend countdown timer
  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  // Handle input changes with validation
  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    const newFormData = { ...formData, [id]: fieldValue };
    setFormData(newFormData);

    // If email changed, reset OTP states
    if (id === 'emailId') {
      setOtpSent(false);
      setOtpVerified(false);
      setResendCountdown(0);
    }

    // Validate field and update errors
    const error = validateField(id, fieldValue, newFormData);
    setErrors(prevErrors => ({
      ...prevErrors,
      [id]: error
    }));

    // If password changed and confirmPassword is filled, revalidate confirmPassword
    if (id === 'password' && newFormData.confirmPassword) {
      const confirmError = validateField('confirmPassword', newFormData.confirmPassword, newFormData);
      setErrors(prevErrors => ({ ...prevErrors, confirmPassword: confirmError }));
      setConfirmPasswordSuccess(!confirmError && newFormData.confirmPassword ? true : false);
    }

    // Set confirmPasswordSuccess for confirmPassword field
    if (id === 'confirmPassword') {
      setConfirmPasswordSuccess(!error && value ? true : false);
    }

    // Mark field as touched
    setTouched(prevTouched => ({
      ...prevTouched,
      [id]: true
    }));
  };

  // Handle field blur for validation
  const handleBlur = (e) => {
    const { id, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setTouched(prevTouched => ({
      ...prevTouched,
      [id]: true
    }));

    const error = validateField(id, fieldValue, formData);
    setErrors(prevErrors => ({
      ...prevErrors,
      [id]: error
    }));
  };

  // Handle next step
  const nextStep = () => {
    if (currentStep < 5 && isStepValid(currentStep, formData, otpVerified)) {
      setCurrentStep(currentStep + 1);
    } else {
      // Mark all fields in current step as touched to show errors
      const stepFields = {
        1: ['emailId', 'otpCode'],
        2: ['fullName', 'fatherName', 'dob', 'bloodGroup', 'studentContact', 'parentContact', 'address'],
        3: ['department', 'academicYear', 'registrationNumber', 'rollNumber', 'roomNumber'],
        4: ['password', 'confirmPassword', 'photo'],
        5: ['agreeTerms', 'agreePrivacy', 'agreeRules']
      };

      const fields = stepFields[currentStep] || [];
      const newTouched = { ...touched };
      fields.forEach(field => {
        newTouched[field] = true;
      });
      setTouched(newTouched);

      // Validate all fields in current step
      const newErrors = { ...errors };
      fields.forEach(field => {
        const error = validateField(field, formData[field], formData);
        newErrors[field] = error;
      });
      setErrors(newErrors);
    }
  };

  // Handle previous step
  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type (only PNG, JPEG, JPG allowed)
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file format. Only PNG, JPEG, JPG files are allowed.');
        return;
      }

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit. Please choose a smaller file.');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);

        // Convert image to base64 and store in form data
        const base64String = reader.result;
        setFormData(prevData => ({
          ...prevData,
          photo: base64String
        }));

        // Validate the photo field
        const error = validateField('photo', base64String);
        setErrors(prevErrors => ({
          ...prevErrors,
          photo: error
        }));

        // Mark as touched
        setTouched(prevTouched => ({
          ...prevTouched,
          photo: true
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle OTP sending
  const handleSendOTP = async () => {
    // Only require email field to be valid before sending OTP
    const requiredFields = ['emailId'];
    for (const field of requiredFields) {
      const error = validateField(field, formData[field]);
      if (error) {
        return;
      }
    }
    if (!formData.emailId) {
      return;
    }
    setSendingOtp(true);
    try {
      await sendOTP(formData.emailId);
      setOtpSent(true);
      setResendCountdown(60); // Start 60-second countdown
    } catch (error) {
      alert('Error sending OTP: ' + error.message);
    } finally {
      setSendingOtp(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOTP = async () => {
    if (!formData.otpCode || formData.otpCode.length !== 6) {
      alert('Please enter a valid 6-digit OTP.');
      return;
    }
    if (!formData.emailId) {
      alert('Email address is required.');
      return;
    }
    setVerifyingOtp(true);
    try {
      await verifyOTP(formData.emailId, formData.otpCode);
      setOtpVerified(true);
    } catch (error) {
      alert('Error verifying OTP: ' + error.message);
    } finally {
      setVerifyingOtp(false);
    }
  };

  // Handle form submission
  const handleRegistration = async (e) => {
    e.preventDefault();
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    // Check if OTP is verified
    if (!otpVerified) {
      alert('Please verify your email address before submitting the registration.');
      return;
    }

    // Prepare payload for API
    const payload = {
      name: formData.fullName,
      father_guardian_name: formData.fatherName,
      dob: formData.dob,
      blood_group: formData.bloodGroup,
      student_contact_number: formData.studentContact,
      parent_guardian_contact_number: formData.parentContact,
      address: formData.address,
      department: formData.department,
      academic_year: formData.academicYear,
      registration_number: formData.registrationNumber,
      roll_number: formData.rollNumber,
      room_number: parseInt(formData.roomNumber, 10),
      email: formData.emailId,
      password: formData.password,
      profile_photo: formData.photo, // base64 string
      status: 'pending',
      approved_by: 'Admin'
    };

    try {
      const data = await registerUser(payload);
      const token = data.token;

      localStorage.setItem("authToken", token);
      localStorage.setItem("token", token);

      alert('You have registered successfully! Please wait until admin approval.');
      onClose(); // Close the modal after successful registration
    } catch (error) {
      alert('Registration failed: ' + error.message);
    }
  };

  // Calculate progress percentage
  const progressPercentage = (currentStep / 5) * 100;

  return (
    <div id="registerModal" className="fixed inset-0 bg-black bg-opacity-60 login-modal z-50 flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl shadow-2xl max-w-2xl w-full mx-4 transform transition-all professional-shadow max-h-[90vh] overflow-y-auto">
        <div className="p-6 sm:p-8">
          {/* Progress Bar */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-sm font-bold text-white">{currentStep}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {currentStep === 1 && 'Email & OTP'}
                  {currentStep === 2 && 'Personal Details'}
                  {currentStep === 3 && 'Academic Details'}
                  {currentStep === 4 && 'Password & Photo'}
                  {currentStep === 5 && 'Terms & Confirmation'}
                </h2>
              </div>
              <span className="text-sm text-slate-400">Step {currentStep} of 5</span>
            </div>

            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleRegistration}>
            {currentStep === 1 && (
              <EmailOtpStep
                formData={formData}
                errors={errors}
                touched={touched}
                otpSent={otpSent}
                otpVerified={otpVerified}
                verifyingOtp={verifyingOtp}
                sendingOtp={sendingOtp}
                resendCountdown={resendCountdown}
                handleInputChange={handleInputChange}
                sendOTP={handleSendOTP}
                verifyOTP={handleVerifyOTP}
                isLight={isLight}
              />
            )}

            {currentStep === 2 && (
              <PersonalDetailsStep
                formData={formData}
                errors={errors}
                touched={touched}
                handleInputChange={handleInputChange}
                handleBlur={handleBlur}
                isLight={isLight}
              />
            )}

            {currentStep === 3 && (
              <AcademicDetailsStep
                formData={formData}
                errors={errors}
                touched={touched}
                handleInputChange={handleInputChange}
                handleBlur={handleBlur}
                isLight={isLight}
              />
            )}

            {currentStep === 4 && (
              <PasswordPhotoStep
                formData={formData}
                errors={errors}
                touched={touched}
                handleInputChange={handleInputChange}
                handleBlur={handleBlur}
                isLight={isLight}
                photoPreview={photoPreview}
                handlePhotoUpload={handlePhotoUpload}
                fileInputRef={fileInputRef}
                confirmPasswordSuccess={confirmPasswordSuccess}
              />
            )}

            {currentStep === 5 && (
              <TermsConfirmationStep
                formData={formData}
                errors={errors}
                touched={touched}
                handleInputChange={handleInputChange}
                isLight={isLight}
              />
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-600">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={previousStep}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    backgroundColor: isLight ? '#2563eb !important' : 'rgba(51, 65, 85, 0.8)',
                    color: isLight ? '#ffffff !important' : '#ffffff',
                    border: isLight ? '2px solid #3b82f6 !important' : 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    if (isLight) {
                      e.target.style.backgroundColor = '#1d4ed8 !important';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isLight) {
                      e.target.style.backgroundColor = '#2563eb !important';
                    }
                  }}
                >
                  ← Previous
                </button>
              )}

              <div className="flex space-x-3 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    backgroundColor: isLight ? '#dc2626 !important' : 'rgba(51, 65, 85, 0.8)',
                    color: isLight ? '#ffffff !important' : '#ffffff',
                    border: isLight ? '2px solid #ef4444 !important' : 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    if (isLight) {
                      e.target.style.backgroundColor = '#b91c1c !important';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isLight) {
                      e.target.style.backgroundColor = '#dc2626 !important';
                    }
                  }}
                >
                  Cancel
                </button>

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!isFormValid(formData) || !otpVerified}
                    className={`px-6 py-3 text-white rounded-lg font-semibold transition-all ${
                      isFormValid(formData) && otpVerified
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700'
                        : 'bg-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Complete Registration
                  </button>
                )}
              </div>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs sm:text-sm text-slate-400">
              Already have an account?
              <button onClick={onOpenLogin} className="text-blue-400 hover:text-blue-300 font-medium transition-colors underline ml-1">
                Login here
              </button>
            </p>
          </div>
        </div>

        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Register;
