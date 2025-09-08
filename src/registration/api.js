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
    const emailPushResponse = await fetch('https://finalbackend-mauve.vercel.app/emailpush/', {
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
    const sendCodeResponse = await fetch('https://finalbackend-mauve.vercel.app/sendcode/', {
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
    const verifyResponse = await fetch('https://finalbackend-mauve.vercel.app/emailverify/', {
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
    const response = await fetch('https://finalbackend-796l.vercel.app/register/', {
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
