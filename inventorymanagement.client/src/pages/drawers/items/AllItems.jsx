import { useState, useEffect } from 'react';
import { Button, Table, Paper, TableRow, TableHead, TableContainer, TableCell, TableBody, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import LoadingCircle from '../../../components/LoadingCircle';
import "../../../index.css";

function AllItems() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    

    async function getItems() {
        try {
            let user = null;
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
            user = userData;
            if (user.role === 'Admin') {
                const response = await fetch('/api/item/getAllItems', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                console.log(data);
                setItems(data);
            } else {
                const response = await fetch(`/api/inventory/${user.inventoryId}/items`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                console.log(data);
                setItems(data.values);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getItems();
    }, []);

    if (loading) {
        return <LoadingCircle />; 
    }
    return (
        <p>Items</p>
    );
}

export default AllItems;