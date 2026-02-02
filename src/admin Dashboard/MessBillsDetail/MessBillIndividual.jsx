import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import MainContent from '../Header/MainContent';

const MessBillIndividual = () => {
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusData, setStatusData] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const billData = sessionStorage.getItem('billData');
    if (billData) {
      setBill(JSON.parse(billData));
      sessionStorage.removeItem('billData'); // Clean up after use
    }
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (showStatusModal && statusData.length === 0) {
      fetchStatusData();
    }
  }, [showStatusModal]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    document.cookie = 'token=; path=/; max-age=0';
    window.location.href = '/';
  };

  const handleBack = () => {
    navigate('/mess-bills-detail');
  };

  const handleSidebarNavigation = (section) => {
    navigate('/admin-dashboard', { state: { activeSection: section } });
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  const handleEdit = () => {
    setEditFormData({
      ...bill,
      paid_date: bill.paid_date ? bill.paid_date.split('T')[0] : '',
      verified: bill.status === 'Verified' || bill.status === 'verified'
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

      const body = {
        id: editFormData.id,
        student_id: editFormData.student_id,
        status: editFormData.statusRaw,
        latest_order_id: editFormData.latest_order_id,
        monthly_year_data_id: editFormData.monthly_year_data_id,
        number_of_days: editFormData.daysPresent,
        monthly_base_cost_id: editFormData.monthly_base_cost_id,
        show: editFormData.show,
        verified: editFormData.verified,
        isveg: editFormData.isveg,
        veg_days: editFormData.vegDays,
        non_veg_days: editFormData.nonVegDays,
        paid_date: editFormData.paid_date || null,
        ispaid: editFormData.ispaid
      };

      // Also update 'verified' explicit check if we have a checkbox for it specifically
      // In list view we mapped 'status' string to Verified/Pending. 
      // Let's rely on explicit verified field if we added it to form, else derive.
      // We will add explicit verified checkbox to form.

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
        // Update local state and session storage
        const updatedBill = {
          ...bill,
          ...editFormData,
          status: editFormData.verified ? 'Verified' : 'Pending Verification', // Update display status
          statusRaw: editFormData.statusRaw // Update raw status
        };
        setBill(updatedBill);
        sessionStorage.setItem('billData', JSON.stringify(updatedBill));
        setIsEditing(false);
        alert('✅ Mess bill updated successfully');
      } else {
        alert('❌ ' + (result.error || 'Update failed'));
      }
    } catch (error) {
      console.error('Error updating mess bill:', error);
      alert('❌ Error updating mess bill');
    }
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

  const fetchStatusData = async () => {
    setLoadingStatus(true);
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    try {
      const response = await fetch('http://localhost:3001/admin/get-department-verifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          monthly_year_data_id: bill.monthly_year_data_id
        })
      });

      const data = await response.json();

      if (data.success && Array.isArray(data.result)) {
        // Map backend results to the grid structure
        const statusMap = new Map();

        // Helper to parse year from various formats (1, I, 1st, etc)
        const parseYear = (yearStr) => {
          if (!yearStr) return 0;
          const s = String(yearStr).trim().toUpperCase();
          if (s.startsWith('1') || s === 'I' || s.startsWith('I ') || s.startsWith('1ST')) return 1;
          if (s.startsWith('2') || s === 'II' || s.startsWith('II ') || s.startsWith('2ND')) return 2;
          if (s.startsWith('3') || s === 'III' || s.startsWith('III ') || s.startsWith('3RD')) return 3;
          if (s.startsWith('4') || s === 'IV' || s.startsWith('IV ') || s.startsWith('4TH')) return 4;
          return parseInt(s) || 0;
        };

        // Populate map with results: "Dept|Year" -> verified
        data.result.forEach(item => {
          const year = parseYear(item.academic_year);
          if (year > 0) {
            const key = `${item.department}|${year}`;
            statusMap.set(key, item.all_verified && item.bill_count > 0);
          }
        });

        const newStatusData = departments.map(dept => {
          const row = { department: dept.department };

          // Check for years 1 to 4
          [1, 2, 3, 4].forEach(year => {
            const isVerified = statusMap.get(`${dept.department}|${year}`);

            // Define column keys matching the table render
            let colKey = '';
            if (year === 1) colKey = '1st year';
            else if (year === 2) colKey = '2nd year';
            else if (year === 3) colKey = '3rd year';
            else if (year === 4) colKey = '4th year';

            row[colKey] = isVerified ? '✓' : '✗';
          });

          return row;
        });

        setStatusData(newStatusData);
      } else {
        console.error('Failed to fetch department verifications');
      }
    } catch (error) {
      console.error('Error fetching status data:', error);
      // Fallback to empty/failed state
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

  if (!bill) {
    return (
      <div className="light-mode flex min-h-screen text-gray-900">
        <Sidebar
          setActiveSection={handleSidebarNavigation}
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
        setActiveSection={handleSidebarNavigation}
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
            <h1 className="text-2xl font-bold mb-4">Individual Bill Details</h1>

            {isEditing ? (
              <div className="bill-card">
                <div className="bill-card-header">
                  <div className="bill-card-title">Edit Bill - {bill.name}</div>
                </div>
                <div className="edit-form grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block text-sm font-bold mb-1">Status (Raw)</label>
                    <input type="text" name="statusRaw" value={editFormData.statusRaw || ''} onChange={handleChange} className="w-full p-2 border rounded" />
                  </div>
                  <div className="form-group">
                    <label className="block text-sm font-bold mb-1">Latest Order ID</label>
                    <input type="text" name="latest_order_id" value={editFormData.latest_order_id || ''} onChange={handleChange} className="w-full p-2 border rounded" />
                  </div>
                  <div className="form-group">
                    <label className="block text-sm font-bold mb-1">Paid Date</label>
                    <input type="date" name="paid_date" value={editFormData.paid_date || ''} onChange={handleChange} className="w-full p-2 border rounded" />
                  </div>
                  <div className="form-group">
                    <label className="block text-sm font-bold mb-1">Days Present</label>
                    <input type="number" name="daysPresent" value={editFormData.daysPresent || 0} onChange={handleChange} className="w-full p-2 border rounded" />
                  </div>

                  <div className="form-group">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" name="show" checked={editFormData.show || false} onChange={handleChange} />
                      Show to Student
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" name="ispaid" checked={editFormData.ispaid || false} onChange={handleChange} />
                      Is Paid
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" name="verified" checked={editFormData.verified || editFormData.status === 'Verified'} onChange={handleChange} />
                      Verified
                    </label>
                  </div>

                  <div className="form-group col-span-2 border-t pt-2 mt-2">
                    <h3 className="font-bold">Meal Details</h3>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" name="isveg" checked={editFormData.isveg || false} onChange={handleChange} />
                        Is Veg
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <label className="block text-sm">Veg Days</label>
                        <input type="number" name="vegDays" value={editFormData.vegDays || 0} onChange={handleChange} className="w-full p-2 border rounded" disabled={!editFormData.isveg} />
                      </div>
                      <div>
                        <label className="block text-sm">Non-Veg Days</label>
                        <input type="number" name="nonVegDays" value={editFormData.nonVegDays || 0} onChange={handleChange} className="w-full p-2 border rounded" disabled={editFormData.isveg} />
                      </div>
                    </div>
                  </div>

                  <div className="form-group col-span-2 border-t pt-2 mt-2">
                    <h3 className="font-bold text-gray-500 text-sm">Detailed IDs (Advanced)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm">Monthly Year Data ID</label>
                        <input type="number" name="monthly_year_data_id" value={editFormData.monthly_year_data_id || ''} onChange={handleChange} className="w-full p-2 border rounded" />
                      </div>
                      <div>
                        <label className="block text-sm">Monthly Base Cost ID</label>
                        <input type="number" name="monthly_base_cost_id" value={editFormData.monthly_base_cost_id || ''} onChange={handleChange} className="w-full p-2 border rounded" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bill-actions mt-6">
                  <button className="btn bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded" onClick={handleCancel}>Cancel</button>
                  <button className="btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" onClick={handleSave}>Save Changes</button>
                </div>
              </div>
            ) : (
              <div className="bill-card">
                <div className="bill-card-header">
                  <div className="bill-card-title">{bill.name} - Room {bill.room}</div>
                  <div className={`bill-status ${bill.status}`}>{bill.status === 'verified' || bill.status === 'Verified' ? 'Verified' : 'Pending Verification'}</div>
                </div>
                <div className="bill-details">
                  <div className="bill-detail">
                    <span className="bill-detail-label">Days Present</span>
                    <span className="bill-detail-value">{bill.daysPresent !== undefined ? bill.daysPresent : bill.days}</span>
                  </div>
                  <div className="bill-detail">
                    <span className="bill-detail-label">Meal Rate</span>
                    <span className="bill-detail-value">₹{bill.mealRate !== undefined ? bill.mealRate : bill.rate}.00</span>
                  </div>
                  <div className="bill-detail">
                    <span className="bill-detail-label">Extra Charges</span>
                    <span className="bill-detail-value">₹{bill.extraCharges !== undefined ? bill.extraCharges : bill.extra}.00</span>
                  </div>
                  <div className="bill-detail">
                    <span className="bill-detail-label">Total Amount</span>
                    <span className="bill-detail-value">₹{bill.totalAmount !== undefined ? bill.totalAmount : bill.total}.00</span>
                  </div>
                  <div className="bill-detail">
                    <span className="bill-detail-label">Paid Status</span>
                    <span className="bill-detail-value">{bill.ispaid ? 'Paid' : 'Unpaid'}</span>
                  </div>
                  <div className="bill-detail">
                    <span className="bill-detail-label">Latest Order ID</span>
                    <span className="bill-detail-value">{bill.latest_order_id || 'N/A'}</span>
                  </div>
                </div>
                <div className="bill-actions">
                  <button className="btn bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded" onClick={handleEdit}>Edit Bill</button>
                  <button className={`btn-verify ${bill.status === 'verified' || bill.status === 'Verified' ? 'disabled' : ''}`} onClick={() => console.log(`Messbill ID: ${bill.id}`)} disabled={bill.status === 'verified' || bill.status === 'Verified'}>
                    {bill.status === 'verified' || bill.status === 'Verified' ? 'Verified' : 'Verify Bill'}
                  </button>
                  <button className="btn-download">Download</button>
                </div>
              </div>
            )}
          </div>
        </MainContent>
      </div>

      {/* Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Mess Bills Verification Status</h2>
              <div className="flex items-center space-x-4">
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm bg-white border-gray-300 text-gray-900"
                >
                  <option value="all">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept.department_id || dept.id} value={dept.department}>
                      {dept.department}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
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
                    {statusData
                      .filter(row => departmentFilter === 'all' || row.department === departmentFilter)
                      .map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2 font-medium">{row.department}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center text-lg">
                            <button
                              className={`px-2 py-1 rounded text-white text-sm ${row['1st year'] === '✓' ? 'bg-green-500' : 'bg-red-500'
                                }`}
                            >
                              {row['1st year'] === '✓' ? 'Verified' : 'Pending'}
                            </button>
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center text-lg">
                            <button
                              className={`px-2 py-1 rounded text-white text-sm ${row['2nd year'] === '✓' ? 'bg-green-500' : 'bg-red-500'
                                }`}
                            >
                              {row['2nd year'] === '✓' ? 'Verified' : 'Pending'}
                            </button>
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center text-lg">
                            <button
                              className={`px-2 py-1 rounded text-white text-sm ${row['3rd year'] === '✓' ? 'bg-green-500' : 'bg-red-500'
                                }`}
                            >
                              {row['3rd year'] === '✓' ? 'Verified' : 'Pending'}
                            </button>
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center text-lg">
                            <button
                              className={`px-2 py-1 rounded text-white text-sm ${row['4th year'] === '✓' ? 'bg-green-500' : 'bg-red-500'
                                }`}
                            >
                              {row['4th year'] === '✓' ? 'Verified' : 'Pending'}
                            </button>
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
