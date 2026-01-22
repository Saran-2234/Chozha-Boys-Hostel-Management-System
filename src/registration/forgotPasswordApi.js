// Forgot Password API functions

// Step 1: Initiate password reset process
export const forgotPasswordMailPush = async (email) => {
  if (!email) {
    return {
      success: false,
      message: "Email is required"
    };
  }

  try {
    const response = await fetch('https://finalbackend1.vercel.app/students/forgotpasswordemailpush', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    switch (response.status) {
      case 200:
        if (data.success === false) {
          if (data.message === "Email is required") {
            return { success: false, message: "Email is required" };
          } else if (data.message === "Email not registered") {
            return { success: false, message: "Email not registered" };
          } else if (data.message === "A verification process is already ongoing. Please check your email or try again later.") {
            return { success: false, message: "A verification process is already ongoing. Please check your email or try again later." };
          }
        } else if (data.success === true) {
          return {
            success: true,
            message: data.message || "Verification process started.",
            token: data.token
          };
        }
        break;
      default:
        return {
          success: false,
          message: data.message || "Unexpected error occurred"
        };
    }
  } catch (error) {
    return {
      success: false,
      message: "Network error. Please check your connection and try again."
    };
  }
};

// Step 2: Send verification code
export const forgotPasswordSendCode = async (email, token) => {
  if (!email || !token) {
    return {
      success: false,
      message: "Email and token are required"
    };
  }

  try {
    const response = await fetch('https://finalbackend1.vercel.app/students/forgotpasswordsendcode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, token })
    });

    const data = await response.json();

    switch (response.status) {
      case 200:
        if (data.success === false) {
          if (data.message === "Email is required") {
            return { success: false, message: "Email is required" };
          } else if (data.message === "No verification process found for this email. Please initiate the forgot password process.") {
            return { success: false, message: "No verification process found for this email. Please initiate the forgot password process." };
          } else if (data.error === "wait for 5 minutes code already send") {
            return { success: false, message: "Please wait 5 minutes before requesting another code." };
          } else if (data.message === "Invalid token or step") {
            return { success: false, message: "Invalid token or step" };
          }
        } else if (data.success === true) {
          return {
            success: true,
            message: data.message || "Code sent to email",
            code: data.code,
            token: data.token
          };
        }
        break;
      default:
        return {
          success: false,
          message: data.message || "Unexpected error occurred"
        };
    }
  } catch (error) {
    return {
      success: false,
      message: "Network error. Please check your connection and try again."
    };
  }
};

// Step 3: Verify the code
export const verifyForgotPasswordCode = async (email, code, token) => {
  if (!email || !code || !token) {
    return {
      success: false,
      message: "Email, code, and token are required"
    };
  }

  try {
    const response = await fetch('https://finalbackend1.vercel.app/students/veriycodeforgot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, code, token })
    });

    const data = await response.json();

    switch (response.status) {
      case 200:
        if (data.success === false) {
          if (data.message === "No verification process found for this email. Please initiate the forgot password process.") {
            return { success: false, message: "No verification process found for this email. Please initiate the forgot password process." };
          } else if (data.error === "timeout") {
            return { success: false, message: "Verification code has expired. Please request a new one." };
          } else if (data.message === "Invalid code") {
            return { success: false, message: "Invalid verification code" };
          } else if (data.message === "Invalid token or step") {
            return { success: false, message: "Invalid token or step" };
          }
        } else if (data.success === true) {
          return {
            success: true,
            message: data.message || "Email verified successfully",
            token: data.token
          };
        }
        break;
      default:
        return {
          success: false,
          message: data.message || "Unexpected error occurred"
        };
    }
  } catch (error) {
    return {
      success: false,
      message: "Network error. Please check your connection and try again."
    };
  }
};

// Step 4: Change password
export const changePassword = async (email, password, token) => {
  if (!email || !password || !token) {
    return {
      success: false,
      message: "Email, password, and token are required"
    };
  }

  try {
    const response = await fetch('https://finalbackend1.vercel.app/students/changepassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, token })
    });

    const data = await response.json();

    switch (response.status) {
      case 200:
        if (data.success === true) {
          return {
            success: true,
            message: data.message || "Password changed successfully"
          };
        } else if (data.success === false) {
          if (data.message === "No verification process exists for the email.") {
            return { success: false, message: "No verification process exists for the email." };
          } else if (data.error === "timeout") {
            return { success: false, message: "Verification has expired. Please start over." };
          } else if (data.error === "first verify the email") {
            return { success: false, message: "Please verify your email first." };
          }
        }
        break;
      default:
        return {
          success: false,
          message: data.message || "Unexpected error occurred"
        };
    }
  } catch (error) {
    return {
      success: false,
      message: "Network error. Please check your connection and try again."
    };
  }
};
