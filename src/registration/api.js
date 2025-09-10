// API calls for registration form

export const sendOTP = async (email) => {
  if (!email) {
    return {
      success: false,
      error: "Email is required",
      status: 400
    };
  }

  try {
    // Step 1: Generate & store OTP for the email
    const emailPushResponse = await fetch('https://finalbackend-mauve.vercel.app/emailpush', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    const emailPushData = await emailPushResponse.json();

    let result;
    switch (emailPushResponse.status) {
      case 200:
        // Email exists in emailverification but not verified
        result = {
          success: true,
          message: emailPushData.message || "Email already exists, pending verification",
          data: emailPushData.data || { email }
        };
        break;
      case 201:
        // Success (new email added)
        result = {
          success: true,
          message: emailPushData.message || "Email record initialized, waiting for verification code",
          data: emailPushData.data || { email }
        };
        break;
      case 400:
        // Missing email
        result = {
          success: false,
          error: emailPushData.error || "Email is required"
        };
        break;
      case 409:
        // Conflict cases: email already registered or already verified or unique violation
        result = {
          success: false,
          message: emailPushData.message || undefined,
          error: emailPushData.error || undefined,
          data: emailPushData.data || { email }
        };
        break;
      case 500:
        // Supabase fetch or insert error
        result = {
          success: false,
          error: emailPushData.error || "Internal server error"
        };
        break;
      default:
        result = {
          success: false,
          error: "Unexpected error"
        };
    }

    // If emailpush was not successful, return the result without sending code
    if (!result.success) {
      return result;
    }

    // Step 2: Send the stored code by email
    const sendCodeResponse = await fetch('https://finalbackend-mauve.vercel.app/sendcode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    const sendCodeData = await sendCodeResponse.json();

    let sendCodeResult;
    switch (sendCodeResponse.status) {
      case 200:
        // Success cases: OTP still valid or new OTP sent
        sendCodeResult = {
          success: true,
          message: sendCodeData.message || "Verification code sent to email",
          expiringtime: sendCodeData.expiringtime || null
        };
        break;
      case 400:
        // Missing email
        sendCodeResult = {
          success: false,
          message: sendCodeData.message || "Email is required"
        };
        break;
      case 404:
        // No verification request found
        sendCodeResult = {
          success: false,
          message: sendCodeData.message || "No verification request found for this email"
        };
        break;
      case 500:
        // Supabase fetch error or error sending email
        sendCodeResult = {
          success: false,
          message: sendCodeData.message || "Internal server error"
        };
        break;
      default:
        sendCodeResult = {
          success: false,
          message: "Unexpected error sending verification code"
        };
    }

    // If sendcode was not successful, return the sendcode result
    if (!sendCodeResult.success) {
      return sendCodeResult;
    }

    // Return the emailpush result combined with sendcode success
    return {
      ...result,
      sendCodeMessage: sendCodeResult.message,
      expiringtime: sendCodeResult.expiringtime
    };
  } catch (error) {
    return {
      success: false,
      error: "Error sending OTP: " + error.message
    };
  }
};

export const verifyOTP = async (email, code) => {
  if (!email || !code) {
    return {
      success: false,
      message: "Email and code are required"
    };
  }

  try {
    const verifyResponse = await fetch('https://finalbackend-mauve.vercel.app/emailverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, code })
    });

    const verifyData = await verifyResponse.json();

    switch (verifyResponse.status) {
      case 200:
        // Success (email verified)
        return {
          success: true,
          message: verifyData.message || "Email verified successfully"
        };
      case 400:
        // Various error cases
        return {
          success: false,
          message: verifyData.message || "Verification failed"
        };
      case 500:
        // Supabase or server errors
        return {
          success: false,
          message: verifyData.message || "Internal server error"
        };
      default:
        return {
          success: false,
          message: "Unexpected error"
        };
    }
  } catch (error) {
    return {
      success: false,
      message: "Error verifying OTP: " + error.message
    };
  }
};

export const registerUser = async (payload) => {
  try {
    const response = await fetch('https://finalbackend-mauve.vercel.app/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    switch (response.status) {
      case 201:
        // Success (user registered)
        return {
          success: true,
          message: data.message || "User registered successfully",
          user: data.user || {},
          token: data.token // Include token if present
        };
      case 400:
        // Various error cases
        return {
          success: false,
          message: data.message || "Registration failed",
          error: data.error || undefined
        };
      case 500:
        // Unexpected server error
        return {
          success: false,
          message: data.message || "Internal server error",
          error: data.error || "err.message"
        };
      default:
        return {
          success: false,
          message: "Unexpected error during registration"
        };
    }
  } catch (error) {
    return {
      success: false,
      message: "Error during registration: " + error.message
    };
  }
};

export const fetchStudents = async () => {
  try {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      throw new Error('No authentication token found. Please log in again.');
    }

    const response = await fetch('https://finalbackend-mauve.vercel.app/fetchstudents/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('API endpoint not found. Please check if the backend is properly deployed.');
      } else if (response.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (response.status === 403) {
        throw new Error('Access forbidden. You may not have permission to view students.');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const data = await response.json();

    if (data.success && Array.isArray(data.data)) {
      return data.data;
    } else if (Array.isArray(data)) {
      return data;
    } else if (data.students) {
      return data.students;
    } else if (data.studentsdata) {
      return data.studentsdata;
    } else {
      console.warn('Unexpected API response structure:', data);
      return [
        {
          id: 14,
          name: 'mega',
          email: 'benmega500@gmail.com',
          room_number: '130',
          status: 'inactive',
          registration_number: 'REG030',
          department: 'Computer Science',
          academic_year: '2023-24',
          created_at: '2024-01-15'
        },
        {
          id: 15,
          name: 'SARAN S',
          email: '9788saran@gmail.com',
          room_number: '410',
          status: 'pending',
          registration_number: '822722104045',
          department: 'Electrical Engineering',
          academic_year: '2023-24',
          created_at: '2024-01-16'
        }
      ];
    }
  } catch (err) {
    console.error('Error fetching students:', err);
    return [
      {
        id: 14,
        name: 'mega',
        email: 'benmega500@gmail.com',
        room_number: '130',
        status: 'inactive',
        registration_number: 'REG030',
        department: 'Computer Science',
        academic_year: '2023-24',
        created_at: '2024-01-15'
      },
      {
        id: 15,
        name: 'SARAN S',
        email: '9788saran@gmail.com',
        room_number: '410',
        status: 'pending',
        registration_number: '822722104045',
        department: 'Electrical Engineering',
        academic_year: '2023-24',
        created_at: '2024-01-16'
      }
    ];
  }
};

// API call for approving student
export const approveStudent = async (registrationNumber) => {
  try {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      throw new Error('No authentication token found. Please log in again.');
    }

    const response = await fetch('https://finalbackend-mauve.vercel.app/approve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        registerno: registrationNumber
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to approve student: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error approving student:', error);
    throw error;
  }
};
