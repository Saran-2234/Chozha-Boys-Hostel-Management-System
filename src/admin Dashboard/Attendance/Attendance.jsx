import React, { useState, useEffect } from 'react';
import Button from '../Common/Button';
import { showAttends, fetchDepartments } from '../../registration/api';
import { changeAttendance } from './attendanceUtils';
import Modal from '../Common/Modal'; // Assuming a Modal component exists for popup messages

const Attendance = ({ isDarkMode }) => {
  const [filters, setFilters] = useState({
    department: '',
    academic_year: '',
    date: '',
    status: ''
  });
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [popupMessage, setPopupMessage] = useState(null);
  const [popupData, setPopupData] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchAttendanceRecords();
    loadDepartments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, attendanceRecords]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [filteredRecords]);

  const loadDepartments = async () => {
    try {
      const depts = await fetchDepartments();
      setDepartments(depts || []);
    } catch (err) {
      console.error('Error loading departments:', err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchAttendanceRecords = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await showAttends();

      if (response.success) {
        setAttendanceRecords(response.data || []);
        setError(null);
      } else {
        setAttendanceRecords([]);
        setError(response.message || "No attendance data found for the current filters.");
      }
    } catch (err) {
      console.error("Error fetching attendance records:", err);
      setAttendanceRecords([]);
      setError(err.message || "Failed to fetch attendance records");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    // Check if any filter is applied
    const hasActiveFilters = filters.department || filters.academic_year || filters.date || filters.status;
    
    // If no filters are applied, show empty results
    if (!hasActiveFilters) {
      setFilteredRecords([]);
      return;
    }

    let filtered = [...attendanceRecords];

    // Filter by department
    if (filters.department) {
      filtered = filtered.filter(record => 
        record.department?.toLowerCase() === filters.department.toLowerCase()
      );
    }

    // Filter by academic year
    if (filters.academic_year) {
      filtered = filtered.filter(record => 
        record.academic_year?.toString() === filters.academic_year
      );
    }

    // Filter by date
    if (filters.date) {
      filtered = filtered.filter(record => {
        const recordDate = record.date ? new Date(record.date).toISOString().split('T')[0] : null;
        return recordDate === filters.date;
      });
    }

    // Filter by status
    if (filters.status) {
      if (filters.status === 'Not Marked') {
        filtered = filtered.filter(record => !record.status);
      } else {
        filtered = filtered.filter(record => 
          record.status?.toLowerCase() === filters.status.toLowerCase()
        );
      }
    }

    setFilteredRecords(filtered);
  };

  const handleClearFilters = () => {
    setFilters({
      department: '',
      academic_year: '',
      date: '',
      status: ''
    });
    setCurrentPage(1);
  };

  const handleExport = () => {
    const recordsToExport = filteredRecords.length > 0 ? filteredRecords : attendanceRecords;
    
    if (recordsToExport.length === 0) {
      alert('No records to export');
      return;
    }

    const headers = ['Name', 'Department', 'Year', 'Date', 'Status'];
    const csvContent = [
      headers.join(','),
      ...recordsToExport.map(record => [
        record.name,
        record.department,
        record.academic_year,
        record.date,
        record.status || 'Not Marked'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'attendance_records.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleAttendanceUpdate = async (attendanceId, newStatus, studentId) => {
    try {
      const token = localStorage.getItem("accessToken"); // Get token from localStorage
      if (!token) {
        setInfoMessage("No access token found. Please log in again.");
        setPopupData(null); // Close popup on error
        return;
      }

      const response = await changeAttendance(attendanceId, newStatus, token, studentId);

      if (response.success) {
        setInfoMessage("Attendance updated successfully");
        fetchAttendanceRecords(); // Refresh the records after update

        // Ensure popup closes automatically after success
        setTimeout(() => {
          setInfoMessage(null); // Clear success message
          setPopupData(null); // Close popup
        }, 1500);
      } else {
        setInfoMessage(response.message || "Failed to update attendance");
        setTimeout(() => setInfoMessage(null), 1500); // Clear error message after delay
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
      setInfoMessage("An error occurred while updating attendance");
      setTimeout(() => setInfoMessage(null), 1500); // Clear error message after delay
    }
  };

  const confirmAttendanceChange = (attendanceId, studentName, newStatus, studentId) => {
    setPopupData({ attendanceId, studentName, newStatus, studentId });
  };

  const handlePopupAction = (confirm) => {
    if (confirm && popupData) {
      setInfoMessage('Okay, changing attendance...');
      handleAttendanceUpdate(popupData.attendanceId, popupData.newStatus, popupData.studentId);
    }
    setPopupData(null);
  };

  const getStatusColor = (status) => {
    if (!status) {
      return 'bg-yellow-100 text-yellow-800';
    }
    switch (status.toLowerCase()) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <Modal isOpen={!!popupData} onClose={() => setPopupData(null)} isDarkMode={isDarkMode}>
        <p>
          Would you like to change the attendance of {popupData?.studentName} to {popupData?.newStatus}?
        </p>
        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={() => handlePopupAction(false)}
            className={`px-4 py-2 rounded hover:opacity-80 ${
              isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-300 text-gray-800'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={() => handlePopupAction(true)}
            className={`px-4 py-2 rounded hover:opacity-80 ${
              isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
            }`}
          >
            Okay
          </button>
        </div>
      </Modal>

      <Modal isOpen={!!infoMessage} onClose={() => setInfoMessage(null)} isDarkMode={isDarkMode}>
        <p>{infoMessage}</p>
      </Modal>

      <div className="space-y-6">
        <div className="flex items-center justify-between select-none">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Attendance Records
          </h2>
          <div className="flex space-x-3">
            <Button onClick={handleExport} variant="outline" isDarkMode={isDarkMode}>
              Export CSV
            </Button>
          </div>
        </div>

        <div className={`rounded-lg shadow-md p-6 ${isDarkMode ? 'bg-gray-800 border border-gray-700 text-white' : 'bg-white border border-gray-200 text-gray-900'}`}>
          <div className="mb-6 select-none">
            <h3 className="text-lg font-semibold">Filter Attendance Records</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Search and filter attendance records by various criteria
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Department */}
            <div>
              <label htmlFor="department" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Department
              </label>
              <select
                id="department"
                name="department"
                value={filters.department}
                onChange={handleFilterChange}
                className={`w-full px-3 py-2 border rounded-md text-sm select-text ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.department_id} value={dept.department}>
                    {dept.department}
                  </option>
                ))}
              </select>
            </div>

            {/* Academic Year */}
            <div>
              <label htmlFor="academic_year" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Academic Year
              </label>
              <select
                id="academic_year"
                name="academic_year"
                value={filters.academic_year}
                onChange={handleFilterChange}
                className={`w-full px-3 py-2 border rounded-md text-sm select-text ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">All Years</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Date
              </label>
              <input
                id="date"
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                className={`w-full px-3 py-2 border rounded-md text-sm select-text ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Status
              </label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className={`w-full px-3 py-2 border rounded-md text-sm select-text ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">All Status</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Not Marked">Not Marked</option>
              </select>
            </div>
          </div>

          {/* Clear Filter Button */}
          <div className="mb-6 flex justify-end">
            <Button onClick={handleClearFilters} variant="outline" isDarkMode={isDarkMode}>
              Clear Filters
            </Button>
          </div>

          {error && (
            <div className={`p-4 rounded-md mb-4 select-none ${isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'}`}>
              <p>Error: {error}</p>
            </div>
          )}

          <div className="overflow-x-auto select-none">
            <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  {['Name','Department','Year','Date','Status', 'Change Attendance'].map((title) => (
                    <th
                      key={title}
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}
                    >
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                {loading ? (
                  <tr>
                    <td colSpan="6" className={`px-6 py-4 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Loading records...
                    </td>
                  </tr>
                ) : currentRecords.length === 0 ? (
                  <tr>
                    <td colSpan="6" className={`px-6 py-4 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {attendanceRecords.length === 0 
                        ? 'No attendance records found' 
                        : filteredRecords.length === 0 && (filters.department || filters.academic_year || filters.date || filters.status)
                        ? 'No records match the selected filters'
                        : 'Please select at least one filter to view attendance records'}
                    </td>
                  </tr>
                ) : (
                  currentRecords.map((record) => (
                    <tr key={record.attendance_id} className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{record.name}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{record.department}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{record.academic_year}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{new Date(record.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                          {record.status || 'Not Marked'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        {!record.status ? (
                          <div className="flex space-x-2 justify-center">
                            <Button
                              onClick={() => confirmAttendanceChange(record.attendance_id, record.name, 'Present', record.student_id)}
                              variant="outline"
                              isDarkMode={isDarkMode}
                              className="bg-green-500 text-white hover:bg-green-600"
                            >
                              Mark Present
                            </Button>
                            <Button
                              onClick={() => confirmAttendanceChange(record.attendance_id, record.name, 'Absent', record.student_id)}
                              variant="outline"
                              isDarkMode={isDarkMode}
                              className="bg-red-500 text-white hover:bg-red-600"
                            >
                              Mark Absent
                            </Button>
                          </div>
                        ) : record.status.toLowerCase() === 'present' ? (
                          <Button
                            onClick={() => confirmAttendanceChange(record.attendance_id, record.name, 'Absent', record.student_id)}
                            variant="outline"
                            isDarkMode={isDarkMode}
                            className="bg-red-500 text-white hover:bg-red-600"
                          >
                            Mark Absent
                          </Button>
                        ) : (
                          <Button
                            onClick={() => confirmAttendanceChange(record.attendance_id, record.name, 'Present', record.student_id)}
                            variant="outline"
                            isDarkMode={isDarkMode}
                            className="bg-green-500 text-white hover:bg-green-600"
                          >
                            Mark Present
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination and Stats */}
          {filteredRecords.length > 0 && (
            <div className="mt-6 space-y-4">
              {/* Statistics */}
              <div className="flex justify-between items-center text-sm select-none">
                <div className={`flex space-x-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span>Present: {filteredRecords.filter(r => r.status?.toLowerCase() === 'present').length}</span>
                  <span>Absent: {filteredRecords.filter(r => r.status?.toLowerCase() === 'absent').length}</span>
                  <span>Not Marked: {filteredRecords.filter(r => !r.status).length}</span>
                </div>
                <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Total Records: {filteredRecords.length}
                </div>
              </div>

              {/* Pagination Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 select-none">
                {/* Items per page selector */}
                <div className="flex items-center space-x-2">
                  <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Show per page:
                  </label>
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className={`px-3 py-1 border rounded-md text-sm ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredRecords.length)} of {filteredRecords.length}
                  </span>
                </div>

                {/* Page navigation */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentPage === 1
                        ? isDarkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-900 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    Previous
                  </button>

                  {/* Page numbers */}
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1 rounded-md text-sm ${
                            currentPage === pageNum
                              ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                              : isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-900 hover:bg-gray-100 border border-gray-300'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentPage === totalPages
                        ? isDarkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-900 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
