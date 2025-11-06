import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../Common/Modal';

const MessBill = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [messBills, setMessBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState(null);

  const API_BASE_URL = 'https://finalbackend1.vercel.app';

  useEffect(() => {
    // Load Cashfree SDK
    const loadCashfreeSDK = () => {
      if (!window.Cashfree) {
        const script = document.createElement('script');
        script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
        script.async = true;
        document.head.appendChild(script);
      }
    };
    loadCashfreeSDK();

    // Load student data from localStorage
    const token = localStorage.getItem('studentToken');
    const userData = localStorage.getItem('userData');
    const studentId = localStorage.getItem('studentId');

    if (token && userData && studentId) {
      setStudentData({
        token,
        ...JSON.parse(userData),
        id: studentId
      });
      fetchMessBills(token, studentId);
    } else {
      setError('Authentication required. Please login again.');
    }
  }, []);

  const fetchMessBills = async (token, studentId) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/showmessbillbyid1`, {
        student_id: studentId,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true,
      });

      if (response.data && response.data.data) {
        setMessBills(response.data.data);
      } else {
        setMessBills([]);
      }
    } catch (err) {
      console.error('Error fetching mess bills:', err);
      setMessBills([]);
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const payNow = async (year_month) => {
    if (!studentData) {
      setError('Student data not available. Please login again.');
      return;
    }

    if (!confirm(`Proceed to pay for ${year_month}?`)) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/create-order`, {
        student_id: studentData.id,
        year_month,
        student_name: studentData.name,
        student_email: studentData.email,
        student_phone: studentData.student_contact_number || '9999999999'
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${studentData.token}`
        },
        withCredentials: true,
      });

      const data = response.data;

      if (response.status !== 200 || data.error) {
        alert(data.error || data.message || "Payment request failed.");
        console.error("Backend error:", data);
        return;
      }

      const paymentSessionId = data.cashfree_response?.payment_session_id;
      if (!paymentSessionId) {
        alert("Failed to get payment session ID from backend.");
        console.error(data);
        return;
      }

      if (window.Cashfree) {
        const cashfree = window.Cashfree({ mode: "sandbox" });
        cashfree.checkout({
          paymentSessionId: paymentSessionId,
          redirectTarget: "_self"
        });
      } else {
        alert('Payment system not loaded. Please try again.');
      }

    } catch (err) {
      console.error(err);
      alert('Payment failed. Please try again.');
    }
  };

  const handleApplyClick = () => {
    console.log('Apply for Reduction button clicked');
    setError('');
    setFromDate('');
    setToDate('');
    setReason('');
    setIsModalOpen(true);
  };

  const validateForm = () => {
    if (!fromDate || !toDate || !reason.trim()) {
      setError('All fields are required.');
      return false;
    }
    const from = new Date(fromDate);
    const to = new Date(toDate);
    if (to <= from) {
      setError('To date must be after from date.');
      return false;
    }
    const diffTime = to - from;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    if (diffDays < 5) {
      setError('Reduction period must be 5 days or greater.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!studentData) {
      setError('Student data not available. Please login again.');
      return;
    }

    const application = {
      id: Date.now(), // Simple unique ID
      studentId: studentData.id,
      studentName: studentData.name || 'Unknown Student',
      fromDate,
      toDate,
      reason,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };

    // Store in localStorage for admin to access
    const existingApps = JSON.parse(localStorage.getItem('reductionApplications') || '[]');
    localStorage.setItem('reductionApplications', JSON.stringify([...existingApps, application]));

    setSuccess('Reduction application submitted successfully!');
    setIsModalOpen(false);
    setTimeout(() => setSuccess(''), 3000);

    // Reset form
    setFromDate('');
    setToDate('');
    setReason('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {error && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-500 bg-opacity-20 border border-green-500 text-green-400 p-3 rounded-lg mb-4">
          {success}
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Mess Bill Management</h2>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <button className="btn-secondary text-white px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base w-full sm:w-auto">
            📄 Download Bill
          </button>
        </div>
      </div>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Apply for Mess Bill Reduction</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-300 mb-2">Reduction From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-2">Reduction To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-2">Reason for Reduction</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white"
                  placeholder="Enter reason..."
                  required
                />
              </div>
              {error && <div className="text-red-400 text-sm">{error}</div>}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 btn-secondary text-white py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary text-white py-2 rounded-lg"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p className="text-slate-400">Loading mess bills...</p>
        </div>
      ) : messBills.length > 0 ? (
        <div className="glass-card rounded-xl p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Mess Bills</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Month-Year</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Grocery Cost</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Vegetable Cost</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Gas Charges</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Milk Litres</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Milk Cost/Litre</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Milk Charges</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Other Cost</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Total Expenditure</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Expenditure After Income</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Mess Fee/Day</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {messBills.map((bill) => {
                  const status = bill.status ? bill.status.toUpperCase() : 'UNPAID';
                  const isPaid = status === 'PAID' || status === 'SUCCESS';

                  return (
                    <tr key={bill.mess_bill_id || bill.month_year} className="border-b border-slate-700">
                      <td className="py-3 px-4 text-white">{bill.month_year ?? '-'}</td>
                      <td className="py-3 px-4 text-white">₹{bill.grocery_cost ?? 0}</td>
                      <td className="py-3 px-4 text-white">₹{bill.vegetable_cost ?? 0}</td>
                      <td className="py-3 px-4 text-white">₹{bill.gas_charges ?? 0}</td>
                      <td className="py-3 px-4 text-white">{bill.total_milk_litres ?? 0}</td>
                      <td className="py-3 px-4 text-white">₹{bill.milk_cost_per_litre ?? 0}</td>
                      <td className="py-3 px-4 text-white">₹{bill.milk_charges_computed ?? 0}</td>
                      <td className="py-3 px-4 text-white">₹{bill.other_costs ?? 0}</td>
                      <td className="py-3 px-4 text-white">₹{bill.total_expenditure ?? 0}</td>
                      <td className="py-3 px-4 text-white">₹{bill.expenditure_after_income ?? 0}</td>
                      <td className="py-3 px-4 text-white">₹{bill.mess_fee_per_day ?? 0}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          isPaid ? 'bg-green-500 bg-opacity-20 text-green-400' : 'bg-red-500 bg-opacity-20 text-red-400'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {isPaid ? (
                          <span className="text-green-400 font-medium">PAID</span>
                        ) : (
                          <button
                            className="btn-primary text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                            onClick={() => payNow(bill.month_year)}
                          >
                            Pay Now
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-slate-400">No mess bills found.</p>
        </div>
      )}

      <div className="glass-card rounded-xl p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-white mb-4 sm:mb-6">Payment History</h3>

        {messBills.length > 0 ? (
          <>
            {/* Desktop/Tablet Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Month</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Payment Date</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {messBills.map((bill) => (
                    <tr key={bill.mess_bill_id} className="border-b border-slate-700">
                      <td className="py-3 px-4 text-white">{bill.month_year}</td>
                      <td className="py-3 px-4 text-white">₹{bill.total_expenditure}</td>
                      <td className="py-3 px-4">
                        <span className={bill.status === 'PAID' ? 'status-paid' : 'status-unpaid'}>
                          {bill.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {bill.status === 'PAID' ? new Date(bill.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        {bill.status === 'PAID' && (
                          <button className="text-blue-400 hover:text-blue-300 text-sm">📄 Download</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Layout */}
            <div className="sm:hidden space-y-4">
              {messBills.map((bill) => (
                <div key={bill.mess_bill_id} className="p-4 bg-slate-900 bg-opacity-20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white font-medium">{bill.month_year}</div>
                    <span className={`text-xs ${bill.status === 'PAID' ? 'status-paid' : 'status-unpaid'}`}>
                      {bill.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Amount</span>
                      <span className="text-white">₹{bill.total_expenditure}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Payment Date</span>
                      <span className="text-slate-400">
                        {bill.status === 'PAID' ? new Date(bill.created_at).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    {bill.status === 'PAID' && (
                      <div className="pt-2">
                        <button className="text-blue-400 hover:text-blue-300 text-sm">📄 Download Receipt</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-400">No payment history available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessBill;
