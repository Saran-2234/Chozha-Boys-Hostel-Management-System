import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

  // Calendar Helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    const days = [];
    // Empty cells for days before start of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 md:h-32 border border-slate-700/50 bg-slate-800/30"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      // Find record for this day
      // Note: record.date might be ISO string
      const record = attendanceData.find(r => {
        if (!r.date) return false;
        return r.date.startsWith(dateStr);
      });

      let statusClass = "bg-slate-800/30"; // Default
      let statusIcon = "";
      let statusLabel = "";

      if (record) {
        const status = record.status || record.present;
        const isPresent = status === 'present' || status === 'Present' || status === true || status === 1;

        if (isPresent) {
          statusClass = "bg-emerald-900/20 border-emerald-500/30";
          statusIcon = "✅";
          statusLabel = "Present";
        } else {
          statusClass = "bg-red-900/20 border-red-500/30";
          statusIcon = "❌";
          statusLabel = "Absent";
        }
      }

      days.push(
        <div key={day} className={`h-24 md:h-32 p-2 border border-slate-700/50 relative hover:bg-slate-700/40 transition-colors ${statusClass}`}>
          <span className="text-slate-300 font-medium">{day}</span>
          {record && (
            <div className="mt-2 flex flex-col items-center">
              <span className="text-xl">{statusIcon}</span>
              <span className={`text-xs mt-1 font-medium ${statusLabel === 'Present' ? 'text-emerald-400' : 'text-red-400'}`}>
                {statusLabel}
              </span>
              <span className="text-[10px] text-slate-500 mt-1">
                {record.time || (record.created_at ? new Date(record.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '')}
              </span>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="glass-card rounded-xl p-6 relative overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-700 rounded-full text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 className="text-xl font-bold text-white">{monthName} {year}</h3>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-700 rounded-full text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2 text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-slate-400 font-medium py-2">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 rounded-lg overflow-hidden border border-slate-700">
          {days}
        </div>
      </div>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card rounded-xl p-6 text-center">
          <div className="relative w-36 h-36 mx-auto mb-4 md:w-32 md:h-32">
            <svg className="progress-circle w-full h-full" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
              <circle cx="60" cy="60" r="50" stroke="#10b981" strokeWidth="8" fill="none"
                strokeDasharray="314" strokeDashoffset={314 - (314 * attendanceStats.percentage / 100)} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{attendanceStats.percentage}%</div>
                <div className="text-xs text-slate-400">Overall</div>
              </div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Attendance Percentage</h3>
          <p className="text-slate-400 text-sm">{attendanceStats.presentDays} out of {attendanceStats.totalDays} days</p>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Monthly Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Present Days</span>
              <span className="text-emerald-400 font-semibold">{attendanceStats.presentDays}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Absent Days</span>
              <span className="text-red-400 font-semibold">{attendanceStats.absentDays}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Late Entries</span>
              <span className="text-yellow-400 font-semibold">{attendanceStats.lateEntries}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total Days</span>
              <span className="text-white font-semibold">{attendanceStats.totalDays}</span>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Today's Status</h3>
          <div className="text-center">
            <div className={`w-16 h-16 ${attendanceStatus === 'present' ? 'bg-emerald-500' : attendanceStatus === 'absent' ? 'bg-red-500' : 'bg-gray-500'} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <span className="text-2xl">{attendanceStatus === 'present' ? '✅' : attendanceStatus === 'absent' ? '❌' : '⏳'}</span>
            </div>
            <p className={`${attendanceStatus === 'present' ? 'text-emerald-400' : attendanceStatus === 'absent' ? 'text-red-400' : 'text-gray-400'} font-semibold mb-2`}>
              {attendanceStatus === 'present' ? 'Present' : attendanceStatus === 'absent' ? 'Absent' : 'Not Marked'}
            </p>
            <p className="text-slate-400 text-sm">
              Marked at {attendanceMarked && todaysRecord ? (todaysRecord.time || (todaysRecord.created_at ? new Date(todaysRecord.created_at).toLocaleTimeString() : '-')) : '-'}
            </p>
            <p className="text-slate-400 text-sm">Status: {attendanceStatus ? 'Confirmed' : 'Pending'}</p>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="mb-8">
        {renderCalendar()}
      </div>

      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Attendance List</h3>

        {/* Desktop/Tablet Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-600">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Date</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Admin Status</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.slice(0, 10).map((record, idx) => {
                const status = record.status || record.present;
                const isPresent = status === 'present' || status === 'Present' || status === true || status === 1;
                const statusText = isPresent ? 'Present' : 'Absent';
                const adminStatus = record.admin_status || record.confirmed || 'Pending';

                return (
                  <tr key={idx} className="border-b border-slate-700">
                    <td className="py-3 px-4 text-white">
                      {record.date ? new Date(record.date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={isPresent ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
                        {statusText}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={adminStatus === 'Confirmed' || adminStatus === true ? 'text-emerald-400 font-semibold' : 'text-yellow-400 font-semibold'}>
                        {adminStatus === 'Confirmed' || adminStatus === true ? 'Confirmed' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {record.time ? record.time : (record.created_at ? new Date(record.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile stacked list */}
        <div className="md:hidden space-y-4">
          {attendanceData.slice(0, 10).map((record, idx) => {
            const status = record.status || record.present;
            const isPresent = status === 'present' || status === 'Present' || status === true || status === 1;
            const statusText = isPresent ? 'Present' : 'Absent';
            const adminStatus = record.admin_status || record.confirmed || 'Pending';

            return (
              <div key={idx} className="p-4 bg-slate-900 bg-opacity-20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white font-medium">
                    {record.date ? new Date(record.date).toLocaleDateString() : 'N/A'}
                  </div>
                  <div className="text-sm text-slate-400">
                    {record.time ? record.time : (record.created_at ? new Date(record.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A')}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-slate-400 text-sm">Status</div>
                    <div className={isPresent ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
                      {statusText}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">Admin</div>
                    <div className={adminStatus === 'Confirmed' || adminStatus === true ? 'text-emerald-400 font-semibold' : 'text-yellow-400 font-semibold'}>
                      {adminStatus === 'Confirmed' || adminStatus === true ? 'Confirmed' : 'Pending'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
