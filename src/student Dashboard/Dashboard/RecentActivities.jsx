import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../Common/Card';

const RecentActivities = ({ setActiveSection, studentData }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleActivityClick = (section) => {
    if (setActiveSection) {
      setActiveSection(section);
    }
  };

  const getAuthToken = () => {
    return localStorage.getItem('studentToken') ||
      localStorage.getItem('accessToken') ||
      sessionStorage.getItem('studentToken');
  };

  const decodeJWT = (token) => {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      return null;
    }
  };

  const isTokenExpired = (token) => {
    try {
      const decoded = decodeJWT(token);
      if (!decoded || !decoded.exp) return true;
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (e) {
      return true;
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const activityDate = new Date(dateString);
    const diffInMs = now - activityDate;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInMs / (1000 * 60));
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInDays);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  const fetchRecentActivities = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      if (!token || isTokenExpired(token)) {
        console.log('No valid token for activities');
        setActivities([]);
        return;
      }

      const decoded = decodeJWT(token);
      const studentId = decoded?.id;

      if (!studentId) {
        console.log('No student ID found');
        setActivities([]);
        return;
      }

      const allActivities = [];

      // Fetch recent attendance
      try {
        const attendanceResponse = await axios.post(
          'https://finalbackend1.vercel.app/students/attendance',
          { id: studentId, token },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            withCredentials: true
          }
        );

        if (attendanceResponse.data.success && attendanceResponse.data.data) {
          const attendanceData = Array.isArray(attendanceResponse.data.data)
            ? attendanceResponse.data.data
            : [attendanceResponse.data.data];

          attendanceData.slice(0, 3).forEach(attendance => {
            if (attendance.date) {
              const status = attendance.status || attendance.present;
              const isPresent = status === 'present' || status === true || status === 1;
              const statusText = isPresent ? 'present' : 'absent';
              const statusIcon = isPresent ? '✅' : '❌';
              const statusColor = isPresent ? 'bg-emerald-500' : 'bg-red-500';

              allActivities.push({
                icon: statusIcon,
                iconBg: statusColor,
                title: `Attendance marked as ${statusText} for ${new Date(attendance.date).toLocaleDateString()}`,
                time: formatTimeAgo(attendance.date),
                timestamp: new Date(attendance.date),
                section: 'attendance'
              });
            }
          });
        }
      } catch (error) {
        console.log('Error fetching attendance:', error);
      }

      // Fetch recent complaints
      try {
        const complaintsResponse = await axios.post(
          'https://finalbackend1.vercel.app/fetchcomplaintsforstudents',
          { id: studentId, token },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            withCredentials: true
          }
        );

        if (complaintsResponse.data.success && complaintsResponse.data.data) {
          const complaintsData = Array.isArray(complaintsResponse.data.data)
            ? complaintsResponse.data.data
            : [complaintsResponse.data.data];

          complaintsData.slice(0, 3).forEach(complaint => {
            if (complaint.created_at) {
              allActivities.push({
                icon: '📝',
                iconBg: 'bg-blue-500',
                title: `New complaint registered`,
                time: formatTimeAgo(complaint.created_at),
                timestamp: new Date(complaint.created_at),
                section: 'complaints'
              });
            }
          });
        }
      } catch (error) {
        console.log('Error fetching complaints:', error);
      }

      // Fetch recent mess bills
      try {
        const billsResponse = await axios.post(
          'https://finalbackend1.vercel.app/students/showmessbillbyid1',
          { student_id: studentId },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            withCredentials: true
          }
        );

        if (billsResponse.data.success && billsResponse.data.data) {
          const billsData = Array.isArray(billsResponse.data.data)
            ? billsResponse.data.data
            : [billsResponse.data.data];

          billsData.slice(0, 2).forEach(bill => {
            if (bill.created_at || bill.year_month) {
              const billDate = bill.created_at || bill.year_month;
              let periodText = '';

              if (bill.year_month) {
                const parts = bill.year_month.split('-');
                if (parts.length >= 2) {
                  const year = parts[0];
                  const monthNum = parseInt(parts[1]);
                  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
                  const monthName = monthNames[monthNum - 1];
                  if (monthName && year) {
                    periodText = `${monthName} ${year}`;
                  }
                }
              }

              // Fallback to formatted date if period parsing fails
              if (!periodText && billDate) {
                periodText = new Date(billDate).toLocaleDateString();
              }

              // Check if bill is paid
              const isPaid = bill.status === 'paid' || bill.payment_status === 'paid' || bill.paid === true;
              const activityTitle = isPaid
                ? `Paid mess bill${periodText ? ` for ${periodText}` : ''}`
                : `New mess bill received${periodText ? ` for ${periodText}` : ''}`;

              allActivities.push({
                icon: isPaid ? '💰' : '🍽️',
                iconBg: isPaid ? 'bg-green-500' : 'bg-orange-500',
                title: activityTitle,
                time: formatTimeAgo(billDate),
                timestamp: new Date(billDate),
                section: 'messbill'
              });
            }
          });
        }
      } catch (error) {
        console.log('Error fetching mess bills:', error);
      }

      // Sort activities by timestamp (most recent first)
      allActivities.sort((a, b) => b.timestamp - a.timestamp);

      // Take only the 3 most recent activities
      setActivities(allActivities.slice(0, 3));

    } catch (error) {
      console.error('Error fetching recent activities:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentData) {
      fetchRecentActivities();
    }
  }, [studentData]);

  return (
    <Card>
      <h3 className="text-lg font-semibold text-white mb-4">Recent Activities</h3>
      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-slate-400 py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
            Loading activities...
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center text-slate-400 py-4">
            <div className="text-lg mb-2">📋</div>
            <div className="text-sm">No recent activities</div>
          </div>
        ) : (
          activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 glass-effect rounded-lg cursor-pointer transition-all duration-200 hover:bg-white hover:bg-opacity-5"
              onClick={() => handleActivityClick(activity.section)}
            >
              <div className={`w-8 h-8 ${activity.iconBg} rounded-full flex items-center justify-center`}>
                <span className="text-sm">{activity.icon}</span>
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{activity.title}</p>
                <p className="text-slate-400 text-xs">{activity.time}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default RecentActivities;
