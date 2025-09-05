import React, { useState } from 'react';
import Button from '../Common/Button';

const AttendanceTable = ({ isDarkMode, selectedDate, selectedClass }) => {
  const [attendanceData, setAttendanceData] = useState({});

  // Mock data - replace with actual data from API
  const students = [
    { id: 1, name: 'John Doe', rollNo: '001', room: '101' },
    { id: 2, name: 'Jane Smith', rollNo: '002', room: '102' },
    { id: 3, name: 'Bob Johnson', rollNo: '003', room: '103' },
    { id: 4, name: 'Alice Brown', rollNo: '004', room: '104' },
    { id: 5, name: 'Charlie Wilson', rollNo: '005', room: '105' },
  ];

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const getAttendanceStatus = (studentId) => {
    return attendanceData[studentId] || 'present';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'absent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'late':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSaveAttendance = () => {
    console.log('Saving attendance:', attendanceData);
    // Here you would typically send the data to your backend
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Attendance for {new Date(selectedDate).toLocaleDateString()}
        </h4>
        <Button onClick={handleSaveAttendance} variant="success" isDarkMode={isDarkMode}>
          Save Attendance
        </Button>
      </div>

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
            {students.map((student) => (
              <tr key={student.id} className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {student.name}
                  </div>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {student.rollNo}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {student.room}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={getAttendanceStatus(student.id)}
                    onChange={(e) => handleAttendanceChange(student.id, e.target.value)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(getAttendanceStatus(student.id))}`}
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
            Present: {Object.values(attendanceData).filter(status => status === 'present').length + students.filter(s => !attendanceData[s.id]).length}
          </span>
          <span className="flex items-center">
            <div className="w-3 h-3 bg-red-100 border border-red-200 rounded-full mr-2"></div>
            Absent: {Object.values(attendanceData).filter(status => status === 'absent').length}
          </span>
          <span className="flex items-center">
            <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded-full mr-2"></div>
            Late: {Object.values(attendanceData).filter(status => status === 'late').length}
          </span>
        </div>
        <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
          Total Students: {students.length}
        </div>
      </div>
    </div>
  );
};

export default AttendanceTable;
