import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchTransactionHistory } from '../../registration/api';

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

  // Transaction History State
  const [showTransModal, setShowTransModal] = useState(false);
  const [transData, setTransData] = useState([]);
  const [transLoading, setTransLoading] = useState(false);
  const [transYear, setTransYear] = useState('');
  const [transMonth, setTransMonth] = useState('');

  const fetchHistory = async (year = '', month = '') => {
    if (!data?.id) return;
    setTransLoading(true);
    setShowTransModal(true);
    try {
      const result = await fetchTransactionHistory(data.id, 1, 100, year, month);
      if (result.success) {
        setTransData(result.data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setTransLoading(false);
    }
  };

  useEffect(() => {
    if (showTransModal) {
      fetchHistory(transYear, transMonth);
    }
  }, [transYear, transMonth, showTransModal]);

  useEffect(() => {
    const fetchStats = async () => {
      if (data?.id) {
        try {
          setStatsLoading(true);
          const response = await axios.post('https://finalbackend1.vercel.app/students/stats', {
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

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

              {/* Transaction Stats */}
              <div className="glass-effect p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
                onClick={() => {
                  setTransYear('');
                  setTransMonth('');
                  fetchHistory();
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-purple-400">Transactions</h3>
                  <span className="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded">History</span>
                </div>
                <div className="space-y-4">
                  <div className="text-center p-3 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/5">
                    <p className="text-slate-400 text-sm mb-1">Total Paid</p>
                    <p className="text-2xl font-bold text-white">₹{stats.messBill.paid}</p>
                  </div>
                  <div className="mt-3 text-xs text-purple-400 text-right font-medium">Click to view details →</div>
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


      {/* Transaction History Modal */}
      {
        showTransModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="glass-card rounded-xl max-w-4xl w-full max-h-[85vh] flex flex-col border border-white/10">
              <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h3 className="font-bold text-xl text-white">Transaction History</h3>

                {/* Filters */}
                <div className="flex gap-2">
                  <select
                    className="px-3 py-1 bg-slate-800 border border-white/10 rounded-md text-sm text-slate-300 focus:outline-none focus:border-blue-500"
                    value={transYear}
                    onChange={(e) => setTransYear(e.target.value)}
                  >
                    <option value="">All Years</option>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <option key={i} value={new Date().getFullYear() - 2 + i}>
                        {new Date().getFullYear() - 2 + i}
                      </option>
                    ))}
                  </select>
                  <select
                    className="px-3 py-1 bg-slate-800 border border-white/10 rounded-md text-sm text-slate-300 focus:outline-none focus:border-blue-500"
                    value={transMonth}
                    onChange={(e) => setTransMonth(e.target.value)}
                  >
                    <option value="">All Months</option>
                    {Array.from({ length: 12 }).map((_, i) => (
                      <option key={i} value={i + 1}>
                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                  <button onClick={() => setShowTransModal(false)} className="text-slate-400 hover:text-white text-2xl ml-2">&times;</button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                {transLoading ? (
                  <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="mt-2 text-slate-400">Loading transactions...</p>
                  </div>
                ) : (
                  <div>
                    {transData && transData.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-white/10 text-slate-400 text-sm">
                              <th className="pb-3 font-medium">Date</th>
                              <th className="pb-3 font-medium">Amount</th>
                              <th className="pb-3 font-medium">Status</th>
                              <th className="pb-3 font-medium">Order ID</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {transData.map((txn) => (
                              <tr key={txn.id} className="hover:bg-white/5">
                                <td className="py-4 text-slate-300 text-sm">
                                  {new Date(txn.payment_time).toLocaleString()}
                                </td>
                                <td className="py-4 font-bold text-white">
                                  ₹{Number(txn.payment_amount).toFixed(2)}
                                </td>
                                <td className="py-4">
                                  <span className={`px-2 py-1 rounded text-xs font-semibold ${txn.payment_status === 'SUCCESS'
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    }`}>
                                    {txn.payment_status}
                                  </span>
                                </td>
                                <td className="py-4 text-slate-500 text-xs font-mono">
                                  {txn.order_id}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-10 text-slate-500">
                        No transactions found.
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-white/10 flex justify-end">
                <button onClick={() => setShowTransModal(false)} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium text-white transition">Close</button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default Profile;