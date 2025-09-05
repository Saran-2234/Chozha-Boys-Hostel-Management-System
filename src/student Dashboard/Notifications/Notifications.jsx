import React from 'react';

const Notifications = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Notifications & Messages</h2>
        <button className="btn-secondary text-white px-4 py-2 rounded-lg font-medium">
          ✅ Mark All Read
        </button>
      </div>

      <div className="space-y-4">
        <div className="notification-item notification-unread glass-card rounded-lg p-4">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">🍽️</span>
            </div>
            <div className="flex-1">
              <h4 className="text-white font-medium mb-1">New Mess Bill Generated</h4>
              <p className="text-slate-300 text-sm mb-2">Your December 2024 mess bill of ₹2,450 has been generated. Payment due by Dec 30, 2024.</p>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs">2 hours ago</span>
                <button className="text-blue-400 hover:text-blue-300 text-sm">View Bill →</button>
              </div>
            </div>
          </div>
        </div>

        <div className="notification-item notification-unread glass-card rounded-lg p-4">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">📝</span>
            </div>
            <div className="flex-1">
              <h4 className="text-white font-medium mb-1">Complaint Update</h4>
              <p className="text-slate-300 text-sm mb-2">Your complaint #C002 about food quality has been updated. Admin has provided a response.</p>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs">5 hours ago</span>
                <button className="text-blue-400 hover:text-blue-300 text-sm">View Update →</button>
              </div>
            </div>
          </div>
        </div>

        <div className="notification-item glass-card rounded-lg p-4">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">✅</span>
            </div>
            <div className="flex-1">
              <h4 className="text-white font-medium mb-1">Attendance Confirmed</h4>
              <p className="text-slate-300 text-sm mb-2">Your attendance for Dec 19, 2024 has been confirmed by the admin.</p>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs">1 day ago</span>
                <span className="text-slate-500 text-xs">Read</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
