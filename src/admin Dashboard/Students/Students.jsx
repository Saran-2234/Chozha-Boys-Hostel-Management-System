import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../Common/Card';
import Button from '../Common/Button';
import StudentTable from './StudentTable';
import EditStudentModal from './EditStudentModal';
import { fetchStudents as fetchStudentsAPI, approveStudent, rejectStudent, editStudentDetails, fetchDepartments } from '../../registration/api';

const Students = ({ isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [departments, setDepartments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [studentToApprove, setStudentToApprove] = useState(null);
  const [studentToReject, setStudentToReject] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, [page, filter, yearFilter, departmentFilter]);

  useEffect(() => {
    fetchDepartmentsData();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Pass the values as is. api.js will handle construction
      // Construct params, excluding 'all' values
      const params = {
        page,
        limit: 10
      };

      if (departmentFilter && departmentFilter !== 'all') {
        params.department = departmentFilter;
      }

      if (yearFilter && yearFilter !== 'all') {
        params.academic_year = yearFilter;
      }

      if (filter && filter !== 'all') {
        params.status = filter;
      }

      const data = await fetchStudentsAPI(params);

      // Handle the new response structure from api.js
      if (data && data.students) {
        setStudents(data.students);
        setHasMore(data.hasMore || false);
      } else if (Array.isArray(data)) {
        // Fallback for older API or direct array return
        setStudents(data);
        setHasMore(false);
      } else {
        setStudents([]);
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      // We don't clear students on error if we want to show stale data, but usually better to clear or show error
      // If error is just 404/400 (no students found), we treat as empty
      if (err.message && (err.message.includes('404') || err.message.includes('400'))) {
        setStudents([]);
        setHasMore(false);
      } else {
        setError(err.message || "Failed to fetch students");
        setStudents([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1); // Reset to first page on filter change
  };

  const fetchDepartmentsData = async () => {
    try {
      const data = await fetchDepartments();
      console.log('Departments fetched:', data);
      if (Array.isArray(data) && data.length > 0) {
        setDepartments(data);
        console.log('Departments set successfully:', data.length, 'departments');
      } else {
        console.warn('No departments data received or invalid format, using fallback data');
        // Temporary fallback data for testing
        setDepartments([
          { id: 1, name: 'Computer Science' },
          { id: 2, name: 'Electrical Engineering' },
          { id: 3, name: 'Mechanical Engineering' }
        ]);
      }
    } catch (err) {
      console.error('Error fetching departments:', err, 'using fallback data');
      // Temporary fallback data for testing
      setDepartments([
        { id: 1, name: 'Computer Science' },
        { id: 2, name: 'Electrical Engineering' },
        { id: 3, name: 'Mechanical Engineering' }
      ]);
    }
  };

  const handleAddStudent = () => {
    console.log('Add student clicked');
  };

  const handleExport = () => {
    console.log('Export students clicked');
  };

  const handleApproveClick = (studentId) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setStudentToApprove(student);
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmApprove = async () => {
    if (!studentToApprove) return;

    const studentId = studentToApprove.id;
    setShowConfirmDialog(false);

    // Show full screen loading overlay
    setLoading(true);

    try {
      console.log('Approving student:', studentToApprove.name, 'with ID:', studentToApprove.id);

      const responseData = await approveStudent(studentToApprove.id);
      console.log('Approval response:', responseData);

      // Update local state with response data
      setStudents(students.map(student => {
        if (student.id === studentId) {
          // If response contains student details, use them; otherwise just update status
          if (responseData && responseData.student) {
            return {
              ...student,
              ...responseData.student,
              status: responseData.student.status ?? true
            };
          } else {
            // Fallback to just updating status if no student details in response
            return { ...student, status: true };
          }
        }
        return student;
      }));

      // Use response message if available, otherwise default message
      const successMsg = responseData && responseData.message
        ? responseData.message
        : `Student ${studentToApprove.name} has been approved successfully!`;

      setSuccessMessage(successMsg);
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Error approving student:', err);
      alert(`Failed to approve student: ${err.message}`);
    } finally {
      setLoading(false);
      setStudentToApprove(null);
    }
  };

  const handleCancelApprove = () => {
    setShowConfirmDialog(false);
    setStudentToApprove(null);
  };

  const handleRejectClick = (studentId) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setStudentToReject(student);
      setRejectionReason('');
      setShowRejectDialog(true);
    }
  };

  const handleConfirmReject = async () => {
    if (!studentToReject) return;

    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason.');
      return;
    }

    const studentId = studentToReject.id;
    setShowRejectDialog(false);

    // Show full screen loading overlay
    setLoading(true);

    try {
      console.log('Rejecting student:', studentToReject.name, 'with ID:', studentToReject.id, 'reason:', rejectionReason.trim());
      const responseData = await rejectStudent(studentToReject.id, rejectionReason.trim());
      console.log('Rejection response:', responseData);

      // Update local state with response data
      setStudents(students.map(student => {
        if (student.id === studentId) {
          // If response contains student details, use them; otherwise just update status
          if (responseData && responseData.student) {
            return {
              ...student,
              ...responseData.student,
              status: responseData.student.status ?? false
            };
          } else {
            // Fallback to just updating status if no student details in response
            return { ...student, status: false };
          }
        }
        return student;
      }));

      // Use response message if available, but override if it's incorrect for reject operation
      let successMsg;
      if (responseData && responseData.message) {
        // If API returns "approved" message for reject operation, override it
        if (responseData.message.toLowerCase().includes('approved') && responseData.message.toLowerCase().includes('successfully')) {
          successMsg = `Student ${studentToReject.name} has been rejected successfully!`;
        } else {
          successMsg = responseData.message;
        }
      } else {
        successMsg = `Student ${studentToReject.name} has been rejected successfully!`;
      }

      setSuccessMessage(successMsg);
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Error rejecting student:', err);
      alert(`Failed to reject student: ${err.message}`);
    } finally {
      setLoading(false);
      setStudentToReject(null);
    }
  };

  const handleCancelReject = () => {
    setShowRejectDialog(false);
    setStudentToReject(null);
    setRejectionReason('');
  };

  const handleRejectStudent = async (studentId) => {
    try {
      const authToken = localStorage.getItem('authToken');

      const response = await fetch(`https://finalbackend1.vercel.app/admin/students/${studentId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to reject student');
      }

      // Update local state
      setStudents(students.map(student =>
        student.id === studentId
          ? { ...student, status: 'rejected' }
          : student
      ));

      alert('Student rejected successfully!');
    } catch (err) {
      console.error('Error rejecting student:', err);
      alert('Failed to reject student');
    }
  };

  const handleEdit = (studentId) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setStudentToEdit(student);
      setShowEditModal(true);
    }
  };

  const handleEditSubmit = async (studentId, updatedStudentData) => {
    if (!studentToEdit) return;

    setLoading(true);

    try {
      console.log('Editing student:', studentToEdit.name, 'with data:', updatedStudentData);

      const responseData = await editStudentDetails(studentId, updatedStudentData);
      console.log('Edit response:', responseData);

      // Update local state with response data
      setStudents(students.map(student => {
        if (student.id === studentId) {
          // If response contains student details, use them; otherwise use the updated data
          if (responseData && responseData.student) {
            return { ...student, ...responseData.student };
          } else {
            return { ...student, ...updatedStudentData };
          }
        }
        return student;
      }));

      // Use response message if available, otherwise default message
      const successMsg = responseData && responseData.message
        ? responseData.message
        : `Student ${studentToEdit.name} has been updated successfully!`;

      setSuccessMessage(successMsg);
      setShowSuccessModal(true);
      setShowEditModal(false);
      setStudentToEdit(null);
    } catch (err) {
      console.error('Error editing student:', err);
      alert(`Failed to update student: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
    setStudentToEdit(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Student Management
        </h2>
        <div className="flex space-x-3">
          <Button onClick={handleExport} variant="outline" isDarkMode={isDarkMode}>
            Export
          </Button>
          <Button onClick={handleAddStudent} variant="primary" isDarkMode={isDarkMode}>
            Add Student
          </Button>
        </div>
      </div>

      {error && (
        <div className={`p-4 rounded-md ${isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'}`}>
          <p>Error: {error}</p>
          <Button
            onClick={fetchStudents}
            variant="outline"
            isDarkMode={isDarkMode}
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      )}

      <Card isDarkMode={isDarkMode}>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold">All Students ({students.length})</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage student information and approval status
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto relative z-20">
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full sm:w-48 px-3 py-2 border rounded-md text-sm ${isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
              />
              <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2">
                <select
                  value={yearFilter}
                  onChange={handleFilterChange(setYearFilter)}
                  className={`w-full sm:w-auto px-3 py-2 border rounded-md text-sm ${isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                    }`}
                >
                  <option value="all">All Years</option>
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                </select>
                <select
                  value={departmentFilter}
                  onChange={handleFilterChange(setDepartmentFilter)}
                  className={`w-full sm:w-auto px-3 py-2 border rounded-md text-sm ${isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  style={{
                    minWidth: 'auto', // CSS overrides line 445 if it exists in original, but here we replace it
                    position: 'relative',
                    zIndex: 30
                  }}
                >
                  <option value="all">All Depts</option>
                  {departments && departments.length > 0 ? (
                    departments.map((dept) => (
                      <option key={dept.department_id || dept.id} value={dept.department}>
                        {dept.department}
                      </option>
                    ))
                  ) : (
                    <option disabled>No departments</option>
                  )}
                </select>
              </div>
              <select
                value={filter}
                onChange={handleFilterChange(setFilter)}
                className={`w-full sm:w-auto px-3 py-2 border rounded-md text-sm ${isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                  }`}
              >
                <option value="all">All Status</option>
                <option value="true">Accepted</option>
                <option value="false">Rejected</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <StudentTable
            isDarkMode={isDarkMode}
            searchTerm={searchTerm}
            filter={filter}
            yearFilter={yearFilter}
            departmentFilter={departmentFilter}
            students={students}
            onApprove={handleApproveClick}
            onReject={handleRejectClick}
            onEdit={handleEdit}
            onRefresh={fetchStudents}
            // Server-side props
            isServerSide={true}
            currentPage={page}
            hasMore={hasMore}
            onPageChange={handlePageChange}
          />
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      {showConfirmDialog && studentToApprove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-2xl shadow-xl max-w-md w-full mx-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Approve Student
              </h3>
              <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Are you sure you want to approve <span className="font-semibold">{studentToApprove.name}</span>?
                <br />
                Registration: <span className="font-mono">{studentToApprove.registration_number}</span>
              </p>
              <div className="flex space-x-3">
                <Button
                  onClick={handleCancelApprove}
                  variant="outline"
                  isDarkMode={isDarkMode}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmApprove}
                  variant="primary"
                  isDarkMode={isDarkMode}
                  className="flex-1"
                >
                  Approve
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Dialog */}
      {showRejectDialog && studentToReject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-2xl shadow-xl max-w-lg w-full mx-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Reject Student
              </h3>
              <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Are you sure you want to reject <span className="font-semibold">{studentToReject.name}</span>?
                <br />
                Registration: <span className="font-mono">{studentToReject.registration_number}</span>
              </p>
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a reason for rejection..."
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md text-sm ${isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  required
                />
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={handleCancelReject}
                  variant="outline"
                  isDarkMode={isDarkMode}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmReject}
                  variant="danger"
                  isDarkMode={isDarkMode}
                  className="flex-1"
                >
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-2xl shadow-xl max-w-md w-full mx-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Success!
              </h3>
              <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {successMessage}
              </p>
              <Button
                onClick={() => setShowSuccessModal(false)}
                variant="primary"
                isDarkMode={isDarkMode}
                className="w-full"
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && studentToEdit && (
        <EditStudentModal
          isDarkMode={isDarkMode}
          student={studentToEdit}
          onSave={handleEditSubmit}
          onCancel={handleEditCancel}
        />
      )}
    </div>
  );
};

export default Students;