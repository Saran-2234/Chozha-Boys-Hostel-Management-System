import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecentActivities = ({ isDarkMode }) => {
  const activities = [
    {
      icon: '👤',
      title: 'New student registered',
      description: 'John Doe joined the hostel',
      time: '2 hours ago',
      bgColor: 'bg-blue-500'
    },
    {
      icon: '💰',
      title: 'Bill payment received',
      description: 'Payment of ₹2,500 from Room 101',
      time: '4 hours ago',
      bgColor: 'bg-green-500'
    },
    {
      icon: '📝',
      title: 'Complaint resolved',
      description: 'Maintenance issue in Room 205 fixed',
      time: '6 hours ago',
      bgColor: 'bg-yellow-500'
    },
    {
      icon: '✅',
      title: 'Attendance marked',
      description: 'Daily attendance for all students completed',
      time: '8 hours ago',
      bgColor: 'bg-purple-500'
    },
    {
      icon: '🏠',
      title: 'Room allocation updated',
      description: 'Room 301 assigned to new student',
      time: '1 day ago',
      bgColor: 'bg-indigo-500'
    }
  ];

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Recent Activities</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className={`flex items-center space-x-4 p-3 rounded-lg ${isDarkMode ? 'bg-slate-700 bg-opacity-50' : 'bg-gray-100'}`}>
            <div className={`w-10 h-10 ${activity.bgColor} bg-opacity-20 rounded-full flex items-center justify-center`}>
              <span>{activity.icon}</span>
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{activity.title}</p>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{activity.description}</p>
            </div>
            <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivities;
