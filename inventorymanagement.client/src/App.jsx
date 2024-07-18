import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from "react-router-dom";
import LogoutButton from './components/LogoutButton';
import './index.css';

function App() {
    const [user, setUser] = useState(null);
    const location = useLocation();

    return (
        <div className="App">
            <div className="header">
                <div className="header-title">
                    <Link to="/">
                        <h1 style={{ color: "white" }}>Raktár Manager 2000</h1>
                    </Link>
                </div>
                <div className="header-buttons">
                    <Link to="/login">
                        <button>Belépés</button>
                    </Link>
                    <LogoutButton />
                    <button>Regisztráció</button>
                    <button>Minden termék</button>
                    <button>Kivét</button>
                    <button>Bevét</button>
                    <button>Termék hozzáadása</button>
                </div>
            </div>
            <Outlet />
        </div>
    );
}

export default App;