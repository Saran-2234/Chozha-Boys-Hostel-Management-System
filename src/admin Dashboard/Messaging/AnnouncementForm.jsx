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

  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'Hostel Maintenance Notice',
      message: 'Water supply will be interrupted from 10 AM to 2 PM tomorrow.',
      priority: 'High',
      targetAudience: 'All Students',
      status: 'Sent',
      sentDate: '2024-01-14'
    },
    {
      id: 2,
      title: 'New Semester Fee Payment',
      message: 'Semester fees are due by January 20th. Please make payments on time.',
      priority: 'Normal',
      targetAudience: 'All Students',
      status: 'Scheduled',
      scheduledDate: '2024-01-16'
    }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAnnouncement(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAnnouncement = {
      ...announcement,
      id: announcements.length + 1,
      status: announcement.scheduledDate ? 'Scheduled' : 'Sent',
      sentDate: announcement.scheduledDate ? null : new Date().toISOString().split('T')[0]
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    setAnnouncement({
      title: '',
      message: '',
      priority: 'Normal',
      targetAudience: 'All Students',
      scheduledDate: '',
      scheduledTime: ''
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

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
            >
              {announcement.scheduledDate ? 'Schedule Announcement' : 'Send Announcement'}
            </Button>
          </form>
        </div>

        {/* Recent Announcements */}
        <div className="glass-card rounded-xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Recent Announcements</h4>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {announcements.map((ann) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementForm;
