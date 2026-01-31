import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AppLayout = () => {
    const [showSessionExpired, setShowSessionExpired] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Hide initial loader when the layout mounts
        const loader = document.getElementById('initial-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
            }, 500);
        }

        // Axios Interceptor for 401 Unauthorized
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                const isLoginRequest = error.config && (
                    error.config.url.includes('login') ||
                    error.config.url.includes('generateauthtoken')
                );

                if (error.response && error.response.status === 401 && !isLoginRequest) {
                    setShowSessionExpired(true);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    const handleReturnToLogin = () => {
        // Clear all storage
        localStorage.clear();
        sessionStorage.clear();

        // Clear cookies
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        }

        setShowSessionExpired(false);
        // Navigate to home and trigger login via state
        navigate('/', { state: { fromDashboard: true } });
    };

    return (
        <>
            <Outlet />

            {showSessionExpired && (
                <div className="fixed inset-0 bg-black bg-opacity-60 login-modal z-[60] flex items-center justify-center p-4">
                    <div className="glass-card rounded-2xl shadow-2xl max-w-sm w-full mx-4 transform transition-all professional-shadow relative p-6 text-center animate-fade-in-up">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Session Expired</h3>
                        <p className="text-gray-600 mb-6">
                            Your session has expired. Please log in again to continue.
                        </p>
                        <button
                            onClick={handleReturnToLogin}
                            className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all transform hover:-translate-y-1 shadow-lg"
                        >
                            Return to Login
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AppLayout;
