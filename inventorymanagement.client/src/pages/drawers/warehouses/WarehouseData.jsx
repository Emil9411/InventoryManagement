import { useEffect, useState } from 'react';
import { Button, Box, Paper, Grid, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LoadingCircle from '../../../components/LoadingCircle';
import UpdateWarehouseModal from '../../../utils/warehouseUpdate.jsx';
import '../../../index.css';

function WarehouseData() {
    const [user, setUser] = useState(null);
    const [warehouseData, setWarehouseData] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    async function getData() {
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
        setUser(userData);
        const warehouseDataResponse = await fetch(`api/inventory/${userData.inventoryId}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const warehouseData = await warehouseDataResponse.json();
        setWarehouseData(warehouseData);
        console.log(warehouseData);
        setLoading(false);
    }

    useEffect(() => {
        getData();
    }, []);

    if (loading) {
        return (
            <LoadingCircle />
        );
    }

    return (
        <Box display="flex" alignItems="center" justifyContent="center" minHeight="fit-content">
            <Paper elevation={3} sx={{ margin: 6, padding: 6, maxWidth: 400, width: '100%' }}>
                <Typography variant="h3" align="center" gutterBottom>Raktár adatok</Typography>
                <Grid container spacing={2}>
                    {user && [
                        { label: 'Név:', value: warehouseData.name },
                        { label: 'Ország:', value: warehouseData.country },
                        { label: 'Város:', value: warehouseData.city },
                        { label: 'Irányítószám:', value: warehouseData.postalCode },
                        { label: 'Cím:', value: warehouseData.address },
                        { label: 'Telefonszám:', value: warehouseData.phone },
                        { label: 'Email:', value: warehouseData.email },
                    ].map((item, index) => (
                        <Grid item xs={12} key={index}>
                            <Grid container justifyContent="center" alignItems="center" spacing={2}>
                                <Grid item>
                                    <Typography variant="h6">{item.label}</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography>{item.value}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    ))}
                    <Grid item xs={12} display="flex" justifyContent="center">
                        <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setOpen(true)} sx={{ marginTop: 2 }}>
                            Adatok módosítása
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
            <UpdateWarehouseModal
                open={open}
                onClose={() => setOpen(false)}
                selectedWarehouse={warehouseData}
                canChangeManager={user.role === 'Admin'}
            />
        </Box>
    );
}

export default WarehouseData;