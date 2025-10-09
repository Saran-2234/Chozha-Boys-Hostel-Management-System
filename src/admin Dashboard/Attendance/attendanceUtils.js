import axios from "axios";

/**
 * Change attendance status for a student by Admin.
 * @param {string} attendanceId - ID of the attendance record.
 * @param {string} newStatus - New status (e.g., Present, Absent, Leave).
 * @param {string} token - Access token for authorization.
 * @returns {Promise<Object>} - API response data.
 */
export async function changeAttendance(attendanceId, newStatus, token) {
  try {
    const response = await axios.post(
      "https://finalbackend-mauve.vercel.app/changeattendanceforadmin",
      {
        attendance_id: attendanceId,
        update: newStatus,
        token: token, // Optional if Authorization header is used
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true, // Ensures refreshToken cookie is sent
      }
    );

    console.log("✅ Success:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
    throw error;
  }
}