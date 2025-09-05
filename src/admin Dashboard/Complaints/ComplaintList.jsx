import React, { useState } from 'react';
import Button from '../Common/Button';

const ComplaintList = ({ isDarkMode, searchTerm, filter }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data - replace with actual data from API
  const complaints = [
    {
      id: 1,
      studentName: 'John Doe',
      room: '101',
      title: 'WiFi Connection Issue',
      description: 'Internet is very slow in the room',
      category: 'Technical',
      priority: 'Medium',
      status: 'Open',
      dateSubmitted: '2024-01-10',
      lastUpdated: '2024-01-10'
    },
    {
      id: 2,
      studentName: 'Jane Smith',
      room: '102',
      title: 'Room Cleaning',
      description: 'Room needs cleaning service',
      category: 'Maintenance',
      priority: 'Low',
      status: 'In Progress',
      dateSubmitted: '2024-01-08',
      lastUpdated: '2024-01-09'
    },
    {
      id: 3,
      studentName: 'Bob Johnson',
      room: '103',
      title: 'Water Heater Not Working',
      description: 'Hot water not available in bathroom',
      category: 'Maintenance',
      priority: 'High',
      status: 'Resolved',
      dateSubmitted: '2024-01-05',
      lastUpdated: '2024-01-07'
    },
    {
      id: 4,
      studentName: 'Alice Brown',
      room: '104',
      title: 'Mess Food Quality',
      description: 'Food quality has deteriorated recently',
      category: 'Mess',
      priority: 'Medium',
      status: 'Open',
      dateSubmitted: '2024-01-12',
      lastUpdated: '2024-01-12'
    },
    {
      id: 5,
      studentName: 'Charlie Wilson',
      room: '105',
      title: 'Security Concern',
      description: 'Suspicious activity near main gate',
      category: 'Security',
      priority: 'Urgent',
      status: 'In Progress',
      dateSubmitted: '2024-01-11',
      lastUpdated: '2024-01-11'
    },
  ];

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' ||
                         complaint.status.toLowerCase().replace(' ', '-') === filter ||
                         complaint.priority.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedComplaints = filteredComplaints.slice(startIndex, startIndex + itemsPerPage);

  const handleViewDetails = (complaintId) => {
    console.log('View complaint details:', complaintId);
  };

  const handleUpdateStatus = (complaintId, newStatus) => {
    console.log('Update complaint status:', complaintId, newStatus);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
          <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Complaint
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Student
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Category
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Priority
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Status
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Date
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
            {paginatedComplaints.map((complaint) => (
              <tr key={complaint.id} className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                <td className="px-6 py-4">
                  <div>
                    <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {complaint.title}
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} truncate max-w-xs`}>
                      {complaint.description}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {complaint.studentName}
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Room {complaint.room}
                    </div>
                  </div>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {complaint.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(complaint.priority)}`}>
                    {complaint.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(complaint.status)}`}>
                    {complaint.status}
                  </span>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {new Date(complaint.dateSubmitted).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Button
                    onClick={() => handleViewDetails(complaint.id)}
                    variant="outline"
                    size="small"
                    isDarkMode={isDarkMode}
                  >
                    View
                  </Button>
                  {complaint.status !== 'Resolved' && (
                    <select
                      onChange={(e) => handleUpdateStatus(complaint.id, e.target.value)}
                      className={`px-2 py-1 text-xs border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      defaultValue=""
                    >
                      <option value="" disabled>Update</option>
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredComplaints.length)} of {filteredComplaints.length} complaints
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            variant="outline"
            size="small"
            isDarkMode={isDarkMode}
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            variant="outline"
            size="small"
            isDarkMode={isDarkMode}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintList;
