import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Grid, Paper, Typography, Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import MessageModal from '../../../components/MessageModal';

function AddWarehouse() {
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        city: "",
        country: "",
        postalCode: "",
        phone: "",
        email: "",
        managerId: null,
        employees: [],
        items: []
    });

    const [loading, setLoading] = useState(false);
    const [modalState, setModalState] = useState({
        open: false,
        title: '',
        message: '',
        actions: []
    });

    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [id]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("api/inventory/create", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setModalState({
                    open: true,
                    title: "Raktár sikeresen létrehozva",
                    message: "",
                    actions: [{ label: 'OK', onClick: () => navigate("/"), color: 'primary', startIcon: <DoneIcon /> }]
                });
            } else {
                const errorData = await response.json();
                setModalState({
                    open: true,
                    title: "Hiba",
                    message: errorData?.message || "Hiba lépett fel a raktár létrehozása közben.",
                    actions: [{ label: 'Close', onClick: () => setModalState({ ...modalState, open: false }), color: 'secondary', startIcon: <CloseIcon /> }]
                });
            }
        } catch (error) {
            setModalState({
                open: true,
                title: "Hiba",
                message: error.message || "Váratlan hiba történt.",
                actions: [{ label: 'Close', onClick: () => setModalState({ ...modalState, open: false }), color: 'secondary', startIcon: <CloseIcon /> }]
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" alignItems="center" justifyContent="center" minHeight="fit-content">
            <Paper elevation={3} sx={{ margin: 6, padding: 6, maxWidth: 500, width: '100%' }}>
                <Typography variant="h4" align="center" gutterBottom>Új raktár létrehozása</Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="name"
                                label="Raktár neve"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="address"
                                label="Cím"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="city"
                                label="Város"
                                value={formData.city}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="country"
                                label="Ország"
                                value={formData.country}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="postalCode"
                                label="Irányítószám"
                                value={formData.postalCode}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="phone"
                                label="Telefonszám"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="email"
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <LoadingButton
                                fullWidth
                                type="submit"
                                variant="contained"
                                startIcon={<AddLocationAltIcon />}
                                loading={loading}
                                loadingPosition="start"
                            >
                                Raktár létrehozása
                            </LoadingButton>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            <MessageModal
                open={modalState.open}
                onClose={() => setModalState({ ...modalState, open: false })}
                title={modalState.title}
                actions={modalState.actions}
            >
                <Typography>{modalState.message}</Typography>
            </MessageModal>
        </Box>
    );
}

export default AddWarehouse;
