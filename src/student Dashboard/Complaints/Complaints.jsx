import React, { useState } from 'react';
import ComplaintModal from './ComplaintModal';

const Complaints = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Complaint Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary text-white px-6 py-3 rounded-lg font-medium"
        >
          📝 Raise New Complaint
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="glass-card rounded-xl p-6 text-center">
          <div className="text-2xl font-bold text-white mb-2">5</div>
          <div className="text-slate-400 text-sm">Total Complaints</div>
        </div>
        <div className="glass-card rounded-xl p-6 text-center">
          <div className="text-2xl font-bold text-yellow-400 mb-2">1</div>
          <div className="text-slate-400 text-sm">Pending</div>
        </div>
        <div className="glass-card rounded-xl p-6 text-center">
          <div className="text-2xl font-bold text-blue-400 mb-2">1</div>
          <div className="text-slate-400 text-sm">In Progress</div>
        </div>
        <div className="glass-card rounded-xl p-6 text-center">
          <div className="text-2xl font-bold text-emerald-400 mb-2">3</div>
          <div className="text-slate-400 text-sm">Resolved</div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">My Complaints</h3>
        <div className="space-y-4">
          <div className="glass-effect rounded-lg p-4 border-l-4 border-yellow-400">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-lg">🔧</span>
                <div>
                  <h4 className="text-white font-medium">Room AC Not Working</h4>
                  <p className="text-slate-400 text-sm">Complaint ID: #C001</p>
                </div>
              </div>
              <span className="status-pending bg-yellow-500 bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
                Pending
              </span>
            </div>
            <p className="text-slate-300 text-sm mb-3">The air conditioning unit in room A-204 has stopped working since yesterday. Please arrange for repair.</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Submitted: Dec 19, 2024</span>
              <span className="text-slate-400">Category: Maintenance</span>
            </div>
          </div>

          <div className="glass-effect rounded-lg p-4 border-l-4 border-blue-400">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-lg">🍽️</span>
                <div>
                  <h4 className="text-white font-medium">Food Quality Issue</h4>
                  <p className="text-slate-400 text-sm">Complaint ID: #C002</p>
                </div>
              </div>
              <span className="status-progress bg-blue-500 bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
                In Progress
              </span>
            </div>
            <p className="text-slate-300 text-sm mb-3">The food quality has been inconsistent lately. Please improve the mess food standards.</p>
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-slate-400">Submitted: Dec 15, 2024</span>
              <span className="text-slate-400">Category: Mess</span>
            </div>
            <div className="glass-effect rounded p-3">
              <p className="text-emerald-400 text-sm font-medium mb-1">Admin Response:</p>
              <p className="text-slate-300 text-sm">We have noted your concern and are working with the mess contractor to improve food quality. Expected resolution by Dec 25.</p>
            </div>
          </div>
        </div>
      </div>

      {showModal && <ComplaintModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Complaints;
