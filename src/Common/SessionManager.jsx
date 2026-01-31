import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SessionManager = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Get user info from localStorage
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const userId = userData.id; // Ensure this matches how ID is stored
    const role = localStorage.getItem("userRole");
    const currentSession = JSON.parse(localStorage.getItem("sessionData") || "{}");
    const currentSessionId = currentSession.id;

    useEffect(() => {
        fetchSessions();
    }, [userId, role]);

    const getBaseUrl = () => {
        return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
            ? "http://localhost:3001"
            : "https://finalbackend1.vercel.app";
    };

    const fetchSessions = async () => {
        if (!userId || !role) {
            setError("User information not found. Please log in.");
            return;
        }

        setLoading(true);
        setError('');
        try {
            const baseUrl = getBaseUrl();
            const endpoint = role === 'admin' ? '/admin/get-session' : '/students/get-session';

            const response = await axios.post(`${baseUrl}${endpoint}`, {
                userid: userId,
                role: role
            });

            if (response.data && response.data.data) {
                // Sort sessions: Current session first, then by created_at desc
                const sorted = response.data.data.sort((a, b) => {
                    if (String(a.id) === String(currentSessionId)) return -1;
                    if (String(b.id) === String(currentSessionId)) return 1;
                    return new Date(b.created_at) - new Date(a.created_at);
                });
                setSessions(sorted);
            }
        } catch (err) {
            console.error("Error fetching sessions:", err);
            setError("Failed to load active sessions.");
        } finally {
            setLoading(false);
        }
    };

    const removeSession = async (sessionId) => {
        if (!window.confirm("Are you sure you want to end this session?")) return;

        try {
            const baseUrl = getBaseUrl();
            const endpoint = role === 'admin' ? '/admin/remove-session' : '/students/remove-session';

            await axios.post(`${baseUrl}${endpoint}`, {
                sessionid: sessionId,
                userid: userId,
                role: role
            });

            // If current session is removed, logout
            if (String(sessionId) === String(currentSessionId)) {
                alert("Current session ended. You will be logged out.");
                localStorage.clear();
                window.location.href = '/';
                return;
            }

            // Refresh list
            fetchSessions();
        } catch (err) {
            console.error("Error removing session:", err);
            alert("Failed to remove session. Please try again.");
        }
    };

    const formatDeviceInfo = (deviceInfo) => {
        if (!deviceInfo) return "Unknown Device";
        // Handle if it comes as a JSON string (sometimes postgres returns it as object, sometimes string depending on driver config)
        let info = deviceInfo;
        if (typeof info === 'string') {
            try {
                info = JSON.parse(info);
            } catch (e) {
                return "Unknown Device";
            }
        }

        const browser = info.browser?.name || "Unknown Browser";
        // const browserVer = info.browser?.version ? `(${info.browser.version})` : "";
        const os = info.os?.name || "Unknown OS";
        const osVer = info.os?.version || "";
        const deviceType = info.device?.type ? `(${info.device.type})` : "";
        const vendor = info.device?.vendor ? `${info.device.vendor}` : "";

        // Construct a readable string
        // Example: Chrome on Windows 10
        // Example: Safari on iOS
        // Example: Mobile Safari on iPhone (iOS)

        let deviceString = "";
        if (vendor) deviceString += `${vendor} `;

        let platformString = `${browser} on ${os} ${osVer}`;

        return `${deviceString}${platformString} ${deviceType}`.trim();
    };

    const getDeviceIcon = (deviceInfo) => {
        let info = deviceInfo;
        if (typeof info === 'string') {
            try { info = JSON.parse(info); } catch (e) { return "💻"; }
        }

        const os = info?.os?.name?.toLowerCase() || "";
        const type = info?.device?.type?.toLowerCase() || "";

        if (type === 'mobile' || os.includes('android') || os.includes('ios')) return "📱";
        if (type === 'tablet' || os.includes('ipad')) return "📱";
        if (os.includes('mac')) return "💻";
        if (os.includes('windows')) return "💻";
        return "💻";
    };

    if (!userId || !role) return null;

    return (
        <div className="glass-card rounded-xl p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Active Sessions</h3>
                <button
                    onClick={fetchSessions}
                    className="text-sm text-blue-400 hover:text-blue-300"
                    disabled={loading}
                >
                    Refresh
                </button>
            </div>

            {error && (
                <div className="p-3 mb-4 bg-red-900/30 text-red-300 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-slate-400 text-center py-4">Loading sessions...</div>
            ) : sessions.length === 0 ? (
                <div className="text-slate-400 text-center py-4">No active sessions found.</div>
            ) : (
                <div className="space-y-4">
                    {sessions.map((session) => {
                        const isCurrent = String(session.id) === String(currentSessionId);
                        return (
                            <div
                                key={session.id}
                                className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border ${isCurrent
                                    ? 'bg-blue-600/10 border-blue-500/30'
                                    : 'bg-slate-800/50 border-slate-700'
                                    }`}
                            >
                                <div className="mb-3 sm:mb-0">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-xl">
                                            {getDeviceIcon(session.device_info)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-white text-base">
                                                    {formatDeviceInfo(session.device_info)}
                                                </span>
                                                {isCurrent && (
                                                    <span className="px-2 py-0.5 text-xs bg-blue-500 text-white rounded-full">
                                                        Current
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-slate-400 mt-1 flex flex-col sm:flex-row gap-1 sm:gap-4">
                                                <span>Session #{session.id}</span>
                                                <span className="hidden sm:inline">•</span>
                                                <span>Active since: {new Date(session.created_at).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-3 mt-2 sm:mt-0">
                                    <div className="text-right mr-4 hidden sm:block">
                                        <div className="text-xs text-slate-500">Expires</div>
                                        <div className="text-xs text-slate-400">{new Date(session.expires_at).toLocaleDateString()}</div>
                                    </div>
                                    <button
                                        onClick={() => removeSession(session.id)}
                                        className={`px-4 py-2 text-sm rounded-lg transition-colors font-medium ${isCurrent
                                            ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30'
                                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                            }`}
                                    >
                                        {isCurrent ? 'Log Out' : 'Revoke'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SessionManager;
