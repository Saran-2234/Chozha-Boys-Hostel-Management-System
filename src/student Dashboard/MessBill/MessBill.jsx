import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../../admin Dashboard/Common/Modal';

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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

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
      // fetchMessBills(token, studentId, 1); // Triggered by useEffect dependency on studentData
    } else {
      setError('Authentication required. Please login again.');
    }
  }, []);

  const fetchMessBills = async (token, studentId, pageNum) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/students/showmessbillbyid1`, {
        student_id: studentId,
        page: pageNum,
        limit: 10,
        year: selectedYear,
        month: selectedMonth,
        status: selectedStatus
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true,
      });

      if (response.data && response.data.data) {
        setMessBills(response.data.data);
        setTotalPages(response.data.totalPages || 1);
        setPage(pageNum);
      } else {
        setMessBills([]);
        setTotalPages(0);
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

  useEffect(() => {
    if (studentData) {
      fetchMessBills(studentData.token, studentData.id, 1);
    }
  }, [selectedYear, selectedMonth, selectedStatus, studentData]);

  const handlePrevious = () => {
    if (page > 1 && studentData) {
      fetchMessBills(studentData.token, studentData.id, page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages && studentData) {
      fetchMessBills(studentData.token, studentData.id, page + 1);
    }
  };

  const payNow = async (year_month) => {
    console.log('Pay Now button clicked for:', year_month);
    if (!studentData) {
      setError('Student data not available. Please login again.');
      return;
    }

    if (!confirm(`Proceed to pay for ${year_month}?`)) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/students/create-order`, {
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
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Mess Bill Management</h2>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <button className="btn-secondary text-gray-800 px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base w-full sm:w-auto">
            📄 Download Bill
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-32 p-2.5"
          >
            <option value="">All Years</option>
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-36 p-2.5"
          >
            <option value="">All Months</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-32 p-2.5"
          >
            <option value="">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </div>
      </div>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
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
          <p className="text-gray-600">Loading mess bills...</p>
        </div>
      ) : messBills.length > 0 ? (
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-2xl border border-gray-300">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Mess Bills</h3>
          {messBills.map((bill) => {
            const status = bill.status ? bill.status.toUpperCase() : 'UNPAID';
            const isPaid = status === 'PAID' || status === 'SUCCESS';
            const totalAmount = (parseFloat(bill.number_of_days || 0) * parseFloat(bill.mess_fee_per_day || 0)) +
              (parseFloat(bill.veg_days || 0) * parseFloat(bill.veg_extra_per_day || 0)) +
              (parseFloat(bill.non_veg_days || 0) * parseFloat(bill.nonveg_extra_per_day || 0));

            return (
              <div key={bill.mess_bill_id || bill.month_year} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-300 relative z-10">
                  <h4 className="text-gray-800 font-semibold mb-3 flex items-center">
                    <span className="mr-2">👤</span> Student Mess Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Month Year:</span>
                      <span className="text-gray-800">{bill.month_year ?? '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Number of Days Present:</span>
                      <span className="text-gray-800">{bill.number_of_days ?? 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mess Fee/Day:</span>
                      <span className="text-gray-800">₹{bill.mess_fee_per_day ?? 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Veg Days:</span>
                      <span className="text-gray-800">{bill.veg_days ?? 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Non Veg Days:</span>
                      <span className="text-gray-800">{bill.non_veg_days ?? 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="text-gray-800">₹{totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {status}
                      </span>
                    </div>
                    {!isPaid && (
                      <div className="pt-2">
                        <button
                          type="button"
                          className="btn-primary text-white px-4 py-2 rounded text-sm hover:bg-blue-600 w-full cursor-pointer"
                          onClick={() => payNow(bill.month_year)}
                        >
                          Pay Now
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-300">
                  <h4 className="text-gray-800 font-semibold mb-3 flex items-center">
                    <span className="mr-2">📊</span> Monthly Calculations
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Grocery Cost:</span>
                      <span className="text-gray-800">₹{bill.grocery_cost ?? 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vegetable Cost:</span>
                      <span className="text-gray-800">₹{bill.vegetable_cost ?? 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gas Charges:</span>
                      <span className="text-gray-800">₹{bill.gas_charges ?? 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Milk Litres:</span>
                      <span className="text-gray-800">{bill.total_milk_litres ?? 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Milk Cost/Litre:</span>
                      <span className="text-gray-800">₹{bill.milk_cost_per_litre ?? 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Milk Charges:</span>
                      <span className="text-gray-800">₹{bill.milk_charges_computed ?? 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Other Cost:</span>
                      <span className="text-gray-800">₹{bill.other_costs ?? 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expenditure After Income:</span>
                      <span className="text-gray-800">₹{bill.expenditure_after_income ?? 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex justify-center mt-6 gap-2">
            <button
              onClick={handlePrevious}
              disabled={page === 1}
              className={`px-4 py-2 rounded text-sm font-medium ${page === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-gray-600 font-medium flex items-center">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded text-sm font-medium ${page === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No mess bills found.</p>
        </div>
      )}

      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-2xl border border-gray-300 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 sm:mb-6">Payment History</h3>

        {messBills.length > 0 ? (
          <>
            {/* Desktop/Tablet Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Month</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Payment Date</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {messBills.map((bill) => {
                    const status = bill.status ? bill.status.toUpperCase() : 'UNPAID';
                    const isPaid = status === 'PAID' || status === 'SUCCESS';
                    return (
                      <tr key={bill.mess_bill_id} className="border-b border-gray-200">
                        <td className="py-3 px-4 text-gray-800">{bill.month_year}</td>
                        <td className="py-3 px-4 text-gray-800">₹{bill.total_expenditure}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {bill.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {isPaid ? new Date(bill.paid_date).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          {isPaid && (
                            <button className="text-blue-600 hover:text-blue-500 text-sm">📄 Download</button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Layout */}
            <div className="sm:hidden space-y-4">
              {messBills.map((bill) => {
                const status = bill.status ? bill.status.toUpperCase() : 'UNPAID';
                const isPaid = status === 'PAID' || status === 'SUCCESS';
                return (
                  <div key={bill.mess_bill_id} className="p-4 bg-gray-100 rounded-lg border border-gray-300">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-gray-800 font-medium">{bill.month_year}</div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {bill.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount</span>
                        <span className="text-gray-800">₹{bill.total_expenditure}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Date</span>
                        <span className="text-gray-600">
                          {isPaid ? new Date(bill.paid_date).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      {isPaid && (
                        <div className="pt-2">
                          <button className="text-blue-600 hover:text-blue-500 text-sm">📄 Download Receipt</button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No payment history available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessBill;
