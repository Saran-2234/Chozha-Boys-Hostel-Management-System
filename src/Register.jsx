import React, { useState, useRef } from 'react';

function Register({ onClose, onOpenLogin, isLight }) {
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    // Step 1: Personal Details
    fullName: '',
    fatherName: '',
    dob: '',
    bloodGroup: '',
    studentContact: '',
    parentContact: '',
    address: '',
    
    // Step 2: Academic Details
    department: '',
    academicYear: '',
    registrationNumber: '',
    rollNumber: '',
    roomNumber: '', 
    
    // Step 3: Account & Photo
    emailId: '',
    otpCode: '',
    password: '',
    confirmPassword: '',
    photo: '',
    
    // Step 4: Terms & Confirmation
    agreeTerms: false,
    agreePrivacy: false,
    agreeRules: false
  });
  

  const [photoPreview, setPhotoPreview] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(true);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [confirmPasswordSuccess, setConfirmPasswordSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const currentYear = new Date().getFullYear();

  // Validation functions
  const validateField = (id, value, newFormData = null) => {
    let error = '';

    switch (id) {
      case 'fullName':
        if (!value.trim()) {
          error = '*Full name is required';
        } else if (value.trim().length < 3) {
          error = '*Full name must be at least 3 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          error = '*Full name can only contain letters and spaces';
        }
        break;

      case 'fatherName':
        if (!value.trim()) {
          error = '*Father/Guardian name is required';
        } else if (value.trim().length < 3) {
          error = '*Father/Guardian name must be at least 3 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          error = '*Father/Guardian name can only contain letters and spaces';
        }
        break;

      case 'dob':
        if (!value) {
          error = '*Date of birth is required';
        } else {
          const birthDate = new Date(value);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          if (age < 15 || age > 30) {
            error = '*Age must be between 15 and 30 years';
          }
        }
        break;

      case 'bloodGroup':
        if (!value) {
          error = '*Blood group is required';
        }
        break;

      case 'studentContact':
        if (!value.trim()) {
          error = '*Student contact number is required';
        } else if (!/^[6-9]\d{9}$/.test(value.trim())) {
          error = '*Please enter a valid 10-digit mobile number starting with 6-9';
        }
        break;

      case 'parentContact':
        if (!value.trim()) {
          error = '*Parent contact number is required';
        } else if (!/^[6-9]\d{9}$/.test(value.trim())) {
          error = '*Please enter a valid 10-digit mobile number starting with 6-9';
        }
        break;

      case 'address':
        if (!value.trim()) {
          error = '*Address is required';
        } else if (value.trim().length < 10) {
          error = '*Address must be at least 10 characters';
        }
        break;

      case 'department':
        if (!value) {
          error = '*Department is required';
        }
        break;

      case 'academicYear':
        if (!value) {
          error = '*Academic year is required';
        }
        break;

      case 'registrationNumber':
        if (!value.trim()) {
          error = '*Registration number is required';
        } else if (!/^[0-9]{8,15}$/.test(value.trim())) {
          error = '*Registration number must be 8-15 digits';
        }
        break;

      case 'rollNumber':
        if (!value.trim()) {
          error = '*Roll number is required';
        } else if (!/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]{6,12}$/.test(value.trim())) {
          error = '*Roll number must be 6-12 characters with at least one letter and one digit';
        }
        break;

      case 'roomNumber':
        if (!value.trim()) {
          error = '*Room number is required';
        } else if (!/^\d{3}$/.test(value.trim())) {
          error = '*Room number must be exactly 3 digits';
        }
        break;

      case 'emailId':
        if (value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = '*Please enter a valid email address';
        }
        break;

      case 'password':
        if (!value) {
          error = '*Password is required';
        } else if (value.length < 8) {
          error = '*Password must be at least 8 characters';
        } else if (value.length > 20) {
          error = '*Password must be at most 20 characters';
        } else if (!/(?=.*[a-z])/.test(value)) {
          error = '*Password must contain at least one lowercase letter';
        } else if (!/(?=.*[A-Z])/.test(value)) {
          error = '*Password must contain at least one uppercase letter';
        } else if (!/(?=.*\d)/.test(value)) {
          error = '*Password must contain at least one number';
        } else if (!/(?=.*[@$!%*?&])/.test(value)) {
          error = '*Password must contain at least one special character';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          error = '*Please confirm your password';
        } else if (value !== (newFormData || formData).password) {
          error = '*Passwords do not match';
        }
        break;

      case 'otpCode':
        if (value.trim() && !/^\d{6}$/.test(value.trim())) {
          error = '*OTP must be exactly 6 digits';
        }
        break;

      case 'photo':
        if (!value.trim()) {
          error = '*Passport size photo is required';
        } else if (!value.startsWith('data:image/')) {
          error = '*Invalid photo format. Only PNG, JPEG, JPG allowed';
        }
        break;

      case 'agreeTerms':
        if (!value) {
          error = '*You must agree to the Terms & Conditions';
        }
        break;

      case 'agreePrivacy':
        if (!value) {
          error = '*You must consent to the Privacy Policy';
        }
        break;

      case 'agreeRules':
        if (!value) {
          error = '*You must agree to abide by the Hostel Rules and Regulations';
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Handle input changes with validation
  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    const newFormData = { ...formData, [id]: fieldValue };
    setFormData(newFormData);

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

    const error = validateField(id, fieldValue);
    setErrors(prevErrors => ({
      ...prevErrors,
      [id]: error
    }));
  };

  // Check if all fields in current step are valid
  const isStepValid = (step) => {
    const stepFields = {
      1: ['fullName', 'fatherName', 'dob', 'bloodGroup', 'studentContact', 'parentContact', 'address'],
      2: ['department', 'academicYear', 'registrationNumber', 'rollNumber', 'roomNumber'],
      3: showPasswordFields ? ['password', 'confirmPassword', 'photo'] : [],
      4: ['agreeTerms', 'agreePrivacy', 'agreeRules']
    };

    const fields = stepFields[step] || [];
    for (const field of fields) {
      const value = formData[field];
      const error = validateField(field, value);
      if (error) {
        return false;
      }
    }
    return true;
  };

  // Check if entire form is valid
  const isFormValid = () => {
    const allFields = [
      'fullName', 'fatherName', 'dob', 'bloodGroup', 'studentContact', 'parentContact', 'address',
      'department', 'academicYear', 'registrationNumber', 'rollNumber', 'roomNumber',
      'emailId', 'password', 'confirmPassword',
      'agreeTerms', 'agreePrivacy', 'agreeRules'
    ];

    for (const field of allFields) {
      const value = formData[field];
      const error = validateField(field, value);
      if (error) {
        return false;
      }
    }

    // Additional checks
    if (formData.password !== formData.confirmPassword) {
      return false;
    }

    return true;
  };

  // Call register API (creates temp user)
  const callRegisterAPI = async () => {
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return false;
    }

    // Prepare payload for register API
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
      profile_photo: formData.photo, // base64 string; backend should handle or you can upload and provide URL
      status: 'pending',
      approved_by: 'Admin'
    };

    try {
      const token1 = localStorage.getItem("authToken");
      const response = await fetch('https://finalbackend-mauve.vercel.app/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user':token1
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration initiated successfully! Please verify your email to complete registration.');
        return true;
      } else {
        alert('Registration failed: ' + (data.error || 'Unknown error'));
        return false;
      }
    } catch (error) {
      alert('Error during registration: ' + error.message);
      return false;
    }
  };

  // Perform final registration (after email verification)
  const performFinalRegistration = async () => {
    // Check if OTP is verified
    if (!otpVerified) {
      alert('Please verify your email address before submitting the registration.');
      return false;
    }

    // Prepare payload for final registration (this would typically be handled by the backend after verification)
    // For now, we'll just show success since the temp user is already created
    alert('Registration completed successfully! Please wait until admin approval.');
    setIsRegistered(true);
    onClose(); // Close the modal after successful registration
    return true;
  };

  // Handle next step
  const nextStep = async () => {
    if (currentStep === 3) {
      // Special handling for step 3: call register API
      if (!isStepValid(currentStep)) {
        // Mark all fields in current step as touched to show errors
        const stepFields = showPasswordFields ? ['password', 'confirmPassword', 'photo'] : ['photo'];
        const newTouched = { ...touched };
        stepFields.forEach(field => {
          newTouched[field] = true;
        });
        setTouched(newTouched);

        // Validate all fields in current step
        const newErrors = { ...errors };
        stepFields.forEach(field => {
          const error = validateField(field, formData[field]);
          newErrors[field] = error;
        });
        setErrors(newErrors);
        return;
      }

      // Call register API
      const success = await callRegisterAPI();
      if (success) {
        setCurrentStep(4);
      }
    } else if (currentStep < 4 && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1);
    } else {
      // Mark all fields in current step as touched to show errors
      const stepFields = {
        1: ['fullName', 'fatherName', 'dob', 'bloodGroup', 'studentContact', 'parentContact', 'address'],
        2: ['department', 'academicYear', 'registrationNumber', 'rollNumber', 'roomNumber'],
        4: ['agreeTerms', 'agreePrivacy', 'agreeRules']
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
        const error = validateField(field, formData[field]);
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
  const sendOTP = async () => {
    // Only require email field to be valid before sending OTP
    const requiredFields = ['emailId'];
    for (const field of requiredFields) {
      const error = validateField(field, formData[field]);
      if (error) {
        alert(`Please fill the ${field} field correctly before sending OTP.`);
        return;
      }
    }
    if (!formData.emailId) {
      alert('Please enter your email address first.');
      return;
    }
    setSendingOtp(true);
    try {
      // Removed sending full registration payload here, only send email for OTP
      const sendCodeResponse = await fetch('https://finalbackend-mauve.vercel.app/sendcode/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: formData.emailId })
      });
      const sendCodeData = await sendCodeResponse.json();
      if (!sendCodeResponse.ok) {
        throw new Error(sendCodeData.message || 'Failed to send verification code');
      }
       

      setOtpSent(true);
      alert('OTP has been sent to your email');
    } catch (error) {
      alert('Error sending OTP: ' + error.message);
    } finally {
      setSendingOtp(false);
    }
  };

  // Handle OTP verification
  const verifyOTP = async () => {
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
      const verifyResponse = await fetch('https://finalbackend-mauve.vercel.app/verifyemail/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: formData.emailId, code: formData.otpCode })
      });
      const verifyData = await verifyResponse.json();
      if (!verifyResponse.ok) {
        throw new Error(verifyData.message || 'OTP verification failed');
      }
      setOtpVerified(true);
      setShowPasswordFields(true);
      alert('OTP verified successfully');
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
        profile_photo: formData.photo, // base64 string; backend should handle or you can upload and provide URL
        status: 'active',
        approved_by: 'Admin'
      };

      try {
        const response = await fetch('https://finalbackend-mauve.vercel.app/register/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        const token = data.token;
<<<<<<< HEAD
        localStorage.setItem("authToken",token);
=======
        console.log(token);
        localStorage.setItem("token",token);
>>>>>>> 89885063aeaca8e0a83d9476e0347b26e98a396f

        if (response.ok) {
          alert('You have registered successfully! Please wait until admin approval.');
          onClose(); // Close the modal after successful registration
        } else {
          alert('Registration failed: ' + (data.error || 'Unknown error'));
        }
      } catch (error) {
        alert('Error during registration: ' + error.message);
      }
    };

  // Calculate progress percentage
  const progressPercentage = (currentStep / 4) * 100;

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
                  {currentStep === 1 && 'Personal Details'}
                  {currentStep === 2 && 'Academic Details'}
                  {currentStep === 3 && 'Account & Photo'}
                  {currentStep === 4 && 'Terms & Confirmation'}
                </h2>
              </div>
              <span className="text-sm text-slate-400">Step {currentStep} of 4</span>
            </div>
            
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleRegistration}>
            {/* Step 1: Personal Details */}
            <div className={`registration-step ${currentStep !== 1 ? 'hidden' : ''}`}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl">👤</span>
                </div>
                <p className="text-slate-400 text-sm sm:text-base">Enter your personal information</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className={`w-full px-4 py-3 glass-effect rounded-lg placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent border-0
                      ${errors.fullName ? 'border-red-500' : ''} ${isLight ? 'text-black' : 'text-white'}`}
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                  />
                  {touched.fullName && errors.fullName && (
                    <p className={`${isLight ? 'text-red-800' : 'text-red-400'} text-xs mt-1`}>{errors.fullName}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Father/Guardian Name *</label>
                  <input
                    type="text"
                    id="fatherName"
                    name="fatherName"
                    className={`w-full px-4 py-3 glass-effect rounded-lg placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent border-0
                      ${errors.fatherName ? 'border-red-500' : ''} ${isLight ? 'text-black' : 'text-white'}`}
                    placeholder="Enter father/guardian name"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}

                  />
                  {touched.fatherName && errors.fatherName && (
                    <p className={`${isLight ? 'text-red-600' : 'text-red-400'} text-xs mt-1`}>{errors.fatherName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Date of Birth *</label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    className={`w-full px-4 py-3 glass-effect rounded-lg placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent border-0
                      ${errors.dob ? 'border-red-500' : ''} ${isLight ? 'text-black' : 'text-white'}`}
                    value={formData.dob}
                    onChange={handleInputChange}
                    onBlur={handleBlur}

                  />
                  {touched.dob && errors.dob && (
                    <p className={`${isLight ? 'text-red-600' : 'text-red-400'} text-xs mt-1`}>{errors.dob}</p>
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
                      backgroundColor: isLight ? 'white' : 'rgba(51, 65, 85, 0.8)',
                      color: isLight ? 'black' : 'white'
                    }}
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    onBlur={handleBlur}

                  >
                    <option value="" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>Select Blood Group</option>
                    <option value="A+" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>A+</option>
                    <option value="A-" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>A-</option>
                    <option value="B+" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>B+</option>
                    <option value="B-" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>B-</option>
                    <option value="AB+" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>AB+</option>
                    <option value="AB-" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>AB-</option>
                    <option value="O+" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>O+</option>
                    <option value="O-" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>O-</option>
                  </select>
                  {touched.bloodGroup && errors.bloodGroup && (
                    <p className={`${isLight ? 'text-red-600' : 'text-red-400'} text-xs mt-1`}>{errors.bloodGroup}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Student Contact *</label>
                  <input
                    type="tel"
                    id="studentContact"
                    name="studentContact"
                    className={`w-full px-4 py-3 glass-effect rounded-lg placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent border-0
                      ${errors.studentContact ? 'border-red-500' : ''} ${isLight ? 'text-black' : 'text-white'}`}
                    placeholder="Enter your phone number"
                    value={formData.studentContact}
                    onChange={handleInputChange}
                    onBlur={handleBlur}

                  />
                  {touched.studentContact && errors.studentContact && (
                    <p className={`${isLight ? 'text-red-600' : 'text-red-400'} text-xs mt-1`}>{errors.studentContact}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Parent Contact *</label>
                  <input
                    type="tel"
                    id="parentContact"
                    name="parentContact"
                    className={`w-full px-4 py-3 glass-effect rounded-lg placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent border-0
                      ${errors.parentContact ? 'border-red-500' : ''} ${isLight ? 'text-black' : 'text-white'}`}
                    placeholder="Enter parent's phone number"
                    value={formData.parentContact}
                    onChange={handleInputChange}
                    onBlur={handleBlur}

                  />
                  {touched.parentContact && errors.parentContact && (
                    <p className={`${isLight ? 'text-red-600' : 'text-red-400'} text-xs mt-1`}>{errors.parentContact}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Address *</label>
                  <textarea
                    id="address"
                    name="address"
                    rows="3"
                    className={`w-full px-4 py-3 glass-effect rounded-lg placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent border-0 resize-none
                      ${errors.address ? 'border-red-500' : ''} ${isLight ? 'text-black' : 'text-white'}`}
                    placeholder="Enter your complete address"
                    value={formData.address}
                    onChange={handleInputChange}
                    onBlur={handleBlur}

                  ></textarea>
                  {touched.address && errors.address && (
                    <p className={`${isLight ? 'text-red-600' : 'text-red-400'} text-xs mt-1`}>{errors.address}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2: Academic Details */}
            <div className={`registration-step ${currentStep !== 2 ? 'hidden' : ''}`}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl">🎓</span>
                </div>
                <p className="text-slate-400 text-sm sm:text-base">Enter your academic information</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Department *</label>
                  <select
                    id="department"
                    name="department"
                    className={`w-full px-4 py-3 glass-effect rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent border-0
                      ${errors.department ? 'border-red-500' : ''}`}
                    style={{
                      backgroundColor: isLight ? 'white' : 'rgba(51, 65, 85, 0.8)',
                      color: isLight ? 'black' : 'white'
                    }}
                    value={formData.department}
                    onChange={handleInputChange}
                    onBlur={handleBlur}

                  >
                    <option value="" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>Select Department</option>
                    <option value="Computer Science Engineering" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>Computer Science Engineering</option>
                    <option value="Electronics and Communication Engineering" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>Electronics and Communication Engineering</option>
                    <option value="Electrical and Electronics Engineering" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>Electrical and Electronics Engineering</option>
                    <option value="Mechanical Engineering" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>Mechanical Engineering</option>
                    <option value="Civil Engineering" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>Civil Engineering</option>
                    <option value="Chemical Engineering" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>Chemical Engineering</option>
                    <option value="Information Technology" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>Information Technology</option>
                    <option value="Instrumentation and Control Engineering" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>Instrumentation and Control Engineering</option>
                  </select>
                  {touched.department && errors.department && (
                    <p className={`${isLight ? 'text-red-600' : 'text-red-400'} text-xs mt-1`}>{errors.department}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Academic Year *</label>
                  <select
                    id="academicYear"
                    name="academicYear"
                    className={`w-full px-4 py-3 glass-effect rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent border-0
                      ${errors.academicYear ? 'border-red-500' : ''}`}
                    style={{
                      backgroundColor: isLight ? 'white' : 'rgba(51, 65, 85, 0.8)',
                      color: isLight ? 'black' : 'white'
                    }}
                    value={formData.academicYear}
                    onChange={handleInputChange}
                    onBlur={handleBlur}

                  >
                    <option value="" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>Select Year</option>
                    <option value="1st Year" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>1st Year</option>
                    <option value="2nd Year" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>2nd Year</option>
                    <option value="3rd Year" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>3rd Year</option>
                    <option value="4th Year" style={{ backgroundColor: isLight ? 'white' : '#1e293b', color: isLight ? 'black' : 'white' }}>4th Year</option>
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

                  />
                  {touched.rollNumber && errors.rollNumber && (
                    <p className={`${isLight ? 'text-red-600' : 'text-red-400'} text-xs mt-1`}>{errors.rollNumber}</p>
                  )}
                </div>

                {/* Added Room Number Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Room Number *</label>
                  <input
                    type="text"
                    id="roomNumber"
                    name="roomNumber"
                    className={`w-full px-4 py-3 glass-effect rounded-lg placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent border-0
                      ${errors.roomNumber ? 'border-red-500' : ''} ${isLight ? 'text-black' : 'text-white'}`}
                    placeholder="Enter room number"
                    value={formData.roomNumber}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    maxLength="3"
                    pattern="[0-9]{3}"
                    inputMode="numeric"

                  />
                  {touched.roomNumber && errors.roomNumber && (
                    <p className={`${isLight ? 'text-red-600' : 'text-red-400'} text-xs mt-1`}>{errors.roomNumber}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Step 3: Account & Photo */}
            <div className={`registration-step ${currentStep !== 3 ? 'hidden' : ''}`}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl">📧</span>
                </div>
                <p className="text-slate-400 text-sm sm:text-base">Setup your account credentials</p>
              </div>
              
              <div className="space-y-6">
                {/* Email Address input moved to Step 3 */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Email Address *</label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      id="emailId"
                      name="emailId"
                      className={`flex-1 px-4 py-3 glass-effect rounded-lg placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent border-0
                        ${errors.emailId ? 'border-red-500' : ''} ${isLight ? 'text-black' : 'text-white'}`}
                      placeholder="Enter your email address"
                      value={formData.emailId}
                      onChange={handleInputChange}
                    />
                    
                  </div>
                  {touched.emailId && errors.emailId && (
                    <p className={`${isLight ? 'text-red-600' : 'text-red-400'} text-xs mt-1`}>{errors.emailId}</p>
                  )}
                </div>

                <div className={otpSent ? '' : 'hidden'}>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Enter OTP</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="otpCode"
                      name="otpCode"
                      className={`flex-1 px-4 py-3 glass-effect rounded-lg placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent border-0
                        ${errors.otpCode ? 'border-red-500' : ''} ${isLight ? 'text-black' : 'text-white'}`}
                      placeholder="Enter 6-digit OTP"
                      maxLength="6"
                      value={formData.otpCode}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      onClick={verifyOTP}
                      className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all whitespace-nowrap"
                    >
                      Verify
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">OTP sent to your email address</p>
                </div>

                {showPasswordFields && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">Create Password *</label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        className={`w-full px-4 py-3 glass-effect rounded-lg placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent border-0 ${errors.password ? 'border-red-500' : ''} ${isLight ? 'text-black' : 'text-white'}`}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleInputChange}

                      />
                      {formData.password && (
                        <div className="text-xs mt-1 space-y-1">
                          {formData.password.length < 8 || formData.password.length > 20 ? (
                            <p className={`${isLight ? 'text-red-600' : 'text-red-400'}`}>*8-20 characters</p>
                          ) : null}
                          {!/(?=.*[a-z])/.test(formData.password) ? (
                            <p className={`${isLight ? 'text-red-600' : 'text-red-400'}`}>*1 lowercase letter</p>
                          ) : null}
                          {!/(?=.*[A-Z])/.test(formData.password) ? (
                            <p className={`${isLight ? 'text-red-600' : 'text-red-400'}`}>*1 uppercase letter</p>
                          ) : null}
                          {!/(?=.*\d)/.test(formData.password) ? (
                            <p className={`${isLight ? 'text-red-600' : 'text-red-400'}`}>*1 number</p>
                          ) : null}
                          {!/(?=.*[@$!%*?&])/.test(formData.password) ? (
                            <p className={`${isLight ? 'text-red-600' : 'text-red-400'}`}>*1 special character</p>
                          ) : null}
                        </div>
                      )}
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
                        className={`w-full px-4 py-3 glass-effect rounded-lg placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent border-0 ${errors.confirmPassword ? 'border-red-500' : ''} ${isLight ? 'text-black' : 'text-white'}`}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}

                      />
                      {touched.confirmPassword && errors.confirmPassword && (
                        <p className={`${isLight ? 'text-red-600' : 'text-red-400'} text-xs mt-1`}>{errors.confirmPassword}</p>
                      )}
                      {confirmPasswordSuccess && !errors.confirmPassword && (
                        <p className="text-green-400 text-xs mt-1">Passwords match</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Passport size photo</label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-slate-700 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-600 overflow-hidden">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">📷</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      id="photo"
                      name="photo"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="px-4 py-2 glass-effect text-white rounded-lg font-medium hover:bg-white hover:bg-opacity-10 transition-all"
                    >
                      Choose Photo
                    </button>
                    <p className="text-xs text-slate-400 mt-1">JPG, PNG ,JPEG (Max 2MB)</p>
                    {touched.photo && errors.photo && (
                      <p className={`${isLight ? 'text-red-600' : 'text-red-400'} text-xs mt-1`}>{errors.photo}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Terms & Confirmation */}
            <div className={`registration-step ${currentStep !== 4 ? 'hidden' : ''}`}>
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
                      <p className={`${isLight ? 'text-red-600' : 'text-red-400'} text-xs mt-1`}>{errors.agreeTerms}</p>
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
                      <p className={`${isLight ? 'text-red-600' : 'text-red-400'} text-xs mt-1`}>{errors.agreePrivacy}</p>
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
                      <p className={`${isLight ? 'text-red-600' : 'text-red-400'} text-xs mt-1`}>{errors.agreeRules}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

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
                
                {currentStep < 4 ? (
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
                    disabled={!isFormValid() || !otpVerified}
                    className={`px-6 py-3 text-white rounded-lg font-semibold transition-all ${
                      isFormValid() && otpVerified
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