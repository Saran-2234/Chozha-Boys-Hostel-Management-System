import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AttendanceCalendar from './AttendanceCalendar';

const Attendance = () => {

  function getIsMobile() {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return false;
    }

    if (navigator.userAgentData && typeof navigator.userAgentData.mobile === 'boolean') {
      return navigator.userAgentData.mobile;
    }

    const userAgent = navigator.userAgent || navigator.vendor || '';
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const isMobileUA = mobileRegex.test(userAgent);
    const maxTouchPoints = navigator.maxTouchPoints || navigator.msMaxTouchPoints || 0;
    const hasTouchSupport = 'ontouchstart' in window || maxTouchPoints > 0;
    const smallestViewport = Math.min(window.innerWidth || 0, window.innerHeight || 0);

    return isMobileUA && hasTouchSupport && smallestViewport <= 820;
  }

  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [absentMarked, setAbsentMarked] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isMobileDevice, setIsMobileDevice] = useState(() => getIsMobile());
  const [attendanceData, setAttendanceData] = useState([]);
  const [todaysRecord, setTodaysRecord] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState({
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    lateEntries: 0,
    percentage: 0
  });

  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const handleResize = () => {
      setIsMobileDevice(getIsMobile());
    };

    handleResize();

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      const token = localStorage.getItem('studentToken') || localStorage.getItem('accessToken');
      const studentId = localStorage.getItem('studentId');

      if (!token || !studentId) {
        setError('Authentication required. Please log in again.');
        return;
      }

      // Updated to local backend to access the new 'showattendance' endpoint
      const API_BASE_URL = 'https://finalbackend1.vercel.app';

      const response = await axios.post(`${API_BASE_URL}/students/showattendance`, {
        token: token,
        limit: 500 // Fetch a large number of records to calculate stats and show history
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });

      if (response.data && response.data.success) {
        const records = Array.isArray(response.data.data)
          ? response.data.data
          : [response.data.data];

        setAttendanceData(records);

        // Check if attendance is already marked for today
        const today = new Date().toDateString();
        const todaysRecord = records.find(record => {
          const recordDate = new Date(record.date).toDateString();
          return recordDate === today;
        });

        if (todaysRecord) {
          const status = todaysRecord.status || todaysRecord.present;
          const isPresent = status === 'present' || status === 'Present' || status === true || status === 1;
          setAttendanceStatus(isPresent ? 'present' : 'absent');
          setTodaysRecord(todaysRecord);
          // Store today's record for time display
          setAttendanceMarked(true);
        } else {
          setAttendanceStatus(null); // Not marked yet
          setTodaysRecord(null);
          setAttendanceMarked(false);
        }

        // Calculate statistics
        const totalDays = records.length;
        const presentDays = records.filter(record => {
          const status = record.status || record.present;
          return status === 'present' || status === 'Present' || status === true || status === 1;
        }).length;
        const absentDays = totalDays - presentDays;
        const lateEntries = records.filter(record => record.late === true || record.late === 1).length;
        const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0;

        setAttendanceStats({
          totalDays,
          presentDays,
          absentDays,
          lateEntries,
          percentage
        });
      }
    } catch (err) {
      console.error('Error fetching attendance data:', err);
      // Check for both 'error' (from controller) and 'message' (from auth middleware/server error)
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to load attendance data';
      setError(errorMsg);
    }
  };

  const markAttendance = async () => {
    if (!isMobileDevice) {
      setMessage('');
      setError('Attendance can only be marked using a mobile device.');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        let token = localStorage.getItem('accessToken') || localStorage.getItem('studentToken');
        const API_BASE_URL = 'https://finalbackend1.vercel.app';

        if (!token) {
          setError('No token found. Please log in.');
          setLoading(false);
          return;
        }

        try {
          const response = await axios.post(
            `${API_BASE_URL}/students/attendance`,
            {
              lat,
              lng,
              token,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          );

          if (response.data.success) {
            setMessage('Attendance marked as present successfully!');
            setAttendanceStatus('present');
            setAttendanceMarked(true);
            // Refresh attendance data to update statistics
            fetchAttendanceData();
          } else {
            setMessage(response.data.message || 'Attendance already marked for today.');
            // If attendance was already marked, refresh data to show current status
            if (response.data.message && response.data.message.includes('already marked')) {
              fetchAttendanceData();
            }
          }
        } catch (err) {
          if (err.response) {
            setError(err.response.data.error || 'An error occurred.');
          } else {
            setError('Network error.');
          }
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError('Unable to retrieve your location.');
        setLoading(false);
      }
    );
  };

  const markAbsent = async () => {
    if (!isMobileDevice) {
      setMessage('');
      setError('Attendance can only be marked using a mobile device.');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        let token = localStorage.getItem('accessToken') || localStorage.getItem('studentToken');
        const API_BASE_URL = 'https://finalbackend1.vercel.app';

        if (!token) {
          setError('No token found. Please log in.');
          setLoading(false);
          return;
        }

        try {
          const response = await axios.post(
            `${API_BASE_URL}/students/absent`,
            {
              lat,
              lng,
              token,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          );

          if (response.data.success) {
            setMessage('Attendance marked as absent successfully!');
            setAttendanceStatus('absent');
            setAttendanceMarked(true);
            // Refresh attendance data to update statistics
            fetchAttendanceData();
          } else {
            setMessage(response.data.message || 'Attendance already marked for today.');
            // If attendance was already marked, refresh data to show current status
            if (response.data.message && response.data.message.includes('already marked')) {
              fetchAttendanceData();
            }
          }
        } catch (err) {
          if (err.response) {
            setError(err.response.data.error || 'An error occurred.');
          } else {
            setError('Network error.');
          }
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError('Unable to retrieve your location.');
        setLoading(false);
      }
    );
  };




  return (
    <div className="max-w-6xl mx-auto px-4 pb-20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 max-w-full relative z-10">
        <h2 className="text-2xl font-bold text-white mb-3 md:mb-0">Attendance Management</h2>


        <div className="w-full md:w-auto md:flex-shrink-0 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
          <button
            onClick={markAttendance}
            disabled={!isMobileDevice || loading || attendanceStatus !== null}
            className="w-full md:inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 transition-all duration-200 relative z-20"
          >
            {loading ? 'Marking...' : attendanceStatus === 'present' ? "Present Marked" : "✅ Mark Present"}
          </button>
          <button
            onClick={markAbsent}
            disabled={!isMobileDevice || loading || attendanceStatus !== null}
            className="w-full md:inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 transition-all duration-200 relative z-20"
          >
            {loading ? 'Marking...' : attendanceStatus === 'absent' ? "Absent Marked" : "❌ Mark Absent"}
          </button>
        </div>
        {!isMobileDevice && (
          <p className="text-sm text-red-400 mt-3">
            Attendance can only be marked using a mobile device.
          </p>
        )}
      </div>

      {message && <p className="text-green-400 mb-4">{message}</p>}
      {error && <p className="text-red-400 mb-4">{error}</p>}



      {/* Calendar View */}


      <div className="mb-8 w-full max-w-full overflow-hidden">
        <AttendanceCalendar attendanceData={attendanceData} />
      </div>

    </div>
  );
};

export default Attendance;
