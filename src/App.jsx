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
  // 1. Check if we already have tokens in localStorage
  const studentToken = localStorage.getItem('studentToken');
  const adminToken = localStorage.getItem('accessToken');

  if (studentToken) {
    throw redirect('/dashboard');
  }
  if (adminToken) {
    throw redirect('/admin-dashboard');
  }

  // 2. If no local tokens, try to auto-login via cookies
  try {
    // Try Student Auto-login first
    const studentResponse = await axios.get("https://finalbackend1.vercel.app/students/generateauthtokenforstudent", {
      withCredentials: true
    });

    if (studentResponse.data.token) {
      localStorage.setItem('studentToken', studentResponse.data.token);
      if (studentResponse.data.data) {
        localStorage.setItem('userData', JSON.stringify(studentResponse.data.data));
        if (studentResponse.data.data.id) {
          localStorage.setItem("studentId", studentResponse.data.data.id);
        }
      }
      throw redirect('/dashboard');
    }
  } catch (error) {
    // Student auto-login failed, try Admin
    try {
      const adminResponse = await axios.post("https://finalbackend1.vercel.app/admin/generateauthtokenforadmin", {}, {
        withCredentials: true
      });

      if (adminResponse.data.token) {
        localStorage.setItem('accessToken', adminResponse.data.token);
        if (adminResponse.data.data) {
          localStorage.setItem('userData', JSON.stringify(adminResponse.data.data));
        }
        throw redirect('/admin-dashboard');
      }
    } catch (adminError) {
      // Both failed, stay on Home page
      return null;
    }
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