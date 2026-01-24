import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import MainContent from '../Header/MainContent';

const MessBillsIndividualList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [month, setMonth] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedMonthYear, setSelectedMonthYear] = useState('');
  const [selectedDepartmentText, setSelectedDepartmentText] = useState('');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resultsVisible, setResultsVisible] = useState(false);
  const [bills, setBills] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusData, setStatusData] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [departments, setDepartments] = useState([]);
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    let currentMonth = null;
    if (location.state && location.state.month) {
      currentMonth = location.state.month;
      setMonth(currentMonth);
    } else {
      const monthData = sessionStorage.getItem('monthData');
      if (monthData) {
        currentMonth = JSON.parse(monthData);
        setMonth(currentMonth);
      }
    }

    if (currentMonth && currentMonth.title) {
      // currentMonth.title is expected to be in "MM-YYYY" format
      const parts = currentMonth.title.split('-');
      if (parts.length === 2) {
        const [mm, yyyy] = parts;
        setSelectedMonthYear(`${yyyy}-${mm}`);
      }
    }

    fetchDepartments();
  }, [location.state]);

  useEffect(() => {
    if (showStatusModal && statusData.length === 0) {
      fetchStatusData();
    }
  }, [showStatusModal]);

  const fetchStatusData = async () => {
    setLoadingStatus(true);
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    try {
      // Fetch departments
      const deptResponse = await fetch('https://finalbackend1.vercel.app/students/fetchdepartments');
      const deptData = await deptResponse.json();

      if (!deptData.success || !deptData.departments) {
        throw new Error('Failed to fetch departments');
      }

      // For each department, check verification status for each year
      const statusPromises = deptData.departments.map(async (dept) => {
        const yearStatuses = {};

        // Check for each year (1st, 2nd, 3rd, 4th)
        for (let year = 1; year <= 4; year++) {
          try {
            // This is a simplified check - in reality you'd need an API endpoint
            // that checks if there are verified bills for this department and year
            const response = await fetch('https://finalbackend1.vercel.app/admin/check-verification-status', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
              },
              body: JSON.stringify({
                department: dept.department,
                year: year
              })
            });

            if (response.ok) {
              const data = await response.json();
              yearStatuses[`${year}st year`] = data.verified ? '✓' : '✗';
            } else {
              yearStatuses[`${year}st year`] = '✗';
            }
          } catch (error) {
            yearStatuses[`${year}st year`] = '✗';
          }
        }

        return {
          department: dept.department,
          ...yearStatuses
        };
      });

      const statusResults = await Promise.all(statusPromises);
      setStatusData(statusResults);
    } catch (error) {
      console.error('Error fetching status data:', error);
      // Create status data for all available departments with default values
      const defaultStatusData = departments.map(dept => ({
        department: dept.department,
        '1st year': '✗',
        '2nd year': '✗',
        '3rd year': '✗',
        '4th year': '✗'
      }));
      setStatusData(defaultStatusData);
    } finally {
      setLoadingStatus(false);
    }
  };



  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    document.cookie = 'token=; path=/; max-age=0';
    window.location.href = '/';
  };

  const handleBack = () => {
    navigate('/mess-bills-detail');
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch('https://finalbackend1.vercel.app/students/fetchdepartments');
      const data = await response.json();
      if (data.success && Array.isArray(data.result)) {
        setDepartments(data.result);
      } else {
        console.error('Failed to fetch departments');
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleViewStudentBill = (student) => {
    // For now, just log or navigate to individual bill if needed
    console.log('View bill for student:', student);
    // You can navigate to MessBillIndividual if required, passing student data
  };

  const handleVerifyBill = (student) => {
    // For now, just log the verification action
    console.log('Verifying bill for student:', student);
    // You can implement actual verification logic here
  };

  const handleDownloadBill = (student) => {
    // For now, just log the download action
    console.log('Downloading bill for student:', student);
    // You can implement actual download logic here
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    setSelectedStudents(bills.map(student => student.id));
  };

  const handleDeselectAll = () => {
    setSelectedStudents([]);
  };

  const handleSelectUnselected = () => {
    const allIds = bills.map(student => student.id);
    setSelectedStudents(allIds.filter(id => !selectedStudents.includes(id)));
  };

  const handleSendBillToAll = () => {
    const studentsToSend = selectedStudents.length > 0
      ? bills.filter(student => selectedStudents.includes(student.id))
      : bills;
    // For now, just log the send action
    console.log('Sending bill to selected/all students:', studentsToSend);
    // You can implement actual send logic here, e.g., API call to send bills
  };

  const handleEditStudent = (studentId) => {
    setBills(bills.map(student =>
      student.id === studentId
        ? { ...student, isEditing: true }
        : student
    ));
  };

  const handleSaveStudent = (studentId) => {
    setBills(bills.map(student =>
      student.id === studentId
        ? { ...student, isEditing: false }
        : student
    ));
    // Here you can add API call to save the changes
  };

  const handleCancelEdit = (studentId) => {
    setBills(bills.map(student =>
      student.id === studentId
        ? { ...student, isEditing: false }
        : student
    ));
    // Reset to original values if needed
  };

  const handleDaysPresentChange = (studentId, value) => {
    const days = Math.max(0, Math.min(31, parseInt(value) || 0)); // Ensure value is between 0 and 31

    const updateStudent = (student) => {
      if (student.id === studentId) {
        // Recalculate extra charges based on current meal type
        const extraCharges = student.isveg
          ? (student.vegDays * student.vegExtraPerDay)
          : (student.nonVegDays * student.nonVegExtraPerDay);
        const newTotalAmount = (days * student.mealRate) + extraCharges;
        return {
          ...student,
          daysPresent: days,
          extraCharges,
          totalAmount: newTotalAmount
        };
      }
      return student;
    };

    setBills(prev => prev.map(updateStudent));
  };

  const handleMealTypeChange = (studentId, value) => {
    const isveg = value === 'Veg';
    const updateStudent = (student) => {
      if (student.id === studentId) {
        const vegDays = isveg ? student.vegDays : 0;
        const nonVegDays = !isveg ? student.nonVegDays : 0;
        const extraCharges = isveg
          ? (vegDays * student.vegExtraPerDay)
          : (nonVegDays * student.nonVegExtraPerDay);
        const newTotalAmount = (student.daysPresent * student.mealRate) + extraCharges;
        return {
          ...student,
          isveg,
          vegDays,
          nonVegDays,
          extraCharges,
          totalAmount: newTotalAmount
        };
      }
      return student;
    };

    setBills(bills.map(updateStudent));
  };

  const handleVegDaysChange = (studentId, value) => {
    const vegDays = Math.max(0, parseInt(value) || 0);
    const updateStudent = (student) => {
      if (student.id === studentId) {
        const extraCharges = vegDays * student.vegExtraPerDay;
        const newTotalAmount = (student.daysPresent * student.mealRate) + extraCharges;
        return { ...student, vegDays, extraCharges, totalAmount: newTotalAmount };
      }
      return student;
    };

    setBills(bills.map(updateStudent));
  };

  const handleNonVegDaysChange = (studentId, value) => {
    const nonVegDays = Math.max(0, parseInt(value) || 0);
    const updateStudent = (student) => {
      if (student.id === studentId) {
        const extraCharges = nonVegDays * student.nonVegExtraPerDay;
        const newTotalAmount = (student.daysPresent * student.mealRate) + extraCharges;
        return { ...student, nonVegDays, extraCharges, totalAmount: newTotalAmount };
      }
      return student;
    };

    setBills(bills.map(updateStudent));
  };

  const handleVerifiedChange = (studentId, value) => {
    const verified = value === 'true';
    const status = verified ? 'Verified' : 'Pending Verification';
    const updateStudent = (student) =>
      student.id === studentId
        ? { ...student, status }
        : student;

    setBills(bills.map(updateStudent));
  };

  const handleUpdateStudent = async (student) => {
    try {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      const body = {
        id: student.id,
        number_of_days: student.daysPresent,
        verified: student.status === 'Verified',
        isveg: student.isveg,
        veg_days: student.isveg ? student.vegDays : 0,
        non_veg_days: !student.isveg ? student.nonVegDays : 0,
      };

      const response = await fetch('https://finalbackend1.vercel.app/admin/upadatemessbill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (response.ok) {
        alert('✅ ' + result.message);
      } else {
        alert('❌ ' + (result.error || 'Update failed'));
      }
    } catch (err) {
      alert('❌ Network or server error during update');
      console.error(err);
    }
  };

  const fetchBillsData = async (page = 1, limit = 10) => {
    setLoading(true);
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    setError('');
    setSuccess('');
    setSelectedStudents([]);
    // Do not reset bills here if we want to show loading state while keeping old data, 
    // but typically we clear or show loading overlay. Validated by loading state.

    if (!selectedMonthYear || !selectedDepartmentText || !selectedAcademicYear) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const [year, month] = selectedMonthYear.split('-');
      const formattedMonthYear = `${month}-${year}`;

      const payload = {
        month_year: formattedMonthYear,
        department: selectedDepartmentText,
        academic_year: selectedAcademicYear,
        page: page,
        limit: limit
      };

      const response = await fetch('https://finalbackend1.vercel.app/admin/fetchstudentsmessbillnew', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        // If 404, it might just mean no records for this page, or total
        if (response.status === 404) {
          setBills([]);
          setTotalRecords(0);
          setTotalPages(0);
          setResultsVisible(true); // Still show the container to show "0 results"
          setError(errorData.message || 'No records found');
          setLoading(false);
          return;
        }
        throw new Error(errorData.error || 'Failed to fetch bills');
      }

      const data = await response.json();

      setTotalRecords(data.total || 0);
      setTotalPages(data.totalPages || 0);
      setCurrentPage(data.page || 1);

      if (!data.data || data.data.length === 0) {
        setError(data.message || 'No records found for the given filters');
        setBills([]);
        setResultsVisible(true);
        setLoading(false);
        return;
      }

      const transformedData = data.data.map(student => ({
        id: student.mess_bill_id,
        name: student.student_name || '',
        room: student.registration_number || '',
        status: student.verified ? 'Verified' : 'Pending Verification',
        daysPresent: parseInt(student.effective_number_of_days) || 0,
        mealRate: parseFloat(student.mess_fee_per_day) || 0,
        vegExtraPerDay: parseFloat(student.veg_extra_per_day) || 0,
        nonVegExtraPerDay: parseFloat(student.nonveg_extra_per_day) || 0,
        extraCharges: student.isveg
          ? ((parseInt(student.veg_days) || 0) * (parseFloat(student.veg_extra_per_day) || 0))
          : ((parseInt(student.non_veg_days) || 0) * (parseFloat(student.nonveg_extra_per_day) || 0)),
        totalAmount: parseFloat(student.total_amount) || 0,
        isEditing: false,
        messStatus: student.ispaid ? 'PAID' : (student.payment_status || 'UNPAID'),
        isveg: Boolean(student.isveg),
        vegDays: parseInt(student.veg_days) || 0,
        nonVegDays: parseInt(student.non_veg_days) || 0
      }));

      setBills(transformedData);
      setResultsVisible(true);
      setSuccess('Bills fetched successfully');
    } catch (err) {
      setError(err.message || 'An error occurred while fetching bills');
      setResultsVisible(false);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchBills = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to page 1 for new filter search
    fetchBillsData(1, itemsPerPage);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchBillsData(newPage, itemsPerPage);
    }
  };

  const handleItemsPerPageChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setItemsPerPage(newLimit);
    setCurrentPage(1);
    fetchBillsData(1, newLimit);
  };

  const handleResetFilters = () => {
    setSelectedMonthYear('');
    setSelectedDepartmentText('');
    setSelectedAcademicYear('');
    setResultsVisible(false);
    setError('');
    setSuccess('');
    setSelectedStudents([]);
  };

  if (!month) {
    return (
      <div className="light-mode flex min-h-screen text-gray-900">
        <Sidebar
          setActiveSection={() => { }}
          activeSection="messbills"
          onLogout={handleLogout}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className={`flex-1 min-w-0 flex flex-col transition-transform duration-300 pointer-events-auto md:ml-64 ${sidebarOpen ? 'translate-x-64 md:translate-x-0' : 'translate-x-0'}`}>
          <Header
            onLogout={handleLogout}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <MainContent>
            <div className="p-6">
              <p>No month data found. Please go back to Mess Bills Detail.</p>
              <button onClick={handleBack} className="btn mt-4">Back to Mess Bills Detail</button>
            </div>
          </MainContent>
        </div>
      </div>
    );
  }

  return (
    <div className="light-mode flex min-h-screen text-gray-900">
      <Sidebar
        setActiveSection={() => { }}
        activeSection="messbills"
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className={`flex-1 min-w-0 flex flex-col transition-transform duration-300 pointer-events-auto md:ml-64 ${sidebarOpen ? 'translate-x-64 md:translate-x-0' : 'translate-x-0'}`}>
        <Header
          onLogout={handleLogout}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <MainContent>
          <div className="p-6">
            <div className="flex gap-4 mb-4">
              <button onClick={handleBack} className="btn">Back to Mess Bills Detail</button>
              <button onClick={() => setShowStatusModal(true)} className="btn">Show Status</button>
            </div>
            <h1 className="text-2xl font-bold mb-4">Mess Bill Reduction</h1>

            <div className="filters-card">
              <h2 style={{ marginBottom: '20px' }}>Mess Bill Reduction</h2>
              <form id="searchForm" onSubmit={handleFetchBills}>
                <div className="filters-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="month_year">Month-Year *</label>
                    <input type="month" className="form-input" id="month_year" value={selectedMonthYear} onChange={(e) => setSelectedMonthYear(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="department">Department *</label>
                    <select
                      className="form-input"
                      id="department"
                      value={selectedDepartmentText}
                      onChange={(e) => setSelectedDepartmentText(e.target.value)}
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept.department_id || dept.id} value={dept.department}>
                          {dept.department}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="academic_year">Academic Year *</label>
                    <select
                      className="form-input"
                      id="academic_year"
                      value={selectedAcademicYear}
                      onChange={(e) => setSelectedAcademicYear(e.target.value)}
                      required
                    >
                      <option value="">Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                </div>
                <div className="bill-controls">
                  <button type="button" className="btn btn-reset" onClick={handleResetFilters}>Reset</button>
                  <button type="submit" className="btn btn-search">Fetch Bills</button>
                </div>
              </form>
            </div>
            <div id="loadingBills" className="loading" style={{ display: loading ? 'block' : 'none' }}>
              <p>Loading mess bills data...</p>
              <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'inline-block', width: '20px', height: '20px', border: '3px solid #f3f3f3', borderTop: '3px solid #4a6cf7', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              </div>
            </div>
            <div id="errorBills" className="error" style={{ display: error ? 'block' : 'none' }}>
              {error}
            </div>
            <div id="successBills" className="success" style={{ display: success ? 'block' : 'none' }}>
              {success}
            </div>
            <div id="resultsContainer" style={{ display: resultsVisible ? 'block' : 'none' }}>
              <div className="results-card">
                <div className="results-header">
                  <div className="results-title">Mess Bills Results</div>
                  <div className="results-actions">
                    <button className="btn" onClick={handleSendBillToAll}>Verify for Marked Students</button>
                    <button className="btn" onClick={handleSelectAll}>Select All</button>
                    <button className="btn" onClick={handleDeselectAll}>Deselect All</button>
                    <button className="btn" onClick={handleSelectUnselected}>Select Unselected</button>
                    <button className="btn" onClick={handleSelectUnselected}>Select Unselected</button>
                    <div className="results-count" id="resultsCount">Total: {totalRecords}</div>
                  </div>
                </div>
                <div id="billsTableContainer">
                  <table className="bills-table">
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            onChange={(e) => e.target.checked ? handleSelectAll() : handleDeselectAll()}
                            checked={selectedStudents.length === bills.length && bills.length > 0}
                          />
                        </th>
                        <th>Student Name</th>
                        <th>Reg No</th>
                        <th>Days</th>
                        <th>Meal Type</th>
                        <th>Veg Days</th>
                        <th>Non-Veg Days</th>
                        <th>Verified</th>
                        <th>Total Amount</th>
                        <th>Payment Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bills.map((student) => (
                        <tr key={student.id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedStudents.includes(student.id)}
                              onChange={() => handleSelectStudent(student.id)}
                            />
                          </td>
                          <td>{student.name}</td>
                          <td>{student.room}</td>
                          <td>
                            <input
                              type="number"
                              value={student.daysPresent || 0}
                              onChange={(e) => handleDaysPresentChange(student.id, e.target.value)}
                              min="0"
                              max="31"
                              style={{ width: '80px', textAlign: 'center' }}
                            />
                          </td>
                          <td>
                            <select
                              value={student.isveg ? 'Veg' : 'Non-Veg'}
                              onChange={(e) => handleMealTypeChange(student.id, e.target.value)}
                              style={{ width: '100px' }}
                            >
                              <option value="Veg">Veg</option>
                              <option value="Non-Veg">Non-Veg</option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="number"
                              value={student.vegDays || 0}
                              onChange={(e) => handleVegDaysChange(student.id, e.target.value)}
                              min="0"
                              disabled={!student.isveg}
                              style={{ width: '80px', textAlign: 'center' }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={student.nonVegDays || 0}
                              onChange={(e) => handleNonVegDaysChange(student.id, e.target.value)}
                              min="0"
                              disabled={student.isveg}
                              style={{ width: '80px', textAlign: 'center' }}
                            />
                          </td>
                          <td>
                            <select
                              value={student.status === 'Verified' ? 'true' : 'false'}
                              onChange={(e) => handleVerifiedChange(student.id, e.target.value)}
                              style={{ width: '90px' }}
                            >
                              <option value="true">Yes</option>
                              <option value="false">No</option>
                            </select>
                          </td>
                          <td>₹{student.totalAmount.toFixed(2)}</td>
                          <td>{student.messStatus}</td>
                          <td>
                            <button
                              className={`update-btn ${student.id === null ? 'disabled' : ''}`}
                              onClick={() => handleUpdateStudent(student)}
                              disabled={student.id === null}
                            >
                              Update
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {totalRecords > 0 && (
                  <div className="pagination-controls" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9f9f9', borderTop: '1px solid #eee' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '0.9rem', color: '#666' }}>Show per page:</span>
                      <select
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        style={{ padding: '5px 10px', borderRadius: '4px', border: '1px solid #ddd' }}
                      >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                      <span style={{ fontSize: '0.9rem', color: '#666', marginLeft: '10px' }}>
                        Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalRecords)} of {totalRecords} records
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button
                        className="btn"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        style={{ padding: '5px 10px', fontSize: '0.9rem', opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                      >
                        Previous
                      </button>

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
                            style={{
                              padding: '5px 10px',
                              borderRadius: '4px',
                              border: '1px solid #ddd',
                              background: currentPage === pageNum ? '#4a6cf7' : 'white',
                              color: currentPage === pageNum ? 'white' : '#333',
                              cursor: 'pointer',
                              fontWeight: currentPage === pageNum ? 'bold' : 'normal'
                            }}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        className="btn"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        style={{ padding: '5px 10px', fontSize: '0.9rem', opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>


          </div>
        </MainContent>
      </div>

      <style>
        {`
          .students-list {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }
          .update-btn {
            background-color: #16a34a;
            color: white;
            padding: 6px 12px;
            border-radius: 5px;
            border: none;
            cursor: pointer;
          }
          .update-btn:hover:not(.disabled) {
            background-color: #15803d;
          }
          .update-btn.disabled {
            background-color: #6c757d;
            cursor: not-allowed;
            opacity: 0.6;
          }

          .student-card {
            background: #f8faff;
            border-radius: 8px;
            padding: 15px;
            border-left: 4px solid #2575fc;
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          .student-info {
            flex: 1;
          }

          .student-name {
            font-weight: 600;
            color: #333;
            margin-bottom: 5px;
          }

          .student-room {
            font-size: 0.9rem;
            color: #666;
            margin-bottom: 5px;
          }

          .student-status {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: 600;
            display: inline-block;
          }

          .student-status.sent {
            background: #d4edda;
            color: #155724;
          }

          .student-status.pending {
            background: #fff3cd;
            color: #856404;
          }

          .student-actions {
            display: flex;
            gap: 10px;
          }

          .btn-view {
            background: #2575fc;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.8rem;
            transition: all 0.3s ease;
          }

          .btn-view:hover {
            background: #1a5ce5;
          }

          .btn {
            background: #4a6cf7;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
          }

          .btn:hover {
            background: #3a5ce5;
          }

          .student-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }

          .student-details {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .labels-row {
            display: flex;
            gap: 10px;
            justify-content: space-between;
          }

          .values-row {
            display: flex;
            gap: 10px;
            justify-content: space-between;
          }

          .detail-label {
            font-weight: 600;
            color: #666;
            flex: 1;
            text-align: center;
            padding: 4px 8px;
            background: #f1f3f4;
            border-radius: 4px;
          }

          .detail-value {
            font-weight: 600;
            color: #333;
            flex: 1;
            text-align: center;
            padding: 4px 8px;
            background: #ffffff;
            border: 1px solid #e9ecef;
            border-radius: 4px;
          }

          .detail-input {
            font-weight: 600;
            color: #333;
            flex: 1;
            text-align: center;
            padding: 4px 8px;
            background: #ffffff;
            border: 2px solid #2575fc;
            border-radius: 4px;
            outline: none;
            font-size: 0.9rem;
          }

          .detail-input:focus {
            border-color: #1a5ce5;
            box-shadow: 0 0 0 0.2rem rgba(37, 117, 252, 0.25);
          }

          .total-label {
            background: #e3f2fd;
            color: #1976d2;
            font-weight: 700;
          }

          .total-value {
            background: #ffffff;
            border: 2px solid #1976d2;
            color: #1976d2;
            font-weight: 700;
            font-size: 1.1rem;
          }

          .student-actions {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
          }

          .btn-verify {
            background: #28a745;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.8rem;
            transition: all 0.3s ease;
          }

          .btn-verify:hover:not(.disabled) {
            background: #218838;
          }

          .btn-verified {
            background: #6c757d;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: not-allowed;
            font-size: 0.8rem;
          }

          .btn-download {
            background: #6c757d;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.8rem;
            transition: all 0.3s ease;
          }

          .btn-download:hover {
            background: #5a6268;
          }

          .btn-edit {
            background: #ffc107;
            color: #212529;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.8rem;
            transition: all 0.3s ease;
          }

          .btn-edit:hover {
            background: #e0a800;
          }

          .btn-save {
            background: #28a745;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.8rem;
            transition: all 0.3s ease;
          }

          .btn-save:hover {
            background: #218838;
          }

          .btn-cancel {
            background: #dc3545;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.8rem;
            transition: all 0.3s ease;
          }

          .btn-cancel:hover {
            background: #c82333;
          }

          .student-status.pending-verification {
            background: #fff3cd;
            color: #856404;
          }

          .student-status.verified {
            background: #d4edda;
            color: #155724;
          }

          .filters-section {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #e9ecef;
          }

          .filter-group {
            display: flex;
            flex-direction: column;
            gap: 5px;
          }

          .filter-label {
            font-weight: 600;
            color: #495057;
            font-size: 0.9rem;
          }

          .filter-select {
            padding: 8px 12px;
            border: 1px solid #ced4da;
            border-radius: 4px;
            background: white;
            font-size: 0.9rem;
            color: #495057;
            cursor: pointer;
            transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
          }

          .filter-select:focus {
            outline: 0;
            border-color: #2575fc;
            box-shadow: 0 0 0 0.2rem rgba(37, 117, 252, 0.25);
          }

          .filters-card {
            background: #fff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 20px;
          }

          .filters-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
          }

          .form-group {
            display: flex;
            flex-direction: column;
          }

          .form-label {
            margin-bottom: 5px;
            font-weight: 600;
          }

          .form-input {
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
          }

          .bill-controls {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            margin-top: 20px;
          }

          .btn-reset {
            background: #6c757d;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
          }

          .btn-reset:hover {
            background: #5a6268;
          }

          .btn-search {
            background: #28a745;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
          }

          .btn-search:hover {
            background: #218838;
          }

          .loading {
            text-align: center;
            padding: 20px;
          }

          .error {
            background: #f8d7da;
            color: #721c24;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 20px;
          }

          .success {
            background: #d4edda;
            color: #155724;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 20px;
          }

          .results-card {
            background: #fff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }

          .results-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }

          .results-title {
            font-size: 1.5rem;
            font-weight: bold;
          }

          .results-count {
            font-size: 1rem;
            color: #666;
          }

          .results-actions {
            display: flex;
            gap: 10px;
            align-items: center;
          }

          .bills-table {
            width: 100%;
            border-collapse: collapse;
          }

          .bills-table th, .bills-table td {
            padding: 10px;
            border: 1px solid #ddd;
            text-align: left;
          }

          .bills-table th {
            background: #f8f9fa;
            font-weight: 600;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      {/* Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Mess Bills Verification Status</h2>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {loadingStatus ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2">Loading status data...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">Department</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">1st Year</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">2nd Year</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">3rd Year</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">4th Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statusData.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-medium">{row.department}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center text-lg">
                          {row['1st year'] === '✓' ? (
                            <span className="text-green-600">✓</span>
                          ) : (
                            <span className="text-red-600">✗</span>
                          )}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center text-lg">
                          {row['2nd year'] === '✓' ? (
                            <span className="text-green-600">✓</span>
                          ) : (
                            <span className="text-red-600">✗</span>
                          )}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center text-lg">
                          {row['3rd year'] === '✓' ? (
                            <span className="text-green-600">✓</span>
                          ) : (
                            <span className="text-red-600">✗</span>
                          )}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center text-lg">
                          {row['4th year'] === '✓' ? (
                            <span className="text-green-600">✓</span>
                          ) : (
                            <span className="text-red-600">✗</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowStatusModal(false)}
                className="btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessBillsIndividualList;
