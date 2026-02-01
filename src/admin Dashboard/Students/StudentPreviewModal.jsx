import React, { useState, useEffect } from 'react';
import { parseRoomNumber } from '../../Common/roomUtils';
import { fetchStudentStats } from '../../registration/api';

const StudentPreviewModal = ({ student, isOpen, onClose }) => {
  if (!isOpen || !student) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  // Get room information using roomUtils
  const roomInfo = parseRoomNumber(student.room_number);

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    if (isOpen && student?.id) {
      setLoadingStats(true);
      fetchStudentStats(student.id)
        .then(response => {
          // Check if response has data property (from axios wrapper in api.js)
          // Our fetchStudentStats returns response.data if success is true.
          // Let's verify structure: result of fetchStudentStats calls response.data.
          // So 'response' here IS likely { success: true, data: { ... } }
          if (response && response.data) {
            setStats(response.data);
          }
        })
        .catch(err => {
          console.error("Failed to fetch stats:", err);
          setStats(null);
        })
        .finally(() => setLoadingStats(false));
    } else if (!isOpen) {
      setStats(null);
    }
  }, [isOpen, student]);

  const getStatusColor = (status) => {
    if (!status || typeof status !== 'string') return 'bg-gray-100 text-gray-800';

    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white border-gray-200 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-gray-200 border-b">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-white">
                {student.name ? student.name.charAt(0).toUpperCase() : 'N'}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {student.name || 'N/A'}
              </h3>
              <p className="text-sm text-gray-600">
                Student Details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            ❌
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Statistics Section - New Addition */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center">
                📊 Performance & Billing Overview
              </h4>

              {loadingStats ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : stats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Attendance Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100 shadow-sm">
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-2xl">📅</span>
                      <h5 className="font-bold text-gray-800">Attendance</h5>
                    </div>


                  </div>

                  {/* Mess Bill Card */}
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-5 rounded-xl border border-orange-100 shadow-sm">
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-2xl">🍽️</span>
                      <h5 className="font-bold text-gray-800">Mess Bill Status</h5>
                    </div>


                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center text-gray-500">
                  No statistical data available for this student.
                </div>
              )}
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Personal Information
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Full Name
                  </label>
                  <p className="text-sm p-2 rounded bg-gray-50 text-gray-900">
                    {student.name || 'N/A'}
                  </p>
                </div>


                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Father/Guardian Name
                  </label>
                  <p className="text-sm p-2 rounded bg-gray-50 text-gray-900">
                    {student.father_guardian_name || 'N/A'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Email Address
                  </label>
                  <p className="text-sm p-2 rounded bg-gray-50 text-gray-900">
                    {student.email || 'N/A'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Student Phone Number
                  </label>
                  <p className="text-sm p-2 rounded bg-gray-50 text-gray-900">
                    {student.student_contact_number || 'N/A'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Parent Phone Number
                  </label>
                  <p className="text-sm p-2 rounded bg-gray-50 text-gray-900">
                    {student.parent_guardian_contact_number || 'N/A'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Date of Birth
                  </label>
                  <p className="text-sm p-2 rounded bg-gray-50 text-gray-900">
                    {student.dob || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Academic Information
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Registration Number
                  </label>
                  <p className="text-sm p-2 rounded bg-gray-50 text-gray-900">
                    {student.registration_number || 'N/A'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Department
                  </label>
                  <p className="text-sm p-2 rounded bg-gray-50 text-gray-900">
                    {student.department || 'N/A'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Academic Year
                  </label>
                  <p className="text-sm p-2 rounded bg-gray-50 text-gray-900">
                    {student.academic_year || 'N/A'}
                  </p>
                </div>


              </div>
            </div>

            {/* Hostel Information */}
            <div className="space-y-4 md:col-span-2">
              <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Hostel Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Room Number
                  </label>
                  <p className="text-sm p-2 rounded bg-gray-50 text-gray-900">
                    {roomInfo.roomNumber || 'N/A'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Block/Building
                  </label>
                  <p className="text-sm p-2 rounded bg-gray-50 text-gray-900">
                    {roomInfo.block || 'N/A'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Floor
                  </label>
                  <p className="text-sm p-2 rounded bg-gray-50 text-gray-900">
                    {roomInfo.floor || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Status and Dates */}
            <div className="space-y-4 md:col-span-2">
              <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Status & Timeline
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Current Status
                  </label>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                    {student.status || 'N/A'}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Application Date
                  </label>
                  <p className="text-sm p-2 rounded bg-gray-50 text-gray-900">
                    {student.created_at ? formatDate(student.created_at) : 'N/A'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Last Updated
                  </label>
                  <p className="text-sm p-2 rounded bg-gray-50 text-gray-900">
                    {student.updated_at ? formatDate(student.updated_at) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            {(student.guardian_name || student.guardian_phone || student.address || student.emergency_contact) && (
              <div className="space-y-4 md:col-span-2">
                <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Additional Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {student.guardian_name && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1">
                        Guardian Name
                      </label>
                      <p className="text-sm p-2 rounded bg-gray-50 text-gray-900">
                        {student.guardian_name}
                      </p>
                    </div>
                  )}

                  {student.guardian_phone && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1">
                        Guardian Phone
                      </label>
                      <p className="text-sm p-2 rounded bg-gray-50 text-gray-900">
                        {student.guardian_phone}
                      </p>
                    </div>
                  )}

                  {student.address && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-800 mb-1">
                        Address
                      </label>
                      <p className="text-sm p-2 rounded bg-gray-50 text-gray-900">
                        {student.address}
                      </p>
                    </div>
                  )}

                  {student.emergency_contact && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-800 mb-1">
                        Emergency Contact
                      </label>
                      <p className="text-sm p-2 rounded bg-gray-50 text-gray-900">
                        {student.emergency_contact}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="flex justify-end space-x-3 p-6 border-gray-200 bg-gray-50 border-t mt-auto">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium transition-colors bg-red-500 text-white hover:bg-red-600"
          >
            Close
          </button>

        </div>
      </div>
    </div>
  );
};

export default StudentPreviewModal;