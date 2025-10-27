import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '../Common/Button';

const API_BASE = 'https://finalbackend1.vercel.app';

const targetOptions = [
  { label: 'All Students', value: 5 },
  { label: 'First Year', value: 1 },
  { label: 'Second Year', value: 2 },
  { label: 'Third Year', value: 3 },
  { label: 'Fourth Year', value: 4 },
];

const getTargetValue = (label) => {
  const option = targetOptions.find((item) => item.label === label);
  return option ? option.value : 5;
};

const getTargetLabel = (value) => {
  const option = targetOptions.find((item) => item.value === value);
  return option ? option.label : 'All Students';
};

const formatDateTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
};

const initialAnnouncementState = {
  title: '',
  message: '',
  priority: 'Normal',
  targetAudience: 'All Students',
  scheduledDate: '',
  scheduledTime: '',
};

const buildConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High':
      return 'text-red-400';
    case 'Normal':
      return 'text-yellow-400';
    case 'Low':
      return 'text-green-400';
    default:
      return 'text-slate-400';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Sent':
      return 'bg-green-500 bg-opacity-20 text-green-400';
    case 'Scheduled':
      return 'bg-blue-500 bg-opacity-20 text-blue-400';
    default:
      return 'bg-slate-500 bg-opacity-20 text-slate-400';
  }
};

