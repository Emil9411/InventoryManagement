import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import LoadingCircle from '../../../components/LoadingCircle';
import '../../../index.css';

function WarehouseData() {
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
        <p>Warehouse data page</p>
    );
}

export default WarehouseData;