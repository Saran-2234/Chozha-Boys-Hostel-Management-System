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
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [emailSendMessage, setEmailSendMessage] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [confirmPasswordSuccess, setConfirmPasswordSuccess] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState(''); // 'success' or 'error'
  const fileInputRef = useRef(null);
  const currentYear = new Date().getFullYear();

  // Handle resend countdown timer
  useEffect(() => {
    console.log('resendCountdown useEffect triggered with value:', resendCountdown);
    let timer;
    if (resendCountdown > 0) {
      timer = setTimeout(() => {
        setResendCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);
  
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
      const result = await sendOTP(formData.emailId);
      if (result.success) {
        setOtpSent(true);
        // Calculate remaining time from expiringtime if available, otherwise default to 60 seconds
        let countdown = 60;
        if (result.expiringtime) {
          const remainingTime = Math.max(0, Math.floor((new Date(result.expiringtime) - new Date()) / 1000));
          countdown = remainingTime;
        }
        console.log('Setting resendCountdown to:', countdown);
        setResendCountdown(countdown);
        // Show a small inline message under the email input instead of the global notification
        setEmailSendMessage(result.sendCodeMessage || result.message || 'OTP sent to your email address');
      } else {
        setNotificationMessage(result.error || result.message || 'Failed to send OTP');
        setNotificationType('error');
      }
    } catch (error) {
      setNotificationMessage('Error sending OTP: ' + error.message);
      setNotificationType('error');
    } finally {
      setSendingOtp(false);
    }
  };

  // Handle input changes with validation
  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    // Prevent changing email after it's verified
    if (id === 'emailId' && otpVerified) return;

    const newFormData = { ...formData, [id]: fieldValue };
    setFormData(newFormData);

    // If email changed, reset OTP states
    if (id === 'emailId') {
      setOtpSent(false);
      setOtpVerified(false);
      setResendCountdown(0);
      setEmailSendMessage('');
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
        setNotificationMessage('Invalid file format. Only PNG, JPEG, JPG files are allowed.');
        setNotificationType('error');
        return;
      }

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setNotificationMessage('File size exceeds 2MB limit. Please choose a smaller file.');
        setNotificationType('error');
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



  // Handle OTP verification
  const handleVerifyOTP = async () => {
    if (!formData.otpCode || formData.otpCode.length !== 6) {
      setNotificationMessage('Please enter a valid 6-digit OTP.');
      setNotificationType('error');
      return;
    }
    if (!formData.emailId) {
      setNotificationMessage('Email address is required.');
      setNotificationType('error');
      return;
    }
    setVerifyingOtp(true);
    try {
      const result = await verifyOTP(formData.emailId, formData.otpCode);
      if (result.success) {
        setOtpVerified(true);
        // clear the inline OTP-sent message after successful verification
        setEmailSendMessage('');
        // Clear any previous global notification (like 'Invalid verification code')
        setNotificationMessage('');
        setNotificationType('');
      } else {
        setNotificationMessage(result.message || 'OTP verification failed');
        setNotificationType('error');
      }
    } catch (error) {
      setNotificationMessage('Error verifying OTP: ' + error.message);
      setNotificationType('error');
    } finally {
      setVerifyingOtp(false);
    }
  };

  // Handle form submission
  const handleRegistration = async (e) => {
    e.preventDefault();
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setNotificationMessage('Passwords do not match!');
      setNotificationType('error');
      return;
    }
    // Check if OTP is verified
    if (!otpVerified) {
      setNotificationMessage('Please verify your email address before submitting the registration.');
      setNotificationType('error');
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
      const result = await registerUser(payload);
      if (result.success) {
        const token = result.token;

        if (token) {
          localStorage.setItem("authToken", token);
          localStorage.setItem("token", token);
        }

        setNotificationMessage(result.message || 'You have registered successfully! Please wait until warden approval.');
        setNotificationType('success');
        // Show a confirmation popup and wait for user to dismiss it
        setShowSuccessModal(true);
      } else {
        setNotificationMessage(result.message || 'Registration failed');
        setNotificationType('error');
      }
    } catch (error) {
      setNotificationMessage('Error during registration: ' + error.message);
      setNotificationType('error');
    }
  };

  // Calculate progress percentage
  const progressPercentage = (currentStep / 5) * 100;

  return (
    <div id="registerModal" className="fixed inset-0 bg-black bg-opacity-60 login-modal z-50 flex items-center justify-center p-4">
  <div className="glass-card rounded-2xl shadow-2xl max-w-2xl w-full mx-4 transform transition-all professional-shadow max-h-[90vh] overflow-y-auto overflow-x-visible">
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
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400">Step {currentStep} of 5</span>
                <button onClick={() => setShowCancelConfirm(true)} aria-label="Cancel registration" className="text-slate-300 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>

            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Notification Message */}
          {notificationMessage && (
            <div
              className={`mb-4 p-3 rounded ${
                notificationType === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
              }`}
              role="alert"
            >
              {notificationMessage}
            </div>
          )}

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
                emailSendMessage={emailSendMessage}
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

            {/* Navigation Buttons (responsive) */}
            <div className="mt-8 pt-6 border-t border-slate-600">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex w-full sm:w-auto gap-3">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={previousStep}
                      className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all text-sm sm:text-base ${isLight ? 'bg-blue-600 border-2 border-blue-500 text-white hover:bg-blue-700' : 'bg-slate-700 text-white'} px-3 py-3`}
                    >
                      ← Previous
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowCancelConfirm(true)}
                    className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all text-sm sm:text-base ${isLight ? 'bg-red-600 border-2 border-red-500 text-white hover:bg-red-700' : 'bg-slate-700 text-white'} px-3 py-3`}
                  >
                    Cancel
                  </button>
                </div>

                <div className="w-full sm:w-auto">
                  {currentStep < 5 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="w-full sm:w-auto px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all"
                    >
                      Next →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!isFormValid(formData) || !otpVerified}
                      className={`w-full sm:w-auto px-4 py-3 text-white rounded-lg font-semibold transition-all ${
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

        

        {/* Cancel confirmation dialog */}
        {showCancelConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white dark:bg-slate-900 rounded-lg p-6 w-[90%] max-w-md">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Cancel registration?</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">Your registration is not complete. Are you sure you want to cancel?</p>
              <div className="flex justify-end gap-3">
                <button className="px-4 py-2 rounded-md bg-gray-200 text-gray-800" onClick={() => setShowCancelConfirm(false)}>Continue registration</button>
                <button className="px-4 py-2 rounded-md bg-red-600 text-white" onClick={() => { setShowCancelConfirm(false); onClose(); }}>Yes, cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Success popup shown after registration */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white dark:bg-slate-900 rounded-lg p-6 w-[90%] max-w-md">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Registration submitted</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">You have registered successfully. Please wait until the warden confirms your registration. Once approved you will be able to login.</p>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 rounded-md bg-emerald-600 text-white"
                  onClick={() => {
                    setShowSuccessModal(false);
                    onClose();
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;
