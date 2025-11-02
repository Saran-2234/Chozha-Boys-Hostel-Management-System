import React, { useState } from 'react';
import axios from 'axios';
import Button from '../Common/Button';

const BillTable = ({ isDarkMode, students, vegFeePerDay, nonVegFeePerDay, messFeePerDay, reductionMode = false, reductionDays = {}, onReductionDaysChange, selectedMonthData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Function to get days in month
  const getDaysInMonth = (monthYear) => {
    if (!monthYear) return 30; // default
    const [month] = monthYear.split(' ');
    const monthIndex = new Date(`${month} 1, 2000`).getMonth();
    const year = parseInt(monthYear.split(' ')[1]);
    return new Date(year, monthIndex + 1, 0).getDate();
  };

  // Local state for editable days, keyed by index for uniqueness
  const [studentDays, setStudentDays] = useState(
    students.reduce((acc, student, index) => {
      const defaultDays = selectedMonthData ? getDaysInMonth(selectedMonthData.month_year) : (student.daysPresent || 30);
      acc[index] = { daysPresent: defaultDays, vegDays: 0, nonVegDays: 0 };
      return acc;
    }, {})
  );

  // State for verified students (keyed by student.id)
  const [verifiedStudents, setVerifiedStudents] = useState({});

  // State for loading verify actions (keyed by index)
  const [verifying, setVerifying] = useState({});

  // State for selected students (keyed by student.id)
  const [selectedStudents, setSelectedStudents] = useState({});

  const handleDaysChange = (index, field, value) => {
    setStudentDays(prev => ({
      ...prev,
      [index]: { ...prev[index], [field]: parseInt(value) || 0 }
    }));
  };

  const calculateMessCharges = (index) => {
    const { daysPresent } = studentDays[index];
    let charges = daysPresent * messFeePerDay;
    if (reductionMode) {
      const studentId = students[index].student_id;
      const reduction = reductionDays[studentId] || 0;
      if (reduction > 0) {
        charges -= reduction * messFeePerDay;
      }
    }
    return charges;
  };

  const calculateTotal = (index) => {
    const { daysPresent, vegDays, nonVegDays } = studentDays[index];
    const messCharges = daysPresent * messFeePerDay;
    return messCharges + (vegDays * vegFeePerDay) + (nonVegDays * nonVegFeePerDay);
  };

  const updateVerifiedStatus = async (ids, verified) => {
    try {
      const response = await axios.post('https://finalbackend1.vercel.app/update-verified-status', {
        ids,
        verified
      }, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating verified status:', error);
      throw error;
    }
  };

  const handleVerify = async (index) => {
    const student = students[index];
    if (!student) return;

    const newVerified = !verifiedStudents[index];
    setVerifying(prev => ({ ...prev, [index]: true }));

    try {
      const data = await updateVerifiedStatus([student.id], newVerified);
      setVerifiedStudents(prev => ({
        ...prev,
        [index]: newVerified
      }));
      alert(data.message);
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to update verified status.';
      alert(errorMessage);
    } finally {
      setVerifying(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleSelectStudent = (index) => {
    setSelectedStudents(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleSendToSelectedVerified = async () => {
    const selectedVerified = Object.keys(selectedStudents).filter(id => selectedStudents[id] && verifiedStudents[id]);
    if (selectedVerified.length === 0) return;

    try {
      const response = await axios.post('https://finalbackend1.vercel.app/bulkshowmessbill', {
        studentIds: selectedVerified.map(id => parseInt(id))
      }, {
        withCredentials: true,
      });
      alert(`Bills sent successfully to ${selectedVerified.length} students.`);
    } catch (error) {
      console.error('Error sending bills:', error);
      alert('Failed to send bills. Please try again.');
    }
  };

  const handleBulkVerify = async () => {
    const selectedUnverified = Object.keys(selectedStudents).filter(id => selectedStudents[id] && !verifiedStudents[id]);
    if (selectedUnverified.length === 0) return;

    try {
      const response = await updateVerifiedStatus(selectedUnverified.map(id => parseInt(id)), true);
      setVerifiedStudents(prev => ({
        ...prev,
        ...selectedUnverified.reduce((acc, id) => ({ ...acc, [id]: true }), {})
      }));
      alert(response.message);
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to bulk verify students.';
      alert(errorMessage);
    }
  };

  // Sort students: unverified first, then verified
  const sortedStudents = [...students].sort((a, b) => {
    const aIndex = students.indexOf(a);
    const bIndex = students.indexOf(b);
    const aVerified = verifiedStudents[aIndex];
    const bVerified = verifiedStudents[bIndex];
    if (aVerified && !bVerified) return 1;
    if (!aVerified && bVerified) return -1;
    return 0;
  });

  const paginatedStudents = sortedStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(students.length / itemsPerPage);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      <div className="flex justify-between">
        <Button
          onClick={handleBulkVerify}
          variant="secondary"
          isDarkMode={isDarkMode}
          disabled={Object.keys(selectedStudents).filter(id => selectedStudents[id] && !verifiedStudents[id]).length === 0}
        >
          Bulk Verify Selected
        </Button>
        <Button
          onClick={handleSendToSelectedVerified}
          variant="primary"
          isDarkMode={isDarkMode}
          disabled={Object.keys(selectedStudents).filter(id => selectedStudents[id] && verifiedStudents[id]).length === 0}
        >
          Send to Selected Verified
        </Button>
      </div>

      {/* Mobile card layout */}
      <div className="sm:hidden space-y-4">
        {paginatedStudents.map((student, index) => {
          const globalIndex = (currentPage - 1) * itemsPerPage + index;
          const { daysPresent, vegDays, nonVegDays } = studentDays[globalIndex];
          const messCharges = calculateMessCharges(globalIndex);
          const total = calculateTotal(globalIndex);
          const isVerified = verifiedStudents[globalIndex];
          const isSelected = selectedStudents[globalIndex];

          return (
            <div
              key={student.id}
              className={`rounded-xl border p-4 shadow-sm ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isSelected || false}
                    onChange={() => handleSelectStudent(globalIndex)}
                    className="w-4 h-4"
                  />
                  <div className="space-y-1">
                    <p className={`text-xs font-medium uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Student</p>
                    <div>
                      <p className="text-sm font-semibold">{student.student_name}</p>
                      {isVerified && <span className="text-xs text-green-500">Verified</span>}
                    </div>
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
                      onChange={(event) => handleDaysChange(globalIndex, 'daysPresent', event.target.value)}
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
                        onChange={(event) => handleDaysChange(globalIndex, 'vegDays', event.target.value)}
                        className={`w-full px-3 py-2 border rounded text-sm ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        min="0"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Non-Veg Days</label>
                      <input
                        type="number"
                        value={nonVegDays}
                        onChange={(event) => handleDaysChange(globalIndex, 'nonVegDays', event.target.value)}
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
                      onClick={() => handleVerify(globalIndex)}
                      variant={isVerified ? "outline" : "primary"}
                      size="small"
                      isDarkMode={isDarkMode}
                      disabled={verifying[globalIndex]}
                    >
                      {verifying[globalIndex] ? "Updating..." : (isVerified ? "Verified" : "Verify")}
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
                Select
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Student Name
              </th>
              {reductionMode && (
                <>
                  <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Reduction Applied
                  </th>
                  <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Reduction Days
                  </th>
                </>
              )}
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
            {paginatedStudents.map((student, index) => {
              const globalIndex = (currentPage - 1) * itemsPerPage + index;
              const { daysPresent, vegDays, nonVegDays } = studentDays[globalIndex];
              const messCharges = calculateMessCharges(globalIndex);
              const total = calculateTotal(globalIndex);
              const isVerified = verifiedStudents[globalIndex];
              const isSelected = selectedStudents[globalIndex];
              return (
                <tr key={student.id} className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={isSelected || false}
                      onChange={() => handleSelectStudent(globalIndex)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {student.student_name}
                    {isVerified && <span className="text-xs text-green-500 ml-2">Verified</span>}
                  </td>
                  {reductionMode && (
                    <>
                      <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {(reductionDays[student.student_id] || 0) > 0 ? 'Yes' : 'No'}
                      </td>
                      <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {reductionDays[student.student_id] || 0}
                      </td>
                    </>
                  )}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={daysPresent}
                      onChange={(e) => handleDaysChange(globalIndex, 'daysPresent', e.target.value)}
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
                      onChange={(e) => handleDaysChange(globalIndex, 'vegDays', e.target.value)}
                      className={`w-20 px-2 py-1 border rounded text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      min="0"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={nonVegDays}
                      onChange={(e) => handleDaysChange(globalIndex, 'nonVegDays', e.target.value)}
                      className={`w-20 px-2 py-1 border rounded text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      min="0"
                    />
                  </td>
                  <td className={`px-4 py-4 whitespace-nowrap text-sm font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                    {formatCurrency(total)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      onClick={() => handleVerify(globalIndex)}
                      variant={isVerified ? "outline" : "primary"}
                      size="small"
                      isDarkMode={isDarkMode}
                      disabled={verifying[globalIndex]}
                    >
                      {verifying[globalIndex] ? "Updating..." : (isVerified ? "Verified" : "Verify")}
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
