import React from 'react'
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
    path: "/mess-bills",
    element: <MessBills/>,
    loader: adminDashboardLoader,
  },
  {
    path: "/mess-bills-detail",
    element: <MessBillsDetail/>,
    loader: adminDashboardLoader,
  },
  {
    path: "/mess-bill-individual",
    element: <MessBillIndividual/>,
    loader: adminDashboardLoader,
  },
  {
    path: "/mess-bills-individual-list",
    element: <MessBillsIndividualList/>,
    loader: adminDashboardLoader,
  },
  {
    path: "/paid-students",
    element: <PaidStudents/>,
    loader: adminDashboardLoader,
  },
  {
    path: "/unpaid-students",
    element: <UnpaidStudents/>,
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