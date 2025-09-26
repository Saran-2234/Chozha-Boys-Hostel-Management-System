import React, { useState } from 'react';
import Modal from '../Common/Modal';

const MessBill = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

    // Mock student info - in real app, get from auth context or localStorage
    const studentInfo = {
      id: 'STU004', // Mock ID
      name: 'Current Student' // Mock name
    };

    const application = {
      id: Date.now(), // Simple unique ID
      studentId: studentInfo.id,
      studentName: studentInfo.name,
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
          <button className="btn-primary text-white px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base w-full sm:w-auto">
            💳 Pay Now
          </button>
          <button 
            onClick={handleApplyClick}
            className="btn-secondary text-white px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base w-full sm:w-auto cursor-pointer"
            style={{ pointerEvents: 'auto', zIndex: 10 }}
          >
            📉 Apply for Reduction
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

      <div className="glass-card rounded-xl p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
          <h3 className="text-lg sm:text-xl font-semibold text-white">December 2024 Bill</h3>
          <span className="status-unpaid bg-red-500 bg-opacity-20 px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-start sm:self-auto">
            Pending Payment
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Bill Details</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Vegetarian Days</span>
                <span className="text-white">20 days × ₹80</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Non-Vegetarian Days</span>
                <span className="text-white">10 days × ₹120</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Special Meals</span>
                <span className="text-white">2 days × ₹150</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Service Charge</span>
                <span className="text-white">₹50</span>
              </div>
              <hr className="border-slate-600" />
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-white">Total Amount</span>
                <span className="text-white">₹2,450</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-white mb-4">Payment Information</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Bill Generated</span>
                <span className="text-white">Dec 1, 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Due Date</span>
                <span className="text-red-400">Dec 30, 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Days Remaining</span>
                <span className="text-yellow-400">10 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Late Fee (if any)</span>
                <span className="text-white">₹100</span>
              </div>
            </div>

            <div className="mt-6">
              <button className="w-full btn-primary text-white py-3 rounded-lg font-semibold text-lg">
                💳 Pay ₹2,450 Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-white mb-4 sm:mb-6">Payment History</h3>

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
              <tr className="border-b border-slate-700">
                <td className="py-3 px-4 text-white">November 2024</td>
                <td className="py-3 px-4 text-white">₹2,300</td>
                <td className="py-3 px-4"><span className="status-paid">Paid</span></td>
                <td className="py-3 px-4 text-slate-400">Nov 28, 2024</td>
                <td className="py-3 px-4">
                  <button className="text-blue-400 hover:text-blue-300 text-sm">📄 Download</button>
                </td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-3 px-4 text-white">October 2024</td>
                <td className="py-3 px-4 text-white">₹2,400</td>
                <td className="py-3 px-4"><span className="status-paid">Paid</span></td>
                <td className="py-3 px-4 text-slate-400">Oct 30, 2024</td>
                <td className="py-3 px-4">
                  <button className="text-blue-400 hover:text-blue-300 text-sm">📄 Download</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile Card Layout */}
        <div className="sm:hidden space-y-4">
          <div className="p-4 bg-slate-900 bg-opacity-20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="text-white font-medium">November 2024</div>
              <span className="status-paid text-xs">Paid</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Amount</span>
                <span className="text-white">₹2,300</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Date</span>
                <span className="text-slate-400">Nov 28, 2024</span>
              </div>
              <div className="pt-2">
                <button className="text-blue-400 hover:text-blue-300 text-sm">📄 Download Receipt</button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-900 bg-opacity-20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="text-white font-medium">October 2024</div>
              <span className="status-paid text-xs">Paid</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Amount</span>
                <span className="text-white">₹2,400</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Date</span>
                <span className="text-slate-400">Oct 30, 2024</span>
              </div>
              <div className="pt-2">
                <button className="text-blue-400 hover:text-blue-300 text-sm">📄 Download Receipt</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessBill;
