// Validation utilities for registration form

export const validateField = (id, value, newFormData = null) => {
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
      } else if (value !== (newFormData || {}).password) {
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

export const isStepValid = (step, formData, otpVerified) => {
  const stepFields = {
    1: ['emailId', 'otpCode'],
    2: ['fullName', 'fatherName', 'dob', 'bloodGroup', 'studentContact', 'parentContact', 'address'],
    3: ['department', 'academicYear', 'registrationNumber', 'rollNumber', 'roomNumber'],
    4: ['password', 'confirmPassword', 'photo'],
    5: ['agreeTerms', 'agreePrivacy', 'agreeRules']
  };

  const fields = stepFields[step] || [];
  for (const field of fields) {
    const value = formData[field];
    const error = validateField(field, value, formData);
    if (error) {
      return false;
    }
  }

  // Special validation for step 1: OTP must be verified
  if (step === 1 && !otpVerified) {
    return false;
  }

  return true;
};

export const isFormValid = (formData) => {
  const allFields = [
    'fullName', 'fatherName', 'dob', 'bloodGroup', 'studentContact', 'parentContact', 'address',
    'department', 'academicYear', 'registrationNumber', 'rollNumber', 'roomNumber',
    'emailId', 'password', 'confirmPassword',
    'agreeTerms', 'agreePrivacy', 'agreeRules'
  ];

  for (const field of allFields) {
    const value = formData[field];
    const error = validateField(field, value, formData);
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
