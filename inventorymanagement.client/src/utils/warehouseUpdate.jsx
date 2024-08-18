import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, TextField, Typography, Grid, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import ErrorIcon from '@mui/icons-material/Error';
import MessageModal from '../components/MessageModal';

function UpdateWarehouseModal({ selectedWarehouse, open, onClose }) {
    const [formData, setFormData] = useState({
        inventoryId: 0,
        name: "",
        address: "",
        city: "",
        country: "",
        postalCode: "",
        phone: "",
        email: "",
        managerId: "",
        employees: [],
        items: []
    });

    const [modalState, setModalState] = useState({
        open: false,
        title: '',
        message: '',
        actions: []
    });

    // Update formData when selectedWarehouse changes
    useEffect(() => {
        if (selectedWarehouse) {
            setFormData({
                inventoryId: selectedWarehouse.inventoryId || 0,
                name: selectedWarehouse.name || "",
                address: selectedWarehouse.address || "",
                city: selectedWarehouse.city || "",
                country: selectedWarehouse.country || "",
                postalCode: selectedWarehouse.postalCode || "",
                phone: selectedWarehouse.phone || "",
                email: selectedWarehouse.email || "",
                managerId: selectedWarehouse.managerId || "",
                employees: selectedWarehouse.employees ? selectedWarehouse.employees : [],
                items: selectedWarehouse.items ? selectedWarehouse.items : []
            });
        }
    }, [selectedWarehouse]);

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormData(prevState => ({ ...prevState, [id]: value }));
    };

    const handleSubmit = async () => {
        // Validate form fields
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
            title: "Biztosan módosítja a raktár adatait?",
            message: "",
            actions: [
                { label: 'Mégse', onClick: () => setModalState({ ...modalState, open: false }), color: 'secondary', startIcon: <CloseIcon /> },
                {
                    label: 'Módosítás',
                    onClick: async () => {
                        try {
                            const response = await fetch("api/inventory/update", {
                                method: "PUT",
                                credentials: "include",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ ...formData, id: selectedWarehouse.inventoryId }),
                            });
                            const data = await response.json();
                            console.log(data);
                            if (data) {
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

    if (!selectedWarehouse) {
        return null; // Optionally, show a loading indicator or a message if no warehouse is selected
    }

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    Raktár adatainak módosítása
                    <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close" sx={{ position: 'absolute', right: 20, top: 8 }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <Grid container spacing={2}>
                        {Object.keys(formData).map((key) => (
                            <Grid item xs={10} key={key}>
                                <TextField
                                    fullWidth
                                    id={key}
                                    label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                                    value={key === 'employees' || key === 'items' ? formData[key].length : formData[key]}
                                    onChange={handleInputChange}
                                    disabled={key === 'inventoryId' || key === 'employees' || key === 'items'}
                                />
                            </Grid>
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
UpdateWarehouseModal.propTypes = {
    selectedWarehouse: PropTypes.shape({
        inventoryId: PropTypes.number,
        name: PropTypes.string,
        address: PropTypes.string,
        city: PropTypes.string,
        country: PropTypes.string,
        postalCode: PropTypes.string,
        phone: PropTypes.string,
        email: PropTypes.string,
        managerId: PropTypes.string,
        employees: PropTypes.array,
        items: PropTypes.array
    }),
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export default UpdateWarehouseModal;
