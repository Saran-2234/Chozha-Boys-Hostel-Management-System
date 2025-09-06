// API calls for registration form

export const sendOTP = async (email) => {
  if (!email) return;

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
    if (!emailPushResponse.ok) {
      throw new Error(emailPushData.error || 'Failed to generate verification code');
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
    if (!sendCodeResponse.ok) {
      throw new Error(sendCodeData.message || 'Failed to send verification code');
    }

    return true;
  } catch (error) {
    throw new Error('Error sending OTP: ' + error.message);
  }
};

export const verifyOTP = async (email, code) => {
  if (!email || !code) return false;

  try {
    const verifyResponse = await fetch('https://finalbackend-mauve.vercel.app/emailverify/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, code })
    });
    const verifyData = await verifyResponse.json();
    if (!verifyResponse.ok) {
      throw new Error(verifyData.message || 'OTP verification failed');
    }
    return true;
  } catch (error) {
    throw new Error('Error verifying OTP: ' + error.message);
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

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error || 'Unknown error');
    }
  } catch (error) {
    throw new Error('Error during registration: ' + error.message);
  }
};
