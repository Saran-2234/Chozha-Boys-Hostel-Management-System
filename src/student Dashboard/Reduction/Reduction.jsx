import React from 'react';

const Reduction = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Reduction Application</h2>
      <p className="text-slate-400 mb-6">
        Apply for mess bill reduction by providing the necessary details below.
      </p>
      <form className="space-y-4">
        <div>
          <label className="block text-slate-300 mb-2">Reduction From Date</label>
          <input
            type="date"
            className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white"
            required
          />
        </div>
        <div>
          <label className="block text-slate-300 mb-2">Reduction To Date</label>
          <input
            type="date"
            className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white"
            required
          />
        </div>
        <div>
          <label className="block text-slate-300 mb-2">Reason for Reduction</label>
          <textarea
            rows={4}
            className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white"
            placeholder="Enter reason..."
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default Reduction;