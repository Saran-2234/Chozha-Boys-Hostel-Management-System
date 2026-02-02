import React, { useState } from 'react';

const AttendanceCalendar = ({ attendanceData, onClose }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        // 0 = Sunday, 1 = Monday, ...
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleMonthChange = (e) => {
        const newMonth = parseInt(e.target.value);
        setCurrentDate(new Date(currentDate.getFullYear(), newMonth, 1));
    };

    const handleYearChange = (e) => {
        const newYear = parseInt(e.target.value);
        setCurrentDate(new Date(newYear, currentDate.getMonth(), 1));
    };

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Generate years (e.g., current year - 5 to current year + 5)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

    const renderDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const days = [];

        // Empty cells for days before start of month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            // Find record for this day
            const record = attendanceData.find(r => {
                if (!r.date) return false;
                // Handle ISO string matching
                return r.date.startsWith(dateStr);
            });

            let statusClass = "bg-transparent text-gray-600 hover:bg-slate-200/50";
            let statusColor = ""; // For the dot or background
            let isPresent = false;
            let isAbsent = false;

            if (record) {
                const status = record.status || record.present;
                isPresent = status === 'present' || status === 'Present' || status === true || status === 1;
                isAbsent = !isPresent;

                if (isPresent) {
                    statusClass = "bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30";
                    statusColor = "bg-emerald-500";
                } else {
                    statusClass = "bg-red-500/10 text-red-400 font-bold border border-red-500/30";
                    statusColor = "bg-red-500";
                }
            }

            // Highlight today
            const today = new Date();
            const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

            if (isToday) {
                // If strictly matching styling of screenshot which highlights selected day heavily
                statusClass += " ring-2 ring-blue-500";
            }

            days.push(
                <div key={day} className={`h-10 w-10 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-200 ${statusClass} relative group`}>
                    {day}
                    {/* Tooltip for time */}
                    {record && (
                        <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-900 text-xs px-2 py-1 rounded border border-slate-700 whitespace-nowrap z-10">
                            {record.time || (record.created_at ? new Date(record.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '')}
                        </div>
                    )}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="glass-card rounded-xl p-6 relative w-full max-w-md mx-auto">
            {onClose && (
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-black">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            )}

            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-black">Attendance Calendar</h3>
                <div className="flex space-x-2">
                    <select
                        value={currentDate.getMonth()}
                        onChange={handleMonthChange}
                        className="bg-slate-800 text-white border border-slate-600 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                    >
                        {monthNames.map((m, idx) => (
                            <option key={m} value={idx}>{m.substring(0, 3)}</option>
                        ))}
                    </select>
                    <select
                        value={currentDate.getFullYear()}
                        onChange={handleYearChange}
                        className="bg-slate-800 text-white border border-slate-600 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                    >
                        {years.map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex items-center justify-between mb-6 px-4">
                <button onClick={prevMonth} className="text-slate-400 hover:text-black transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <span className="text-lg font-semibold text-gray-800">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
                <button onClick={nextMonth} className="text-slate-400 hover:text-black transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </div>

            <div className="grid grid-cols-7 gap-y-4 justify-items-center mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-slate-500 text-sm font-medium">{day}</div>
                ))}
                {renderDays()}
            </div>

            <div className="flex items-center justify-center space-x-6 mt-6 pt-4 border-t border-slate-700/50">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/50"></div>
                    <span className="text-sm text-slate-400">Present</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded bg-red-500/20 border border-red-500/50"></div>
                    <span className="text-sm text-slate-400">Absent</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded bg-slate-800 border border-slate-700"></div>
                    <span className="text-sm text-slate-400">No Data</span>
                </div>
            </div>
        </div>
    );
};

export default AttendanceCalendar;
