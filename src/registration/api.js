import axios from "axios";

const API_BASE = "https://finalbackend-mauve.vercel.app";

// Axios instance
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // include cookies automatically
  headers: {
    "Content-Type": "application/json",
  },
});

// ====== API CALLS ======

// Send OTP
export const sendOTP = async (email) => {
  if (!email) return { success: false, error: "Email is required", status: 400 };

  try {
    const emailPushResponse = await api.post("/emailpush", { email });
    const emailPushData = emailPushResponse.data;

    let result;
    switch (emailPushResponse.status) {
      case 200:
        result = {
          success: true,
          message: emailPushData.message || "Email already exists, pending verification",
          data: emailPushData.data || { email },
        };
        break;
      case 201:
        result = {
          success: true,
          message: emailPushData.message || "Email record initialized, waiting for verification code",
          data: emailPushData.data || { email },
        };
        break;
      default:
        result = { success: false, error: emailPushData.error || "Unexpected error" };
    }

    if (!result.success) return result;

    const sendCodeResponse = await api.post("/sendcode", { email });
    const sendCodeData = sendCodeResponse.data;

    if (sendCodeResponse.status === 200) {
      return {
        ...result,
        sendCodeMessage: sendCodeData.message || "Verification code sent to email",
        expiringtime: sendCodeData.expiringtime || null,
      };
    }

    return { success: false, message: sendCodeData.message || "Unexpected error sending verification code" };
  } catch (error) {
    return { success: false, error: "Error sending OTP: " + (error.response?.data?.message || error.message) };
  }
};

// Verify OTP
export const verifyOTP = async (email, code) => {
  if (!email || !code) return { success: false, message: "Email and code are required" };

  try {
    const response = await api.post("/emailverify", { email, code });
    return { success: true, message: response.data.message || "Email verified successfully" };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Error verifying OTP" };
  }
};

// Register User
export const registerUser = async (payload) => {
  try {
    const response = await api.post("/register", payload);
    return {
      success: true,
      message: response.data.message || "User registered successfully",
      user: response.data.user || {},
      token: response.data.token,
    };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Error during registration" };
  }
};

// Fetch Students
export const fetchStudents = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await api.post(
      "/fetchstudents",
      { token }, // ✅ send in body
      { headers: { Authorization: `Bearer ${token}` } } // ✅ send in headers
    );

    const data = response.data;
    if (data.success && Array.isArray(data.data)) return data.data;
    if (Array.isArray(data)) return data;
    if (data.students) return data.students;
    if (data.studentsdata) return data.studentsdata;

    return [];
  } catch (err) {
    console.error("Error fetching students:", err);
    return [];
  }
};

// Approve Student
export const approveStudent = async (registrationNumber) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await api.post(
      "/approve",
      { registerno: registrationNumber, token }, // ✅ token in body
      { headers: { Authorization: `Bearer ${token}` } } // ✅ token in headers
    );

    return response.data;
  } catch (error) {
    console.error("Error approving student:", error);
    throw error;
  }
};

// Add Department
export const addDepartment = async (departmentName) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await api.post(
      "/adddepartments",
      { department: departmentName, token }, // ✅ token in body
      { headers: { authorization: `Bearer ${token}` } } // ✅ token in headers
    );

    return response.data;
  } catch (error) {
    console.error("Error adding department:", error);
    throw error;
  }
};

// Fetch Departments
export const fetchDepartments = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await api.post(
      "/fetchdepartments",
      { token }, // ✅ token in body
      { headers: { Authorization: `Bearer ${token}` } } // ✅ token in headers
    );

    if (response.data.success && Array.isArray(response.data.result)) return response.data.result;
    throw new Error("Invalid response format from API");
  } catch (error) {
    console.error("Error fetching departments:", error);
    throw error;
  }
};

// Edit Department
export const editDepartment = async (oldDepartment, newDepartment) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await api.put(
      "/editdepartment",
      { oldDepartment, newDepartment, token }, // ✅ token in body
      { headers: { Authorization: `Bearer ${token}` } } // ✅ token in headers
    );

    return response.data;
  } catch (error) {
    console.error("Error editing department:", error);
    throw error;
  }
};
