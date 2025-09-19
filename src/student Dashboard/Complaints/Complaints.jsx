import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ComplaintModal from './ComplaintModal';

const Complaints = () => {
  const [showModal, setShowModal] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get token from storage
      const token = localStorage.getItem('studentToken') || 
                   localStorage.getItem('accessToken') ||
                   sessionStorage.getItem('studentToken');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      // Debug: Check what's in the JWT token
      const decodedToken = decodeJWT(token);
      console.log('Decoded JWT token:', decodedToken);
      
      if (decodedToken) {
        console.log('Token role:', decodedToken.role);
        console.log('Token student ID:', decodedToken.id);
      }

      // Try both request formats as per API documentation
      const requestBodies = [
        { token }, // Option 2: Without Student ID
        { id: decodedToken?.id, token } // Option 1: With Student ID
      ];

      for (const body of requestBodies) {
        try {
          console.log('Trying request with body:', body);

          const response = await axios.post('https://finalbackend-mauve.vercel.app/fetchcomplaintsforstudents', body, {
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
            setComplaints(complaintsData);

            const total = complaintsData.length;
            const pending = complaintsData.filter(c => c.status === 'Pending').length;
            const inProgress = complaintsData.filter(c => c.status === 'In Progress').length;
            const resolved = complaintsData.filter(c => c.status === 'Resolved').length;
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
          if (err.response && err.response.status === 403) {
            const errorData = err.response.data;
            if (errorData && errorData.error === 'Forbidden: not student') {
              err = new Error('Your account does not have student permissions. Please contact administration.');
            } else {
              err = new Error(errorData?.error || 'Access forbidden');
            }
          } else if (err.response) {
            err = new Error('Failed to fetch complaints');
          } // else keep err as is for network error
          // If this is the last approach, re-throw the error
          if (body === requestBodies[requestBodies.length - 1]) {
            throw err;
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
  }, []);

  const handleModalClose = () => {
    setShowModal(false);
    fetchComplaints();
  };

  const debugAuth = () => {
    console.log('=== AUTH DEBUG INFO ===');
    
    // Check all possible token locations
    const tokenLocations = {
      'localStorage studentToken': localStorage.getItem('studentToken'),
      'localStorage accessToken': localStorage.getItem('accessToken'),
      'sessionStorage studentToken': sessionStorage.getItem('studentToken')
    };
    
    Object.entries(tokenLocations).forEach(([location, token]) => {
      console.log(`${location}:`, token ? 'Present' : 'Missing');
      if (token) {
        const decoded = decodeJWT(token);
        console.log(`  Decoded ${location}:`, decoded);
        if (decoded) {
          console.log(`  Role: ${decoded.role}`);
          console.log(`  ID: ${decoded.id}`);
          console.log(`  Exp: ${new Date(decoded.exp * 1000).toLocaleString()}`);
        }
      }
    });

    // Check student data
    const studentDataStr = localStorage.getItem('studentData') || 
                          sessionStorage.getItem('studentData');
    if (studentDataStr) {
      try {
        const studentData = JSON.parse(studentDataStr);
        console.log('Student data:', studentData);
      } catch (e) {
        console.log('Error parsing student data:', e);
      }
    }
  };

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem('studentToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('studentData');
    sessionStorage.removeItem('studentToken');
    sessionStorage.removeItem('studentData');
    
    // Redirect to login (you might need to adjust this based on your routing)
    window.location.href = '/login';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8" style={{ zIndex: 50, position: 'relative' }}>
        <h2 className="text-2xl font-bold text-white">Complaint Management</h2>
        <div className="flex space-x-4">
          
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
            disabled={error}
          >
            📝 Raise New Complaint
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="glass-card rounded-xl p-6 text-center">
          <div className="text-2xl font-bold text-white mb-2">{stats.total}</div>
          <div className="text-slate-400 text-sm">Total Complaints</div>
        </div>
        <div className="glass-card rounded-xl p-6 text-center">
          <div className="text-2xl font-bold text-yellow-400 mb-2">{stats.pending}</div>
          <div className="text-slate-400 text-sm">Pending</div>
        </div>
        <div className="glass-card rounded-xl p-6 text-center">
          <div className="text-2xl font-bold text-blue-400 mb-2">{stats.inProgress}</div>
          <div className="text-slate-400 text-sm">In Progress</div>
        </div>
        <div className="glass-card rounded-xl p-6 text-center">
          <div className="text-2xl font-bold text-emerald-400 mb-2">{stats.resolved}</div>
          <div className="text-slate-400 text-sm">Resolved</div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">My Complaints</h3>
        
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
                <li>Try logging out and back in using the button above</li>
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
          <div className="text-center text-slate-400">
            No complaints found. Ready to submit your first complaint!
            <button 
              onClick={fetchComplaints}
              className="ml-4 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            >
              Refresh
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <div key={complaint.complaint_id} className={`glass-effect rounded-lg p-4 border-l-4 ${
                complaint.status === 'Pending' ? 'border-yellow-400' :
                complaint.status === 'In Progress' ? 'border-blue-400' :
                complaint.status === 'Resolved' ? 'border-emerald-400' : 'border-gray-400'
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
                      <p className="text-slate-400 text-sm">ID: #{complaint.complaint_id}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${
                    complaint.status === 'Pending' ? 'bg-yellow-500 bg-opacity-20' :
                    complaint.status === 'In Progress' ? 'bg-blue-500 bg-opacity-20' :
                    complaint.status === 'Resolved' ? 'bg-emerald-500 bg-opacity-20' : 'bg-gray-500 bg-opacity-20'
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