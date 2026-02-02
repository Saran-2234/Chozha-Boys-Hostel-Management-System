import React, { useState, useEffect } from 'react';

const EditProfile = ({ studentData, onSave, onCancel }) => {
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
    profile_photo: null
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = React.useRef(null);

  // Initialize form with student data
  useEffect(() => {
    if (studentData) {
      // Check different possible structures of studentData
      const student = studentData.userdata && studentData.userdata.length > 0
        ? studentData.userdata[0]
        : studentData;

      setFormData({
        name: student.name || '',
        father_guardian_name: student.father_guardian_name || '',
        dob: student.dob || '',
        blood_group: student.blood_group || '',
        student_contact_number: student.student_contact_number || '',
        parent_guardian_contact_number: student.parent_guardian_contact_number || '',
        address: student.address || '',
        department: student.department || '',
        academic_year: student.academic_year || '',
        registration_number: student.registration_number || '',
        roll_number: student.roll_number || '',
        room_number: student.room_number || '',
        email: student.email || '',
        profile_photo: student.profile_photo || null
      });

      if (student.profile_photo) {
        setPhotoPreview(student.profile_photo);
      }
    }
  }, [studentData]);

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

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          profile_photo: 'Invalid file format. Only PNG, JPEG, JPG files are allowed.'
        }));
        return;
      }

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          profile_photo: 'File size exceeds 2MB limit. Please choose a smaller file.'
        }));
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData(prev => ({
          ...prev,
          profile_photo: reader.result
        }));
      };
      reader.readAsDataURL(file);

      // Clear any previous errors
      if (errors.profile_photo) {
        setErrors(prev => ({
          ...prev,
          profile_photo: ''
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.father_guardian_name.trim()) newErrors.father_guardian_name = 'Father/Guardian name is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.blood_group) newErrors.blood_group = 'Blood group is required';
    if (!formData.student_contact_number.trim()) newErrors.student_contact_number = 'Student contact is required';
    if (!formData.parent_guardian_contact_number.trim()) newErrors.parent_guardian_contact_number = 'Parent contact is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.academic_year) newErrors.academic_year = 'Academic year is required';
    if (!formData.registration_number.trim()) newErrors.registration_number = 'Registration number is required';
    if (!formData.roll_number.trim()) newErrors.roll_number = 'Roll number is required';
    if (!formData.room_number) newErrors.room_number = 'Room number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone number validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (formData.student_contact_number && !phoneRegex.test(formData.student_contact_number)) {
      newErrors.student_contact_number = 'Please enter a valid 10-digit mobile number';
    }
    if (formData.parent_guardian_contact_number && !phoneRegex.test(formData.parent_guardian_contact_number)) {
      newErrors.parent_guardian_contact_number = 'Please enter a valid 10-digit mobile number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Call the onSave prop function with the updated data
      await onSave(formData);
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to save profile. Please try again.'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card rounded-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
            <button
              onClick={onCancel}
              className="px-4 py-2 glass-effect text-white rounded-lg font-medium hover:bg-white hover:bg-opacity-10 transition-all"
            >
              Cancel
            </button>
          </div>

          {errors.submit && (
            <div className="mb-6 p-4 bg-red-900 bg-opacity-20 rounded-lg">
              <p className="text-red-400">{errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Photo Section */}
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-white">
                      {formData.name ? formData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'UP'}
                    </span>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="px-4 py-2 glass-effect text-white rounded-lg font-medium hover:bg-white hover:bg-opacity-10 transition-all mb-2"
                >
                  Change Photo
                </button>

                {errors.profile_photo && (
                  <p className="text-red-400 text-xs mt-2">{errors.profile_photo}</p>
                )}

                <p className="text-xs text-slate-400 mt-2">
                  JPG, PNG, JPEG (Max 2MB)
                </p>
              </div>

              {/* Personal Details Section */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-white mb-4 border-b border-slate-600 pb-2">
                      Personal Information
                    </h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 glass-effect rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-0 ${errors.name ? 'border-red-500' : ''
                        }`}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Father's/Guardian's Name *
                    </label>
                    <input
                      type="text"
                      name="father_guardian_name"
                      value={formData.father_guardian_name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 glass-effect rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-0 ${errors.father_guardian_name ? 'border-red-500' : ''
                        }`}
                    />
                    {errors.father_guardian_name && <p className="text-red-400 text-xs mt-1">{errors.father_guardian_name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 glass-effect rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-0 ${errors.dob ? 'border-red-500' : ''
                        }`}
                    />
                    {errors.dob && <p className="text-red-400 text-xs mt-1">{errors.dob}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Blood Group *
                    </label>
                    <select
                      name="blood_group"
                      value={formData.blood_group}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 glass-effect rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-0 ${errors.blood_group ? 'border-red-500' : ''
                        }`}
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                    {errors.blood_group && <p className="text-red-400 text-xs mt-1">{errors.blood_group}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Student Contact *
                    </label>
                    <input
                      type="tel"
                      name="student_contact_number"
                      value={formData.student_contact_number}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 glass-effect rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-0 ${errors.student_contact_number ? 'border-red-500' : ''
                        }`}
                    />
                    {errors.student_contact_number && <p className="text-red-400 text-xs mt-1">{errors.student_contact_number}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Parent Contact *
                    </label>
                    <input
                      type="tel"
                      name="parent_guardian_contact_number"
                      value={formData.parent_guardian_contact_number}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 glass-effect rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-0 ${errors.parent_guardian_contact_number ? 'border-red-500' : ''
                        }`}
                    />
                    {errors.parent_guardian_contact_number && <p className="text-red-400 text-xs mt-1">{errors.parent_guardian_contact_number}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                      className={`w-full px-4 py-3 glass-effect rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-0 resize-none ${errors.address ? 'border-red-500' : ''
                        }`}
                    />
                    {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                  </div>

                  {/* Academic Information */}
                  <div className="md:col-span-2 mt-6">
                    <h3 className="text-lg font-semibold text-white mb-4 border-b border-slate-600 pb-2">
                      Academic Information
                    </h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Department *
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 glass-effect rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-0 ${errors.department ? 'border-red-500' : ''
                        }`}
                    >
                      <option value="">Select Department</option>
                      <option value="Computer Science Engineering">Computer Science Engineering</option>
                      <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
                      <option value="Electrical and Electronics Engineering">Electrical and Electronics Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Chemical Engineering">Chemical Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Instrumentation and Control Engineering">Instrumentation and Control Engineering</option>
                    </select>
                    {errors.department && <p className="text-red-400 text-xs mt-1">{errors.department}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Academic Year *
                    </label>
                    <select
                      name="academic_year"
                      value={formData.academic_year}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 glass-effect rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-0 ${errors.academic_year ? 'border-red-500' : ''
                        }`}
                    >
                      <option value="">Select Year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                    {errors.academic_year && <p className="text-red-400 text-xs mt-1">{errors.academic_year}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Registration Number *
                    </label>
                    <input
                      type="text"
                      name="registration_number"
                      value={formData.registration_number}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 glass-effect rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-0 ${errors.registration_number ? 'border-red-500' : ''
                        }`}
                    />
                    {errors.registration_number && <p className="text-red-400 text-xs mt-1">{errors.registration_number}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Roll Number *
                    </label>
                    <input
                      type="text"
                      name="roll_number"
                      value={formData.roll_number}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 glass-effect rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-0 ${errors.roll_number ? 'border-red-500' : ''
                        }`}
                    />
                    {errors.roll_number && <p className="text-red-400 text-xs mt-1">{errors.roll_number}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Room Number *
                    </label>
                    <input
                      type="text"
                      name="room_number"
                      value={formData.room_number}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 glass-effect rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-0 ${errors.room_number ? 'border-red-500' : ''
                        }`}
                    />
                    {errors.room_number && <p className="text-red-400 text-xs mt-1">{errors.room_number}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 glass-effect rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-0 ${errors.email ? 'border-red-500' : ''
                        }`}
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-slate-600">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 glass-effect text-white rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all ${isLoading ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;