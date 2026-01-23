import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = ({ studentData }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if we have studentData from props first
        if (studentData && studentData.email) {
          console.log("Using studentData from props:", studentData);

          try {
            // Option 1: Try the profile endpoint (if it exists)
            const profileResponse = await axios.get(`https://finalbackend1.vercel.app/students/${studentData.email}`);

            if (profileResponse.status === 200) {
              setProfileData(profileResponse.data);
              setLoading(false);
              return;
            }
          } catch (apiError) {
            console.log('Profile endpoint not available, trying alternative endpoints...');

            try {
              const studentsResponse = await axios.get(`https://finalbackend1.vercel.app/students`);

              if (studentsResponse.status === 200) {
                const studentsData = studentsResponse.data;
                const student = Array.isArray(studentsData)
                  ? studentsData.find(s => s.email === studentData.email)
                  : null;

                if (student) {
                  setProfileData(student);
                  setLoading(false);
                  return;
                } else {
                  setError('Student not found in the database');
                }
              } else {
                setError('Failed to fetch students data');
              }
            } catch (studentsError) {
              console.log('Students endpoint also failed, using props data only');
              setError('Failed to fetch profile data from all endpoints');
            }
          }

          // If API calls fail, use the studentData from props
          setProfileData(studentData);
        } else {
          setError('No student data available');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
        if (studentData) {
          setProfileData(studentData);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, [studentData]);

  // Use the actual student data if available
  const data = profileData || studentData || {};

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      if (data?.id) {
        try {
          setStatsLoading(true);
          const response = await axios.post('http://localhost:3001/students/stats', {
            student_id: data.id
          });
          if (response.data.success) {
            setStats(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching stats:", error);
        } finally {
          setStatsLoading(false);
        }
      }
    };

    fetchStats();
  }, [data?.id]);

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

  if (error && !profileData) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-xl p-8">
            <div className="text-center text-red-400">
              <p>Error loading profile: {error}</p>
              <p className="text-sm mt-2">Showing available information only</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">

        {/* Statistics Section */}
        {stats && (
          <div className="glass-card rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Dashboard Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Attendance Stats */}
              <div className="glass-effect p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-blue-400">Attendance</h3>
                  <span className="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded">Live Updates</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/5">
                    <p className="text-slate-400 text-sm mb-1">Overall</p>
                    <p className="text-2xl font-bold text-white">{stats.attendance.overall.percentage}%</p>
                    <p className="text-xs text-slate-500 mt-1">{stats.attendance.overall.present}/{stats.attendance.overall.total} Days</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/5">
                    <p className="text-slate-400 text-sm mb-1">Current Year</p>
                    <p className="text-2xl font-bold text-white">{stats.attendance.year.percentage}%</p>
                    <p className="text-xs text-slate-500 mt-1">{stats.attendance.year.present}/{stats.attendance.year.total} Days</p>
                  </div>
                </div>
              </div>

              {/* Mess Bill Stats */}
              <div className="glass-effect p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-emerald-400">Mess Bill</h3>
                  <span className="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded">Payment Status</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Paid Amount</span>
                      <span className="text-emerald-400 font-bold float-right">{stats.messBill.currency} {stats.messBill.paid}</span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Pending Amount</span>
                      <span className="text-red-400 font-bold float-right">{stats.messBill.currency} {stats.messBill.notPaid}</span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

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
              <p className="text-slate-400">Reg. Number: {data.registration_number || 'N/A'}</p>
              <p className="text-slate-400">Roll Number: {data.roll_number || 'N/A'}</p>
              <p className="text-slate-400 mt-2">Room Number: {data.room_number || 'N/A'}</p>
            </div>

            {/* Personal Details */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                  <div className="glass-effect p-3 rounded-lg">
                    <p className="text-white">{data.name || 'Not Available'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Father's Name</label>
                  <div className="glass-effect p-3 rounded-lg">
                    <p className="text-white">{data.father_guardian_name || 'Not Available'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Department</label>
                  <div className="glass-effect p-3 rounded-lg">
                    <p className="text-white">{data.department || 'Not Available'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Academic Year</label>
                  <div className="glass-effect p-3 rounded-lg">
                    <p className="text-white">{data.academic_year || 'Not Available'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Student Contact</label>
                  <div className="glass-effect p-3 rounded-lg">
                    <p className="text-white">{data.student_contact_number || 'Not Available'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Parent Contact</label>
                  <div className="glass-effect p-3 rounded-lg">
                    <p className="text-white">{data.parent_guardian_contact_number || 'Not Available'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Date of Birth</label>
                  <div className="glass-effect p-3 rounded-lg">
                    <p className="text-white">{data.dob ? new Date(data.dob).toLocaleDateString() : 'Not Available'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Blood Group</label>
                  <div className="glass-effect p-3 rounded-lg">
                    <p className="text-white">{data.blood_group || 'Not Available'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Email ID</label>
                  <div className="glass-effect p-3 rounded-lg">
                    <p className="text-white">{data.email || 'Not Available'}</p>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-400 mb-2">Address</label>
                  <div className="glass-effect p-3 rounded-lg">
                    <p className="text-white">{data.address || 'Not Available'}</p>
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