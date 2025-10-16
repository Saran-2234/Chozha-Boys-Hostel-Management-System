import React, { useState } from 'react';
import Button from '../Common/Button';

const AnnouncementForm = () => {
  const [announcement, setAnnouncement] = useState({
    title: '',
    message: '',
    priority: 'Normal',
    targetAudience: 'All Students',
    scheduledDate: '',
    scheduledTime: ''
  });

  const [sendOptions, setSendOptions] = useState({
    dashboardNotification: false,
    email: false,
    studentsDashboard: false
  });

  const [sendStatus, setSendStatus] = useState({
    dashboardNotification: null,
    email: null,
    studentsDashboard: null
  });

  const [announcements, setAnnouncements] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAnnouncement(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendOptionChange = (e) => {
    const { name, checked } = e.target;
    setSendOptions(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const sendToDashboardNotification = async (announcement) => {
    // Mock function for sending to dashboard notification
    // Replace with actual API call later
    console.log('Sending to dashboard notification:', announcement);
    return new Promise((resolve) => setTimeout(() => resolve('success'), 1000));
  };

  const sendEmail = async (announcement) => {
    // Mock function for sending email
    // Replace with actual API call later
    console.log('Sending email:', announcement);
    return new Promise((resolve) => setTimeout(() => resolve('success'), 1000));
  };

  const sendToStudentsDashboard = async (announcement) => {
    // Mock function for sending to students dashboard
    // Replace with actual API call later
    console.log('Sending to students dashboard:', announcement);
    return new Promise((resolve) => setTimeout(() => resolve('success'), 1000));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newAnnouncement = {
      ...announcement,
      id: announcements.length + 1,
      status: announcement.scheduledDate ? 'Scheduled' : 'Sent',
      sentDate: announcement.scheduledDate ? null : new Date().toISOString().split('T')[0]
    };

    // Send to selected destinations
    if (sendOptions.dashboardNotification) {
      try {
        await sendToDashboardNotification(newAnnouncement);
        setSendStatus(prev => ({ ...prev, dashboardNotification: 'success' }));
      } catch (error) {
        setSendStatus(prev => ({ ...prev, dashboardNotification: 'error' }));
      }
    }

    if (sendOptions.email) {
      try {
        await sendEmail(newAnnouncement);
        setSendStatus(prev => ({ ...prev, email: 'success' }));
      } catch (error) {
        setSendStatus(prev => ({ ...prev, email: 'error' }));
      }
    }

    if (sendOptions.studentsDashboard) {
      try {
        await sendToStudentsDashboard(newAnnouncement);
        setSendStatus(prev => ({ ...prev, studentsDashboard: 'success' }));
      } catch (error) {
        setSendStatus(prev => ({ ...prev, studentsDashboard: 'error' }));
      }
    }

    setAnnouncements([newAnnouncement, ...announcements]);
    setAnnouncement({
      title: '',
      message: '',
      priority: 'Normal',
      targetAudience: 'All Students',
      scheduledDate: '',
      scheduledTime: ''
    });
    setSendOptions({
      dashboardNotification: false,
      email: false,
      studentsDashboard: false
    });
  };

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Send Announcement</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Announcement Form */}
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
                  <option value="All Students">All Students</option>
                  <option value="First Year">First Year</option>
                  <option value="Second Year">Second Year</option>
                  <option value="Third Year">Third Year</option>
                  <option value="Fourth Year">Fourth Year</option>
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
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Send To
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="dashboardNotification"
                    checked={sendOptions.dashboardNotification}
                    onChange={handleSendOptionChange}
                    className="mr-2"
                  />
                  <span className="text-slate-300">Dashboard Notification</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="email"
                    checked={sendOptions.email}
                    onChange={handleSendOptionChange}
                    className="mr-2"
                  />
                  <span className="text-slate-300">Email</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="studentsDashboard"
                    checked={sendOptions.studentsDashboard}
                    onChange={handleSendOptionChange}
                    className="mr-2"
                  />
                  <span className="text-slate-300">Students Dashboard</span>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
            >
              {announcement.scheduledDate ? 'Schedule Announcement' : 'Send Announcement'}
            </Button>

            {/* Send Status Feedback */}
            {(sendStatus.dashboardNotification || sendStatus.email || sendStatus.studentsDashboard) && (
              <div className="mt-4 p-4 bg-slate-700 rounded-lg">
                <h4 className="text-sm font-medium text-slate-300 mb-2">Send Status</h4>
                <div className="space-y-1">
                  {sendStatus.dashboardNotification && (
                    <div className="flex items-center text-sm">
                      <span className="text-slate-400 mr-2">Dashboard Notification:</span>
                      <span className={sendStatus.dashboardNotification === 'success' ? 'text-green-400' : 'text-red-400'}>
                        {sendStatus.dashboardNotification === 'success' ? 'Sent' : 'Failed'}
                      </span>
                    </div>
                  )}
                  {sendStatus.email && (
                    <div className="flex items-center text-sm">
                      <span className="text-slate-400 mr-2">Email:</span>
                      <span className={sendStatus.email === 'success' ? 'text-green-400' : 'text-red-400'}>
                        {sendStatus.email === 'success' ? 'Sent' : 'Failed'}
                      </span>
                    </div>
                  )}
                  {sendStatus.studentsDashboard && (
                    <div className="flex items-center text-sm">
                      <span className="text-slate-400 mr-2">Students Dashboard:</span>
                      <span className={sendStatus.studentsDashboard === 'success' ? 'text-green-400' : 'text-red-400'}>
                        {sendStatus.studentsDashboard === 'success' ? 'Sent' : 'Failed'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Recent Announcements */}
        <div className="glass-card rounded-xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Recent Announcements</h4>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {announcements.length === 0 ? (
              <p className="text-slate-400 text-sm">No announcements yet.</p>
            ) : (
              announcements.map((ann) => (
                <div key={ann.id} className="border border-slate-600 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-white">{ann.title}</h5>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ann.status)}`}>
                      {ann.status}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm mb-2">{ann.message}</p>
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span className={getPriorityColor(ann.priority)}>{ann.priority} Priority</span>
                    <span>{ann.sentDate || ann.scheduledDate}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementForm;
