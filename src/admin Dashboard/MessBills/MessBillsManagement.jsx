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
  reductionMode = false,
  onApplyReductions,
  isReductionStep = false,
  isFinalStep = false,
}) => {
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [monthYear, setMonthYear] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [department, setDepartment] = useState('');
  const [departments, setDepartments] = useState([]);
  const [approvedReductions, setApprovedReductions] = useState([]);
  const [reductionDays, setReductionDays] = useState({});
  const [selectedStudentsForReduction, setSelectedStudentsForReduction] = useState({});
  const [totalReductionDays, setTotalReductionDays] = useState(0);
  const [remainingReductionDays, setRemainingReductionDays] = useState(0);
  const [savingReductions, setSavingReductions] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [verifiedStudents, setVerifiedStudents] = useState([]);
  const [availableMonthYears, setAvailableMonthYears] = useState([]);

  const getDaysInMonth = (monthYear) => {
    if (!monthYear) return 30;
    const [month, year] = monthYear.split(' ');
    const monthNames = {
      'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
      'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
    };
    const monthIndex = monthNames[month];
    if (monthIndex === undefined) return 30;
    return new Date(parseInt(year), monthIndex + 1, 0).getDate();
  };

  const inputClass = `w-full rounded-md border px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${
    isDarkMode
      ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
  }`;

  useEffect(() => {
    loadDepartments();
    loadAvailableMonthYears();
    if (reductionMode || isReductionStep) {
      loadApprovedReductions();
    }
  }, [reductionMode, isReductionStep, selectedMonthData, department, academicYear]);

  useEffect(() => {
    if (approvedReductions.length > 0) {
      const total = approvedReductions.reduce((sum, app) => {
        const fromDate = new Date(app.fromDate);
        const toDate = new Date(app.toDate);
        const days = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;
        return sum + days;
      }, 0);
      setTotalReductionDays(total);
      const used = Object.values(reductionDays).reduce((sum, days) => sum + (days || 0), 0);
      setRemainingReductionDays(total - used);
    }
  }, [approvedReductions, reductionDays]);

  const loadDepartments = async () => {
    try {
      const depts = await fetchDepartments();
      setDepartments(depts || []);
    } catch (err) {
      console.error('Error loading departments:', err);
    }
  };

  const loadAvailableMonthYears = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/show`, {}, {
        withCredentials: true,
      });
      if (response.data && response.data.data) {
        const monthYears = response.data.data.map(item => item.month_year);
        setAvailableMonthYears([...new Set(monthYears)]); // Remove duplicates
      }
    } catch (error) {
      console.error('Error loading available month years:', error);
      // Fallback to default options
      setAvailableMonthYears(['October 2025', 'November 2025', 'December 2025']);
    }
  };

  const loadApprovedReductions = async () => {
    try {
      // First try to load from database
      const response = await axios.post(`${API_BASE_URL}/get-student-reductions`, {
        month_year: selectedMonthData?.month_year,
        department: department,
        academic_year: academicYear
      }, {
        withCredentials: true,
      });

      if (response.data && response.data.data) {
        const dbReductions = response.data.data;
        setApprovedReductions(dbReductions);

        // Initialize reductionDays from database
        const initialReductionDays = {};
        dbReductions.forEach(reduction => {
          initialReductionDays[reduction.student_id] = reduction.reduction_days || 0;
        });
        setReductionDays(initialReductionDays);
      } else {
        // Fallback to localStorage if no database data
        const storedApps = JSON.parse(localStorage.getItem('reductionApplications') || '[]');
        const approved = storedApps.filter(app => app.status === 'approved');
        setApprovedReductions(approved);

        // Initialize reductionDays based on approved reductions
        const initialReductionDays = {};
        approved.forEach(app => {
          const fromDate = new Date(app.fromDate);
          const toDate = new Date(app.toDate);
          const days = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1; // inclusive
          initialReductionDays[app.studentId] = days;
        });
        setReductionDays(initialReductionDays);
      }
    } catch (error) {
      console.error('Error loading reductions:', error);
      // Fallback to localStorage
      const storedApps = JSON.parse(localStorage.getItem('reductionApplications') || '[]');
      const approved = storedApps.filter(app => app.status === 'approved');
      setApprovedReductions(approved);

      const initialReductionDays = {};
      approved.forEach(app => {
        const fromDate = new Date(app.fromDate);
        const toDate = new Date(app.toDate);
        const days = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;
        initialReductionDays[app.studentId] = days;
      });
      setReductionDays(initialReductionDays);
    }
  };

  const saveStudentReductions = async () => {
    if (Object.keys(reductionDays).length === 0) {
      alert('No reduction days to save.');
      return;
    }

    setSavingReductions(true);
    try {
      // Save to localStorage (temporary until backend API is ready)
      const existingReductions = JSON.parse(localStorage.getItem('appliedReductions') || '[]');
      const reductionsToSave = Object.entries(reductionDays).map(([studentId, days]) => ({
        student_id: parseInt(studentId),
        reduction_days: days,
        month_year: monthYear,
        department: department,
        academic_year: academicYear,
        student_name: studentsData.find(s => s.student_id === parseInt(studentId))?.student_name,
        timestamp: new Date().toISOString()
      }));

      // Remove existing reductions for these students in this month
      const filteredReductions = existingReductions.filter(r =>
        !(r.student_id === parseInt(studentId) && r.month_year === monthYear)
      );

      // Add new reductions
      const updatedReductions = [...filteredReductions, ...reductionsToSave];
      localStorage.setItem('appliedReductions', JSON.stringify(updatedReductions));

      alert('Reductions saved successfully!');
      setReductionDays({});
      setSelectedStudentsForReduction({});
      fetchStudentsForReductions(); // Refresh the data
    } catch (error) {
      alert('Failed to save reductions');
    } finally {
      setSavingReductions(false);
    }
  };

  const fetchStudentsForReductions = async () => {
    if (!monthYear || !department || !academicYear) {
      setError('Please select month_year, department, and academic_year to fetch students.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Fetch all students for the selected filters (no reduction filtering needed)
      const response = await axios.post(`${API_BASE_URL}/fetchstudentsmessbill`, {
        month_year: monthYear,
        department: department,
        academic_year: academicYear,
      }, {
        withCredentials: true,
      });

      if (response.data && response.data.data) {
        let data = response.data.data;
        // Add reduction_days from localStorage for each student
        const appliedReductions = JSON.parse(localStorage.getItem('appliedReductions') || '[]');
        data = data.map(student => {
          const reduction = appliedReductions.find(r => r.student_id === student.student_id && r.month_year === monthYear);
          return {
            ...student,
            reduction_days: reduction ? reduction.reduction_days : 0
          };
        });
        setStudentsData(data);
      } else {
        setStudentsData([]);
        setError('No students found for the given filters.');
      }
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to fetch students for reductions';
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
          <h2 className="text-xl font-semibold">
            {isReductionStep ? 'Apply Reductions' : 'Mess Bills Management'}
          </h2>
          <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
            {isReductionStep
              ? 'Select students who have applied for mess bill reductions and set their reduction days.'
              : 'Filter bills department-wise or per academic year, apply manual reductions, and dispatch bills to students.'
            }
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="rounded-2xl border p-6 shadow-lg">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold">Fetch Students for Reductions</h3>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Select filters to fetch students who have applied for mess bill reductions.
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
                {availableMonthYears.map((monthYearOption) => (
                  <option key={monthYearOption} value={monthYearOption}>
                    {monthYearOption}
                  </option>
                ))}
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
                onClick={fetchStudentsForReductions}
                variant="primary"
                isDarkMode={isDarkMode}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Fetching...' : 'Fetch Students'}
              </Button>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}
        </div>



        {(reductionMode || isReductionStep) && (
          <div className="rounded-2xl border p-6 shadow-lg">
            <div className="flex flex-col gap-4 border-b pb-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold">Apply Reductions</h3>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Search for students, enter their reduction days, and update the changes.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className={`w-48 px-3 py-2 border rounded text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                  />
                </div>
                <Button
                  onClick={saveStudentReductions}
                  variant="primary"
                  isDarkMode={isDarkMode}
                  disabled={savingReductions}
                >
                  {savingReductions ? 'Saving...' : 'Save All Reductions'}
                </Button>
              </div>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Student Name
                    </th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Reduction Days
                    </th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                  {studentsData
                    .filter(student =>
                      student.student_name?.toLowerCase().includes(studentSearch.toLowerCase())
                    )
                    .map((student) => (
                    <tr key={student.student_id} className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                      <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {student.student_name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          value={reductionDays[student.student_id] || student.reduction_days || 0}
                          onChange={(e) => {
                            const newDays = parseInt(e.target.value) || 0;
                            setReductionDays(prev => ({
                              ...prev,
                              [student.student_id]: newDays
                            }));
                          }}
                          className={`w-20 px-2 py-1 border rounded text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                          min="0"
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <Button
                          onClick={async () => {
                            try {
                              // Save individual reduction to localStorage
                              const existingReductions = JSON.parse(localStorage.getItem('appliedReductions') || '[]');
                              const reductionToSave = {
                                student_id: student.student_id,
                                reduction_days: reductionDays[student.student_id] || student.reduction_days || 0,
                                month_year: monthYear,
                                department: department,
                                academic_year: academicYear,
                                student_name: student.student_name,
                                timestamp: new Date().toISOString()
                              };

                              // Remove existing reduction for this student in this month
                              const filteredReductions = existingReductions.filter(r =>
                                !(r.student_id === student.student_id && r.month_year === monthYear)
                              );

                              // Add new reduction
                              const updatedReductions = [...filteredReductions, reductionToSave];
                              localStorage.setItem('appliedReductions', JSON.stringify(updatedReductions));

                              alert('Reduction days updated successfully!');
                              fetchStudentsForReductions(); // Refresh the data
                            } catch (error) {
                              alert('Failed to update reduction days');
                            }
                          }}
                          variant="primary"
                          size="small"
                          isDarkMode={isDarkMode}
                        >
                          Update
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}



        

        {isFinalStep && (
          <div className="rounded-2xl border p-6 shadow-lg">
            <div className="flex flex-col gap-4 border-b pb-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold">Send Bill to Students</h3>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Review student bills, verify calculations, and send bills to all verified students.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={fetchStudentsForReductions}
                  variant="outline"
                  isDarkMode={isDarkMode}
                  disabled={loading}
                >
                  {loading ? 'Fetching...' : 'Refresh Students'}
                </Button>
                <Button
                  onClick={async () => {
                    if (verifiedStudents.length === 0) {
                      alert('No students have been verified yet.');
                      return;
                    }
                    try {
                      const response = await axios.post(`${API_BASE_URL}/send-mess-bills`, {
                        month_year: monthYear,
                        department: department,
                        academic_year: academicYear,
                        student_ids: verifiedStudents
                      }, {
                        withCredentials: true,
                      });
                      alert(response.data.message || 'Bills sent successfully to all verified students!');
                      setVerifiedStudents([]);
                      fetchStudentsForReductions(); // Refresh the data
                    } catch (error) {
                      const message = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to send bills';
                      alert(message);
                    }
                  }}
                  variant="primary"
                  isDarkMode={isDarkMode}
                  disabled={verifiedStudents.length === 0}
                >
                  Send Bills to Verified Students ({verifiedStudents.length})
                </Button>
              </div>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Student Name</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Days in Month</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Reduction Applied</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Mess Charges</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Veg Charges</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Non-Veg Charges</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Total</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Action</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                  {studentsData.map((student) => {
                    const daysInMonth = getDaysInMonth ? getDaysInMonth(selectedMonthData?.month_year?.split('-')[0] || '', selectedMonthData?.month_year?.split('-')[1] || '') : 30;
                    const reductionDays = student.reduction_days || 0;
                    const effectiveDays = daysInMonth - reductionDays;
                    const messCharges = effectiveDays * (messFeePerDay || 0);
                    const vegCharges = (student.veg_days || 0) * (vegFeePerDay || 0);
                    const nonVegCharges = (student.nonveg_days || 0) * (nonVegFeePerDay || 0);
                    const total = messCharges + vegCharges + nonVegCharges;
                    const isVerified = verifiedStudents.includes(student.student_id);

                    return (
                      <tr key={student.student_id} className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                        <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {student.student_name}
                        </td>
                        <td className={`px-4 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          {daysInMonth}
                        </td>
                        <td className={`px-4 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          {reductionDays > 0 ? `Yes (${reductionDays} days)` : 'No'}
                        </td>
                        <td className={`px-4 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          ₹{messCharges.toFixed(2)}
                        </td>
                        <td className={`px-4 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          ₹{vegCharges.toFixed(2)}
                        </td>
                        <td className={`px-4 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          ₹{nonVegCharges.toFixed(2)}
                        </td>
                        <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          ₹{total.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          {isVerified ? (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                            }`}>
                              Verified
                            </span>
                          ) : (
                            <Button
                              onClick={() => {
                                setVerifiedStudents(prev => [...prev, student.student_id]);
                              }}
                              variant="primary"
                              size="small"
                              isDarkMode={isDarkMode}
                            >
                              Verify
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {isFinalStep && (
          <div className="rounded-2xl border p-6 shadow-lg">
            <div className="flex flex-col gap-4 border-b pb-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold">Mess Bill Payment Status</h3>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  View payment status of sent mess bills with filtering options.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <input
                  type="text"
                  placeholder="Search by student name..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className={`w-48 px-3 py-2 border rounded text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                />
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className={`w-32 px-3 py-2 border rounded text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  <option value="">All Depts</option>
                  {departments.map((dept) => (
                    <option key={dept.department_id} value={dept.department}>
                      {dept.department}
                    </option>
                  ))}
                </select>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className={`w-32 px-3 py-2 border rounded text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  <option value="">All Years</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Student Name</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Department</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Year</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Mess Bill Amount</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Status</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                  {studentsData
                    .filter(student =>
                      student.student_name?.toLowerCase().includes(studentSearch.toLowerCase()) &&
                      (!department || student.department === department) &&
                      (!academicYear || student.year?.toString() === academicYear)
                    )
                    .map((student) => {
                      const daysInMonth = getDaysInMonth ? getDaysInMonth(selectedMonthData?.month_year?.split('-')[0] || '', selectedMonthData?.month_year?.split('-')[1] || '') : 30;
                      const reductionDays = student.reduction_days || 0;
                      const effectiveDays = daysInMonth - reductionDays;
                      const messCharges = effectiveDays * (messFeePerDay || 0);
                      const vegCharges = (student.veg_days || 0) * (vegFeePerDay || 0);
                      const nonVegCharges = (student.nonveg_days || 0) * (nonVegFeePerDay || 0);
                      const total = messCharges + vegCharges + nonVegCharges;
                      const isPaid = student.payment_status === 'paid'; // Assuming this field exists

                      return (
                        <tr key={student.student_id} className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                          <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {student.student_name}
                          </td>
                          <td className={`px-4 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                            {student.department}
                          </td>
                          <td className={`px-4 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                            {student.year}
                          </td>
                          <td className={`px-4 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                            ₹{total.toFixed(2)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              isPaid
                                ? (isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800')
                                : (isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800')
                            }`}>
                              {isPaid ? 'Paid' : 'Not Paid'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

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
