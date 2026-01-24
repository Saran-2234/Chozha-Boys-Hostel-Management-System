import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import MainContent from '../Header/MainContent';

const PaidStudents = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState({ department: '', year: '' });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [monthYear, setMonthYear] = useState('');

  useEffect(() => {
    if (location.state && location.state.month) {
      setMonthYear(location.state.month);
    }
  }, [location.state]);

  useEffect(() => {
    if (monthYear) {
      fetchPaidStudents();
    }
  }, [monthYear, filter]);

  const fetchPaidStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

      const payload = {
        month_year: monthYear,
        status: 'PAID',
        ...(filter.department && { department: filter.department }),
        ...(filter.year && { year: filter.year })
      };

      const response = await fetch('https://finalbackend1.vercel.app/admin/fetch-paid-unpaid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setStudents(data.data || []);
      } else {
        setError(data.error || 'Failed to fetch paid students');
        setStudents([]);
      }
    } catch (err) {
      setError('Network error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    document.cookie = 'token=; path=/; max-age=0';
    window.location.href = '/';
  };

  const handleBack = () => {
    navigate('/mess-bills-detail');
  };

  return (
    <div className="light-mode flex min-h-screen text-gray-900">
      <Sidebar
        setActiveSection={() => { }}
        activeSection="messbills"
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className={`flex-1 min-w-0 flex flex-col transition-transform duration-300 pointer-events-auto md:ml-64 ${sidebarOpen ? 'translate-x-64 md:translate-x-0' : 'translate-x-0'}`}>
        <Header
          onLogout={handleLogout}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <MainContent>
          <div className="p-6">
            <button onClick={handleBack} className="btn mb-4">Back to Mess Bills Detail</button>
            <h1 className="text-2xl font-bold mb-4">Paid Students - {monthYear}</h1>

            <div className="filter-section mb-6">
              <select
                value={filter.department}
                onChange={(e) => setFilter({ ...filter, department: e.target.value })}
                className="filter-select"
              >
                <option value="">All Departments</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="ME">ME</option>
                <option value="CE">CE</option>
                <option value="IT">IT</option>
              </select>
              <select
                value={filter.year}
                onChange={(e) => setFilter({ ...filter, year: e.target.value })}
                className="filter-select"
              >
                <option value="">All Years</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : error ? (
              <div className="text-red-500 text-center py-4">{error}</div>
            ) : (
              <div className="students-list">
                {students.length > 0 ? (
                  students.map(student => (
                    <div key={student.student_id || student.id} className="student-item">
                      <span>{student.name} - {student.register_number} - Room {student.room_no} - {student.department} {student.year}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">No paid students found matching criteria.</div>
                )}
              </div>
            )}
          </div>
        </MainContent>
      </div>

      <style>
        {`
          .filter-section {
            display: flex;
            gap: 15px;
            justify-content: center;
          }

          .filter-select {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            background: white;
            font-size: 0.9rem;
            cursor: pointer;
          }

          .filter-select:focus {
            outline: none;
            border-color: #2575fc;
          }

          .students-list {
            max-height: 600px;
            overflow-y: auto;
          }

          .student-item {
            padding: 10px;
            border-bottom: 1px solid #eee;
            text-align: left;
          }

          .btn {
            background: #4a6cf7;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
          }

          .btn:hover {
            background: #3a5ce5;
          }
        `}
      </style>
    </div>
  );
};

export default PaidStudents;
