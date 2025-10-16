import React, { useState } from 'react';
import Button from '../Common/Button';

const BillTable = ({ isDarkMode, students, vegFeePerDay, nonVegFeePerDay, messFeePerDay }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Local state for editable days
  const [studentDays, setStudentDays] = useState(
    students.reduce((acc, student) => {
      acc[student.id] = { daysPresent: student.daysPresent, vegDays: 0, nonVegDays: 0 };
      return acc;
    }, {})
  );

  const handleDaysChange = (studentId, field, value) => {
    setStudentDays(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: parseInt(value) || 0 }
    }));
  };

  const calculateMessCharges = (studentId) => {
    const { daysPresent } = studentDays[studentId];
    return daysPresent * messFeePerDay;
  };

  const calculateTotal = (studentId) => {
    const { daysPresent, vegDays, nonVegDays } = studentDays[studentId];
    const messCharges = daysPresent * messFeePerDay;
    return messCharges + (vegDays * vegFeePerDay) + (nonVegDays * nonVegFeePerDay);
  };

  const handleSendBill = (studentId) => {
    console.log(`Sending bill to student ${studentId}`);
    // Simulate sending bill
  };

  const paginatedStudents = students.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(students.length / itemsPerPage);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {/* Mobile card layout */}
      <div className="sm:hidden space-y-4">
        {paginatedStudents.map((student) => {
          const { daysPresent, vegDays, nonVegDays } = studentDays[student.id];
          const messCharges = calculateMessCharges(student.id);
          const total = calculateTotal(student.id);

          return (
            <div
              key={student.id}
              className={`rounded-xl border p-4 shadow-sm ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className={`text-xs font-medium uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Student</p>
                  <div>
                    <p className="text-sm font-semibold">{student.name}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{student.id}</p>
                  </div>
                </div>
                <div className={`rounded-full px-3 py-1 text-xs font-semibold ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-600'}`}>
                  ₹{messFeePerDay.toLocaleString()}/day
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Days Present</label>
                    <input
                      type="number"
                      value={daysPresent}
                      onChange={(event) => handleDaysChange(student.id, 'daysPresent', event.target.value)}
                      className={`w-full px-3 py-2 border rounded text-sm ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      min="0"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-1">
                      <label className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Veg Days</label>
                      <input
                        type="number"
                        value={vegDays}
                        onChange={(event) => handleDaysChange(student.id, 'vegDays', event.target.value)}
                        className={`w-full px-3 py-2 border rounded text-sm ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        min="0"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Non-Veg Days</label>
                      <input
                        type="number"
                        value={nonVegDays}
                        onChange={(event) => handleDaysChange(student.id, 'nonVegDays', event.target.value)}
                        className={`w-full px-3 py-2 border rounded text-sm ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Mess Charges</span>
                    <span className="font-medium">{formatCurrency(messCharges)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Total</span>
                    <span className={`text-base font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={() => handleSendBill(student.id)}
                    variant="primary"
                    size="small"
                    isDarkMode={isDarkMode}
                  >
                    Send Bill
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
          <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
            <tr>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Student ID
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Student Name
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Days Present
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Mess Fee per Day
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Mess Charges
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Veg Days
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Non-Veg Days
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Total
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
            {paginatedStudents.map((student) => {
              const { daysPresent, vegDays, nonVegDays } = studentDays[student.id];
              const messCharges = calculateMessCharges(student.id);
              const total = calculateTotal(student.id);
              return (
                <tr key={student.id} className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                  <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {student.id}
                  </td>
                  <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {student.name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={daysPresent}
                      onChange={(e) => handleDaysChange(student.id, 'daysPresent', e.target.value)}
                      className={`w-20 px-2 py-1 border rounded text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      min="0"
                    />
                  </td>
                  <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    ₹{messFeePerDay.toLocaleString()}
                  </td>
                  <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {formatCurrency(messCharges)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={vegDays}
                      onChange={(e) => handleDaysChange(student.id, 'vegDays', e.target.value)}
                      className={`w-20 px-2 py-1 border rounded text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      min="0"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={nonVegDays}
                      onChange={(e) => handleDaysChange(student.id, 'nonVegDays', e.target.value)}
                      className={`w-20 px-2 py-1 border rounded text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      min="0"
                    />
                  </td>
                  <td className={`px-4 py-4 whitespace-nowrap text-sm font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                    {formatCurrency(total)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      onClick={() => handleSendBill(student.id)}
                      variant="primary"
                      size="small"
                      isDarkMode={isDarkMode}
                    >
                      Send Bill
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {students.length > itemsPerPage && (
        <div className="flex items-center justify-between">
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, students.length)} of {students.length} students
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
      )}
    </div>
  );
};

export default BillTable;
