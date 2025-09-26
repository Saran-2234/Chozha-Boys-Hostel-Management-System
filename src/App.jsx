import React from 'react'
import Home from './Home.jsx'
import Login from './Login.jsx'
import Dashboard from './student Dashboard/StudentDashboard.jsx'
import AdminDashboard from './admin Dashboard/AdminDashboard.jsx'
import { createBrowserRouter, RouterProvider, redirect } from "react-router-dom";



function dashboardLoader() {
  const token = localStorage.getItem('studentToken') || sessionStorage.getItem('studentToken');
  if (!token) {
    throw redirect('/', {
      state: { fromDashboard: true, loginType: 'student' }
    });
  }
  return null;
}

function adminDashboardLoader() {
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  if (!token) {
    throw redirect('/', {
      state: { fromDashboard: true, loginType: 'admin' }
    });
  }
  return null;
}

function App() {

  const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/dashboard",
    element: <Dashboard/>,
    loader: dashboardLoader,
  },
  {
    path: "/admin-dashboard",
    element: <AdminDashboard/>,
    loader: adminDashboardLoader,
  },
  {
    path:"/login",
    element:<Login/>
  }
];

    const router = createBrowserRouter(routes);
  return (
    <RouterProvider router={router} />
  )
}

export default App