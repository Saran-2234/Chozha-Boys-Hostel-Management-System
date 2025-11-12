import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../Common/Card';
import { getRoomInfo } from '../../Common/roomUtils';

const QuickStats = ({ studentData, setActiveSection }) => {
  const { roomNumber, block, floor } = getRoomInfo(studentData);
  const [messBillData, setMessBillData] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'https://finalbackend1.vercel.app';

  useEffect(() => {
    const fetchData = async () => {
      if (!studentData) return;

      const token = localStorage.getItem('studentToken');
      const studentId = localStorage.getItem('studentId');

      if (!token || !studentId) return;

      try {
        // Fetch mess bill data
        const messBillResponse = await axios.post(`${API_BASE_URL}/showmessbillbyid1`, {
          student_id: studentId,
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true,
        });

        if (messBillResponse.data && messBillResponse.data.data && messBillResponse.data.data.length > 0) {
          const latestBill = messBillResponse.data.data[0];
          setMessBillData(latestBill);
        }

        // Fetch attendance data
        const attendanceResponse = await axios.post(`${API_BASE_URL}/attendance`, {
          id: studentId,
          token: token,
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true,
        });

        if (attendanceResponse.data && attendanceResponse.data.success) {
          const attendanceRecords = Array.isArray(attendanceResponse.data.data)
            ? attendanceResponse.data.data
            : [attendanceResponse.data.data];

          // Calculate attendance percentage
          const totalDays = attendanceRecords.length;
          const presentDays = attendanceRecords.filter(record => {
            const status = record.status || record.present;
            return status === 'present' || status === true || status === 1;
          }).length;

          const attendancePercentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0;

          setAttendanceData({
            percentage: attendancePercentage,
            presentDays: presentDays,
            totalDays: totalDays,
            records: attendanceRecords
          });
        }

      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentData]);

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
            <p className="text-2xl font-bold text-white">
              {loading ? '...' : attendanceData ? `${attendanceData.percentage}%` : '0%'}
            </p>
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
            <p className="text-2xl font-bold text-white">
              {loading ? '...' : messBillData ? `₹${(messBillData.number_of_days * messBillData.mess_fee_per_day + messBillData.veg_days * messBillData.veg_extra_per_day + messBillData.non_veg_days * messBillData.nonveg_extra_per_day).toFixed(0)}` : '₹0'}
            </p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <span className="text-xl">🍽️</span>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className={`font-medium ${messBillData && messBillData.status === 'SUCCESS' ? 'text-green-400' : 'text-red-400'}`}>
            {loading ? 'Loading...' : messBillData ? (messBillData.status === 'SUCCESS' ? 'Paid' : 'Pending') : 'No Data'}
          </span>
          <span className="text-slate-400 ml-2">
            {messBillData ? `Month: ${messBillData.month_year}` : ''}
          </span>
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
