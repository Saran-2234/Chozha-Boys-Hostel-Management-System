import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import MainContent from '../Header/MainContent';
import { fetchStudents, fetchStudentStats, showAttends, fetchStudentMessBillsForAdmin, fetchTransactionHistory } from '../../registration/api';
import { parseRoomNumber } from '../../Common/roomUtils';

const StudentProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const activeSection = 'students';

    // Modal States
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [showBillsModal, setShowBillsModal] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [attendanceData, setAttendanceData] = useState([]);
    const [billsData, setBillsData] = useState([]);

    // Calendar State
    const [currentDate, setCurrentDate] = useState(new Date());

    // Calendar & Bill Filters
    const [attendanceYear, setAttendanceYear] = useState(new Date().getFullYear());
    const [attendanceMonth, setAttendanceMonth] = useState(new Date().getMonth());

    // For mess bill filter
    const [billYear, setBillYear] = useState('');
    const [billMonth, setBillMonth] = useState('');

    // For transaction history
    const [showTransModal, setShowTransModal] = useState(false);
    const [transData, setTransData] = useState([]);
    const [transYear, setTransYear] = useState('');
    const [transMonth, setTransMonth] = useState('');
    const [transLoading, setTransLoading] = useState(false);

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
                month: 'short',
                day: 'numeric'
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

    // --- Detail Fetching Functions ---

    const fetchAttendanceHistory = async () => {
        if (!student) return;
        setLoadingDetails(true);
        setShowAttendanceModal(true);
        try {
            // Fetch all attendance for this student
            const result = await showAttends({
                registration_number: student.registration_number,
                limit: 1500 // Get enough records
            });
            if (result.success) {
                setAttendanceData(result.data);
            }
        } catch (error) {
            console.error("Error fetching attendance history:", error);
        } finally {
            setLoadingDetails(false);
        }
    };

    const fetchMessBillHistory = async (year = '', month = '') => {
        if (!id) return;
        setLoadingDetails(true);
        setShowBillsModal(true);
        try {
            const result = await fetchStudentMessBillsForAdmin(id, 1, 100, null, year, month); // Get up to 100 bills
            if (result.success) {
                setBillsData(result.data);
            }
        } catch (error) {
            console.error("Error fetching bill history:", error);
        } finally {
            setLoadingDetails(false);
        }
    };

    // Handle Mess Bill Filter Change
    useEffect(() => {
        if (showBillsModal) {
            fetchMessBillHistory(billYear, billMonth);
        }
    }, [billYear, billMonth, showBillsModal]);

    const fetchHistory = async (year = '', month = '') => {
        if (!id) return;
        setTransLoading(true);
        setShowTransModal(true);
        try {
            const result = await fetchTransactionHistory(id, 1, 100, year, month);
            if (result.success) {
                setTransData(result.data);
            }
        } catch (error) {
            console.error("Error fetching transaction history:", error);
        } finally {
            setTransLoading(false);
        }
    };

    // Handle Transaction Filter Change
    useEffect(() => {
        if (showTransModal) {
            fetchHistory(transYear, transMonth);
        }
    }, [transYear, transMonth, showTransModal]);

    // Update calendar when year/month dropdowns change
    useEffect(() => {
        if (showAttendanceModal) {
            setCurrentDate(new Date(attendanceYear, attendanceMonth, 1));
        }
    }, [attendanceYear, attendanceMonth, showAttendanceModal]); // Added showAttendanceModal to dependency array

    // Sync dropdowns when month is changed via arrows
    useEffect(() => {
        setAttendanceYear(currentDate.getFullYear());
        setAttendanceMonth(currentDate.getMonth());
    }, [currentDate]);


    // --- Calendar Helper Functions ---
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const changeMonth = (offset) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
        setCurrentDate(newDate);
    };

    const getAttendanceStatusForDate = (day, month, year) => {
        // Find attendance record for this date
        // Note: result.data strings might be ISO or YYYY-MM-DD
        const targetDate = new Date(year, month, day);
        // Normalize comparison (ignore time)

        const record = attendanceData.find(a => {
            const aDate = new Date(a.date);
            return aDate.getDate() === day &&
                aDate.getMonth() === month &&
                aDate.getFullYear() === year;
        });

        return record ? record.status : null;
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
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                {/* Stats Cards */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                        <span className="mr-2">📊</span> Performance & Billing
                                    </h3>

                                    {stats ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {/* Attendance Card - Clickable */}
                                            <div
                                                className="bg-blue-50/50 rounded-xl p-5 border border-blue-100 cursor-pointer hover:shadow-md transition-shadow"
                                                onClick={() => {
                                                    const today = new Date();
                                                    setAttendanceYear(today.getFullYear());
                                                    setAttendanceMonth(today.getMonth());
                                                    fetchAttendanceHistory();
                                                }}
                                            >
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
                                                <div className="mt-3 text-xs text-blue-600 text-right font-medium">Click to view calendar →</div>
                                            </div>

                                            {/* Mess Bill Card - Clickable */}
                                            <div
                                                className="bg-orange-50/50 rounded-xl p-5 border border-orange-100 cursor-pointer hover:shadow-md transition-shadow"
                                                onClick={() => {
                                                    setBillYear('');
                                                    setBillMonth('');
                                                    fetchMessBillHistory();
                                                }}
                                            >
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
                                                <div className="mt-3 text-xs text-orange-600 text-right font-medium">Click to view history →</div>
                                            </div>

                                            {/* Transaction History Card */}
                                            <div
                                                className="bg-purple-50/50 rounded-xl p-5 border border-purple-100 cursor-pointer hover:shadow-md transition-shadow"
                                                onClick={() => {
                                                    setTransYear('');
                                                    setTransMonth('');
                                                    fetchHistory();
                                                }}
                                            >
                                                <h4 className="font-semibold text-purple-900 mb-4 flex justify-between">
                                                    <span>Transactions</span>
                                                    <span className="text-2xl">💳</span>
                                                </h4>
                                                <div className="bg-white p-3 rounded-lg shadow-sm border border-purple-50">
                                                    <div className="text-xs text-gray-500 uppercase font-semibold">Total Paid</div>
                                                    <div className="text-xl font-bold text-emerald-600">₹{stats.messBill.paid}</div>
                                                </div>
                                                <div className="mt-3 text-xs text-purple-600 text-right font-medium">Click to view details →</div>
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

            {/* Attendance Modal */}
            {showAttendanceModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden">
                        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center bg-gray-50 gap-4">
                            <h3 className="font-bold text-lg text-gray-800">Attendance Calendar</h3>

                            {/* Attendance Filters */}
                            <div className="flex gap-2">
                                <select
                                    className="px-3 py-1 border rounded-md text-sm bg-white"
                                    value={attendanceMonth}
                                    onChange={(e) => setAttendanceMonth(parseInt(e.target.value))}
                                >
                                    {Array.from({ length: 12 }).map((_, i) => (
                                        <option key={i} value={i}>
                                            {new Date(0, i).toLocaleString('default', { month: 'short' })}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    className="px-3 py-1 border rounded-md text-sm bg-white"
                                    value={attendanceYear}
                                    onChange={(e) => setAttendanceYear(parseInt(e.target.value))}
                                >
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <option key={i} value={new Date().getFullYear() - 2 + i}>
                                            {new Date().getFullYear() - 2 + i}
                                        </option>
                                    ))}
                                </select>
                                <button onClick={() => setShowAttendanceModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl ml-2">&times;</button>
                            </div>
                        </div>
                        <div className="p-6">
                            {loadingDetails ? (
                                <div className="text-center py-10">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="mt-2 text-gray-500">Loading attendance data...</p>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 rounded-full">←</button>
                                        <div className="font-bold text-lg">
                                            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                        </div>
                                        <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 rounded-full">→</button>
                                    </div>

                                    {/* Days Header */}
                                    <div className="grid grid-cols-7 mb-2 text-center text-sm font-medium text-gray-500">
                                        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                                    </div>

                                    {/* Days Grid */}
                                    <div className="grid grid-cols-7 gap-1">
                                        {Array.from({ length: getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth()) }).map((_, i) => (
                                            <div key={`empty-${i}`} className="h-10"></div>
                                        ))}
                                        {Array.from({ length: getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth()) }).map((_, i) => {
                                            const day = i + 1;
                                            const status = getAttendanceStatusForDate(day, currentDate.getMonth(), currentDate.getFullYear());
                                            let bgClass = "bg-white hover:bg-gray-50 border border-gray-100";
                                            let textClass = "text-gray-700";

                                            if (status === 'Present') {
                                                bgClass = "bg-green-100 border-green-200";
                                                textClass = "text-green-700 font-bold";
                                            } else if (status === 'Absent') {
                                                bgClass = "bg-red-100 border-red-200";
                                                textClass = "text-red-700 font-bold";
                                            }

                                            return (
                                                <div key={day} className={`h-10 flex items-center justify-center rounded-lg text-sm ${bgClass} ${textClass}`}>
                                                    {day}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="flex gap-4 mt-6 text-sm justify-center">
                                        <div className="flex items-center"><div className="w-3 h-3 bg-green-100 border border-green-200 rounded mr-2"></div> Present</div>
                                        <div className="flex items-center"><div className="w-3 h-3 bg-red-100 border border-red-200 rounded mr-2"></div> Absent</div>
                                        <div className="flex items-center"><div className="w-3 h-3 bg-white border border-gray-100 rounded mr-2"></div> No Data</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Mess Bill Modal */}
            {showBillsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[85vh] flex flex-col">
                        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center bg-gray-50 gap-4">
                            <h3 className="font-bold text-lg text-gray-800">Mess Bill History</h3>

                            {/* Bill Filters */}
                            <div className="flex gap-2">
                                <select
                                    className="px-3 py-1 border rounded-md text-sm bg-white"
                                    value={billYear}
                                    onChange={(e) => setBillYear(e.target.value)}
                                >
                                    <option value="">All Years</option>
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <option key={i} value={new Date().getFullYear() - 2 + i}>
                                            {new Date().getFullYear() - 2 + i}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    className="px-3 py-1 border rounded-md text-sm bg-white"
                                    value={billMonth}
                                    onChange={(e) => setBillMonth(e.target.value)}
                                >
                                    <option value="">All Months</option>
                                    {Array.from({ length: 12 }).map((_, i) => (
                                        <option key={i} value={i + 1}>
                                            {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                        </option>
                                    ))}
                                </select>
                                <button onClick={() => setShowBillsModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl ml-2">&times;</button>
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            {loadingDetails ? (
                                <div className="text-center py-10">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                                    <p className="mt-2 text-gray-500">Loading bill history...</p>
                                </div>
                            ) : (
                                <div>
                                    {billsData && billsData.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="border-b border-gray-200 text-gray-500 text-sm">
                                                        <th className="pb-3 font-medium">Month/Year</th>
                                                        <th className="pb-3 font-medium">Bill Amount</th>
                                                        <th className="pb-3 font-medium">Status</th>
                                                        <th className="pb-3 font-medium">Paid Date</th>
                                                        <th className="pb-3 font-medium">Days Present</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {billsData.map((bill) => {
                                                        // Calculate bill amount if not explicitly present, or use logic from fetchstats
                                                        // Using fields from response
                                                        let amount = 0;
                                                        // Assuming bill object has all fields returned by query
                                                        const days = bill.number_of_days;
                                                        const fee = Number(bill.mess_fee_per_day);
                                                        const vegExtra = Number(bill.veg_extra_per_day);
                                                        const nonVegExtra = Number(bill.nonveg_extra_per_day);

                                                        let calculatedAmount = (days * fee);
                                                        if (bill.isveg) {
                                                            calculatedAmount += (bill.veg_days || 0) * vegExtra;
                                                        } else {
                                                            calculatedAmount += (bill.non_veg_days || 0) * nonVegExtra;
                                                        }

                                                        return (
                                                            <tr key={bill.mess_bill_id} className="hover:bg-gray-50">
                                                                <td className="py-4 font-medium text-gray-900">{bill.month_year}</td>
                                                                <td className="py-4 font-bold text-gray-700 hover:text-blue-600 cursor-help" title="Click for details">
                                                                    ₹{calculatedAmount.toFixed(2)}
                                                                </td>
                                                                <td className="py-4">
                                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${bill.ispaid
                                                                        ? 'bg-green-100 text-green-700'
                                                                        : 'bg-red-100 text-red-700'
                                                                        }`}>
                                                                        {bill.ispaid ? 'PAID' : 'UNPAID'}
                                                                    </span>
                                                                </td>
                                                                <td className="py-4 text-gray-500 text-sm">
                                                                    {bill.paid_date ? formatDate(bill.paid_date) : '-'}
                                                                </td>
                                                                <td className="py-4 text-gray-500 text-sm">
                                                                    {days}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 text-gray-500">
                                            No mess bill history found.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t bg-gray-50 flex justify-end">
                            <button onClick={() => setShowBillsModal(false)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium text-gray-700 transition">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Transaction History Modal */}
            {showTransModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[85vh] flex flex-col">
                        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center bg-gray-50 gap-4">
                            <h3 className="font-bold text-lg text-gray-800">Transaction History</h3>

                            {/* Filters */}
                            <div className="flex gap-2">
                                <select
                                    className="px-3 py-1 border rounded-md text-sm bg-white"
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
                                    className="px-3 py-1 border rounded-md text-sm bg-white"
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
                                <button onClick={() => setShowTransModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl ml-2">&times;</button>
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            {transLoading ? (
                                <div className="text-center py-10">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                                    <p className="mt-2 text-gray-500">Loading transactions...</p>
                                </div>
                            ) : (
                                <div>
                                    {transData && transData.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="border-b border-gray-200 text-gray-500 text-sm">
                                                        <th className="pb-3 font-medium">Date</th>
                                                        <th className="pb-3 font-medium">Amount</th>
                                                        <th className="pb-3 font-medium">Status</th>
                                                        <th className="pb-3 font-medium">Order ID</th>
                                                        <th className="pb-3 font-medium">Reference</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {transData.map((txn) => (
                                                        <tr key={txn.id} className="hover:bg-gray-50">
                                                            <td className="py-4 font-medium text-gray-900">
                                                                {new Date(txn.payment_time).toLocaleString()}
                                                            </td>
                                                            <td className="py-4 font-bold text-gray-700">
                                                                ₹{Number(txn.payment_amount).toFixed(2)}
                                                            </td>
                                                            <td className="py-4">
                                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${txn.payment_status === 'SUCCESS'
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : 'bg-red-100 text-red-700'
                                                                    }`}>
                                                                    {txn.payment_status}
                                                                </span>
                                                            </td>
                                                            <td className="py-4 text-gray-500 text-sm font-mono text-xs">
                                                                {txn.order_id}
                                                            </td>
                                                            <td className="py-4 text-gray-500 text-sm">
                                                                {txn.gateway_payment_id || '-'}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 text-gray-500">
                                            No transactions found.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t bg-gray-50 flex justify-end">
                            <button onClick={() => setShowTransModal(false)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium text-gray-700 transition">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentProfilePage;
