import React, { useState, useEffect } from 'react';
import Button from '../Common/Button';

const EditStudentModal = ({ isDarkMode, student, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    father_guardian_name: '',
    dob: '',
    blood_group: '',
    student_contact_number: '',
    parent_guardian_contact_number: '',
    address: '',
    department: '',
    academic_year: '',
    registration_number: '',
    roll_number: '',
    room_number: '',
    email: '',
    status: '',
    approved_by: '',
    year: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name ? String(student.name) : '',
        father_guardian_name: student.father_guardian_name ? String(student.father_guardian_name) : '',
        dob: student.dob ? String(student.dob).split('T')[0] : '',
        blood_group: student.blood_group ? String(student.blood_group) : '',
        student_contact_number: student.student_contact_number ? String(student.student_contact_number) : '',
        parent_guardian_contact_number: student.parent_guardian_contact_number ? String(student.parent_guardian_contact_number) : '',
        address: student.address ? String(student.address) : '',
        department: student.department ? String(student.department) : '',
        academic_year: student.academic_year ? String(student.academic_year) : '',
        registration_number: student.registration_number ? String(student.registration_number) : '',
        roll_number: student.roll_number ? String(student.roll_number) : '',
        room_number: student.room_number ? String(student.room_number) : '',
        email: student.email ? String(student.email) : '',
        status: student.status ? String(student.status) : '',
        approved_by: student.approved_by ? String(student.approved_by) : '',
        year: student.year ? String(student.year) : ''
      });
    }
  }, [student]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (formData.student_contact_number && !/^\d{10}$/.test(formData.student_contact_number.replace(/\D/g, ''))) {
      newErrors.student_contact_number = 'Phone number must be 10 digits';
    }

    if (!formData.room_number.trim()) {
      newErrors.room_number = 'Room number is required';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (!formData.academic_year.trim()) {
      newErrors.academic_year = 'Academic year is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Include all form fields, even if empty (let backend handle validation)
      const dataToUpdate = {};
      Object.keys(formData).forEach(key => {
        // Only trim string fields, keep numbers and other types as-is
        if (typeof formData[key] === 'string') {
          dataToUpdate[key] = formData[key].trim();
        } else {
          dataToUpdate[key] = formData[key];
        }
      });

      console.log('Sending update data:', dataToUpdate);

      await onSave(student.id, dataToUpdate);
    } catch (error) {
      console.error('Error updating student:', error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`p-6 rounded-2xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="text-center mb-6">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Edit Student Details
          </h3>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {student.name} - {student.registration_number}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md text-sm ${isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                } ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Enter student name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Father/Guardian Name *
            </label>
            <input
              type="text"
              name="father_guardian_name"
              value={formData.father_guardian_name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md text-sm ${isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                } ${errors.father_guardian_name ? 'border-red-500' : ''}`}
              placeholder="Enter father/guardian name"
            />
            {errors.father_guardian_name && <p className="text-red-500 text-xs mt-1">{errors.father_guardian_name}</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Date of Birth *
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md text-sm ${isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                } ${errors.dob ? 'border-red-500' : ''}`}
            />
            {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Blood Group *
            </label>
            <input
              type="text"
              name="blood_group"
              value={formData.blood_group}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md text-sm ${isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                } ${errors.blood_group ? 'border-red-500' : ''}`}
              placeholder="Enter blood group (e.g., A+, O-)"
            />
            {errors.blood_group && <p className="text-red-500 text-xs mt-1">{errors.blood_group}</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md text-sm ${isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                } ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Enter email address"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Student Phone
            </label>
            <input
              type="tel"
              name="student_contact_number"
              value={formData.student_contact_number}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md text-sm ${isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                } ${errors.student_contact_number ? 'border-red-500' : ''}`}
              placeholder="Enter phone number"
            />
            {errors.student_contact_number && <p className="text-red-500 text-xs mt-1">{errors.student_contact_number}</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Parent/Guardian Phone
            </label>
            <input
              type="tel"
              name="parent_guardian_contact_number"
              value={formData.parent_guardian_contact_number}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md text-sm ${isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                } ${errors.parent_guardian_contact_number ? 'border-red-500' : ''}`}
              placeholder="Enter guardian phone number"
            />
            {errors.parent_guardian_contact_number && <p className="text-red-500 text-xs mt-1">{errors.parent_guardian_contact_number}</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Address *
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md text-sm ${isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                } ${errors.address ? 'border-red-500' : ''}`}
              placeholder="Enter address"
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Registration Number (Read-only)
            </label>
            <input
              type="text"
              name="registration_number"
              value={formData.registration_number}
              readOnly
              className={`w-full px-3 py-2 border rounded-md text-sm bg-gray-100 ${isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                }`}
              placeholder="Registration number"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Roll Number *
            </label>
            <input
              type="text"
              name="roll_number"
              value={formData.roll_number}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md text-sm ${isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                } ${errors.roll_number ? 'border-red-500' : ''}`}
              placeholder="Enter roll number"
            />
            {errors.roll_number && <p className="text-red-500 text-xs mt-1">{errors.roll_number}</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Room Number *
            </label>
            <input
              type="text"
              name="room_number"
              value={formData.room_number}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md text-sm ${isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                } ${errors.room_number ? 'border-red-500' : ''}`}
              placeholder="Enter room number"
            />
            {errors.room_number && <p className="text-red-500 text-xs mt-1">{errors.room_number}</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Department *
            </label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md text-sm ${isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                } ${errors.department ? 'border-red-500' : ''}`}
              placeholder="Enter department"
            />
            {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Academic Year *
            </label>
            <input
              type="text"
              name="academic_year"
              value={formData.academic_year}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md text-sm ${isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                } ${errors.academic_year ? 'border-red-500' : ''}`}
              placeholder="Enter academic year"
            />
            {errors.academic_year && <p className="text-red-500 text-xs mt-1">{errors.academic_year}</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Year *
            </label>
            <input
              type="text"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md text-sm ${isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                } ${errors.year ? 'border-red-500' : ''}`}
              placeholder="Enter year"
            />
            {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Status (Read-only)
            </label>
            <input
              type="text"
              name="status"
              value={formData.status}
              readOnly
              className={`w-full px-3 py-2 border rounded-md text-sm bg-gray-100 ${isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                }`}
              placeholder="Status"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Approved By (Read-only)
            </label>
            <input
              type="text"
              name="approved_by"
              value={formData.approved_by}
              readOnly
              className={`w-full px-3 py-2 border rounded-md text-sm bg-gray-100 ${isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                }`}
              placeholder="Approved by"
            />
          </div>

          {errors.submit && (
            <div className={`p-3 rounded-md ${isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'}`}>
              <p className="text-sm">{errors.submit}</p>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              isDarkMode={isDarkMode}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isDarkMode={isDarkMode}
              className="flex-1"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudentModal;
