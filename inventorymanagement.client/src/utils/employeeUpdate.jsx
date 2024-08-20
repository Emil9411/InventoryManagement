import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, TextField, Typography, Grid, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Divider, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import ErrorIcon from '@mui/icons-material/Error';
import MessageModal from '../components/MessageModal';

function UpdateEmployeeModal({ selectedEmployee, warehouses, open, onClose }) {
    const [formData, setFormData] = useState({
        lastName: "",
        firstName: "",
        city: "",
        postalCode: "",
        address: "",
        phoneNumber: "",
        email: "",
        userName: "",
        role: "",
        inventoryId: 0,
        emailConfirmed: false
    });

    const [modalState, setModalState] = useState({
        open: false,
        title: '',
        message: '',
        actions: []
    });

    useEffect(() => {
        if (selectedEmployee) {
            setFormData({
                lastName: selectedEmployee.lastName || "",
                firstName: selectedEmployee.firstName || "",
                city: selectedEmployee.city || "",
                postalCode: selectedEmployee.postalCode || "",
                address: selectedEmployee.address || "",
                phoneNumber: selectedEmployee.phoneNumber || "",
                email: selectedEmployee.email || "",
                userName: selectedEmployee.userName || "",
                role: selectedEmployee.role || "",
                inventoryId: selectedEmployee.inventoryId || 0,
                emailConfirmed: selectedEmployee.emailConfirmed || false
            });
        }
    }, [selectedEmployee]);

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormData(prevState => ({ ...prevState, [id]: value }));
    };

    const handleSelectChange = (event) => {
        const value = event.target.value;
        setFormData(prevState => ({ ...prevState, inventoryId: value }));
    };

    const handleSubmit = async () => {
        const hasEmptyField = Object.values(formData).some(value => value === "");
        if (hasEmptyField) {
            setModalState({
                open: true,
                title: "Minden mező kitöltése kötelező!",
                message: "",
                actions: [{ label: 'OK', onClick: () => setModalState({ ...modalState, open: false }), color: 'error', startIcon: <ErrorIcon /> }]
            });
            return;
        }

        setModalState({
            open: true,
            title: "Biztosan módosítja a munkatárs adatait?",
            message: "",
            actions: [
                { label: 'Mégse', onClick: () => setModalState({ ...modalState, open: false }), color: 'secondary', startIcon: <CloseIcon /> },
                {
                    label: 'Módosítás',
                    onClick: async () => {
                        try {
                            const response = await fetch("api/auth/update", {
                                method: "PUT",
                                credentials: "include",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ ...formData, id: selectedEmployee.id }),
                            });
                            const data = await response.json();
                            if (data.success) {
                                setModalState({
                                    open: true,
                                    title: "Sikeres módosítás!",
                                    message: "",
                                    actions: [{ label: 'OK', onClick: () => window.location.reload(), color: 'success', startIcon: <DoneIcon /> }]
                                });
                            } else {
                                setModalState({
                                    open: true,
                                    title: "Hiba történt a módosítás során!",
                                    message: "",
                                    actions: [{ label: 'OK', onClick: () => setModalState({ ...modalState, open: false }), color: 'error', startIcon: <ErrorIcon /> }]
                                });
                            }
                        } catch (error) {
                            console.error(error);
                            setModalState({
                                open: true,
                                title: "Hiba történt a módosítás során!",
                                message: "Hiba: " + error.message,
                                actions: [{ label: 'OK', onClick: () => setModalState({ ...modalState, open: false }), color: 'error', startIcon: <ErrorIcon /> }]
                            });
                        }
                    },
                    color: 'primary',
                    startIcon: <DoneIcon />
                }
            ]
        });
    };

    if (!selectedEmployee) {
        return null;
    }

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    Munkatárs adatainak módosítása
                    <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close" sx={{ position: 'absolute', right: 20, top: 8 }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <Grid container spacing={2}>
                        {Object.keys(formData).map((key) => (
                            key !== 'id' && key !== 'inventoryId' ? (
                                <Grid item xs={10} key={key}>
                                    <TextField
                                        fullWidth
                                        id={key}
                                        label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                                        value={formData[key]}
                                        onChange={handleInputChange}
                                        disabled={key === 'role' || key === 'emailConfirmed'}
                                    />
                                </Grid>
                            ) : key === 'inventoryId' && warehouses.length > 0 ? (
                                <Grid item xs={10} key={key}>
                                    <FormControl fullWidth>
                                        <InputLabel id="inventoryId-label">Raktár</InputLabel>
                                        <Select
                                            labelId="inventoryId-label"
                                            id={key}
                                            value={formData[key]}
                                            onChange={handleSelectChange}
                                            label="Raktár"
                                        >
                                            <MenuItem value={0} disabled>Nincs raktár</MenuItem>
                                            {warehouses.map(warehouse => (
                                                <MenuItem key={warehouse.inventoryId} value={warehouse.inventoryId}>{warehouse.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            ) : null
                        ))}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} variant="outlined" color="secondary">
                        Mégse
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        Módosítás
                    </Button>
                </DialogActions>
            </Dialog>
            <MessageModal
                open={modalState.open}
                onClose={() => setModalState({ ...modalState, open: false })}
                title={modalState.title}
                actions={modalState.actions}
            >
                <Typography>{modalState.message}</Typography>
            </MessageModal>
        </>
    );
}

// Define PropTypes for the component
UpdateEmployeeModal.propTypes = {
    selectedEmployee: PropTypes.shape({
        lastName: PropTypes.string,
        firstName: PropTypes.string,
        city: PropTypes.string,
        postalCode: PropTypes.string,
        address: PropTypes.string,
        phoneNumber: PropTypes.string,
        email: PropTypes.string,
        userName: PropTypes.string,
        role: PropTypes.string,
        emailConfirmed: PropTypes.bool,
        inventoryId: PropTypes.number,
        id: PropTypes.string
    }),
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    warehouses: PropTypes.array.isRequired
};

export default UpdateEmployeeModal;
