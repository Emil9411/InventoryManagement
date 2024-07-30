import { useEffect, useState } from 'react';
import '../index.css';
import swal from 'sweetalert';

function Inventory() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
        setLoading(false);
        setUser(userData);
    }

    useEffect(() => {
        getUser();
    }, []);

    if (loading) {
        return (
            <>
                <br />
                <div className="spinner"></div>
            </>
        );
    }

    return (
        <div className="inventory">
            {user && user.role === "Admin" ? (
                <>
                    <button>Új raktár hozzáadása</button>
                    <button>Összes raktár listázása</button>
                    <button>Raktár adatok frissítése</button>
                    <button>Raktár törlése</button>
                    <button>Raktár adatok</button>
                    <button>Alkalmazottak</button>
                    <button>Alkalmazott hozzáadása</button>
                    <button>Alkalmazott törlése</button>
                    <button>Raktárkészlet</button>
                    <button>Hozzávalók</button>
                    <button>Termékek</button>
                    <button>Fogyócikkek</button>
                    <button>Tartós cikkek</button>
                    <button>Felszerelések</button>
                    <button>Eszközök</button>
                    <button>Rendelési lista</button>
                </>
            ) : user.role === "Manager" ? (
                <>
                    <button>Raktár adatok</button>
                    <button>Alkalmazottak</button>
                    <button>Alkalmazott hozzáadása</button>
                    <button>Alkalmazott törlése</button>
                    <button>Raktárkészlet</button>
                    <button>Hozzávalók</button>
                    <button>Termékek</button>
                    <button>Fogyócikkek</button>
                    <button>Tartós cikkek</button>
                    <button>Felszerelések</button>
                    <button>Eszközök</button>
                    <button>Rendelési lista</button>
                </>
            ) : user.role === "User" ? (
                <>
                    <button>Raktárkészlet</button>
                    <button>Hozzávalók</button>
                    <button>Termékek</button>
                    <button>Fogyócikkek</button>
                    <button>Tartós cikkek</button>
                    <button>Felszerelések</button>
                    <button>Eszközök</button>
                    <button>Rendelési lista</button>
                </>
            ) : (
                null
            )}
        </div>
    );
}

export default Inventory;