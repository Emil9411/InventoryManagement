import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import App from './App.jsx'
import Login from './pages/Login.jsx'
import AllItems from './pages/AllItems.jsx'
import Registration from './pages/Registration.jsx'
import Verification from './pages/Verification.jsx'
import Employees from './pages/Employees.jsx'
import Profile from './pages/Profile.jsx'
import Inventory from './pages/Inventory.jsx'
import Logout from './components/LogoutButton.jsx'
import './index.css'

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/logout",
                element: <Logout />
            },
            {
                path: "/allitems",
                element: <AllItems />
            },
            {
                path: "/registration",
                element: <Registration />
            },
            {
                path: "/verify/:userId",
                element: <Verification />
            },
            {
                path: "/employees",
                element: <Employees />
            },
            {
                path: "/profile",
                element: <Profile />
            },
            {
                path: "/inventory",
                element: <Inventory />
            }
        ]
    },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
