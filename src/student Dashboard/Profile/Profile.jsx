import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import EditProfile from './EditProfile';

const Profile = ({ studentData }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Editing removed: profile is read-only in the dashboard

  // Fallback data if studentData is not available
  const defaultData = {
    name: 'Student Name',
    father_guardian_name: 'Father Name',
    department: 'Department',
    academic_year: 'Academic Year',
    student_contact_number: 'Contact Number',
    parent_guardian_contact_number: 'Parent Contact',
    blood_group: 'Blood Group',
    email: 'student@example.com',
    registration_number: 'REG001',
    roll_number: 'ROLL001',
    room_number: '101',
    address: 'Address not available',
    profile_photo: null,
    dob: ''
  };

  useEffect(() => {
    const fetchStudentProfile = async () => {
      // Check if we have studentData with the correct structure from login
      if (studentData && studentData.data) {
        console.log("Using studentData from props:", studentData.data);
        setProfileData(studentData.data);
        setLoading(false);
        return;
      }

      // If no studentData, try to fetch from API
      if (!studentData?.email) {
        setProfileData(defaultData);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Try to fetch complete student data from your backend
        const profileResponse = await fetch(`https://finalbackend-mauve.vercel.app/student/profile/${studentData.email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        console.log("Profile API raw response status:", profileResponse.status);
        
        if (profileResponse.ok) {
          const data = await profileResponse.json();
          setProfileData(data);
        } else {
          // Try to get student by email from a general students endpoint
          const studentsResponse = await fetch(`https://finalbackend-mauve.vercel.app/students?email=${studentData.email}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (studentsResponse.ok) {
            const studentsData = await studentsResponse.json();
            // Assuming the response is an array, get the first matching student
            const student = Array.isArray(studentsData) ? studentsData.find(s => s.email === studentData.email) : studentsData;
            setProfileData(student || { ...defaultData, ...studentData });
          } else {
            // Use login data with fallbacks
            setProfileData({ ...defaultData, ...studentData });
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
        // Use login data as fallback
        setProfileData({ ...defaultData, ...studentData });
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, [studentData]);

  // Handle profile update
  const handleSaveProfile = async (updatedData) => {
    try {
      // Call your API to update the profile
      const response = await fetch('https://hostel-backend-three.vercel.app/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(updatedData)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Profile updated successfully:', result);

        // Update authToken if a new token is provided
        if (result.token) {
          localStorage.setItem('authToken', result.token);
        }

        // Update local state with new data
        setProfileData(updatedData);
        setIsEditing(false);

        // Show success message
        alert('Profile updated successfully!');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  // Use the actual student data if available, otherwise use default data
  const data = profileData || defaultData;

  console.log("Rendering profile with data:", data, "Loading:", loading, "Error:", error);


  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-xl p-8">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-slate-400">Loading profile data...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 font-bold">
        Error loading profile: {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card rounded-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Personal Information</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Photo */}
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                {data.profile_photo ? (
                  <img
                    src={data.profile_photo}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-4xl font-bold text-white">
                    {data.name ? data.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'ST'}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{data.name || 'Student Name'}</h3>
              <p className="text-slate-400">Registration: {data.registration_number || 'N/A'}</p>
              <p className="text-slate-400">Roll: {data.roll_number || 'N/A'}</p>
              <p className="text-slate-400 mt-2">Room: {data.room_number || 'N/A'}</p>
            </div>

            {/* Personal Details */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                  <div className="glass-effect p-3 rounded-lg">
                    <p className="text-white">{data.name || 'Rajesh Kumar'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Father's Name</label>
                  <div className="glass-effect p-3 rounded-lg">
                    <p className="text-white">{data.father_guardian_name || 'Suresh Kumar'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Department</label>
                  <div className="glass-effect p-3 rounded-lg">
                    <p className="text-white">{data.department || 'Computer Science Engineering'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Academic Year</label>
                  <div className="glass-effect p-3 rounded-lg">
                    <p className="text-white">{data.academic_year || '3rd Year'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Student Contact</label>
                  <div className="glass-effect p-3 rounded-lg">
                    <p className="text-white">{data.student_contact_number || '+91 9876543210'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Parent Contact</label>
                  <div className="glass-effect p-3 rounded-lg">
                    <p className="text-white">{data.parent_guardian_contact_number || '+91 9876543211'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Date of Birth</label>
                  <div className="glass-effect p-3 rounded-lg">
                    <p className="text-white">{data.dob ? new Date(data.dob).toLocaleDateString() : '01/01/2000'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Blood Group</label>
                  <div className="glass-effect p-3 rounded-lg">
                    <p className="text-white">{data.blood_group || 'B+'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Email ID</label>
                  <div className="glass-effect p-3 rounded-lg">
                    <p className="text-white">{data.email || 'rajesh.kumar@student.gce.edu'}</p>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-400 mb-2">Address</label>
                  <div className="glass-effect p-3 rounded-lg">
                    <p className="text-white">{data.address || '123, Main Street, Thanjavur, Tamil Nadu - 613001'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;