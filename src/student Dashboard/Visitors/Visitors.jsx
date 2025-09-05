import React from 'react';

const Visitors = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Visitor Management</h2>
        <button className="btn-primary text-white px-6 py-3 rounded-lg font-medium">
          👥 Request Visitor Approval
        </button>
      </div>

      <div className="glass-card rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-6">Recent Visitors</h3>
        <div className="overflow-x-auto">
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
