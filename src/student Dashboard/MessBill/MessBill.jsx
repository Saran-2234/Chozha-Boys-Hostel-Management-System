import React from 'react';

const MessBill = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Mess Bill Management</h2>
        <div className="flex space-x-3">
          <button className="btn-secondary text-white px-4 py-2 rounded-lg font-medium">
            📄 Download Bill
          </button>
          <button className="btn-primary text-white px-4 py-2 rounded-lg font-medium">
            💳 Pay Now
          </button>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">December 2024 Bill</h3>
          <span className="status-unpaid bg-red-500 bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
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

      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Payment History</h3>
        <div className="overflow-x-auto">
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
                  <button className="text-blue-400 hover:text-blue-300">📄 Download</button>
                </td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-3 px-4 text-white">October 2024</td>
                <td className="py-3 px-4 text-white">₹2,400</td>
                <td className="py-3 px-4"><span className="status-paid">Paid</span></td>
                <td className="py-3 px-4 text-slate-400">Oct 30, 2024</td>
                <td className="py-3 px-4">
                  <button className="text-blue-400 hover:text-blue-300">📄 Download</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MessBill;
