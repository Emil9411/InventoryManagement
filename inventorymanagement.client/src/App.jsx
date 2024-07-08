import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from "react-router-dom";
import './App.css';

function App() {
    const [user, setUser] = useState(null);
    const location = useLocation();

    return (
        <div className="App">
            <h1>Raktár Manager 2000</h1>
            <div className="buttons">
                <button>Belépés</button>
                <button>Regisztráció</button>
                <button>Minden termék</button>
                <button>Kivét</button>
                <button>Bevét</button>
                <button>Termék hozzáadása</button>
            </div>
        </div>
    );
}

export default App;