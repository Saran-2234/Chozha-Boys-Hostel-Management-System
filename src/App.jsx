import React, { useEffect } from 'react'
import axios from 'axios';
import Home from './Home.jsx'
import Login from './Login.jsx'
import Dashboard from './student Dashboard/StudentDashboard.jsx'
import AdminDashboard from './admin Dashboard/AdminDashboard.jsx'
import MessBills from './admin Dashboard/MessBills/MessBills.jsx'
import MessBillsDetail from './admin Dashboard/MessBillsDetail/MessBillsDetail.jsx'
import MessBillIndividual from './admin Dashboard/MessBillsDetail/MessBillIndividual.jsx'
import MessBillsIndividualList from './admin Dashboard/MessBillsDetail/MessBillsIndividualList.jsx'
import PaidStudents from './admin Dashboard/MessBillsDetail/PaidStudents.jsx'
import UnpaidStudents from './admin Dashboard/MessBillsDetail/UnpaidStudents.jsx'
import StudentProfilePage from './admin Dashboard/Students/StudentProfilePage.jsx'
import Loader from './Common/Loader.jsx'
import { createBrowserRouter, RouterProvider, redirect } from "react-router-dom";



async function dashboardLoader() {
  const token = localStorage.getItem('studentToken') || sessionStorage.getItem('studentToken');
  if (token) {
    return null;
  }

  const baseUrl = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:3001"
    : "https://finalbackend1.vercel.app";

  try {
    const response = await axios.get(`${baseUrl}/students/generateauthtokenforstudent`, {
      withCredentials: true
    });
    if (response.data.token) {
      localStorage.setItem('studentToken', response.data.token);
      if (response.data.data) {
        localStorage.setItem('userData', JSON.stringify(response.data.data));
        // Ensure the studentId is also set if needed by other components
        if (response.data.data.id) {
          localStorage.setItem("studentId", response.data.data.id);
        }
      }
      return null;
    }
  } catch (error) {
    console.log("Student Auto-login failed", error);
  }

  throw redirect('/', {
    state: { fromDashboard: true, loginType: 'student' }
  });
}

async function adminDashboardLoader() {
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  if (token) {
    return null;
  }

  const baseUrl = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:3001"
    : "https://finalbackend1.vercel.app";

  try {
    const response = await axios.post(`${baseUrl}/admin/generateauthtokenforadmin`, {}, {
      withCredentials: true
    });
    if (response.data.token) {
      localStorage.setItem('accessToken', response.data.token);
      if (response.data.data) {
        localStorage.setItem('userData', JSON.stringify(response.data.data));
      }
      return null;
    }
  } catch (error) {
    console.log("Admin Auto-login failed", error);
  }

  throw redirect('/', {
    state: { fromDashboard: true, loginType: 'admin' }
  });
}

async function rootLoader() {
  const studentToken = localStorage.getItem('studentToken');
  const adminToken = localStorage.getItem('accessToken');

  const baseUrl = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:3001"
    : "https://finalbackend1.vercel.app";

  const checkStudent = () => axios.get(`${baseUrl}/students/generateauthtokenforstudent`, { withCredentials: true });
  const checkAdmin = () => axios.post(`${baseUrl}/admin/generateauthtokenforadmin`, {}, { withCredentials: true });

  const handleStudentSuccess = (response) => {
    if (response.data.token) {
      localStorage.setItem('studentToken', response.data.token);
      if (response.data.data) {
        localStorage.setItem('userData', JSON.stringify(response.data.data));
        if (response.data.data.id) localStorage.setItem("studentId", response.data.data.id);
      }
      return redirect('/dashboard');
    }
    return null;
  };

  const handleAdminSuccess = (response) => {
    if (response.data.token) {
      localStorage.setItem('accessToken', response.data.token);
      if (response.data.data) {
        localStorage.setItem('userData', JSON.stringify(response.data.data));
      }
      return redirect('/admin-dashboard');
    }
    return null;
  };

  // Helper to read cookies
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  // Optimize auto-login by checking the stored role first (Cookie ONLY)
  const userRole = getCookie('userRole');

  if (userRole === 'student') {
    try {
      const res = await checkStudent();
      const result = handleStudentSuccess(res);
      if (result) return result;
    } catch (e) {
      console.log("Student auto-login failed", e);
    }
  } else if (userRole === 'admin') {
    try {
      const res = await checkAdmin();
      const result = handleAdminSuccess(res);
      if (result) return result;
    } catch (e) {
      console.log("Admin auto-login failed", e);
    }
  }

  // If absolutely everything failed, verify clean slate
  if (!studentToken && !adminToken) {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('studentId');
  }

  return null;
}



import AppLayout from './Common/AppLayout.jsx'

// ... existing imports ...

function App() {
  const routes = [
    {
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
          loader: rootLoader,
        },
        {
          path: "/dashboard",
          element: <Dashboard />,
          loader: dashboardLoader,
        },
        {
          path: "/admin-dashboard",
          element: <AdminDashboard />,
          loader: adminDashboardLoader,
        },
        {
          path: "/admin/student/:id",
          element: <StudentProfilePage />,
          loader: adminDashboardLoader,
        },
        {
          path: "/mess-bills",
          element: <MessBills />,
          loader: adminDashboardLoader,
        },
        {
          path: "/mess-bills-detail",
          element: <MessBillsDetail />,
          loader: adminDashboardLoader,
        },
        {
          path: "/mess-bill-individual",
          element: <MessBillIndividual />,
          loader: adminDashboardLoader,
        },
        {
          path: "/mess-bills-individual-list",
          element: <MessBillsIndividualList />,
          loader: adminDashboardLoader,
        },
        {
          path: "/paid-students",
          element: <PaidStudents />,
          loader: adminDashboardLoader,
        },
        {
          path: "/unpaid-students",
          element: <UnpaidStudents />,
          loader: adminDashboardLoader,
        },
        {
          path: "/login",
          element: <Login />
        }
      ]
    }
  ];

  const router = createBrowserRouter(routes);
  return (
    <RouterProvider router={router} fallbackElement={<Loader />} />
  )
}

export default App