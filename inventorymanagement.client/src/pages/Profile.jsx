﻿import { useState, useEffect } from 'react';
import { Button, Box, Paper, Grid, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import '../index.css';
import UpdateEmployeeModal from '../utils/employeeUpdate.jsx';
import LoadingCircle from '../components/LoadingCircle';

function Profile() {
    const [user, setUser] = useState(null);
    const [open, setOpen] = useState(false);
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
        setUser(userData);
        setLoading(false);
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
        <Box display="flex" alignItems="center" justifyContent="center" minHeight="fit-content">
            <Paper elevation={3} sx={{ margin: 6, padding: 6, maxWidth: 400, width: '100%' }}>
                <Typography variant="h3" align="center" gutterBottom>Profil</Typography>
                <Grid container spacing={2}>
                    {user && [
                        { label: 'Vezetéknév:', value: user.lastName },
                        { label: 'Keresztnév:', value: user.firstName },
                        { label: 'Város:', value: user.city },
                        { label: 'Irányítószám:', value: user.postalCode },
                        { label: 'Cím:', value: user.address },
                        { label: 'Telefonszám:', value: user.phoneNumber },
                        { label: 'Email:', value: user.email },
                        { label: 'Szerepkör:', value: user.role },
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
                        <Button variant="outlined" onClick={() => setOpen(true)} startIcon={<EditIcon />} sx={{ marginTop: 2 }}>
                            Adatok módosítása
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
            <UpdateEmployeeModal 
                open={open}
                onClose={() => setOpen(false)}
                selectedEmployee={user}
                warehouses={[]} />
        </Box>
    );
}

export default Profile;
