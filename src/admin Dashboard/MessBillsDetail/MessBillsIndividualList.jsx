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
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'John Doe',
      room: '101',
      status: 'Pending Verification',
      daysPresent: 28,
      mealRate: 150.00,
      extraCharges: 350.00,
      totalAmount: 4550.00,
      isEditing: false
    },
    {
      id: 2,
      name: 'Jane Smith',
      room: '205',
      status: 'Pending Verification',
      daysPresent: 25,
      mealRate: 150.00,
      extraCharges: 200.00,
      totalAmount: 3950.00,
      isEditing: false
    },
    {
      id: 3,
      name: 'Robert Johnson',
      room: '312',
      status: 'Verified',
      daysPresent: 30,
      mealRate: 150.00,
      extraCharges: 450.00,
      totalAmount: 4950.00,
      isEditing: false
    },
    // Add more static data as needed
  ]);

  useEffect(() => {
    if (location.state && location.state.month) {
      setMonth(location.state.month);
    } else {
      const monthData = sessionStorage.getItem('monthData');
      if (monthData) {
        setMonth(JSON.parse(monthData));
      }
    }
  }, [location.state]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    document.cookie = 'token=; path=/; max-age=0';
    window.location.href = '/';
  };

  const handleBack = () => {
    navigate('/mess-bills-detail');
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
    setStudents(students.map(student =>
      student.id === studentId
        ? { ...student, isEditing: true }
        : student
    ));
  };

  const handleSaveStudent = (studentId) => {
    setStudents(students.map(student =>
      student.id === studentId
        ? { ...student, isEditing: false }
        : student
    ));
    // Here you can add API call to save the changes
  };

  const handleCancelEdit = (studentId) => {
    setStudents(students.map(student =>
      student.id === studentId
        ? { ...student, isEditing: false }
        : student
    ));
    // Reset to original values if needed
  };

  const handleDaysPresentChange = (studentId, value) => {
    const days = Math.max(0, Math.min(31, parseInt(value) || 0)); // Ensure value is between 0 and 31
    const student = students.find(s => s.id === studentId);
    const newTotalAmount = (days * student.mealRate) + student.extraCharges;

    setStudents(students.map(student =>
      student.id === studentId
        ? {
            ...student,
            daysPresent: days,
            totalAmount: newTotalAmount
          }
        : student
    ));
  };

  const handleFetchBills = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setSelectedStudents([]);
    setTimeout(() => {
      setBills(students);
      setResultsVisible(true);
      setLoading(false);
      setSuccess('Bills fetched successfully');
    }, 2000);
  };

  const handleResetFilters = () => {
    setSelectedMonthYear('');
    setSelectedDepartmentText('');
    setSelectedAcademicYear('');
    setResultsVisible(false);
    setError('');
    setSuccess('');
  };

  if (!month) {
    return (
      <div className="light-mode flex min-h-screen text-gray-900">
        <Sidebar
          setActiveSection={() => {}}
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
        setActiveSection={() => {}}
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
            <button onClick={handleBack} className="btn mb-4">Back to Mess Bills Detail</button>
            <h1 className="text-2xl font-bold mb-4">Mess Bill Reduction</h1>

            <div className="filters-card">
              <h2 style={{marginBottom: '20px'}}>Mess Bill Reduction</h2>
              <form id="searchForm" onSubmit={handleFetchBills}>
                <div className="filters-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="month_year">Month Year *</label>
                    <input type="month" className="form-input" id="month_year" value={selectedMonthYear} onChange={(e) => setSelectedMonthYear(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="department">Department *</label>
                    <input type="text" className="form-input" id="department" value={selectedDepartmentText} onChange={(e) => setSelectedDepartmentText(e.target.value)} placeholder="Enter department" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="academic_year">Academic Year *</label>
                    <input type="number" className="form-input" id="academic_year" value={selectedAcademicYear} onChange={(e) => setSelectedAcademicYear(e.target.value)} min="1" placeholder="Enter academic year" required />
                  </div>
                </div>
                <div className="bill-controls">
                  <button type="button" className="btn btn-reset" onClick={handleResetFilters}>Reset</button>
                  <button type="submit" className="btn btn-search">Fetch Bills</button>
                </div>
              </form>
            </div>
            <div id="loadingBills" className="loading" style={{display: loading ? 'block' : 'none'}}>
              <p>Loading mess bills data...</p>
              <div style={{marginTop: '20px'}}>
                <div style={{display: 'inline-block', width: '20px', height: '20px', border: '3px solid #f3f3f3', borderTop: '3px solid #4a6cf7', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
              </div>
            </div>
            <div id="errorBills" className="error" style={{display: error ? 'block' : 'none'}}>
              {error}
            </div>
            <div id="successBills" className="success" style={{display: success ? 'block' : 'none'}}>
              {success}
            </div>
            <div id="resultsContainer" style={{display: resultsVisible ? 'block' : 'none'}}>
              <div className="results-card">
                <div className="results-header">
                  <div className="results-title">Mess Bills Results</div>
                  <div className="results-actions">
                    <button className="btn" onClick={handleSendBillToAll}>Verify for Marked Students</button>
                    <button className="btn" onClick={handleSelectAll}>Select All</button>
                    <button className="btn" onClick={handleDeselectAll}>Deselect All</button>
                    <button className="btn" onClick={handleSelectUnselected}>Select Unselected</button>
                    <div className="results-count" id="resultsCount">{bills.length} bills found</div>x``
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
                        <th>Name</th>
                        <th>Room</th>
                        <th>Status</th>
                        <th>Days Present</th>
                        <th>Meal Rate</th>
                        <th>Extra Charges</th>
                        <th>Total Amount</th>
                        <th>Actions</th>
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
                          <td>{student.status}</td>
                          <td>
                            {student.isEditing ? (
                              <input
                                type="number"
                                value={student.daysPresent}
                                onChange={(e) => handleDaysPresentChange(student.id, e.target.value)}
                                min="0"
                                max="31"
                              />
                            ) : (
                              student.daysPresent
                            )}
                          </td>
                          <td>₹{student.mealRate.toFixed(2)}</td>
                          <td>₹{student.extraCharges.toFixed(2)}</td>
                          <td>₹{student.totalAmount.toFixed(2)}</td>
                          <td>
                            {student.isEditing ? (
                              <>
                                <button className="btn-save" onClick={() => handleSaveStudent(student.id)}>Save</button>
                                <button className="btn-cancel" onClick={() => handleCancelEdit(student.id)}>Cancel</button>
                              </>
                            ) : (
                              <>
                                <button className="btn-edit" onClick={() => handleEditStudent(student.id)}>Edit</button>
                                {student.status === 'Pending Verification' ? (
                                  <button className="btn-verify" onClick={() => handleVerifyBill(student)}>Verify</button>
                                ) : (
                                  <button className="btn-verified" disabled>Verified</button>
                                )}
                                <button className="btn-download" onClick={() => handleDownloadBill(student)}>Download</button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
    </div>
  );
};

export default MessBillsIndividualList;
