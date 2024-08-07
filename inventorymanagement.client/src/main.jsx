import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import App from './App.jsx'
import Login from './pages/Login.jsx'
import Verification from './pages/Verification.jsx'
import Profile from './pages/Profile.jsx'
import AllItems from './pages/drawers/items/AllItems.jsx'
import Consumables from './pages/drawers/items/Consumables.jsx'
import Equipments from './pages/drawers/items/Equipments.jsx'
import Ingredients from './pages/drawers/items/Ingredients.jsx'
import NonConsumables from './pages/drawers/items/NonConsumables.jsx'
import OrderList from './pages/drawers/items/OrderList.jsx'
import Products from './pages/drawers/items/Products.jsx'
import Tools from './pages/drawers/items/Tools.jsx'
import Registration from './pages/drawers/employees/Registration.jsx'
import Employees from './pages/drawers/employees/Employees.jsx'
import RemoveEmployee from './pages/drawers/employees/RemoveEmployee.jsx'
import Inventory from './pages/drawers/warehouses/Inventory.jsx'
import AddWarehouse from './pages/drawers/warehouses/AddWarehouse.jsx'
import Warehouses from './pages/drawers/warehouses/Warehouses.jsx'
import UpdateWarehouse from './pages/drawers/warehouses/UpdateWarehouse.jsx'
import DeleteWarehouse from './pages/drawers/warehouses/DeleteWarehouse.jsx'
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
            },
            {
                path: "/addwarehouse",
                element: <AddWarehouse />
            },
            {
                path: "/warehouses",
                element: <Warehouses />
            },
            {
                path: "/updatewarehouse",
                element: <UpdateWarehouse />
            },
            {
                path: "/deletewarehouse",
                element: <DeleteWarehouse />
            },
            {
                path: "/removeemployee",
                element: <RemoveEmployee />
            },
            {
                path: "/consumables",
                element: <Consumables />
            },
            {
                path: "/equipments",
                element: <Equipments />
            },
            {
                path: "/ingredients",
                element: <Ingredients />
            },
            {
                path: "/nonconsumables",
                element: <NonConsumables />
            },
            {
                path: "/orderlist",
                element: <OrderList />
            },
            {
                path: "/products",
                element: <Products />
            },
            {
                path: "/tools",
                element: <Tools />
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
