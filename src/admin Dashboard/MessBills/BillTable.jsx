import React, { useState } from 'react';
import Button from '../Common/Button';

const BillTable = ({ isDarkMode, selectedMonth, filter }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data - replace with actual data from API
  const bills = [
    { id: 1, studentName: 'John Doe', room: '101', amount: 2500, status: 'Paid', dueDate: '2024-01-15', paidDate: '2024-01-10' },
    { id: 2, studentName: 'Jane Smith', room: '102', amount: 2500, status: 'Pending', dueDate: '2024-01-15', paidDate: null },
    { id: 3, studentName: 'Bob Johnson', room: '103', amount: 2500, status: 'Paid', dueDate: '2024-01-15', paidDate: '2024-01-12' },
    { id: 4, studentName: 'Alice Brown', room: '104', amount: 2500, status: 'Overdue', dueDate: '2024-01-15', paidDate: null },
    { id: 5, studentName: 'Charlie Wilson', room: '105', amount: 2500, status: 'Paid', dueDate: '2024-01-15', paidDate: '2024-01-08' },
  ];

  const filteredBills = bills.filter(bill => {
    const matchesFilter = filter === 'all' || bill.status.toLowerCase() === filter;
    return matchesFilter;
  });

  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBills = filteredBills.slice(startIndex, startIndex + itemsPerPage);

  const handleSendReminder = (billId) => {
    console.log('Send reminder for bill:', billId);
  };

  const handleMarkAsPaid = (billId) => {
    console.log('Mark bill as paid:', billId);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
          <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Student
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Room
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Amount
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Status
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Due Date
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
            {paginatedBills.map((bill) => (
              <tr key={bill.id} className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {bill.studentName}
                  </div>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {bill.room}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatCurrency(bill.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(bill.status)}`}>
                    {bill.status}
                  </span>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {new Date(bill.dueDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {bill.status === 'Pending' || bill.status === 'Overdue' ? (
                    <>
                      <Button
                        onClick={() => handleMarkAsPaid(bill.id)}
                        variant="success"
                        size="small"
                        isDarkMode={isDarkMode}
                      >
                        Mark Paid
                      </Button>
                      <Button
                        onClick={() => handleSendReminder(bill.id)}
                        variant="outline"
                        size="small"
                        isDarkMode={isDarkMode}
                      >
                        Reminder
                      </Button>
                    </>
                  ) : (
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Paid on {bill.paidDate ? new Date(bill.paidDate).toLocaleDateString() : 'N/A'}
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
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredBills.length)} of {filteredBills.length} bills
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

export default BillTable;
