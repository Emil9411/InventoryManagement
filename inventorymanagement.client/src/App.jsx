import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from "react-router-dom";
import LogoutButton from './components/LogoutButton';
import './index.css';

function App() {
    const [user, setUser] = useState(null); //email, username, role
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
        console.log(data);
        setUser(data);
    }

    useEffect(() => {
        getUser();
    }, [location.pathname]);

    return (
        <div className="App">
            <div className="header">
                <div className="header-title">
                    <Link to="/">
                        <h1 style={{ color: "white" }}>Raktár Manager 2000</h1>
                    </Link>
                </div>
                <div className="header-buttons">
                    {!user ? (
                        <Link to="/login">
                            <button>Belépés</button>
                        </Link>
                    ) : user.role === "Admin" || user.role === "Manager" ? (
                        <>
                            <LogoutButton />
                            <button>Regisztráció</button>
                            <button>Minden termék</button>
                            <button>Kivét</button>
                            <button>Bevét</button>
                            <button>Termék hozzáadása</button>
                        </>
                    ) : (
                        <>
                            <LogoutButton />
                            <button>Minden termék</button>
                            <button>Kivét</button>
                        </>
                    )}
                </div>
            </div>
            <Outlet />
        </div>
    );
}

export default App;