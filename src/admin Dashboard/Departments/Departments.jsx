import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../Common/Card';
import Button from '../Common/Button';
import DepartmentTable from './DepartmentTable';
import { addDepartment, fetchDepartments } from '../../registration/api';

const Departments = ({ isDarkMode }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departmentName, setDepartmentName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchDepartmentsData();
  }, []);

  const fetchDepartmentsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDepartments();
      setDepartments(data);
    } catch (err) {
      console.error('Error fetching departments:', err);
      setError(err.message);
      // Fallback to empty array
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!departmentName.trim()) {
      alert('Department name is required');
      return;
    }

    setSubmitting(true);
    try {
      const response = await addDepartment(departmentName.trim());
      console.log('Add department response:', response);

      // Add the new department to the list
      if (response.department) {
        setDepartments([...departments, response.department]);
      }

      setSuccessMessage(response.message || 'Department added successfully!');
      setShowSuccessModal(true);
      setDepartmentName('');
    } catch (err) {
      console.error('Error adding department:', err);
      alert(`Failed to add department: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Loading departments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Department Management
        </h2>
      </div>

      {error && (
        <div className={`p-4 rounded-md ${isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'}`}>
          <p>Error: {error}</p>
          <Button
            onClick={fetchDepartmentsData}
            variant="outline"
            isDarkMode={isDarkMode}
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Add Department Form */}
      <Card isDarkMode={isDarkMode}>
        <CardHeader>
          <h3 className="text-lg font-semibold">Add New Department</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Enter the department name to add it to the system.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddDepartment} className="space-y-4">
            <div>
              <label
                htmlFor="departmentName"
                className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Department Name
              </label>
              <input
                type="text"
                id="departmentName"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                placeholder="Enter department name"
                className={`w-full px-3 py-2 border rounded-md ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                required
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              isDarkMode={isDarkMode}
              disabled={submitting}
            >
              {submitting ? 'Adding...' : 'Add Department'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Departments List */}
      <Card isDarkMode={isDarkMode}>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold">All Departments ({departments.length})</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage department information
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DepartmentTable
            isDarkMode={isDarkMode}
            departments={departments}
            onRefresh={fetchDepartmentsData}
          />
        </CardContent>
      </Card>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
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

export default Departments;
