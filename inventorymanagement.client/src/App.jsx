import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from "react-router-dom";
import LogoutButton from './components/LogoutButton';
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
                <div className="header-buttons">
                    {!isVerificationPage && (
                        <>
                            {!user ? (
                                <Link to="/login">
                                    <button>Belépés</button>
                                </Link>
                            ) : user.role === "Admin" || user.role === "Manager" ? (
                                <>
                                    <LogoutButton />
                                    <Link to="/registration">
                                        <button>Regisztráció</button>
                                    </Link>
                                    <Link to="/employees">
                                        <button>Alkalmazottak</button>
                                    </Link>
                                    <Link to="/profile">
                                        <button>Profil</button>
                                    </Link>
                                    <Link to="/inventory">
                                        <button>Raktár</button>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <LogoutButton />
                                    <Link to="/profile">
                                        <button>Profil</button>
                                    </Link>
                                    <Link to="/inventory">
                                        <button>Raktár</button>
                                    </Link>
                                </>
                            )}
                        </>
                    )}
                </div>
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