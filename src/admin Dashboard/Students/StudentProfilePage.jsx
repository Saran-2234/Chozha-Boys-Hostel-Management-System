import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import MainContent from '../Header/MainContent';
import { fetchStudents, fetchStudentStats } from '../../registration/api';
import { parseRoomNumber } from '../../Common/roomUtils';

const StudentProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const activeSection = 'students'; // Keep 'students' active in sidebar

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                // Fetch student details
                const studentsData = await fetchStudents({ id });
                if (studentsData && studentsData.students && studentsData.students.length > 0) {
                    const studentData = studentsData.students[0];
                    setStudent(studentData);

                    // Fetch stats
                    try {
                        const statsData = await fetchStudentStats(id);
                        if (statsData.success) {
                            setStats(statsData.data);
                        }
                    } catch (statsErr) {
                        console.error("Error fetching stats:", statsErr);
                        // Non-critical, continue
                    }
                } else {
                    // Handle not found
                }
            } catch (error) {
                console.error("Error loading profile:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadData();
        }
    }, [id]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        sessionStorage.removeItem('accessToken');
        document.cookie = 'token=; path=/; max-age=0';
        window.location.href = '/';
    };

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

    const getStatusColor = (status) => {
        if (!status || typeof status !== 'string') return 'bg-gray-100 text-gray-800';
        switch (status.toLowerCase()) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };


    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!student) {
        return <div className="p-10 text-center">Student not found</div>
    }

    const roomInfo = parseRoomNumber(student.room_number);


    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">
            <Sidebar
                activeSection={activeSection}
                setActiveSection={() => navigate('/admin-dashboard', { state: { activeSection: 'students' } })}
                onLogout={handleLogout}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            {/* Mobile Sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            <div className={`flex-1 min-w-0 flex flex-col transition-transform duration-300 md:ml-64 ${sidebarOpen ? 'translate-x-64 md:translate-x-0' : 'translate-x-0'}`}>
                <Header
                    onLogout={handleLogout}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                <MainContent>
                    <div className="max-w-7xl mx-auto">
                        {/* Back Button */}
                        <button
                            onClick={() => navigate('/admin-dashboard', { state: { activeSection: 'students' } })}
                            className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors"
                        >
                            <span className="mr-2">←</span> Back to Students
                        </button>

                        {/* Profile Header Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                            <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                            <div className="px-8 pb-8 flex flex-col md:flex-row items-start relative">
                                {/* Avatar */}
                                <div className="-mt-16 mb-4 md:mb-0 mr-6 sticky">
                                    {student.profile_photo ? (
                                        <img src={student.profile_photo} alt={student.name} className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover bg-white" />
                                    ) : (
                                        <div className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl text-white font-bold">
                                            {student.name ? student.name.charAt(0).toUpperCase() : 'N'}
                                        </div>
                                    )}
                                    <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-white ${getStatusColor(student.status).includes('green') ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
                                </div>

                                {/* Name & Status */}
                                <div className="flex-1 pt-2">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                                        <div>
                                            <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
                                            <p className="text-gray-500 mt-1 flex items-center">
                                                <span className="mr-3">{student.email}</span>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full mr-3"></span>
                                                <span>{student.registration_number}</span>
                                            </p>
                                        </div>
                                        <div className="mt-4 md:mt-0 flex gap-3">
                                            <span className={`px-4 py-2 rounded-lg text-sm font-medium ${getStatusColor(student.status)}`}>
                                                {student.status || 'Unknown Status'}
                                            </span>
                                            {/* Action buttons could go here */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column: Stats */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Stats Cards */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                        <span className="mr-2">📊</span> Performance & Billing
                                    </h3>

                                    {stats ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Attendance */}
                                            <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
                                                <h4 className="font-semibold text-blue-900 mb-4 flex justify-between">
                                                    <span>Attendance</span>
                                                    <span className="text-2xl">📅</span>
                                                </h4>
                                                <div className="space-y-4">
                                                    <div>
                                                        <div className="flex justify-between text-sm mb-1">
                                                            <span className="text-gray-600">Overall</span>
                                                            <span className="font-bold text-gray-900">{stats.attendance.overall.percentage}%</span>
                                                        </div>
                                                        <div className="w-full bg-blue-200 rounded-full h-2">
                                                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${stats.attendance.overall.percentage}%` }}></div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between text-sm mb-1">
                                                            <span className="text-gray-600">This Year</span>
                                                            <span className="font-bold text-gray-900">{stats.attendance.year.percentage}%</span>
                                                        </div>
                                                        <div className="w-full bg-blue-200 rounded-full h-2">
                                                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${stats.attendance.year.percentage}%` }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Mess Bill */}
                                            <div className="bg-orange-50/50 rounded-xl p-5 border border-orange-100">
                                                <h4 className="font-semibold text-orange-900 mb-4 flex justify-between">
                                                    <span>Mess Bill</span>
                                                    <span className="text-2xl">🍽️</span>
                                                </h4>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-white p-3 rounded-lg shadow-sm border border-orange-50">
                                                        <div className="text-xs text-gray-500 uppercase font-semibold">Paid</div>
                                                        <div className="text-xl font-bold text-emerald-600">₹{stats.messBill.paid}</div>
                                                    </div>
                                                    <div className="bg-white p-3 rounded-lg shadow-sm border border-orange-50">
                                                        <div className="text-xs text-gray-500 uppercase font-semibold">Due</div>
                                                        <div className="text-xl font-bold text-red-500">₹{stats.messBill.notPaid}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">Stats not available</div>
                                    )}
                                </div>

                                {/* Academic Info */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">Academic Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 block mb-1">Registration Number</label>
                                            <p className="text-gray-900 font-medium">{student.registration_number || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 block mb-1">Department</label>
                                            <p className="text-gray-900 font-medium">{student.department || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 block mb-1">Academic Year</label>
                                            <p className="text-gray-900 font-medium">{student.academic_year || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Personal & Hostel Info */}
                            <div className="space-y-6">
                                {/* Hostel Details */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">Hostel Details</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between border-b border-gray-50 pb-2">
                                            <span className="text-gray-600">Room Number</span>
                                            <span className="font-medium">{roomInfo.roomNumber || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-50 pb-2">
                                            <span className="text-gray-600">Block</span>
                                            <span className="font-medium">{roomInfo.block || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between pb-2">
                                            <span className="text-gray-600">Floor</span>
                                            <span className="font-medium">{roomInfo.floor || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Info</h3>
                                    <ul className="space-y-4">
                                        <li className="flex items-start">
                                            <span className="text-lg mr-3">📱</span>
                                            <div>
                                                <label className="text-xs text-gray-500 block">Student Mobile</label>
                                                <span className="text-gray-900">{student.student_contact_number || 'N/A'}</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-lg mr-3">📧</span>
                                            <div>
                                                <label className="text-xs text-gray-500 block">Email</label>
                                                <span className="text-gray-900 truncate max-w-[200px]">{student.email || 'N/A'}</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-lg mr-3">👨‍👩‍👦</span>
                                            <div>
                                                <label className="text-xs text-gray-500 block">Parent Contact</label>
                                                <span className="text-gray-900">{student.parent_guardian_contact_number || 'N/A'}</span>
                                            </div>
                                        </li>
                                        {student.address && (
                                            <li className="flex items-start">
                                                <span className="text-lg mr-3">🏠</span>
                                                <div>
                                                    <label className="text-xs text-gray-500 block">Address</label>
                                                    <span className="text-gray-900 text-sm">{student.address}</span>
                                                </div>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </MainContent>
            </div>
        </div>
    );
};

export default StudentProfilePage;
