import axios from "axios";

const API_BASE = "https://finalbackend1.vercel.app/";

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
  if (!email) return { success: false, message: "Email is required" };

  try {
    const { data: emailPushData } = await api.post("emailpush", { email });

    if (!emailPushData?.success) {
      return { success: false, message: emailPushData?.message || "Unable to start verification" };
    }

    const emailToken = emailPushData.token;

    if (!emailToken) {
      return { success: false, message: "Verification token missing" };
    }

    const { data: sendCodeData } = await api.post("sendcode", { email, token: emailToken });

    if (!sendCodeData?.success) {
      return { success: false, message: sendCodeData?.message || "Unable to send verification code" };
    }

    return {
      success: true,
      message: emailPushData.message || "Registration verification process started.",
      sendCodeMessage: sendCodeData.message || "Verification code sent to email",
      token: sendCodeData.token || "",
      emailToken,
      code: sendCodeData.code,
      expiringtime: sendCodeData.expiringtime || null,
    };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || error.message || "Error sending OTP" };
  }
};

// Verify OTP
export const verifyOTP = async (email, code, token) => {
  if (!email || !code || !token) return { success: false, message: "Email, code, and token are required" };

  try {
    const { data } = await api.post("emailverify", { email, code, token });

    if (!data?.success) {
      return { success: false, message: data?.message || "OTP verification failed" };
    }

    return {
      success: true,
      message: data.message || "Email verified successfully",
      token: data.token || token,
    };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || error.message || "Error verifying OTP" };
  }
};

// Register User
export const registerUser = async (payload) => {
  if (!payload?.token) {
    return { success: false, message: "Verification token is required" };
  }

  try {
    const { data } = await api.post("register", payload);

    if (!data?.success) {
      return { success: false, message: data?.message || "Registration failed" };
    }

    return {
      success: true,
      message: data.message || "User registered successfully",
      user: data.user || {},
      token: data.token,
    };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || error.message || "Error during registration" };
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
    if (!registrationNumber) {
      throw new Error("Registration number is required");
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No authentication token found. Please log in again.");
    }

    const response = await api.post(
      "/approve",
      { registerno: registrationNumber },
      { headers: { Authorization: `Bearer ${token}` } }
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
      { headers: { Authorization: `Bearer ${token}` } } // ✅ token in headers
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
      { oldDepartment, newDepartment, token },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
  } catch (error) {
    console.error("Error editing department:", error);
    throw error;
  }
};

// Delete Department
export const deleteDepartment = async (departmentId) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No authentication token found. Please log in again.");
    }

    const response = await api.post(
      "deletedepartment",
      { department_id: departmentId, token },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data?.token) {
      localStorage.setItem("accessToken", response.data.token);
    }

    return response.data;
  } catch (error) {
    console.error("Error deleting department:", error);
    throw error;
  }
};

// Reject Student
export const rejectStudent = async (registrationNumber, reason) => {
  try {
    if (!registrationNumber) {
      throw new Error("Registration number is required");
    }

    if (!reason) {
      throw new Error("Rejection reason is required");
    }

    const authToken = localStorage.getItem("accessToken");
    if (!authToken) {
      throw new Error("No authentication token found. Please log in again.");
    }

    const response = await api.post(
      "/adminreject",
      { registerno: registrationNumber, reason },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );

    return response.data;
  } catch (error) {
    console.error("Error rejecting student:", error);
    throw error;
  }
};

// Edit Student Details
export const editStudentDetails = async (studentId, studentData) => {
  try {
    const authToken = localStorage.getItem("accessToken");
    if (!authToken) {
      throw new Error("No authentication token found. Please log in again.");
    }

    const response = await api.put(
      "/editstudentsdetails",
      { id: studentId, token: authToken, ...studentData },
      { headers: { Authorization: `Bearer ${authToken}` }, withCredentials: true }
    );

    // Update token if provided
    if (response.data.token) {
      localStorage.setItem("accessToken", response.data.token);
    }

    return response.data;
  } catch (error) {
    console.error("Error editing student:", error);
    throw error;
  }
};

// Show Attendance Records
export const showAttends = async (filters = {}) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No authentication token found. Please log in again.");
    }

    const response = await api.post(
      "/showattends",
      {
        accessToken, // required
        registration_number: filters.registration_number,
        department: filters.department,
        academic_year: filters.academic_year,
        date: filters.date,
        status: filters.status,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    if (!response.data.success) {
      return {
        success: false,
        message:
          response.data.message || "No attendance data found for the current filters.",
        data: [],
      };
    }

    // If backend returns a refreshed token, store it for subsequent calls
    if (response.data.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
    }

    const rawData = Array.isArray(response.data.data) ? response.data.data : [];
    const normalizedData = rawData.map((entry) => {
      const status =
        entry.status ??
        entry.attendance_status ??
        entry.attendanceStatus ??
        entry.AttendanceStatus ??
        null;

      const date =
        entry.date ??
        entry.attendance_date ??
        entry.attendanceDate ??
        entry.AttendanceDate ??
        null;

      const attendanceId =
        entry.attendance_id ??
        entry.attendanceId ??
        entry.AttendanceID ??
        entry.AttendanceId ??
        null;

      const studentId =
        entry.student_id ??
        entry.studentId ??
        entry.StudentID ??
        entry.StudentId ??
        null;

      return {
        ...entry,
        status,
        date,
        attendance_id: attendanceId,
        student_id: studentId,
      };
    });

    return {
      success: true,
      data: normalizedData,
    };
  } catch (error) {
    console.error("Error fetching attendance:", error);
    throw error;
  }
};

export const promoteStudents = async (email, isdeletefinalyear) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No authentication token found. Please log in again.");
    }

    const response = await axios.post(
      "https://finalbackend1.vercel.app/promotion",
      {
        email,
        isdeletefinalyear,
        token,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error calling promotion API:", error.response?.data || error.message);
    return error.response?.data || { success: false, error: "Unknown error" };
  }
};
