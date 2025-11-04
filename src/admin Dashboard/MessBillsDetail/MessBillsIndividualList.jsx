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

  // Static data for students who have been sent the bill
  const staticStudents = [
    {
      id: 1,
      name: 'John Doe',
      room: '101',
      status: 'Pending Verification',
      daysPresent: 28,
      mealRate: 150.00,
      extraCharges: 350.00,
      totalAmount: 4550.00
    },
    {
      id: 2,
      name: 'Jane Smith',
      room: '205',
      status: 'Pending Verification',
      daysPresent: 25,
      mealRate: 150.00,
      extraCharges: 200.00,
      totalAmount: 3950.00
    },
    {
      id: 3,
      name: 'Robert Johnson',
      room: '312',
      status: 'Verified',
      daysPresent: 30,
      mealRate: 150.00,
      extraCharges: 450.00,
      totalAmount: 4950.00
    },
    // Add more static data as needed
  ];

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
            <h1 className="text-2xl font-bold mb-4">Individual Bills for {month.title}</h1>

            <div className="students-list">
              {staticStudents.map((student) => (
                <div key={student.id} className="student-card">
                  <div className="student-header">
                    <div className="student-name">{student.name} - Room {student.room}</div>
                    <div className={`student-status ${student.status.toLowerCase().replace(' ', '-')}`}>{student.status}</div>
                  </div>
                  <div className="student-details">
                    <div className="detail-row">
                      <span className="detail-label">Days Present</span>
                      <span className="detail-value">{student.daysPresent}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Meal Rate</span>
                      <span className="detail-value">₹{student.mealRate.toFixed(2)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Extra Charges</span>
                      <span className="detail-value">₹{student.extraCharges.toFixed(2)}</span>
                    </div>
                    <div className="detail-row total-row">
                      <span className="detail-label">Total Amount</span>
                      <span className="detail-value">₹{student.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="student-actions">
                    {student.status === 'Pending Verification' ? (
                      <button className="btn-verify" onClick={() => handleVerifyBill(student)}>Verify Bill</button>
                    ) : (
                      <button className="btn-verified" disabled>Verified</button>
                    )}
                    <button className="btn-download" onClick={() => handleDownloadBill(student)}>Download</button>
                  </div>
                </div>
              ))}
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

          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 4px 0;
          }

          .detail-label {
            font-weight: 600;
            color: #666;
          }

          .detail-value {
            font-weight: 600;
            color: #333;
          }

          .total-row {
            border-top: 2px solid #2575fc;
            padding-top: 8px;
            margin-top: 8px;
          }

          .total-row .detail-value {
            color: #2575fc;
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

          .student-status.pending-verification {
            background: #fff3cd;
            color: #856404;
          }

          .student-status.verified {
            background: #d4edda;
            color: #155724;
          }
        `}
      </style>
    </div>
  );
};

export default MessBillsIndividualList;
