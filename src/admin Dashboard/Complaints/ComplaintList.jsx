import React, { useState } from 'react';
import Button from '../Common/Button';
import Modal from '../Common/Modal';
import { changeComplaintStatus } from '../../registration/api';

const ComplaintList = ({
  isDarkMode,
  complaints = [],
  onRefresh,
  pagination,
  onPageChange
}) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Use props for pagination
  const { currentPage, totalPages, totalRecords, limit } = pagination || {
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10
  };

  const handleUpdateStatus = async (complaintId, newStatus) => {
    // Optimistic UI update or wait for completion? waiting for completion is safer
    if (!window.confirm(`Are you sure you want to change status to "${newStatus}"?`)) return;

    try {
      const response = await changeComplaintStatus(complaintId, newStatus);
      if (response && (response.success || response.message)) {
        // Note: api usually returns whole response object or data
        // API wrapper returns response.data probably
        alert(response.message || 'Updated successfully');
        if (onRefresh) onRefresh();
      } else {
        alert(response?.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating complaint status:', err);
      // alert(err.message || 'Internal Server Error');
    }
  };

  const handleViewComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedComplaint(null);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
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
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'normal':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate start and end indices for display purposes only
  const displayStartIndex = (currentPage - 1) * limit + 1;
  const displayEndIndex = Math.min(currentPage * limit, totalRecords);

  return (
    <div className="space-y-4">
      {/* Mobile: stacked complaint cards */}
      <div className="space-y-3 sm:hidden">
        {complaints.length > 0 ? (
          complaints.map((complaint) => {
            return (
              <div key={complaint.id} className={isDarkMode ? 'p-3 rounded-lg bg-gray-800 border border-gray-700' : 'p-3 rounded-lg bg-white border border-gray-200'}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className={isDarkMode ? 'text-sm font-medium text-white' : 'text-sm font-medium text-gray-900'}>
                      {complaint.title}
                    </div>
                    <div className={isDarkMode ? 'text-xs text-gray-400 mt-1' : 'text-xs text-gray-600 mt-1'}>
                      {complaint.description}
                    </div>
                    <div className="mt-2 text-sm">
                      <div><strong>Student:</strong> {complaint.studentName}</div>
                      <div><strong>Room:</strong> {complaint.room}</div>
                      <div><strong>Category:</strong> {complaint.category}</div>
                      <div><strong>Priority:</strong> <span className={'inline-block px-2 py-1 rounded ' + getPriorityColor(complaint.priority)}>{complaint.priority}</span></div>
                      <div><strong>Status:</strong> <span className={'inline-block px-2 py-1 rounded ' + getStatusColor(complaint.status)}>{complaint.status}</span></div>
                      <div><strong>Date:</strong> {new Date(complaint.dateSubmitted).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="ml-3 flex-shrink-0">
                    <div className="flex flex-col space-y-2">
                      <Button onClick={() => handleViewComplaint(complaint)} variant="outline" size="small" isDarkMode={isDarkMode}>
                        View
                      </Button>
                      {complaint.status !== 'resolved' && (
                        <div className="flex flex-col space-y-1 mt-2">
                          {/* Status Change Buttons */}
                          {(complaint.status !== 'pending' && complaint.status !== 'open') && (
                            <Button
                              onClick={() => handleUpdateStatus(complaint.id, 'pending')}
                              variant="outline"
                              size="small"
                              isDarkMode={isDarkMode}
                              className="w-full text-center"
                            >
                              Mark Pending
                            </Button>
                          )}

                          {complaint.status !== 'in progress' && (
                            <Button
                              onClick={() => handleUpdateStatus(complaint.id, 'in progress')}
                              variant="outline"
                              size="small"
                              isDarkMode={isDarkMode}
                              className="w-full text-center"
                            >
                              Mark In Progress
                            </Button>
                          )}

                          <Button
                            onClick={() => handleUpdateStatus(complaint.id, 'resolved')}
                            variant="outline"
                            size="small"
                            isDarkMode={isDarkMode}
                            className="w-full text-center hover:bg-green-100 hover:text-green-700"
                          >
                            Mark Resolved
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className={isDarkMode ? 'px-4 py-3 text-center text-gray-400' : 'px-4 py-3 text-center text-gray-600'}>No complaints found</div>
        )}
      </div>

      {/* Desktop/tablet: show table on sm+ */}
      <div className="hidden sm:block">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto block w-full" style={{ position: 'relative', zIndex: 1 }}>
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
              {complaints.length > 0 ? (
                complaints.map((complaint) => (
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
                    <td className="px-6 py-4 text-sm font-medium space-x-2">
                      <div className="flex flex-col space-y-1">
                        <Button
                          onClick={() => handleViewComplaint(complaint)}
                          variant="outline"
                          size="small"
                          isDarkMode={isDarkMode}
                          className="w-full"
                        >
                          View
                        </Button>

                        {complaint.status !== 'resolved' && (
                          <>
                            {(complaint.status !== 'pending' && complaint.status !== 'open') && (
                              <Button
                                onClick={() => handleUpdateStatus(complaint.id, 'pending')}
                                variant="outline"
                                size="small"
                                isDarkMode={isDarkMode}
                              >
                                Pending
                              </Button>
                            )}

                            {complaint.status !== 'in progress' && (
                              <Button
                                onClick={() => handleUpdateStatus(complaint.id, 'in progress')}
                                variant="outline"
                                size="small"
                                isDarkMode={isDarkMode}
                              >
                                In Progress
                              </Button>
                            )}

                            <Button
                              onClick={() => handleUpdateStatus(complaint.id, 'resolved')}
                              variant="outline"
                              size="small"
                              isDarkMode={isDarkMode}
                              className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                            >
                              Resolve
                            </Button>
                          </>
                        )}
                        {/* Optionally allow reopening resolved tickets */}
                        {complaint.status === 'resolved' && (
                          <Button
                            onClick={() => handleUpdateStatus(complaint.id, 'pending')}
                            variant="outline"
                            size="small"
                            isDarkMode={isDarkMode}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Reopen
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className={`px-6 py-4 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No complaints found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 mt-4">
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
            Showing {totalRecords > 0 ? displayStartIndex : 0} to {displayEndIndex} of {totalRecords} complaints
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              variant="outline"
              size="small"
              isDarkMode={isDarkMode}
            >
              Previous
            </Button>
            <Button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
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

      {/* Modal for viewing complaint details */}
      <Modal isOpen={isViewModalOpen} onClose={handleCloseModal} title="Complaint Details" size="medium" isDarkMode={isDarkMode}>
        {selectedComplaint ? (
          <div className="space-y-4 text-sm">
            <div className={`p-4 rounded-md ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className={`block font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Student</span>
                  <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{selectedComplaint.studentName}</span>
                </div>
                <div>
                  <span className={`block font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Room</span>
                  <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{selectedComplaint.room}</span>
                </div>
                <div>
                  <span className={`block font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Category</span>
                  <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{selectedComplaint.category}</span>
                </div>
                <div>
                  <span className={`block font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Priority</span>
                  <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${getPriorityColor(selectedComplaint.priority)}`}>{selectedComplaint.priority}</span>
                </div>
                <div>
                  <span className={`block font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</span>
                  <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${getStatusColor(selectedComplaint.status)}`}>{selectedComplaint.status}</span>
                </div>
                <div>
                  <span className={`block font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Submitted</span>
                  <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{new Date(selectedComplaint.dateSubmitted).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Title</h4>
              <p className={`p-2 rounded border ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}`}>
                {selectedComplaint.title}
              </p>
            </div>

            <div>
              <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Description</h4>
              <div className={`p-3 rounded border h-32 overflow-y-auto ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}`}>
                {selectedComplaint.description}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button onClick={handleCloseModal} variant="primary" isDarkMode={isDarkMode}>Close</Button>
            </div>
          </div>
        ) : (
          <div>No complaint selected.</div>
        )}
      </Modal>
    </div>
  );
};

export default ComplaintList;
