import React, { useState } from 'react';
import Button from '../Common/Button';

const ReportCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState('attendance');

  const reportCategories = [
    {
      id: 'attendance',
      title: 'Attendance Reports',
      description: 'Generate attendance reports for students',
      icon: '📊',
      reports: [
        { name: 'Daily Attendance', description: 'Student attendance for selected date' },
        { name: 'Monthly Report', description: 'Attendance summary for the month' },
        { name: 'Defaulters List', description: 'Students with low attendance' }
      ]
    },
    {
      id: 'financial',
      title: 'Financial Reports',
      description: 'Mess bills and payment reports',
      icon: '💰',
      reports: [
        { name: 'Bill Summary', description: 'Monthly mess bill summary' },
        { name: 'Payment Status', description: 'Outstanding payments report' },
        { name: 'Revenue Report', description: 'Total revenue generated' }
      ]
    },
    {
      id: 'complaints',
      title: 'Complaints Reports',
      description: 'Complaint resolution and statistics',
      icon: '📋',
      reports: [
        { name: 'Resolution Time', description: 'Average complaint resolution time' },
        { name: 'Category-wise', description: 'Complaints by category' },
        { name: 'Pending Complaints', description: 'List of unresolved complaints' }
      ]
    },
    {
      id: 'occupancy',
      title: 'Room Occupancy',
      description: 'Room allocation and occupancy reports',
      icon: '🏠',
      reports: [
        { name: 'Occupancy Rate', description: 'Current room occupancy percentage' },
        { name: 'Vacant Rooms', description: 'List of available rooms' },
        { name: 'Room Utilization', description: 'Room usage statistics' }
      ]
    },
    {
      id: 'visitors',
      title: 'Visitor Reports',
      description: 'Visitor logs and statistics',
      icon: '👥',
      reports: [
        { name: 'Daily Visitors', description: 'Visitors for selected date' },
        { name: 'Monthly Summary', description: 'Visitor statistics for the month' },
        { name: 'Frequent Visitors', description: 'Most frequent visitors' }
      ]
    }
  ];

  const generateReport = (categoryId, reportName) => {
    // In a real app, this would generate and download the report
    alert(`Generating ${reportName} report for ${categoryId} category...`);
  };

  const exportAllReports = () => {
    // In a real app, this would export all reports
    alert('Exporting all reports...');
  };

  const currentCategory = reportCategories.find(cat => cat.id === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Reports & Analytics</h3>
        <Button
          onClick={exportAllReports}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          Export All Reports
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category Selection */}
        <div className="lg:col-span-1">
          <div className="glass-card rounded-xl p-4">
            <h4 className="text-lg font-semibold text-white mb-4">Categories</h4>
            <div className="space-y-2">
              {reportCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{category.icon}</span>
                    <div>
                      <div className="font-medium">{category.title}</div>
                      <div className="text-xs opacity-75">{category.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Report Details */}
        <div className="lg:col-span-3">
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-3xl">{currentCategory.icon}</span>
              <div>
                <h4 className="text-xl font-semibold text-white">{currentCategory.title}</h4>
                <p className="text-slate-400">{currentCategory.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentCategory.reports.map((report, index) => (
                <div key={index} className="border border-slate-600 rounded-lg p-4 hover:bg-slate-700 hover:bg-opacity-30 transition-colors">
                  <h5 className="font-medium text-white mb-2">{report.name}</h5>
                  <p className="text-slate-400 text-sm mb-4">{report.description}</p>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => generateReport(currentCategory.id, report.name)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded-lg"
                    >
                      Generate
                    </Button>
                    <Button
                      onClick={() => generateReport(currentCategory.id, report.name)}
                      className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1 text-sm rounded-lg"
                    >
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats for Selected Category */}
            <div className="mt-6 pt-6 border-t border-slate-600">
              <h5 className="text-lg font-semibold text-white mb-4">Quick Statistics</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">85%</div>
                  <div className="text-sm text-slate-400">Attendance Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">₹2.5L</div>
                  <div className="text-sm text-slate-400">Monthly Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">12</div>
                  <div className="text-sm text-slate-400">Pending Complaints</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">95%</div>
                  <div className="text-sm text-slate-400">Room Occupancy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCategories;
