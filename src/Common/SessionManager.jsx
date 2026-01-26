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

    const fetchSessions = async () => {
        if (!userId || !role) {
            setError("User information not found. Please log in.");
            return;
        }

        setLoading(true);
        setError('');
        try {
            // NOTE: Using localhost:3001 as the new session endpoints are likely only local for now.
            // Update this URL if the backend is deployed.
            const baseUrl = "https://finalbackend1.vercel.app";
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
            // Don't show error if it's just a connection refused (meaning backend might be down or not local)
            // to avoid breaking the UI flow, but good to inform user.
            setError("Failed to load active sessions.");
        } finally {
            setLoading(false);
        }
    };

    const removeSession = async (sessionId) => {
        if (!window.confirm("Are you sure you want to end this session?")) return;

        try {
            const baseUrl = "https://finalbackend1.vercel.app";
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
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-slate-200">
                                            Session #{session.id}
                                        </span>
                                        {isCurrent && (
                                            <span className="px-2 py-0.5 text-xs bg-blue-500 text-white rounded-full">
                                                Current
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-sm text-slate-400 mt-1">
                                        Created: {new Date(session.created_at).toLocaleString()}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        Expires: {new Date(session.expires_at).toLocaleString()}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* We could add logic to show 'This Device' if we matched tokens, but we don't have that info easily */}
                                    <button
                                        onClick={() => removeSession(session.id)}
                                        className={`px-4 py-2 text-sm rounded-lg transition-colors ${isCurrent
                                            ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                            }`}
                                    >
                                        {isCurrent ? 'Logout' : 'Revoke'}
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
