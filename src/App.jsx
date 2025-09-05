import React from 'react'
import Home from './Home.jsx'
import Login from './Login.jsx'
import Dashboard from './student Dashboard/StudentDashboard.jsx'
import AdminDashboard from './admin Dashboard/AdminDashboard.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";



function App() {

  const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/dashboard",
    element: <Dashboard/>,
  },
  {
    path: "/admin-dashboard",
    element: <AdminDashboard/>,
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