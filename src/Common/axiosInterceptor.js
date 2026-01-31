import Swal from 'sweetalert2';

let isAlertOpen = false;

export const handle401Error = async (error) => {
    if (error.response && error.response.status === 401) {
        if (!isAlertOpen && !Swal.isVisible()) {
            isAlertOpen = true;
            try {
                await Swal.fire({
                    title: 'Session Expired',
                    text: 'Your session has expired. Please log in again.',
                    icon: 'warning',
                    confirmButtonText: 'Go to Login',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    confirmButtonColor: '#3085d6',
                });

                // Clear auth data
                localStorage.clear();
                sessionStorage.clear();

                // Redirect to login
                window.location.href = '/login';
            } finally {
                isAlertOpen = false;
            }
        }
    }
    return Promise.reject(error);
};

export const setupInterceptors = (axiosInstance) => {
    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => handle401Error(error)
    );
};