const AnnouncementForm = () => {
  const [announcement, setAnnouncement] = useState(initialAnnouncementState);
  const [announcements, setAnnouncements] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAnnouncement((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setAnnouncement(initialAnnouncementState);
    setEditingId(null);
  };

  // IMPROVED: Better field mapping between database and frontend
  const mapAnnouncementFields = (item) => {
    // Database has 'message', API expects 'description' in response
    // Map fields to ensure consistent frontend display
    return {
      id: item.id,
      title: item.title,
      // Use description if available, otherwise use message from database
      description: item.description || item.message,
      message: item.message || item.description, // Keep both for flexibility
      priority: item.priority,
      target: item.target,
      created_at: item.created_at,
      scheduled_date: item.scheduled_date
    };
  };

  const resolveAnnouncements = (payload) => {
    if (!payload) {
      console.log('❌ No payload received');
      return [];
    }
    
    console.log('📦 Raw API response:', payload);
    
    let announcementsArray = [];
    
    if (Array.isArray(payload.announcements)) {
      announcementsArray = payload.announcements;
      console.log(`✅ Found ${announcementsArray.length} announcements in payload.announcements`);
    } else if (Array.isArray(payload.data)) {
      announcementsArray = payload.data;
      console.log(`✅ Found ${announcementsArray.length} announcements in payload.data`);
    } else if (Array.isArray(payload)) {
      announcementsArray = payload;
      console.log(`✅ Found ${announcementsArray.length} announcements in root payload`);
    } else {
      console.log('❌ No announcements array found in response structure');
    }
    
    // Map all announcements to ensure consistent field names
    const mappedAnnouncements = announcementsArray.map(mapAnnouncementFields);
    console.log('🔄 Mapped announcements:', mappedAnnouncements);
    
    return mappedAnnouncements;
  };

  const applyAnnouncements = (payload) => {
    const items = resolveAnnouncements(payload);
    console.log('🎯 Setting announcements state with:', items);
    setAnnouncements(items);
  };

  // FIXED: Enhanced fetchAnnouncements with comprehensive error handling
  const fetchAnnouncements = async () => {
    console.log('🔄 fetchAnnouncements called');
    
    const token = localStorage.getItem('accessToken');
    console.log('🔐 Token exists:', !!token);
    if (token) {
      console.log('🔐 Token preview:', token.substring(0, 20) + '...');
    }
    
    if (!token) {
      console.log('❌ No token found in localStorage');
      setAnnouncements([]);
      setError('No access token found. Please login again.');
      return;
    }
    
    setFetching(true);
    setError('');
    
    try {
      console.log('🚀 Making API request to:', `${API_BASE}/fetchannouncement`);
      
      const response = await axios.post(
        `${API_BASE}/fetchannouncement`,
        {}, // Empty body to fetch all announcements
        buildConfig(token)
      );
      
      console.log('✅ API Response received:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });
      
      if (response.data?.token) {
        console.log('🔄 New token received, updating localStorage');
        localStorage.setItem('accessToken', response.data.token);
      }
      
      applyAnnouncements(response.data);
      
    } catch (err) {
      console.error('❌ Fetch error details:', {
        name: err.name,
        message: err.message,
        stack: err.stack,
        response: err.response ? {
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data
        } : 'No response',
        request: err.request ? 'Request made but no response' : 'No request made'
      });
      
      if (err.response?.status === 401) {
        const errorMsg = 'Authentication failed (401). Please login again.';
        console.error('❌', errorMsg);
        setError(errorMsg);
        setAnnouncements([]);
      } else if (err.response?.status === 403) {
        const errorMsg = 'Access forbidden (403). Admin role required.';
        console.error('❌', errorMsg);
        setError(errorMsg);
        setAnnouncements([]);
      } else if (err.response?.status === 404) {
        console.log('ℹ️ No announcements found (404)');
        if (err.response?.data?.token) {
          localStorage.setItem('accessToken', err.response.data.token);
        }
        applyAnnouncements(err.response?.data || { announcements: [] });
      } else if (err.response?.status === 500) {
        const errorMsg = 'Server error (500). Please try again later.';
        console.error('❌', errorMsg);
        setError(errorMsg);
      } else if (err.code === 'NETWORK_ERROR' || err.code === 'ECONNREFUSED') {
        const errorMsg = 'Network error. Please check your connection.';
        console.error('❌', errorMsg);
        setError(errorMsg);
      } else {
        const errorMsg = err.response?.data?.message || 
                        err.response?.data?.error || 
                        err.message || 
                        'Failed to fetch announcements';
        console.error('❌ Unexpected error:', errorMsg);
        setError(errorMsg);
      }
    } finally {
      console.log('🏁 Fetch operation completed');
      setFetching(false);
    }
  };

  useEffect(() => {
    console.log('🎯 AnnouncementForm mounted, fetching announcements...');
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!announcement.title.trim() || !announcement.message.trim()) {
      setError('Title and message are required');
      return;
    }
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('Authentication required');
      return;
    }
    setProcessing(true);
    setError('');
    setSuccess('');
    const target = getTargetValue(announcement.targetAudience);
    try {
      if (editingId) {
        const payload = {
          announcement_id: editingId,
          title: announcement.title.trim(),
          description: announcement.message.trim(), // API expects 'description'
          target,
        };
        if (announcement.priority && announcement.priority !== 'Normal') {
          payload.priority = announcement.priority;
        }
        const response = await axios.put(`${API_BASE}/editannouncementforadmin`, payload, buildConfig(token));
        if (response.data?.token) {
          localStorage.setItem('accessToken', response.data.token);
        }
        setSuccess(response.data?.message || 'Announcement updated successfully');
      } else {
        const payload = {
          title: announcement.title.trim(),
          message: announcement.message.trim(), // Database uses 'message'
          priority: announcement.priority,
          target,
        };
        if (announcement.scheduledDate) {
          payload.scheduled_date = announcement.scheduledDate;
        }
        const response = await axios.post(`${API_BASE}/pushannocement`, payload, buildConfig(token));
        if (response.data?.token) {
          localStorage.setItem('accessToken', response.data.token);
        }
        setSuccess(response.data?.message || 'Announcement sent successfully');
      }
      await fetchAnnouncements();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to submit announcement');
    } finally {
      setProcessing(false);
    }
  };

  const handleEdit = (item) => {
    console.log('✏️ Editing announcement:', item);
    setEditingId(item.id);
    setAnnouncement({
      title: item.title || '',
      message: item.description || item.message || '', // Use description first, fallback to message
      priority: item.priority || 'Normal',
      targetAudience: getTargetLabel(item.target),
      scheduledDate: '',
      scheduledTime: '',
    });
    setSuccess('');
    setError('');
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('Authentication required');
      return;
    }
    setDeletingId(id);
    setError('');
    setSuccess('');
    try {
      const response = await axios.post(`${API_BASE}/deleteannounce`, { announcement_id: id }, buildConfig(token));
      if (response.data?.token) {
        localStorage.setItem('accessToken', response.data.token);
      }
      setSuccess(response.data?.message || 'Announcement deleted successfully');
      await fetchAnnouncements(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to delete announcement');
    } finally {
      setDeletingId(null);
    }
  };

  const statusText = (item) => (item.scheduled_date ? 'Scheduled' : 'Sent');
  const displayDate = (item) => formatDateTime(item.scheduled_date || item.created_at);

  // IMPROVED: Display logic that handles both 'description' and 'message' fields
  const displayMessage = (item) => {
    return item.description || item.message || 'No message provided.';
  };

  const submitDisabled = processing || !announcement.title.trim() || !announcement.message.trim();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Send Announcement</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-400">
            {announcements.length} announcement(s) loaded
          </span>
          <Button size="small" variant="outline" onClick={fetchAnnouncements} disabled={fetching}>
            {fetching ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {(error || success) && (
        <div className={`p-4 rounded-lg ${error ? 'bg-red-500 bg-opacity-20 text-red-300' : 'bg-green-500 bg-opacity-20 text-green-300'}`}>
          {error || success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={announcement.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter announcement title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={announcement.message}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your announcement message"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={announcement.priority}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={Boolean(editingId)}
                >
                  <option value="Low">Low</option>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Target Audience
                </label>
                <select
                  name="targetAudience"
                  value={announcement.targetAudience}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {targetOptions.map((option) => (
                    <option key={option.value} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Schedule Date (Optional)
                </label>
                <input
                  type="date"
                  name="scheduledDate"
                  value={announcement.scheduledDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={Boolean(editingId)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Schedule Time (Optional)
                </label>
                <input
                  type="time"
                  name="scheduledTime"
                  value={announcement.scheduledTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                disabled={submitDisabled}
              >
                {editingId ? 'Update Announcement' : announcement.scheduledDate ? 'Schedule Announcement' : 'Send Announcement'}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={resetForm}
                  disabled={processing}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Recent Announcements</h4>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {fetching ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-slate-400">Loading announcements...</span>
              </div>
            ) : announcements.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm">No announcements found.</p>
                <p className="text-slate-500 text-xs mt-2">Create your first announcement using the form.</p>
              </div>
            ) : (
              announcements.map((ann) => {
                const status = statusText(ann);
                const displayPriority = ann.priority || 'Normal';
                return (
                  <div key={ann.id} className="border border-slate-600 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h5 className="font-medium text-white">{ann.title}</h5>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(status)}`}>
                        {status}
                      </span>
                    </div>
                    {/* FIXED: Use the improved displayMessage function */}
                    <p className="text-slate-300 text-sm whitespace-pre-wrap">{displayMessage(ann)}</p>
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <span className={getPriorityColor(displayPriority)}>{displayPriority} Priority</span>
                      <span>{getTargetLabel(ann.target)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>{displayDate(ann)}</span>
                      <div className="flex space-x-2">
                        <Button size="small" variant="secondary" onClick={() => handleEdit(ann)} disabled={processing}>
                          Edit
                        </Button>
                        <Button
                          size="small"
                          variant="danger"
                          onClick={() => handleDelete(ann.id)}
                          disabled={deletingId === ann.id}
                        >
                          {deletingId === ann.id ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementForm;