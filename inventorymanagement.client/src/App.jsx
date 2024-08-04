import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from "react-router-dom";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import LogoutButton from './components/LogoutButton';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupsIcon from '@mui/icons-material/Groups';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import LoginIcon from '@mui/icons-material/Login';
import './index.css';
import handleUpdateEmployeeData from './utils/employeeUpdate';

function App() {
    const [user, setUser] = useState(null);
    const location = useLocation();

    async function getUser() {
        const response = await fetch("api/auth/check", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        const userDataResponse = await fetch(`api/auth/user/${data.email}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const userData = await userDataResponse.json();
        console.log(userData);
        if (userData.firstName === null) {
            handleUpdateEmployeeData(userData);
        } else {
            setUser(userData);
        }
    }

    useEffect(() => {
        getUser();
    }, [location.pathname]);

    const isVerificationPage = location.pathname.startsWith('/verify');

    return (
        <div className="App">
            <div className="header">
                <div className="header-title">
                    <Link to="/">
                        <h1 style={{ color: "white" }}>Raktár Manager</h1>
                    </Link>
                </div>
                <ButtonGroup variant="outlined" size="large" aria-label="header button group">
                    {!isVerificationPage && (
                        <>
                            {!user ? (
                                <Link to="/login">
                                    <Button startIcon={<LoginIcon />}>Belépés</Button>
                                </Link>
                            ) : user.role === "Admin" || user.role === "Manager" ? (
                                <>
                                    <LogoutButton />
                                    <Link to="/registration">
                                        <Button startIcon={<PersonAddIcon />}>Regisztráció</Button>
                                    </Link>
                                    <Link to="/employees">
                                        <Button startIcon={<GroupsIcon />}>Alkalmazottak</Button>
                                    </Link>
                                    <Link to="/profile">
                                        <Button startIcon={<ManageAccountsIcon />}>Profil</Button>
                                    </Link>
                                    <Link to="/inventory">
                                        <Button startIcon={<WarehouseIcon />}>Raktár</Button>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <LogoutButton />
                                    <Link to="/profile">
                                        <Button startIcon={<ManageAccountsIcon />}>Profil</Button>
                                    </Link>
                                    <Link to="/inventory">
                                        <Button startIcon={<WarehouseIcon />}>Raktár</Button>
                                    </Link>
                                </>
                            )}
                        </>
                    )}
                </ButtonGroup>
            </div>
            <Outlet />
            <div className="footer">
                <p>© 2024 Raktár Manager</p>
                <p>Created by: EM&EM Software</p>
                <p>Contact: <a href="mailto:emandemsoftware@gmail.com">emandemsoftware@gmail.com</a></p>
                <p>(Under registration)</p>
            </div>
        </div>
    );
}

export default App;