import axios from "axios";

/**
 * Change attendance status for a student by Admin.
 * @param {string | number | null} attendanceId - Existing record ID (use null/empty for insert).
 * @param {string} newStatus - New status (e.g., Present, Absent, Leave).
 * @param {string} token - Access token for authorization.
 * @param {number | null} studentId - Student ID; required when creating a new record.
 * @param {string | null} date - Attendance date (ISO string). Required when creating a new record and recommended for updates.
 * @returns {Promise<Object>} - API response data.
 */
export async function changeAttendance(attendanceId, newStatus, token, studentId = null, date = null) {
  try {
    const payload = {
      attendance_id: attendanceId ?? "",
      update: newStatus,
      token,
    };

    if (!attendanceId && studentId) {
      payload.student_id = studentId;
    }

    if (date) {
      payload.date = date;
    }

    const response = await axios.post(
      "https://finalbackend1.vercel.app/changeattendanceforadmin",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    console.log("✅ Success:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
    throw error;
  }
}