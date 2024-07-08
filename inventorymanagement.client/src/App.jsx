import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from "react-router-dom";
import './App.css';

function App() {
    const [user, setUser] = useState(null);
    const location = useLocation();

    return (
        <div className="App">
            <h1>Rakt�r Manager 2000</h1>
            <div className="buttons">
                <button>Bel�p�s</button>
                <button>Regisztr�ci�</button>
                <button>Minden term�k</button>
                <button>Kiv�t</button>
                <button>Bev�t</button>
                <button>Term�k hozz�ad�sa</button>
            </div>
        </div>
    );
}

export default App;