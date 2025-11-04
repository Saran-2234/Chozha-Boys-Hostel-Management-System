import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import MainContent from '../Header/MainContent';

const MessBillIndividual = () => {
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const billData = sessionStorage.getItem('billData');
    if (billData) {
      setBill(JSON.parse(billData));
      sessionStorage.removeItem('billData'); // Clean up after use
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    document.cookie = 'token=; path=/; max-age=0';
    window.location.href = '/';
  };

  const handleBack = () => {
    navigate('/mess-bills-detail');
  };

  if (!bill) {
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
              <p>No bill data found. Please go back to Mess Bills Detail.</p>
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
            <h1 className="text-2xl font-bold mb-4">Individual Bill Details</h1>

            <div className="bill-card">
              <div className="bill-card-header">
                <div className="bill-card-title">{bill.name} - Room {bill.room}</div>
                <div className={`bill-status ${bill.status}`}>{bill.status === 'verified' ? 'Verified' : 'Pending Verification'}</div>
              </div>
              <div className="bill-details">
                <div className="bill-detail">
                  <span className="bill-detail-label">Days Present</span>
                  <span className="bill-detail-value">{bill.days}</span>
                </div>
                <div className="bill-detail">
                  <span className="bill-detail-label">Meal Rate</span>
                  <span className="bill-detail-value">₹{bill.rate}.00</span>
                </div>
                <div className="bill-detail">
                  <span className="bill-detail-label">Extra Charges</span>
                  <span className="bill-detail-value">₹{bill.extra}.00</span>
                </div>
                <div className="bill-detail">
                  <span className="bill-detail-label">Total Amount</span>
                  <span className="bill-detail-value">₹{bill.total}.00</span>
                </div>
              </div>
              <div className="bill-actions">
                <button className={`btn-verify ${bill.status === 'verified' ? 'disabled' : ''}`} onClick={() => console.log(`Verify bill`)} disabled={bill.status === 'verified'}>
                  {bill.status === 'verified' ? 'Verified' : 'Verify Bill'}
                </button>
                <button className="btn-download">Download</button>
              </div>
            </div>
          </div>
        </MainContent>
      </div>

      <style>
        {`
          .bill-card {
            background: #f8faff;
            border-radius: 8px;
            padding: 20px;
            border-left: 4px solid #2575fc;
            max-width: 600px;
            margin: 0 auto;
          }

          .bill-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }

          .bill-card-title {
            font-weight: 600;
            color: #333;
            font-size: 1.2rem;
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

          .bill-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
          }

          .bill-detail {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
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
            justify-content: center;
          }

          .btn-verify {
            background: #28a745;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
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
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
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
        `}
      </style>
    </div>
  );
};

export default MessBillIndividual;
