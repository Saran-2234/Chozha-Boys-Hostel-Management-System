import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import MainContent from '../Header/MainContent';

const MessBillsDetail = () => {
  const navigate = useNavigate();
  const [month, setMonth] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPublishPopup, setShowPublishPopup] = useState(false);
  const [publishMessage, setPublishMessage] = useState('');
  const [students, setStudents] = useState([
    { id: 1, name: 'John Doe', room: '101', paymentStatus: 'paid', department: 'CSE', year: '3rd' },
    { id: 2, name: 'Jane Smith', room: '205', paymentStatus: 'unpaid', department: 'ECE', year: '2nd' },
    { id: 3, name: 'Robert Johnson', room: '312', paymentStatus: 'paid', department: 'CSE', year: '4th' },
    { id: 4, name: 'Alice Brown', room: '102', paymentStatus: 'paid', department: 'ME', year: '3rd' },
    { id: 5, name: 'Bob Wilson', room: '206', paymentStatus: 'unpaid', department: 'CSE', year: '1st' },
    // Add more mock data as needed
  ]);

  useEffect(() => {
    const monthData = sessionStorage.getItem('monthData');
    if (monthData) {
      setMonth(JSON.parse(monthData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    document.cookie = 'token=; path=/; max-age=0';
    window.location.href = '/';
  };

  const handleBack = () => {
    navigate('/admin-dashboard', { state: { activeSection: 'messbills' } });
  };

  const handleViewBill = (bill) => {
    sessionStorage.setItem('billData', JSON.stringify(bill));
    navigate('/mess-bill-individual');
  };

  const handlePublishClick = () => {
    setShowPublishPopup(true);
  };

  const handleConfirmPublish = () => {
    setShowPublishPopup(false);
    setPublishMessage('Your bills have been published');
  };

  const handleCancelPublish = () => {
    setShowPublishPopup(false);
  };

  const handleShowPaidStudents = () => {
    navigate('/paid-students', { state: { students: students.filter(s => s.paymentStatus === 'paid') } });
  };

  const handleShowUnpaidStudents = () => {
    navigate('/unpaid-students', { state: { students: students.filter(s => s.paymentStatus === 'unpaid') } });
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
              <p>No data found. Please go back to Mess Bills.</p>
              <button onClick={handleBack} className="btn mt-4">Back to Mess Bills</button>
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
            <button onClick={handleBack} className="btn mb-4">Back to Mess Bills</button>
            <h1 className="text-2xl font-bold mb-4">{month.title} Details</h1>

            <div className="month-card expanded">
              <div className="month-header">
                <div>
                  <div className="month-title">{month.title}</div>
                  <div className="month-date">{month.date}</div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div style={{fontSize: '0.9rem', opacity: 0.9}}>Total Bills: {month.totalBills}</div>
                  <div style={{fontSize: '0.9rem', opacity: 0.9}}>Total Amount: ₹{month.totalAmount.toFixed(2)}</div>
                </div>
              </div>

              <div className="actions-section" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px'}}>
                <div className="student-cards">
                  <div className="student-card paid-card" onClick={handleShowPaidStudents}>
                    <div className="card-icon">✓</div>
                    <div className="card-content">
                      <div className="card-title">Paid Students</div>
                      <div className="card-count">{students.filter(s => s.paymentStatus === 'paid').length}</div>
                    </div>
                  </div>
                  <div className="student-card unpaid-card" onClick={handleShowUnpaidStudents}>
                    <div className="card-icon">⚠</div>
                    <div className="card-content">
                      <div className="card-title">Unpaid Students</div>
                      <div className="card-count">{students.filter(s => s.paymentStatus === 'unpaid').length}</div>
                    </div>
                  </div>
                </div>
                <button className="btn" onClick={handlePublishClick}>Publish Bills</button>
                {publishMessage && <div className="success-message">{publishMessage}</div>}
              </div>

              <div className="order-tracker">
                <div className={`step ${['created', 'verified', 'published'].indexOf((month.status || 'created').toLowerCase()) >= 0 ? 'completed' : 'pending'}`}>
                  <div className="circle"></div>
                  <p>Created</p>
                  <span className="date">{month.createdDate || 'N/A'}</span>
                </div>
                <div className={`bar ${['verified', 'published'].indexOf((month.status || 'created').toLowerCase()) >= 0 ? 'completed' : 'pending'}`}></div>
                <div className={`step ${['verified', 'published'].indexOf((month.status || 'created').toLowerCase()) >= 0 ? 'completed' : 'pending'}`}>
                  <div className="circle"></div>
                  <p>Verified</p>
                  <span className="date">{month.verifiedDate || 'N/A'}</span>
                </div>
                <div className={`bar ${(month.status || 'created').toLowerCase() === 'published' ? 'completed' : 'pending'}`}></div>
                <div className={`step ${(month.status || 'created').toLowerCase() === 'published' ? 'completed' : 'pending'}`}>
                  <div className="circle"></div>
                  <p>Published</p>
                  <span className="date">{month.publishedDate || 'N/A'}</span>
                </div>
              </div>

              <div className="month-content">
                <table className="costs-table">
                  <thead>
                    <tr>
                      <th>Bill Category</th>
                      <th>Amount</th>
                      <th>Bill Category</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {month.costs.map((cost, i) => (
                      i % 2 === 0 ? (
                        <tr key={i}>
                          <td>{cost.label}</td>
                          <td className="cost-value">{typeof cost.value === 'number' && cost.value > 100 ? `₹${cost.value.toFixed(2)}` : cost.value}</td>
                          {month.costs[i+1] && (
                            <>
                              <td>{month.costs[i+1].label}</td>
                              <td className="cost-value">{typeof month.costs[i+1].value === 'number' && month.costs[i+1].value > 100 ? `₹${month.costs[i+1].value.toFixed(2)}` : month.costs[i+1].value}</td>
                            </>
                          )}
                        </tr>
                      ) : null
                    ))}
                  </tbody>
                </table>

                <div className="years-section">
                  <h3>Department-wise Breakdown</h3>
                  <div className="years-grid">
                    {month.departments.map((dept, i) => (
                      <div key={i} className="year-card">
                        <div className="year-title">{dept.name}</div>
                        <div className="year-stats">
                          <div className="stat">
                            <div className="stat-value">{dept.bills}</div>
                            <div className="stat-label">Bills</div>
                          </div>
                          <div className="stat">
                            <div className="stat-value">₹{dept.amount}</div>
                            <div className="stat-label">Amount</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="actions-section">
                  <button className="btn-individual-bills" onClick={() => navigate('/mess-bills-individual-list', { state: { month } })}>Individual Bills</button>
                </div>

              </div>
            </div>
            {showPublishPopup && (
              <div className="popup-overlay">
                <div className="popup">
                  <p>Need to publish your bills?</p>
                  <div className="popup-buttons">
                    <button className="btn-cancel" onClick={handleCancelPublish}>Cancel</button>
                    <button className="btn-confirm" onClick={handleConfirmPublish}>OK</button>
                  </div>
                </div>
              </div>
            )}


          </div>
        </MainContent>
      </div>

      <style>
        {`
          .month-card {
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
            margin-bottom: 20px;
          }

          .month-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            background: linear-gradient(135deg, #f8faff 0%, #e8f2ff 100%);
            border-radius: 10px 10px 0 0;
          }

          .month-title {
            font-size: 1.3rem;
            font-weight: 600;
            color: #2575fc;
            margin-bottom: 5px;
          }

          .month-date {
            font-size: 0.9rem;
            opacity: 0.7;
          }

          .month-content {
            padding: 20px;
          }

          .costs-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }

          .costs-table th, .costs-table td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #eee;
          }

          .costs-table th {
            background-color: #f8faff;
            font-weight: 600;
          }

          .cost-value {
            font-weight: 600;
            color: #2575fc;
          }

          .years-section h3 {
            margin-bottom: 15px;
            color: #2575fc;
          }

          .years-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 15px;
          }

          .year-card {
            background: #f8faff;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #2575fc;
          }

          .year-title {
            font-weight: 600;
            margin-bottom: 10px;
            color: #2575fc;
          }

          .year-stats {
            display: flex;
            justify-content: space-between;
          }

          .stat {
            text-align: center;
          }

          .stat-value {
            font-size: 1.2rem;
            font-weight: 600;
            color: #333;
            display: block;
          }

          .stat-label {
            font-size: 0.8rem;
            opacity: 0.7;
            margin-top: 2px;
          }

          .individual-bills {
            margin-top: 20px;
          }

          .individual-bills.active {
            display: block;
          }

          .bill-card {
            background: #f8faff;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid #2575fc;
          }

          .bill-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }

          .bill-card-title {
            font-weight: 600;
            color: #333;
          }

          .bill-status {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: 600;
          }

          .bill-status.verified {
            background: #d4edda;
            color: #155724;
          }

          .bill-status.pending {
            background: #fff3cd;
            color: #856404;
          }

          .bill-status.created {
            background: #cce5ff;
            color: #004085;
          }

          .bill-status.published {
            background: #e7e8ff;
            color: #3c009d;
          }

          .bill-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
            margin-bottom: 15px;
          }

          .bill-detail {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }

          .bill-detail-label {
            font-weight: 600;
            color: #666;
          }

          .bill-detail-value {
            font-weight: 600;
            color: #333;
          }

          .bill-actions {
            display: flex;
            gap: 10px;
          }

          .btn-view-bill {
            background: #2575fc;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.8rem;
            transition: all 0.3s ease;
          }

          .btn-view-bill:hover {
            background: #1a5ce5;
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

          .btn-verify.disabled {
            background: #6c757d;
            cursor: not-allowed;
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

          .actions-section {
            margin-top: 20px;
            text-align: center;
          }

          .btn-individual-bills {
            background: #28a745;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
          }

          .btn-individual-bills:hover {
            background: #218838;
          }

          .btn-paid {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
            position: relative;
            overflow: hidden;
          }

          .btn-paid::before {
            content: '✓';
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 1.2rem;
          }

          .btn-paid:hover {
            background: linear-gradient(135deg, #218838 0%, #17a2b8 100%);
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(40, 167, 69, 0.4);
          }

          .btn-unpaid {
            background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            box-shadow: 0 4px 8px rgba(255, 193, 7, 0.3);
            position: relative;
            overflow: hidden;
          }

          .btn-unpaid::before {
            content: '⚠';
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 1.2rem;
          }

          .btn-unpaid:hover {
            background: linear-gradient(135deg, #e0a800 0%, #d39e00 100%);
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(255, 193, 7, 0.4);
          }

          .students-list {
            max-height: 300px;
            overflow-y: auto;
            margin-top: 20px;
          }

          .student-item {
            padding: 10px;
            border-bottom: 1px solid #eee;
            text-align: left;
          }

          .popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }

          .popup {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }

          .popup-buttons {
            margin-top: 20px;
            display: flex;
            gap: 10px;
            justify-content: center;
          }

          .btn-cancel {
            background: #6c757d;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
          }

          .btn-cancel:hover {
            background: #5a6268;
          }

          .btn-confirm {
            background: #28a745;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
          }

          .btn-confirm:hover {
            background: #218838;
          }

          .success-message {
            color: green;
            margin-top: 10px;
            font-weight: 600;
          }

          .order-tracker {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 90%;
            margin: 20px auto;
            font-family: Arial, sans-serif;
          }

          .step {
            text-align: center;
            width: 110px;
          }

          .circle {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            margin: 0 auto 5px;
            border: 3px solid #4CAF50;
            background: white;
          }

          .completed .circle {
            background: #4CAF50;
          }

          .pending .circle {
            background: #ccc;
            border-color: #ccc;
          }

          .bar {
            flex: 1;
            height: 4px;
            background: #ccc;
            margin: 0 5px;
            border-radius: 5px;
          }

          .bar.completed {
            background: #4CAF50;
          }

          .order-tracker p {
            margin: 5px 0;
            font-weight: bold;
            color: #333;
            font-size: 0.9rem;
          }

          .date {
            font-size: 12px;
            color: #777;
          }

          .student-cards {
            display: flex;
            gap: 20px;
            justify-content: center;
          }

          .student-card {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 15px;
            min-width: 200px;
          }

          .student-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          }

          .paid-card {
            border-left: 4px solid #28a745;
          }

          .unpaid-card {
            border-left: 4px solid #ffc107;
          }

          .card-icon {
            font-size: 2rem;
            color: #2575fc;
          }

          .card-content {
            flex: 1;
          }

          .card-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #333;
            margin-bottom: 5px;
          }

          .card-count {
            font-size: 1.5rem;
            font-weight: 700;
            color: #2575fc;
          }

          .filter-section {
            display: flex;
            gap: 15px;
            margin-bottom: 20px;
            justify-content: center;
          }

          .filter-select {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            background: white;
            font-size: 0.9rem;
            cursor: pointer;
          }

          .filter-select:focus {
            outline: none;
            border-color: #2575fc;
          }
        `}
      </style>
    </div>
  );
};

export default MessBillsDetail;
