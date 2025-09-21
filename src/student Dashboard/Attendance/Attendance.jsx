import React, { useState } from 'react';
import axios from 'axios';

const Attendance = () => {
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const markAttendance = async () => {
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
        const token = localStorage.getItem('accessToken');

        if (!token) {
          setError('No token found. Please log in.');
          setLoading(false);
          return;
        }

          console.log("lat",lat)
          console.log("lng",lng)
        try {
          const response = await axios.post('https://finalbackend-mauve.vercel.app/attendance', {
            lat,
            lng,
            token
          }, {
            withCredentials: true
          });

          if (response.data.success) {
            setMessage('Attendance marked successfully!');
            setAttendanceMarked(true);
          } else {
            setMessage(response.data.message || 'Attendance already marked for today.');
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
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8" style={{ zIndex: 50, position: 'relative' }}>
        <h2 className="text-2xl font-bold text-white">Attendance Management</h2>
        
          <button
            onClick={markAttendance}
            disabled={loading || attendanceMarked}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"

          >
          {loading ? 'Marking...' : attendanceMarked ? 'Attendance Marked' : '✅ Mark Today\'s Attendance'}
        </button>
        {message && <p className="text-green-400 mt-2">{message}</p>}
        {error && <p className="text-red-400 mt-2">{error}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="glass-card rounded-xl p-6 text-center">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="progress-circle w-32 h-32" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none"/>
              <circle cx="60" cy="60" r="50" stroke="#10b981" strokeWidth="8" fill="none"
                      strokeDasharray="314" strokeDashoffset="39.25"/>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">87.5%</div>
                <div className="text-xs text-slate-400">Overall</div>
              </div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Attendance Percentage</h3>
          <p className="text-slate-400 text-sm">175 out of 200 days</p>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Monthly Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Present Days</span>
              <span className="text-emerald-400 font-semibold">28</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Absent Days</span>
              <span className="text-red-400 font-semibold">2</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Late Entries</span>
              <span className="text-yellow-400 font-semibold">3</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total Days</span>
              <span className="text-white font-semibold">30</span>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Today's Status</h3>
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <p className="text-emerald-400 font-semibold mb-2">Present</p>
            <p className="text-slate-400 text-sm">Marked at 09:15 AM</p>
            <p className="text-slate-400 text-sm">Status: Confirmed</p>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Attendance History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-600">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Date</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Self Marked</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Admin Status</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Time</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Remarks</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-700">
                <td className="py-3 px-4 text-white">Dec 20, 2024</td>
                <td className="py-3 px-4"><span className="status-paid">Present</span></td>
                <td className="py-3 px-4"><span className="status-paid">Confirmed</span></td>
                <td className="py-3 px-4 text-slate-400">09:15 AM</td>
                <td className="py-3 px-4 text-slate-400">On time</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-3 px-4 text-white">Dec 19, 2024</td>
                <td className="py-3 px-4"><span className="status-paid">Present</span></td>
                <td className="py-3 px-4"><span className="status-paid">Confirmed</span></td>
                <td className="py-3 px-4 text-slate-400">09:45 AM</td>
                <td className="py-3 px-4 text-slate-400">Late entry</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-3 px-4 text-white">Dec 18, 2024</td>
                <td className="py-3 px-4"><span className="status-unpaid">Absent</span></td>
                <td className="py-3 px-4"><span className="status-unpaid">Confirmed</span></td>
                <td className="py-3 px-4 text-slate-400">-</td>
                <td className="py-3 px-4 text-slate-400">Medical leave</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
