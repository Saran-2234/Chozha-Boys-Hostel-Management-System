import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../Common/Button';

const AttendanceTable = ({ isDarkMode, selectedDate, selectedClass }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch attendance data from API
  useEffect(() => {
    const fetchAttendance = async () => {
      setFetchLoading(true);
      setMessage('');
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setMessage('No token found. Please log in.');
        setFetchLoading(false);
        return;
      }

      try {
        const response = await axios.get('https://finalbackend-mauve.vercel.app/getattendanceforadmin', {
          params: {
            date: selectedDate,
            class: selectedClass
          },
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });

        if (response.data.success) {
          // Assume response has attendance array with joined student data
          // Adjust field names to match DB: roll_number -> rollNo, room_number -> room
          const formattedData = (response.data.attendance || []).map(record => ({
            ...record,
            student: {
              ...record.student,
              rollNo: record.student.roll_number,
              room: record.student.room_number
            }
          }));
          setAttendanceData(formattedData);
        } else {
          setMessage('Failed to fetch attendance data.');
        }
      } catch (err) {
        if (err.response) {
          setMessage(err.response.data.message || 'An error occurred while fetching data.');
        } else {
          setMessage('Network error.');
        }
      } finally {
        setFetchLoading(false);
      }
    };

    if (selectedDate && selectedClass) {
      fetchAttendance();
    }
  }, [selectedDate, selectedClass]);

  const handleAttendanceChange = (attendanceId, status) => {
    setAttendanceData(prev =>
      prev.map(record =>
        record.id === attendanceId ? { ...record, status } : record
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'present':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'absent':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSaveAttendance = async () => {
    setLoading(true);
    setMessage('');
    const token = localStorage.getItem('accessToken');

    if (!token) {
      setMessage('No token found. Please log in.');
      setLoading(false);
      return;
    }

    try {
      // Update each attendance record
      for (const record of attendanceData) {
        await axios.post('https://finalbackend-mauve.vercel.app/changeattendanceforadmin', {
          attendance_id: record.id,
          update: record.status,
          token
        }, {
          withCredentials: true
        });
      }
      setMessage('Attendance updated successfully!');
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.message || 'An error occurred.');
      } else {
        setMessage('Network error.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Attendance for {new Date(selectedDate).toLocaleDateString()}
        </h4>
        <Button onClick={handleSaveAttendance} variant="success" isDarkMode={isDarkMode} disabled={loading}>
          {loading ? 'Saving...' : 'Save Attendance'}
        </Button>
      </div>

      {fetchLoading && <p className="text-sm text-gray-500 mb-4">Loading attendance data...</p>}
      {message && !fetchLoading && <p className={`text-sm ${message.includes('successfully') ? 'text-green-400' : 'text-red-400'} mb-4`}>{message}</p>}

      <div className="overflow-x-auto">
        <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
          <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Student
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Roll No
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Room
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Status
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
            {attendanceData.map((record) => (
              <tr key={record.id} className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {record.student.name}
                  </div>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {record.student.rollNo}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {record.student.room}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={record.status}
                    onChange={(e) => handleAttendanceChange(record.id, e.target.value)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(record.status)}`}
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center text-sm">
        <div className={`flex space-x-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <span className="flex items-center">
            <div className="w-3 h-3 bg-green-100 border border-green-200 rounded-full mr-2"></div>
            Present: {attendanceData.filter(record => record.status === 'present').length}
          </span>
          <span className="flex items-center">
            <div className="w-3 h-3 bg-red-100 border border-red-200 rounded-full mr-2"></div>
            Absent: {attendanceData.filter(record => record.status === 'absent').length}
          </span>
          <span className="flex items-center">
            <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded-full mr-2"></div>
            Late: {attendanceData.filter(record => record.status === 'late').length}
          </span>
        </div>
        <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
          Total Students: {attendanceData.length}
        </div>
      </div>
    </div>
  );
};

export default AttendanceTable;
