import React, { useState } from 'react';
import Button from '../Common/Button';

const VisitorTable = ({ isDarkMode, filter }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data - replace with actual data from API
  const visitors = [
    { id: 1, name: 'Sarah Johnson', studentName: 'John Doe', relation: 'Mother', checkInTime: '2024-01-15 10:30', checkOutTime: null, status: 'Checked In', purpose: 'Parent Visit' },
    { id: 2, name: 'Mike Wilson', studentName: 'Jane Smith', relation: 'Father', checkInTime: '2024-01-15 09:15', checkOutTime: '2024-01-15 11:45', status: 'Checked Out', purpose: 'Meeting' },
    { id: 3, name: 'Emma Davis', studentName: 'Bob Johnson', relation: 'Sister', checkInTime: null, checkOutTime: null, status: 'Expected', purpose: 'Family Visit' },
    { id: 4, name: 'Robert Brown', studentName: 'Alice Brown', relation: 'Brother', checkInTime: '2024-01-14 14:20', checkOutTime: '2024-01-14 16:30', status: 'Checked Out', purpose: 'Delivery' },
    { id: 5, name: 'Lisa Anderson', studentName: 'Charlie Wilson', relation: 'Friend', checkInTime: '2024-01-15 13:45', checkOutTime: null, status: 'Checked In', purpose: 'Study Group' },
  ];

  const filteredVisitors = visitors.filter(visitor => {
    const matchesFilter = filter === 'all' || visitor.status.toLowerCase().replace(' ', '-') === filter;
    return matchesFilter;
  });

  const totalPages = Math.ceil(filteredVisitors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVisitors = filteredVisitors.slice(startIndex, startIndex + itemsPerPage);

  const handleCheckIn = (visitorId) => {
    console.log('Check in visitor:', visitorId);
  };

  const handleCheckOut = (visitorId) => {
    console.log('Check out visitor:', visitorId);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'checked in':
        return 'bg-green-100 text-green-800';
      case 'checked out':
        return 'bg-gray-100 text-gray-800';
      case 'expected':
        return 'bg-blue-100 text-blue-800';
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
                Visitor
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Student
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Relation
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Status
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Check-in Time
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
            {paginatedVisitors.map((visitor) => (
              <tr key={visitor.id} className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {visitor.name}
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {visitor.purpose}
                    </div>
                  </div>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {visitor.studentName}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {visitor.relation}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(visitor.status)}`}>
                    {visitor.status}
                  </span>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {visitor.checkInTime ? new Date(visitor.checkInTime).toLocaleString() : 'Not checked in'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {visitor.status === 'Expected' && (
                    <Button
                      onClick={() => handleCheckIn(visitor.id)}
                      variant="success"
                      size="small"
                      isDarkMode={isDarkMode}
                    >
                      Check In
                    </Button>
                  )}
                  {visitor.status === 'Checked In' && (
                    <Button
                      onClick={() => handleCheckOut(visitor.id)}
                      variant="outline"
                      size="small"
                      isDarkMode={isDarkMode}
                    >
                      Check Out
                    </Button>
                  )}
                  {visitor.status === 'Checked Out' && (
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Completed
                    </span>
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
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredVisitors.length)} of {filteredVisitors.length} visitors
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

export default VisitorTable;
