import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import LoadingCircle from '../components/LoadingCircle';
import '../index.css';

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
            <LoadingCircle />
        );
    }

    return (
        <div className="inventory">
            {user && user.role === "Admin" ? (
                <>
                    <Button>Új raktár hozzáadása</Button>
                    <Button>Összes raktár listázása</Button>
                    <Button>Raktár adatok frissítése</Button>
                    <Button>Raktár törlése</Button>
                    <Button>Raktár adatok</Button>
                    <Button>Alkalmazottak</Button>
                    <Button>Alkalmazott hozzáadása</Button>
                    <Button>Alkalmazott törlése</Button>
                    <Button>Raktárkészlet</Button>
                    <Button>Hozzávalók</Button>
                    <Button>Termékek</Button>
                    <Button>Fogyócikkek</Button>
                    <Button>Tartós cikkek</Button>
                    <Button>Felszerelések</Button>
                    <Button>Eszközök</Button>
                    <Button>Rendelési lista</Button>
                </>
            ) : user.role === "Manager" ? (
                <>
                    <Button>Raktár adatok</Button>
                    <Button>Alkalmazottak</Button>
                    <Button>Alkalmazott hozzáadása</Button>
                    <Button>Alkalmazott törlése</Button>
                    <Button>Raktárkészlet</Button>
                    <Button>Hozzávalók</Button>
                    <Button>Termékek</Button>
                    <Button>Fogyócikkek</Button>
                    <Button>Tartós cikkek</Button>
                    <Button>Felszerelések</Button>
                    <Button>Eszközök</Button>
                    <Button>Rendelési lista</Button>
                </>
            ) : user.role === "User" ? (
                <>
                    <Button>Raktárkészlet</Button>
                    <Button>Hozzávalók</Button>
                    <Button>Termékek</Button>
                    <Button>Fogyócikkek</Button>
                    <Button>Tartós cikkek</Button>
                    <Button>Felszerelések</Button>
                    <Button>Eszközök</Button>
                    <Button>Rendelési lista</Button>
                </>
            ) : (
                null
            )}
        </div>
    );
}

export default Inventory;