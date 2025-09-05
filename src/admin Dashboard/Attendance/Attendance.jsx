import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../Common/Card';
import Button from '../Common/Button';
import AttendanceTable from './AttendanceTable';

const Attendance = ({ isDarkMode }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('all');

  const handleMarkAttendance = () => {
    console.log('Mark attendance clicked');
  };

  const handleExport = () => {
    console.log('Export attendance clicked');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Attendance Management
        </h2>
        <div className="flex space-x-3">
          <Button onClick={handleExport} variant="outline" isDarkMode={isDarkMode}>
            Export Report
          </Button>
          <Button onClick={handleMarkAttendance} variant="primary" isDarkMode={isDarkMode}>
            Mark Attendance
          </Button>
        </div>
      </div>

      <Card isDarkMode={isDarkMode}>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h3 className="text-lg font-semibold">Daily Attendance</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Track and manage student attendance records
              </p>
            </div>
            <div className="flex space-x-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={`px-3 py-2 border rounded-md text-sm ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className={`px-3 py-2 border rounded-md text-sm ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">All Classes</option>
                <option value="class-a">Class A</option>
                <option value="class-b">Class B</option>
                <option value="class-c">Class C</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AttendanceTable isDarkMode={isDarkMode} selectedDate={selectedDate} selectedClass={selectedClass} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;
