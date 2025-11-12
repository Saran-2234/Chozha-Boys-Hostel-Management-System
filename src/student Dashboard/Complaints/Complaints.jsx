import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ComplaintModal from './ComplaintModal';

const Complaints = () => {
  const [showModal, setShowModal] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'pending', 'inProgress', 'resolved'
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });

  const decodeJWT = (token) => {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error('Failed to decode JWT:', e);
      return null;
    }
  };

  const isTokenExpired = (token) => {
    try {
      const decoded = decodeJWT(token);
      if (!decoded || !decoded.exp) {
        return true; // Consider invalid tokens as expired
      }
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (e) {
      console.error('Error checking token expiration:', e);
      return true; // Consider invalid tokens as expired
    }
  };

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get token from storage
      const token = localStorage.getItem('studentToken') ||
                   localStorage.getItem('accessToken') ||
                   sessionStorage.getItem('studentToken');

      if (!token) {
        console.log('No token found, redirecting to login');
        window.location.href = '/';
        return;
      }

      // Check if token is expired
      if (isTokenExpired(token)) {
        console.log('Token expired, clearing storage and redirecting to login');
        // Clear expired token
        localStorage.removeItem('studentToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
        sessionStorage.removeItem('studentToken');
        window.location.href = '/';
        return;
      }

      // Debug: Check what's in the JWT token
      const decodedToken = decodeJWT(token);
      console.log('Decoded JWT token:', decodedToken);

      if (decodedToken) {
        console.log('Token role:', decodedToken.role);
        console.log('Token student ID:', decodedToken.id);
        console.log('Token expires:', new Date(decodedToken.exp * 1000).toLocaleString());
      }

      // Try both request formats as per API documentation
      const requestBodies = [
        { token }, // Option 2: Without Student ID
        { id: decodedToken?.id, token } // Option 1: With Student ID
      ];

      for (const body of requestBodies) {
        try {
          console.log('Trying request with body:', body);

          const response = await axios.post('https://finalbackend1.vercel.app/fetchcomplaintsforstudents', body,token, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            withCredentials: true
          });

          const data = response.data;
          console.log('API response data:', data);

          if (data.success) {
            // Handle successful response
            const complaintsData = Array.isArray(data.data) ? data.data : [];
            console.log('Raw complaints data:', complaintsData);

            // Debug: Log all status values
            complaintsData.forEach((complaint, index) => {
              console.log(`Complaint ${index}:`, {
                id: complaint.complaint_id,
                title: complaint.title,
                status: complaint.status,
                statusType: typeof complaint.status
              });
            });

            setComplaints(complaintsData);

            const total = complaintsData.length;
            const pending = complaintsData.filter(c => {
              const matches = c.status && c.status.toLowerCase() === 'pending';
              console.log(`Pending check for "${c.status}": ${matches}`);
              return matches;
            }).length;
            const inProgress = complaintsData.filter(c => {
              const matches = c.status && c.status.toLowerCase() === 'in progress';
              console.log(`In Progress check for "${c.status}": ${matches}`);
              return matches;
            }).length;
            const resolved = complaintsData.filter(c => {
              const matches = c.status && c.status.toLowerCase() === 'resolved';
              console.log(`Resolved check for "${c.status}": ${matches}`);
              return matches;
            }).length;

            console.log('Calculated stats:', { total, pending, inProgress, resolved });
            setStats({ total, pending, inProgress, resolved });

            return; // Success, exit the function
          } else if (data.error === 'Forbidden: not student') {
            // Specific error handling for role issues
            throw new Error('Your account does not have student permissions. Please contact administration.');
          } else {
            throw new Error(data.error || 'Failed to fetch complaints');
          }
        } catch (err) {
          // Handle axios errors
          let errorToThrow = err;
          if (err.response) {
            const status = err.response.status;
            const errorData = err.response.data;

            // Handle authentication/authorization errors
            if (status === 401 || status === 403) {
              console.log('Authentication error, clearing tokens and redirecting to login');
              // Clear invalid tokens
              localStorage.removeItem('studentToken');
              localStorage.removeItem('accessToken');
              localStorage.removeItem('userData');
              sessionStorage.removeItem('studentToken');
              window.location.href = '/';
              return; // Don't continue with other request formats
            }

            // Handle other API errors
            if (errorData && errorData.error) {
              if (errorData.error.includes('refresh token') || errorData.error.includes('token')) {
                // Token-related error, redirect to login
                console.log('Token error from API, redirecting to login');
                localStorage.removeItem('studentToken');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('userData');
                sessionStorage.removeItem('studentToken');
                window.location.href = '/';
                return;
              }
              errorToThrow = new Error(errorData.error);
            } else {
              errorToThrow = new Error(`Failed to fetch complaints (${status})`);
            }
          } else if (err.request) {
            // Network error
            errorToThrow = new Error('Network error. Please check your internet connection.');
          } // else keep err as is

          // If this is the last approach, re-throw the error
          if (body === requestBodies[requestBodies.length - 1]) {
            throw errorToThrow;
          }
          console.log('Request approach failed, trying next one...');
        }
      }
      
    } catch (err) {
      console.error('Error fetching complaints:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter complaints based on active filter
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredComplaints(complaints);
    } else {
      const filtered = complaints.filter(complaint => {
        switch (activeFilter) {
          case 'pending':
            return complaint.status && complaint.status.toLowerCase() === 'pending';
          case 'inProgress':
            return complaint.status && complaint.status.toLowerCase() === 'in progress';
          case 'resolved':
            return complaint.status && complaint.status.toLowerCase() === 'resolved';
          default:
            return true;
        }
      });
      setFilteredComplaints(filtered);
    }
  }, [complaints, activeFilter]);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const handleModalClose = () => {
    setShowModal(false);
    fetchComplaints();
  };



  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4 max-w-full relative z-10">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Complaint Management</h2>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base w-full sm:w-auto transition-all duration-200 relative z-20"
            disabled={error}
          >
            📝 Raise New Complaint
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div
          className={`glass-card rounded-xl p-6 text-center cursor-pointer transition-all duration-200 hover:scale-105 ${
            activeFilter === 'all' ? 'ring-2 ring-blue-400 bg-blue-900 bg-opacity-20' : ''
          }`}
          onClick={() => handleFilterClick('all')}
        >
          <div className="text-2xl font-bold text-white mb-2">{stats.total}</div>
          <div className="text-slate-400 text-sm">Total Complaints</div>
        </div>
        <div
          className={`glass-card rounded-xl p-6 text-center cursor-pointer transition-all duration-200 hover:scale-105 ${
            activeFilter === 'pending' ? 'ring-2 ring-yellow-400 bg-yellow-900 bg-opacity-20' : ''
          }`}
          onClick={() => handleFilterClick('pending')}
        >
          <div className="text-2xl font-bold text-yellow-400 mb-2">{stats.pending}</div>
          <div className="text-slate-400 text-sm">Pending</div>
        </div>
        <div
          className={`glass-card rounded-xl p-6 text-center cursor-pointer transition-all duration-200 hover:scale-105 ${
            activeFilter === 'inProgress' ? 'ring-2 ring-blue-400 bg-blue-900 bg-opacity-20' : ''
          }`}
          onClick={() => handleFilterClick('inProgress')}
        >
          <div className="text-2xl font-bold text-blue-400 mb-2">{stats.inProgress}</div>
          <div className="text-slate-400 text-sm">In Progress</div>
        </div>
        <div
          className={`glass-card rounded-xl p-6 text-center cursor-pointer transition-all duration-200 hover:scale-105 ${
            activeFilter === 'resolved' ? 'ring-2 ring-emerald-400 bg-emerald-900 bg-opacity-20' : ''
          }`}
          onClick={() => handleFilterClick('resolved')}
        >
          <div className="text-2xl font-bold text-emerald-400 mb-2">{stats.resolved}</div>
          <div className="text-slate-400 text-sm">Resolved</div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">
            My Complaints
            {activeFilter !== 'all' && (
              <span className="ml-2 text-sm text-slate-400">
                ({activeFilter === 'pending' ? 'Pending' :
                  activeFilter === 'inProgress' ? 'In Progress' :
                  activeFilter === 'resolved' ? 'Resolved' : 'All'})
              </span>
            )}
          </h3>
          <div className="text-sm text-slate-400">
            Showing {filteredComplaints.length} of {complaints.length} complaints
          </div>
        </div>

        {loading ? (
          <div className="text-center text-white">Loading complaints...</div>
        ) : error ? (
          <div className="text-center p-6">
            <div className="text-red-400 text-lg font-semibold mb-4">{error}</div>
            <div className="bg-yellow-900 bg-opacity-30 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-yellow-400 mb-2">Possible Solutions:</h4>
              <ul className="text-sm text-yellow-300 list-disc pl-5 space-y-1">
                <li>Your account might not have the correct student role assigned</li>
                <li>Your authentication token might be corrupted or expired</li>
                <li>Try logging out and back in using the logout button</li>
                <li>Contact your administrator if the issue persists</li>
              </ul>
            </div>
            <button
              onClick={fetchComplaints}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium"
            >
              🔄 Retry
            </button>
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center text-slate-400 py-8">
            <div className="text-lg mb-2">📝 No complaints found</div>
            <div className="text-sm mb-4">Ready to submit your first complaint!</div>
            <button
              onClick={fetchComplaints}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              🔄 Refresh
            </button>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="text-center text-slate-400">
            No {activeFilter === 'pending' ? 'pending' :
                activeFilter === 'inProgress' ? 'in progress' :
                activeFilter === 'resolved' ? 'resolved' : ''} complaints found.
            <button
              onClick={() => setActiveFilter('all')}
              className="ml-4 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            >
              Show All
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComplaints.map((complaint) => (
              <div key={complaint.complaint_id} className={`glass-effect rounded-lg p-4 border-l-4 ${
                complaint.status && complaint.status.toLowerCase() === 'pending' ? 'border-yellow-400' :
                complaint.status && complaint.status.toLowerCase() === 'in progress' ? 'border-blue-400' :
                complaint.status && complaint.status.toLowerCase() === 'resolved' ? 'border-emerald-400' : 'border-gray-400'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{
                      complaint.category === 'Maintenance' ? '🔧' :
                      complaint.category === 'Mess' ? '🍽️' :
                      complaint.category === 'Infrastructure' ? '🏗️' : '📋'
                    }</span>
                    <div>
                      <h4 className="text-white font-medium">{complaint.title}</h4>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${
                    complaint.status && complaint.status.toLowerCase() === 'pending' ? 'bg-yellow-500 bg-opacity-20' :
                    complaint.status && complaint.status.toLowerCase() === 'in progress' ? 'bg-blue-500 bg-opacity-20' :
                    complaint.status && complaint.status.toLowerCase() === 'resolved' ? 'bg-emerald-500 bg-opacity-20' : 'bg-gray-500 bg-opacity-20'
                  }`}>
                    {complaint.status}
                  </span>
                </div>
                <p className="text-slate-300 text-sm mb-3">{complaint.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">
                    {new Date(complaint.created_at).toLocaleDateString()}
                  </span>
                  <span className="text-slate-400">{complaint.category}</span>
                </div>
                {complaint.admin_response && (
                  <div className="mt-3 p-3 bg-emerald-900 bg-opacity-20 rounded">
                    <p className="text-emerald-400 text-sm font-medium">Admin Response:</p>
                    <p className="text-slate-300 text-sm">{complaint.admin_response}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && <ComplaintModal onClose={handleModalClose} />}
    </div>
  );
};

export default Complaints;