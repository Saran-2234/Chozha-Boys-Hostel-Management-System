import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../Common/Card';
import Button from '../Common/Button';
import StudentTable from './StudentTable';

const Students = ({ isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [studentToApprove, setStudentToApprove] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get the token from localStorage
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('No authentication token found. Please log in again.');
      }

      console.log('Attempting to fetch students from API...');
      
      // Use the new API endpoint
      const response = await fetch('https://finalbackend-mauve.vercel.app/fetchstudents/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });

      console.log('API response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('API endpoint not found. Please check if the backend is properly deployed.');
        } else if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access forbidden. You may not have permission to view students.');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const data = await response.json();
      console.log('API response data:', data);
      
      // Check if the expected data structure exists
      // The API returns { data: [], success: true }
      if (data.success && Array.isArray(data.data)) {
        setStudents(data.data);
      } else if (Array.isArray(data)) {
        setStudents(data);
      } else if (data.students) {
        setStudents(data.students);
      } else if (data.studentsdata) {
        setStudents(data.studentsdata);
      } else {
        console.warn('Unexpected API response structure:', data);
        // Fallback to mock data
        setStudents([
          { 
            id: 14, 
            name: 'mega', 
            email: 'benmega500@gmail.com', 
            room_number: '130', 
            status: 'inactive', 
            registration_number: 'REG030',
            department: 'Computer Science',
            academic_year: '2023-24',
            created_at: '2024-01-15'
          },
          { 
            id: 15, 
            name: 'SARAN S', 
            email: '9788saran@gmail.com', 
            room_number: '410', 
            status: 'pending', 
            registration_number: '822722104045',
            department: 'Electrical Engineering',
            academic_year: '2023-24',
            created_at: '2024-01-16'
          }
        ]);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(err.message);
      // Fallback to mock data if API fails
      setStudents([
        { 
          id: 14, 
          name: 'mega', 
          email: 'benmega500@gmail.com', 
          room_number: '130', 
          status: 'inactive', 
          registration_number: 'REG030',
          department: 'Computer Science',
          academic_year: '2023-24',
          created_at: '2024-01-15'
        },
        { 
          id: 15, 
          name: 'SARAN S', 
          email: '9788saran@gmail.com', 
          room_number: '410', 
          status: 'pending', 
          registration_number: '822722104045',
          department: 'Electrical Engineering',
          academic_year: '2023-24',
          created_at: '2024-01-16'
        }
      ]);
    } finally {
      setLoading(false);
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
      const authToken = localStorage.getItem('authToken');

      console.log('Approving student:', studentToApprove.name, 'with registration number:', studentToApprove.registration_number);

      const response = await fetch('https://finalbackend-796l.vercel.app/approve/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          registerno: studentToApprove.registration_number
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to approve student: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log('Approval response:', responseData);

      // Update local state
      setStudents(students.map(student =>
        student.id === studentId
          ? { ...student, status: 'active' }
          : student
      ));

      setSuccessMessage(`Student ${studentToApprove.name} has been approved successfully!`);
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

  const handleRejectStudent = async (studentId) => {
    try {
      const authToken = localStorage.getItem('authToken');
      
      const response = await fetch(`https://finalbackend-mauve.vercel.app/admin/students/${studentId}/reject`, {
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
            <div>
              <h3 className="text-lg font-semibold">All Students ({students.length})</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage student information and approval status
              </p>
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`px-3 py-2 border rounded-md text-sm ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={`px-3 py-2 border rounded-md text-sm ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">All Students</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="rejected">Rejected</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <StudentTable
            isDarkMode={isDarkMode}
            searchTerm={searchTerm}
            filter={filter}
            students={students}
            onApprove={handleApproveClick}
            onReject={handleRejectStudent}
            onRefresh={fetchStudents}
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
    </div>
  );
};

export default Students;