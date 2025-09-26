import React, { useState, useEffect } from 'react';
import Modal from '../Common/Modal';
import Button from '../Common/Button';

const Reduction = ({ isDarkMode }) => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [action, setAction] = useState(''); // 'accept' or 'reject'
  const [reason, setReason] = useState(''); // For rejection reason

  // Mock data - in real app, fetch from backend API
  useEffect(() => {
    const mockApplications = [
      {
        id: 1,
        studentId: 'STU001',
        studentName: 'John Doe',
        fromDate: '2024-08-10',
        toDate: '2024-08-14',
        reason: 'Medical leave due to illness',
        status: 'pending',
        appliedDate: '2024-08-05'
      },
      {
        id: 2,
        studentId: 'STU002',
        studentName: 'Jane Smith',
        fromDate: '2024-08-15',
        toDate: '2024-08-20',
        reason: 'Family emergency',
        status: 'pending',
        appliedDate: '2024-08-10'
      },
      {
        id: 3,
        studentId: 'STU003',
        studentName: 'Bob Johnson',
        fromDate: '2024-07-20',
        toDate: '2024-07-25',
        reason: 'Approved for vacation',
        status: 'approved',
        appliedDate: '2024-07-15'
      }
    ];
    setApplications(mockApplications);

    // In real implementation, check localStorage or API for student applications
    // For demo, assume localStorage stores application objects
    const storedApps = JSON.parse(localStorage.getItem('reductionApplications') || '[]');
    if (storedApps.length > 0) {
      setApplications(prev => [...prev, ...storedApps]);
    }
  }, []);

  const handleAction = (app, type) => {
    setSelectedApp(app);
    setAction(type);
    setIsModalOpen(true);
  };

  const confirmAction = () => {
    if (action === 'reject' && !reason.trim()) {
      alert('Rejection reason is required.');
      return;
    }

    // Update status
    setApplications(prev => prev.map(app => 
      app.id === selectedApp.id 
        ? { ...app, status: action, rejectionReason: action === 'reject' ? reason : undefined }
        : app
    ));

    // In real app, send to backend API
    console.log(`Application ${selectedApp.id} ${action}ed by admin.`);

    // Store updated apps in localStorage for persistence
    localStorage.setItem('reductionApplications', JSON.stringify(applications.map(app => 
      app.id === selectedApp.id 
        ? { ...app, status: action, rejectionReason: action === 'reject' ? reason : undefined }
        : app
    )));

    setIsModalOpen(false);
    setReason('');
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-500 text-yellow-900',
      approved: 'bg-green-500 text-white',
      rejected: 'bg-red-500 text-white'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${badges[status] || 'bg-gray-500 text-white'}`;
  };

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reduction Applications</h1>
        <span className="text-sm text-gray-400">Total: {applications.length}</span>
      </div>

      <div className={`glass-card rounded-xl p-6 overflow-x-auto ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
        <table className="w-full">
          <thead>
            <tr className={`${isDarkMode ? 'border-slate-600' : 'border-gray-200'} border-b`}>
              <th className="text-left py-3 px-4 font-semibold">Student</th>
              <th className="text-left py-3 px-4 font-semibold">Period</th>
              <th className="text-left py-3 px-4 font-semibold">Reason</th>
              <th className="text-left py-3 px-4 font-semibold">Status</th>
              <th className="text-left py-3 px-4 font-semibold">Applied Date</th>
              <th className="text-left py-3 px-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className={`${isDarkMode ? 'border-slate-700' : 'border-gray-100'} border-b hover:bg-opacity-5`}>
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium">{app.studentName}</div>
                    <div className="text-sm text-gray-400">{app.studentId}</div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  {app.fromDate} to {app.toDate}
                </td>
                <td className="py-3 px-4 max-w-xs truncate" title={app.reason}>
                  {app.reason}
                </td>
                <td className="py-3 px-4">
                  <span className={getStatusBadge(app.status)}>{app.status.toUpperCase()}</span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-400">{app.appliedDate}</td>
                <td className="py-3 px-4">
                  {app.status === 'pending' ? (
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleAction(app, 'accept')} 
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Accept
                      </Button>
                      <Button 
                        onClick={() => handleAction(app, 'reject')} 
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">No action needed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {applications.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No reduction applications found.</p>
          </div>
        )}
      </div>

      {/* Action Confirmation Modal */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className={`p-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <h3 className="text-xl font-bold mb-4">
              {action === 'accept' ? 'Approve Application' : 'Reject Application'}
            </h3>
            <p className="mb-4">
              Student: {selectedApp?.studentName} ({selectedApp?.studentId})
            </p>
            <p className="mb-4">
              Period: {selectedApp?.fromDate} to {selectedApp?.toDate}
            </p>
            {action === 'reject' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Rejection Reason (Required)</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className={`w-full p-2 rounded border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  placeholder="Enter reason for rejection..."
                />
              </div>
            )}
            <div className="flex justify-end space-x-3">
              <Button 
                onClick={() => setIsModalOpen(false)} 
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmAction} 
                className={`text-white px-4 py-2 rounded ${action === 'accept' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
              >
                {action === 'accept' ? 'Approve' : 'Reject'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Reduction;
