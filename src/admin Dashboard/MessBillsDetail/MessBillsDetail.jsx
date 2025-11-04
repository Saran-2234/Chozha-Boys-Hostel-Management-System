import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import MainContent from '../Header/MainContent';

const MessBillsDetail = () => {
  const navigate = useNavigate();
  const [month, setMonth] = useState(null);

  useEffect(() => {
    const monthData = sessionStorage.getItem('monthData');
    if (monthData) {
      setMonth(JSON.parse(monthData));
    }
  }, []);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        `}
      </style>
    </div>
  );
};

export default MessBillsDetail;
