import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardContent } from '../Common/Card';
import Button from '../Common/Button';
import BillTable from './BillTable';
import { fetchDepartments } from '../../registration/api';

const API_BASE_URL = 'https://finalbackend1.vercel.app';

const MessBillsManagement = ({
  isDarkMode,
  messFeePerDay,
  vegFeePerDay,
  nonVegFeePerDay,
  calculated,
  handleBulkSendYearDept,
  handleSendAll,
  handleDownloadExcel,
  setActiveSection,
  selectedMonthData,
}) => {
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [monthYear, setMonthYear] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [department, setDepartment] = useState('');
  const [departments, setDepartments] = useState([]);

  const inputClass = `w-full rounded-md border px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${
    isDarkMode
      ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
  }`;

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const depts = await fetchDepartments();
      setDepartments(depts || []);
    } catch (err) {
      console.error('Error loading departments:', err);
    }
  };

  const fetchStudentsMessBills = async () => {
    if (!monthYear || !department || !academicYear) {
      setError('Please select month_year, department, and academic_year to fetch bills.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_BASE_URL}/fetchstudentsmessbill`, {
        month_year: monthYear,
        department: department,
        academic_year: academicYear,
      }, {
        withCredentials: true,
      });

      if (response.data && response.data.data) {
        setStudentsData(response.data.data);
      } else {
        setStudentsData([]);
        setError('No records found for the given filters.');
      }
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to fetch mess bills';
      setError(message);
      setStudentsData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setMonthYear('');
    setAcademicYear('');
    setDepartment('');
    setStudentsData([]);
    setError('');
  };

  const handleBulkShowHide = async (show) => {
    if (!monthYear || !department || !academicYear) {
      setError('Please select month_year, department, and academic_year to update bills.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_BASE_URL}/bulkshowmessbill`, {
        month_year: monthYear,
        year: parseInt(academicYear),
        department: department,
        show: show
      }, {
        withCredentials: true,
      });

      alert(response.data.message);
      // Optionally refetch data to reflect changes
      fetchStudentsMessBills();
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to update show flag';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="space-y-6" isDarkMode={isDarkMode}>
      <CardHeader>
        <div className="space-y-2 text-left">
          <h2 className="text-xl font-semibold">Mess Bills Management</h2>
          <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
            Filter bills department-wise or per academic year, apply manual reductions, and dispatch bills to
            students.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="rounded-2xl border p-6 shadow-lg">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold">Fetch Students Mess Bills</h3>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Select filters to fetch mess bill data from the API.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleResetFilters}
                variant="outline"
                isDarkMode={isDarkMode}
              >
                Reset All
              </Button>
              <Button
                onClick={() => setActiveSection('createCalculation')}
                variant="primary"
                isDarkMode={isDarkMode}
              >
                Update Monthly Inputs
              </Button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Month Year</label>
              <select
                value={monthYear}
                onChange={(e) => setMonthYear(e.target.value)}
                className={inputClass}
              >
                <option value="">Select Month Year</option>
                {selectedMonthData ? (
                  <option value={selectedMonthData.month_year}>{selectedMonthData.month_year}</option>
                ) : (
                  <>
                    <option value="October 2025">October 2025</option>
                    <option value="November 2025">November 2025</option>
                    <option value="December 2025">December 2025</option>
                  </>
                )}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className={inputClass}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.department_id} value={dept.department}>
                    {dept.department}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Academic Year</label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className={inputClass}
              >
                <option value="">Select Academic Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fetch Bills</label>
              <Button
                onClick={fetchStudentsMessBills}
                variant="primary"
                isDarkMode={isDarkMode}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Fetching...' : 'Fetch Bills'}
              </Button>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}
        </div>

        

        <div className="rounded-2xl border p-6 shadow-lg">
          <div className="flex flex-col gap-4 border-b pb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold">Filtered Results</h3>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Showing {studentsData.length} students
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => handleBulkShowHide(true)}
                variant="primary"
                isDarkMode={isDarkMode}
                disabled={studentsData.length === 0}
              >
                Show Bills
              </Button>
              <Button
                onClick={() => handleBulkShowHide(false)}
                variant="outline"
                isDarkMode={isDarkMode}
                disabled={studentsData.length === 0}
              >
                Hide Bills
              </Button>
              <Button
                onClick={handleBulkSendYearDept}
                variant="primary"
                isDarkMode={isDarkMode}
                disabled={studentsData.length === 0}
              >
                Send to Filtered Group
              </Button>
              <Button onClick={handleSendAll} variant="outline" isDarkMode={isDarkMode}>
                Send to All Students
              </Button>
              <Button onClick={handleDownloadExcel} variant="outline" isDarkMode={isDarkMode}>
                Export to CSV
              </Button>
            </div>
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="text-center py-8">
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Loading students data...
                </p>
              </div>
            ) : studentsData.length > 0 ? (
              <BillTable
                isDarkMode={isDarkMode}
                students={studentsData}
                vegFeePerDay={vegFeePerDay}
                nonVegFeePerDay={nonVegFeePerDay}
                messFeePerDay={messFeePerDay}
              />
            ) : (
              <div className="text-center py-8">
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  No students data available. Please fetch bills using the filters above.
                </p>
              </div>
            )}
          </div>
        </div>

        {calculated && (
          <div className="rounded-2xl border p-6 text-center shadow-lg">
            <h3 className="text-lg font-semibold">Bulk Actions</h3>
            <p className={`mt-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              The monthly calculation is confirmed. You can now dispatch bills to students.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button onClick={handleBulkSendYearDept} variant="primary" isDarkMode={isDarkMode}>
                Send Bills to Filtered Students
              </Button>
              <Button onClick={handleSendAll} variant="outline" isDarkMode={isDarkMode}>
                Send Bills to Everyone
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MessBillsManagement;
