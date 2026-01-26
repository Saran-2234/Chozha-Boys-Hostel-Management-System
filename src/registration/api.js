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
    const { data: emailPushData } = await api.post("students/emailpush", { email });

    if (!emailPushData?.success) {
      return { success: false, message: emailPushData?.message || "Unable to start verification" };
    }

    const emailToken = emailPushData.token;

    if (!emailToken) {
      return { success: false, message: "Verification token missing" };
    }

    const { data: sendCodeData } = await api.post("students/sendcode", { email, token: emailToken });

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
    const { data } = await api.post("students/emailverify", { email, code, token });

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
    const { data } = await api.post("students/register", payload);

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
// Fetch Students
export const fetchStudents = async ({ department, academic_year, status, page = 1, limit = 10, id } = {}) => {
  try {
    const token = localStorage.getItem("accessToken");

    // Construct payload with only defined values to avoid sending undefined
    const payload = { token, page, limit };
    if (department) payload.department = department;
    if (academic_year) payload.academic_year = academic_year;
    if (status !== undefined) payload.status = status;
    if (id) payload.id = id;

    const response = await api.post(
      "/admin/fetchstudents",
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = response.data;
    // The new backend returns { success: true, students: [...] }
    if (data.success) {
      return {
        students: data.students || [],
        fetched: data.fetched,
        hasMore: data.hasMore,
        page: data.page
      };
    }

    // Fallback for older responses or other formats
    if (Array.isArray(data.data)) return { students: data.data };
    if (Array.isArray(data)) return { students: data };
    if (data.students) return { students: data.students };

    return { students: [] };
  } catch (err) {
    console.error("Error fetching students:", err);
    throw err; // Re-throw so the component can handle the error (e.g. 400 Bad Request)
  }
};

// Approve Student
export const approveStudent = async (id) => {
  try {
    if (!id) {
      throw new Error("Student ID is required");
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No authentication token found. Please log in again.");
    }

    const response = await api.put(
      `/admin/approve/${id}`,
      {},
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
      "/admin/adddepartments",
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
    console.log("Making API call to fetch departments...");
    const response = await api.get("/students/fetchdepartments");
    console.log("API Response:", response);
    console.log("Response data:", response.data);

    if (response.data.success && Array.isArray(response.data.result)) {
      console.log("Returning departments:", response.data.result);
      return response.data.result;
    }

    // Fallback: check if response.data is directly an array
    if (Array.isArray(response.data)) {
      console.log("Response data is directly an array:", response.data);
      return response.data;
    }

    // Fallback: check if response.data.data is an array
    if (response.data.data && Array.isArray(response.data.data)) {
      console.log("Found departments in response.data.data:", response.data.data);
      return response.data.data;
    }

    console.error("Unexpected response structure:", response.data);
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
      "/admin/editdepartment",
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
      "/admin/deletedepartment",
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
export const rejectStudent = async (id, reason) => {
  try {
    if (!id) {
      throw new Error("Student ID is required");
    }

    if (!reason) {
      throw new Error("Rejection reason is required");
    }

    const authToken = localStorage.getItem("accessToken");
    if (!authToken) {
      throw new Error("No authentication token found. Please log in again.");
    }

    const response = await api.put(
      `/admin/adminreject/${id}`,
      { reason },
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
      "/admin/editstudentsdetails",
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
      "/admin/showattends",
      {
        accessToken, // required
        registration_number: filters.registration_number,
        department: filters.department,
        academic_year: filters.academic_year,
        date: filters.date,
        status: filters.status,
        page: filters.page || 1,
        limit: filters.limit || 10,
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
      total: response.data.total,
      totalPages: response.data.totalPages,
      page: response.data.page,
      limit: response.data.limit,
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
      "https://finalbackend1.vercel.app/admin/promotion",
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

// Fetch Complaints for Admin
export const fetchComplaintsForAdmin = async (filters = {}) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No access token found");
    }

    const response = await api.post(
      "/admin/fetchcomplaintforadmins",
      { token, ...filters },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to fetch complaints");
    }
  } catch (error) {
    console.error("Error fetching complaints:", error);
    throw error;
  }
};

// Resolve Complaint
export const resolveComplaint = async (complaintId) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No access token found");

    const response = await api.post(
      "/admin/resolvecomplaints",
      { complaint_id: complaintId, token },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
  } catch (error) {
    console.error("Error resolving complaint:", error);
    throw error;
  }
};

// Change Complaint Status
export const changeComplaintStatus = async (complaintId, status) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No access token found");

    // The backend expects key 'status'
    const response = await api.post(
      "/admin/complaintstatuschangeforadmin",
      { complaint_id: String(complaintId), status, token },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating complaint status:", error);
    throw error;
  }
};

// Fetch Student Stats (Profile)
export const fetchStudentStats = async (studentId) => {
  try {
    const response = await api.post("/students/stats", { student_id: studentId });

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.error || "Failed to fetch stats");
    }
  } catch (error) {
    console.error("Error fetching student stats:", error);
    throw error;
  }
};

// Fetch Student Mess Bills (Admin)
export const fetchStudentMessBillsForAdmin = async (studentId, page = 1, limit = 10, status = null, year = null, month = null) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No access token found");

    const payload = {
      student_id: studentId,
      token,
      page,
      limit
    };

    if (status) payload.status = status;
    if (year) payload.year = year;
    if (month) payload.month = month;

    const response = await api.post(
      "/admin/fetch-student-mess-bills",
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.error || "Failed to fetch mess bills");
    }
  } catch (error) {
    console.error("Error fetching student mess bills:", error);
    throw error;
  }
};

// Fetch Transaction History (Payments)
export const fetchTransactionHistory = async (studentId, page = 1, limit = 10, year = null, month = null) => {
  try {
    const token = localStorage.getItem("accessToken");
    const payload = {
      student_id: studentId,
      page,
      limit,
      token // sending token just in case
    };

    if (year) payload.year = year;
    if (month) payload.month = month;

    const response = await api.post(
      "/students/fetch-transaction-history",
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to fetch transaction history");
    }
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    throw error;
  }
};
