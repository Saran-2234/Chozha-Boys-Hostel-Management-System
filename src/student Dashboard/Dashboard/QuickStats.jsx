import React from 'react';
import Card from '../Common/Card';
import { getRoomInfo } from '../../Common/roomUtils';

const QuickStats = ({ studentData, setActiveSection }) => {
  const { roomNumber, block, floor } = getRoomInfo(studentData);

  const handleCardClick = (section) => {
    if (setActiveSection) {
      setActiveSection(section);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card
        className="hover-lift cursor-pointer transition-all duration-200 hover:scale-105"
        onClick={() => handleCardClick('attendance')}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium">Attendance</p>
            <p className="text-2xl font-bold text-white">87.5%</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
            <span className="text-xl">✅</span>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-emerald-400">↗ 2.5%</span>
          <span className="text-slate-400 ml-2">from last month</span>
        </div>
      </Card>

      <Card
        className="hover-lift cursor-pointer transition-all duration-200 hover:scale-105"
        onClick={() => handleCardClick('messbill')}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium">Mess Bill</p>
            <p className="text-2xl font-bold text-white">₹2,450</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <span className="text-xl">🍽️</span>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-red-400">Pending</span>
          <span className="text-slate-400 ml-2">Due: Dec 30</span>
        </div>
      </Card>

      <Card
        className="hover-lift cursor-pointer transition-all duration-200 hover:scale-105"
        onClick={() => handleCardClick('complaints')}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium">Complaints</p>
            <p className="text-2xl font-bold text-white">2</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-xl">📝</span>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-blue-400">1 In Progress</span>
          <span className="text-slate-400 ml-2">1 Pending</span>
        </div>
      </Card>

      <Card
        className="hover-lift cursor-pointer transition-all duration-200 hover:scale-105"
        onClick={() => handleCardClick('profile')}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium">Room</p>
            <p className="text-2xl font-bold text-white">{roomNumber}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-xl">🏠</span>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-emerald-400">{block}</span>
          <span className="text-slate-400 ml-2">{floor}</span>
        </div>
      </Card>
    </div>
  );
};

export default QuickStats;
