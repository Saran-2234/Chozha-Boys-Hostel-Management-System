import React from 'react'
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
import { createBrowserRouter, RouterProvider, redirect } from "react-router-dom";



async function dashboardLoader() {
  const token = localStorage.getItem('studentToken') || sessionStorage.getItem('studentToken');
  if (token) {
    return null;
  }

  try {
    const response = await axios.get("https://finalbackend1.vercel.app/students/generateauthtokenforstudent", {
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

  try {
    const response = await axios.post("https://finalbackend1.vercel.app/admin/generateauthtokenforadmin", {}, {
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

  const checkStudent = () => axios.get("https://finalbackend1.vercel.app/students/generateauthtokenforstudent", { withCredentials: true });
  const checkAdmin = () => axios.post("https://finalbackend1.vercel.app/admin/generateauthtokenforadmin", {}, { withCredentials: true });

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

  // 1. If we have a hint, try that one first (Fastest for valid users)
  if (studentToken) {
    try {
      const res = await checkStudent();
      const result = handleStudentSuccess(res);
      if (result) return result;
    } catch { /* Fallback */ }
  } else if (adminToken) {
    try {
      const res = await checkAdmin();
      const result = handleAdminSuccess(res);
      if (result) return result;
    } catch { /* Fallback */ }
  }

  // 2. If no tokens or the hint failed, run BOTH in parallel (Fastest for guests/switchers)
  const [studentRes, adminRes] = await Promise.allSettled([checkStudent(), checkAdmin()]);

  if (studentRes.status === 'fulfilled') {
    const result = handleStudentSuccess(studentRes.value);
    if (result) return result;
  }

  if (adminRes.status === 'fulfilled') {
    const result = handleAdminSuccess(adminRes.value);
    if (result) return result;
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

function App() {

  const routes = [
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
  ];

  const router = createBrowserRouter(routes);
  return (
    <RouterProvider router={router} />
  )
}

export default App