import React from 'react';

const Visitors = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4 max-w-full relative z-10">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Visitor Management</h2>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
          <button className="btn-primary text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base w-full sm:w-auto transition-all duration-200 relative z-20">
            👥 Request Visitor Approval
          </button>
        </div>
      </div>

      <div className="glass-card rounded-xl p-4 sm:p-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4 sm:mb-6">Recent Visitors</h3>

        {/* Desktop/Tablet Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-600">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Visitor Name</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Relation</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Visit Date</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Entry Time</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Exit Time</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-700">
                <td className="py-3 px-4 text-white">Suresh Kumar</td>
                <td className="py-3 px-4 text-slate-400">Father</td>
                <td className="py-3 px-4 text-white">Dec 18, 2024</td>
                <td className="py-3 px-4 text-slate-400">10:30 AM</td>
                <td className="py-3 px-4 text-slate-400">02:15 PM</td>
                <td className="py-3 px-4"><span className="status-resolved">Completed</span></td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-3 px-4 text-white">Priya Kumar</td>
                <td className="py-3 px-4 text-slate-400">Sister</td>
                <td className="py-3 px-4 text-white">Dec 15, 2024</td>
                <td className="py-3 px-4 text-slate-400">11:00 AM</td>
                <td className="py-3 px-4 text-slate-400">01:30 PM</td>
                <td className="py-3 px-4"><span className="status-resolved">Completed</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile Card Layout */}
        <div className="sm:hidden space-y-4">
          <div className="p-4 bg-slate-900 bg-opacity-20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="text-white font-medium">Suresh Kumar</div>
              <span className="status-resolved text-xs">Completed</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Relation</span>
                <span className="text-white">Father</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Visit Date</span>
                <span className="text-white">Dec 18, 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Entry Time</span>
                <span className="text-slate-400">10:30 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Exit Time</span>
                <span className="text-slate-400">02:15 PM</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-900 bg-opacity-20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="text-white font-medium">Priya Kumar</div>
              <span className="status-resolved text-xs">Completed</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Relation</span>
                <span className="text-white">Sister</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Visit Date</span>
                <span className="text-white">Dec 15, 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Entry Time</span>
                <span className="text-slate-400">11:00 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Exit Time</span>
                <span className="text-slate-400">01:30 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Pending Visitor Requests</h3>
        <div className="space-y-4">
          <div className="glass-effect rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-lg">👨‍👩‍👧‍👦</span>
                <div>
                  <h4 className="text-white font-medium">Family Visit Request</h4>
                  <p className="text-slate-400 text-sm">Request ID: #V001</p>
                </div>
              </div>
              <span className="status-pending bg-yellow-500 bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
                Pending Approval
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Visitor: <span className="text-white">Suresh Kumar & Lakshmi Kumar</span></p>
                <p className="text-slate-400">Relation: <span className="text-white">Parents</span></p>
              </div>
              <div>
                <p className="text-slate-400">Requested Date: <span className="text-white">Dec 25, 2024</span></p>
                <p className="text-slate-400">Time: <span className="text-white">10:00 AM - 04:00 PM</span></p>
              </div>
            </div>
            <p className="text-slate-300 text-sm mt-3">Purpose: Festival celebration and family time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visitors;
