import React, { useState, useEffect } from 'react';
import Button from '../Common/Button';
import { showAttends, fetchDepartments } from '../../registration/api';
import { changeAttendance } from './attendanceUtils';
import Modal from '../Common/Modal'; // Assuming a Modal component exists for popup messages

const Attendance = () => {
  const [filters, setFilters] = useState({
    department: '',
    academic_year: '',
    date: '',
    status: ''
  });
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [popupData, setPopupData] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [bulkAction, setBulkAction] = useState(null);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  useEffect(() => {
    loadDepartments();
  }, []);

  useEffect(() => {
    const hasActiveFilters = Object.values(filters).some(Boolean);
    if (!hasActiveFilters) {
      setAttendanceRecords([]);
      return;
    }

    fetchAttendanceRecords(filters);
  }, [filters]);

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

  const fetchAttendanceRecords = async (selectedFilters) => {
    setLoading(true);
    setError(null);

    try {
      const response = await showAttends(selectedFilters);

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

  const handleClearFilters = () => {
    setFilters({
      department: '',
      academic_year: '',
      date: '',
      status: ''
    });
    setAttendanceRecords([]);
    setCurrentPage(1);
  };

  const handleExport = () => {
    const recordsToExport = attendanceRecords;

    if (recordsToExport.length === 0) {
      alert('No records to export');
      return;
    }

    const headers = ['Name', 'Department', 'Year', 'Date', 'Status'];
    const csvContent = [
      headers.join(','),
      ...recordsToExport.map((record) => [
        record.name,
        record.department,
        record.academic_year,
        record.date,
        record.status || 'Not Marked',
      ].join(',')),
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRecords = attendanceRecords.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(attendanceRecords.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleBulkMarkRequest = (status) => {
    if (!filters.department || !filters.academic_year || !filters.date) {
      setInfoMessage('Please select department, academic year, and date before applying bulk attendance.');
      setTimeout(() => setInfoMessage(null), 2000);
      return;
    }

    if (filters.date && new Date(filters.date) > new Date()) {
      setInfoMessage('Bulk updates are disabled for future dates. Please pick a past or current date.');
      setTimeout(() => setInfoMessage(null), 2000);
      return;
    }

    if (attendanceRecords.length === 0) {
      setInfoMessage('No students match the current filters. Please adjust the filters and try again.');
      setTimeout(() => setInfoMessage(null), 2000);
      return;
    }

    setBulkAction(status);
    setPopupData({ isBulk: true, status });
  };

  const handleAttendanceUpdate = async (attendanceId, newStatus, studentId, dateOverride = null) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setInfoMessage("No access token found. Please log in again.");
        setPopupData(null);
        return;
      }

      const response = await changeAttendance(attendanceId, newStatus, token, studentId, dateOverride ?? filters.date);

      if (response.success) {
        setInfoMessage("Attendance updated successfully");
        fetchAttendanceRecords(filters);

        setTimeout(() => {
          setInfoMessage(null);
          setPopupData(null);
        }, 1500);
      } else {
        setInfoMessage(response.message || "Failed to update attendance");
        setTimeout(() => setInfoMessage(null), 1500);
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
      setInfoMessage("An error occurred while updating attendance");
      setTimeout(() => setInfoMessage(null), 1500);
    }
  };

  const confirmAttendanceChange = (attendanceId, studentName, newStatus, studentId, date) => {
    setPopupData({ attendanceId, studentName, newStatus, studentId, date });
  };

  const handlePopupAction = (confirm) => {
    if (confirm && popupData) {
      if (popupData.isBulk) {
        handleBulkApply(popupData.status);
      } else {
        setInfoMessage('Okay, changing attendance...');
        handleAttendanceUpdate(popupData.attendanceId, popupData.newStatus, popupData.studentId, popupData.date);
      }
    }
    setPopupData(null);
  };

  const handleBulkApply = async (status) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setInfoMessage("No access token found. Please log in again.");
        setTimeout(() => setInfoMessage(null), 2000);
        return;
      }

      setIsBulkProcessing(true);
      setInfoMessage('Applying bulk attendance...');

      const updatePromises = attendanceRecords.map((record) =>
        changeAttendance(record.attendance_id ?? null, status, token, record.student_id ?? record.studentId ?? null)
      );

      const responses = await Promise.allSettled(updatePromises);

      const failedUpdates = responses.filter(result => result.status === 'rejected');

      if (failedUpdates.length > 0) {
        setInfoMessage(`${failedUpdates.length} records failed to update. Please try again.`);
      } else {
        setInfoMessage('Bulk attendance applied successfully.');
      }

      await fetchAttendanceRecords(filters);
    } catch (error) {
      console.error('Bulk attendance error:', error);
      setInfoMessage('An error occurred while applying bulk attendance.');
    } finally {
      setIsBulkProcessing(false);
      setTimeout(() => setInfoMessage(null), 2000);
      setBulkAction(null);
    }
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

  const formatRecordDate = (dateValue) => {
    if (!dateValue) {
      if (filters.date) {
        const selectedDate = new Date(filters.date);
        if (!Number.isNaN(selectedDate.getTime())) {
          return selectedDate.toLocaleDateString();
        }
      }
      return 'N/A';
    }

    const parsedDirect = new Date(dateValue);
    if (!Number.isNaN(parsedDirect.getTime())) {
      return parsedDirect.toLocaleDateString();
    }

    if (typeof dateValue === 'string') {
      const separator = dateValue.includes('/') ? '/' : '-';
      const parts = dateValue.split(separator).map((part) => part.trim());

      if (parts.length === 3) {
        const [first, second, third] = parts;

        if (third.length === 4) {
          const normalizedDMY = `${third}-${second.padStart(2, '0')}-${first.padStart(2, '0')}`;
          const parsedDMY = new Date(normalizedDMY);
          if (!Number.isNaN(parsedDMY.getTime())) {
            return parsedDMY.toLocaleDateString();
          }

          const normalizedMDY = `${third}-${first.padStart(2, '0')}-${second.padStart(2, '0')}`;
          const parsedMDY = new Date(normalizedMDY);
          if (!Number.isNaN(parsedMDY.getTime())) {
            return parsedMDY.toLocaleDateString();
          }
        }
      }
    }

    if (filters.date) {
      const selectedDate = new Date(filters.date);
      if (!Number.isNaN(selectedDate.getTime())) {
        return selectedDate.toLocaleDateString();
      }
    }

    return dateValue;
  };

  return (
    <div className="space-y-6">
      <Modal isOpen={!!popupData} onClose={() => setPopupData(null)}>
        <p>
          {popupData?.isBulk
            ? `Apply status "${popupData?.status}" to all ${attendanceRecords.length} filtered students on ${filters.date || 'the selected date'}?`
            : `Would you like to change the attendance of ${popupData?.studentName} to ${popupData?.newStatus}?`}
        </p>
        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={() => handlePopupAction(false)}
            className="px-4 py-2 rounded hover:opacity-80 bg-gray-300 text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => handlePopupAction(true)}
            className="px-4 py-2 rounded hover:opacity-80 bg-blue-500 text-white"
          >
            Okay
          </button>
        </div>
      </Modal>

      <Modal isOpen={!!infoMessage} onClose={() => setInfoMessage(null)}>
        <p>{infoMessage}</p>
      </Modal>

      <div className="space-y-6">
        <div className="flex items-center justify-between select-none">
          <h2 className="text-2xl font-bold text-gray-900">
            Attendance Records
          </h2>
          <div className="flex space-x-3">
            <Button onClick={() => handleBulkMarkRequest('Present')} variant="success" disabled={isBulkProcessing}>
              {isBulkProcessing && bulkAction === 'Present' ? 'Applying...' : 'Mark All Present'}
            </Button>
            <Button onClick={() => handleBulkMarkRequest('Absent')} variant="danger" disabled={isBulkProcessing}>
              {isBulkProcessing && bulkAction === 'Absent' ? 'Applying...' : 'Mark All Absent'}
            </Button>
            <Button onClick={() => handleBulkMarkRequest('Not Marked')} variant="outline" disabled={isBulkProcessing}>
              {isBulkProcessing && bulkAction === 'Not Marked' ? 'Applying...' : 'Reset All'}
            </Button>
            <Button onClick={handleExport} variant="outline">
              Export CSV
            </Button>
          </div>
        </div>

        <div className="rounded-lg shadow-md p-6 bg-white border border-gray-200 text-gray-900">
          <div className="mb-6 select-none">
            <h3 className="text-lg font-semibold">Filter Attendance Records</h3>
            <p className="text-sm text-gray-600">
              Search and filter attendance records by various criteria
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Department */}
            <div>
              <label htmlFor="department" className="block text-sm font-medium mb-1 text-gray-700">
                Department
              </label>
              <select
                id="department"
                name="department"
                value={filters.department}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border rounded-md text-sm select-text bg-white border-gray-300 text-gray-900"
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
              <label htmlFor="academic_year" className="block text-sm font-medium mb-1 text-gray-700">
                Academic Year
              </label>
              <select
                id="academic_year"
                name="academic_year"
                value={filters.academic_year}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border rounded-md text-sm select-text bg-white border-gray-300 text-gray-900"
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
              <label htmlFor="date" className="block text-sm font-medium mb-1 text-gray-700">
                Date
              </label>
              <input
                id="date"
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border rounded-md text-sm select-text bg-white border-gray-300 text-gray-900"
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-1 text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border rounded-md text-sm select-text bg-white border-gray-300 text-gray-900"
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
            <Button onClick={handleClearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>

          {error && (
            <div className="p-4 rounded-md mb-4 select-none bg-red-100 text-red-700">
              <p>Error: {error}</p>
            </div>
          )}
          {filters.date && new Date(filters.date) > new Date() && (
            <div className="p-3 mb-4 rounded-md text-sm bg-blue-100 text-blue-700">
              Attendance for future dates is displayed as <strong>Not Marked</strong> and cannot be edited.
            </div>
          )}

          <div className="mt-4 space-y-3 sm:hidden">
            {loading ? (
              <div className="p-4 rounded-lg text-center text-sm bg-gray-50 text-gray-600 border border-gray-200">
                Loading records...
              </div>
            ) : currentRecords.length === 0 ? (
              <div className="p-4 rounded-lg text-center text-sm bg-gray-50 text-gray-600 border border-gray-200">
                No attendance records found for the selected filters
              </div>
            ) : (
              currentRecords.map((record) => (
                <div
                  key={record.attendance_id || `placeholder-card-${record.student_id}`}
                  className="p-4 rounded-xl border shadow-sm transition-all select-text bg-white border-gray-200 text-gray-900 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold bg-blue-100 text-blue-600">
                          {(record.name || 'N').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold leading-tight">{record.name || 'Unknown Student'}</p>
                          <p className="text-xs text-gray-500">{record.department || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="uppercase tracking-wide text-gray-500">Year</p>
                          <p className="font-medium">{record.academic_year || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="uppercase tracking-wide text-gray-500">Date</p>
                          <p className="font-medium">{formatRecordDate(record.date)}</p>
                        </div>
                        <div>
                          <p className="uppercase tracking-wide text-gray-500">Status</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getStatusColor(record.status)}`}>
                            {record.status || 'Not Marked'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {record.isPlaceholder || (filters.date && new Date(filters.date) > new Date()) ? (
                        <span className="text-xs font-medium text-gray-500">
                          Changes disabled for future dates
                        </span>
                      ) : !record.status ? (
                        <div className="flex flex-col gap-2 w-full">
                          <Button
                            onClick={() => confirmAttendanceChange(record.attendance_id, record.name, 'Present', record.student_id, record.date)}
                            variant="outline"
                            className="bg-green-500 text-white hover:bg-green-600"
                          >
                            Mark Present
                          </Button>
                          <Button
                            onClick={() => confirmAttendanceChange(record.attendance_id, record.name, 'Absent', record.student_id, record.date)}
                            variant="outline"
                            className="bg-red-500 text-white hover:bg-red-600"
                          >
                            Mark Absent
                          </Button>
                        </div>
                      ) : record.status.toLowerCase() === 'present' ? (
                        <Button
                          onClick={() => confirmAttendanceChange(record.attendance_id, record.name, 'Absent', record.student_id, record.date)}
                          variant="outline"
                          className="bg-red-500 text-white hover:bg-red-600"
                        >
                          Mark Absent
                        </Button>
                      ) : (
                        <Button
                          onClick={() => confirmAttendanceChange(record.attendance_id, record.name, 'Present', record.student_id, record.date)}
                          variant="outline"
                          className="bg-green-500 text-white hover:bg-green-600"
                        >
                          Mark Present
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="hidden sm:block overflow-x-auto select-none">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Name','Department','Year','Date','Status', 'Change Attendance'].map((title) => (
                    <th
                      key={title}
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      Loading records...
                    </td>
                  </tr>
                ) : currentRecords.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      No attendance records found for the selected filters
                    </td>
                  </tr>
                ) : (
                  currentRecords.map((record) => (
                    <tr key={record.attendance_id || `placeholder-row-${record.student_id}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.academic_year}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatRecordDate(record.date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                          {record.status || 'Not Marked'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        {record.isPlaceholder || (filters.date && new Date(filters.date) > new Date()) ? (
                          <span className="text-xs font-medium text-gray-500">
                            Changes disabled for future dates
                          </span>
                        ) : !record.status ? (
                          <div className="flex space-x-2 justify-center">
                            <Button
                              onClick={() => confirmAttendanceChange(record.attendance_id, record.name, 'Present', record.student_id, record.date)}
                              variant="outline"
                              className="bg-green-500 text-white hover:bg-green-600"
                            >
                              Mark Present
                            </Button>
                            <Button
                              onClick={() => confirmAttendanceChange(record.attendance_id, record.name, 'Absent', record.student_id, record.date)}
                              variant="outline"
                              className="bg-red-500 text-white hover:bg-red-600"
                            >
                              Mark Absent
                            </Button>
                          </div>
                        ) : record.status.toLowerCase() === 'present' ? (
                          <Button
                            onClick={() => confirmAttendanceChange(record.attendance_id, record.name, 'Absent', record.student_id, record.date)}
                            variant="outline"
                            className="bg-red-500 text-white hover:bg-red-600"
                          >
                            Mark Absent
                          </Button>
                        ) : (
                          <Button
                            onClick={() => confirmAttendanceChange(record.attendance_id, record.name, 'Present', record.student_id, record.date)}
                            variant="outline"
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
          {attendanceRecords.length > 0 && (
            <div className="mt-6 space-y-4">
              {/* Statistics */}
              <div className="flex justify-between items-center text-sm select-none">
                <div className="flex space-x-4 text-gray-600">
                  <span>Present: {attendanceRecords.filter(r => r.status?.toLowerCase() === 'present').length}</span>
                  <span>Absent: {attendanceRecords.filter(r => r.status?.toLowerCase() === 'absent').length}</span>
                  <span>Not Marked: {attendanceRecords.filter(r => !r.status).length}</span>
                </div>
                <div className="text-gray-600">
                  Total Records: {attendanceRecords.length}
                </div>
              </div>

              {/* Pagination Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 select-none">
                {/* Items per page selector */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">
                    Show per page:
                  </label>
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="px-3 py-1 border rounded-md text-sm bg-white border-gray-300 text-gray-900"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span className="text-sm text-gray-600">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, attendanceRecords.length)} of {attendanceRecords.length}
                  </span>
                </div>

                {/* Page navigation */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentPage === 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-900 hover:bg-gray-100 border border-gray-300'
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
                              ? 'bg-blue-500 text-white'
                              : 'bg-white text-gray-900 hover:bg-gray-100 border border-gray-300'
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
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-900 hover:bg-gray-100 border border-gray-300'
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