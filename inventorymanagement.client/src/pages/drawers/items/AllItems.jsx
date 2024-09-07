import { useState, useEffect } from 'react';
import { Button, Table, Paper, TableRow, TableHead, TableContainer, TableCell, TableBody, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
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
                setItems(data.$values);
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
                setItems(data.$values);
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
        <TableContainer component={Paper} sx={{ padding: 6, width: '90vw', marginLeft: 'auto', marginRight: 'auto', marginTop: 6, marginBottom: 6 }}>
            <Table sx={{ width: '80vw', marginLeft: 'auto', marginRight: 'auto' }} aria-label="employee table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Név</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Áfa kulcs</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Mennyiség (db)</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Mennyiség (kg)</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Nettó Ár (Ft/db)</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Bruttó Ár (Ft/db)</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Nettó Ár (Ft/kg)</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Bruttó Ár (Ft/kg)</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Műveletek</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.taxRate}</TableCell>
                            <TableCell>{item.quantityInPieces}</TableCell>
                            <TableCell>{item.weightInKilograms}</TableCell>
                            <TableCell>{item.netPricePerPiece}</TableCell>
                            <TableCell>{item.grossPricePerPiece}</TableCell>
                            <TableCell>{item.netPricePerKilogram}</TableCell>
                            <TableCell>{item.grossPricePerKilogram}</TableCell>
                            <TableCell>
                                <Button variant="contained" color="primary" sx={{ marginRight: 1 }} startIcon={<EditIcon />}>Szerkesztés</Button>
                                <Button variant="contained" color="error" startIcon={<DeleteForeverIcon />}>Törlés</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default AllItems;