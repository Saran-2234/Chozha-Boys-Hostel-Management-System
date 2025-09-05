import React from 'react';
import ReportCategories from './ReportCategories';

const Reports = () => {
  return (
    <section id="reports" className="section">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Reports</h2>
        <p className="text-slate-400">Generate and view various reports</p>
      </div>

      <ReportCategories />
    </section>
  );
};

export default Reports;
