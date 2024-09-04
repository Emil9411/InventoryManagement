import { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, Typography, Grid, Paper, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import LoadingCircle from '../../../components/LoadingCircle';
import MessageModal from '../../../components/MessageModal';

function AddItem() {
    const [user, setUser] = useState(null);
    const [warehouseData, setWarehouseData] = useState([]);
    const [allWarehouses, setAllWarehouses] = useState([]);
    const [itemType, setItemType] = useState("");
    const [itemData, setItemData] = useState({
        name: '',
        isIngredient: false,
        isConsumable: false,
        isEquipment: false,
        weightInGrams: 0,
        weightInKilograms: 0,
        quantityInPieces: 0,
        quantityPerPackage: 0,
        netPricePerGram: 0,
        netPricePerKilogram: 0,
        netPricePerPiece: 0,
        netPricePerPackage: 0,
        grossPricePerGram: 0,
        grossPricePerKilogram: 0,
        grossPricePerPiece: 0,
        grossPricePerPackage: 0,
        taxRate: 0,
        shouldOrder: false,
        inventoryId: 0,
        inventory: {}
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalState, setModalState] = useState({
        open: false,
        title: '',
        actions: []
    });
    const [loading, setLoading] = useState(true);

    const listOfTypes = ['Hozzávaló', 'Termék', 'Fogyócikk', 'Tartós cikk', 'Felszerelés', 'Eszköz'];

    async function getData() {
        try {
            const response = await fetch("api/auth/check", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error("Nem vagy bejelentkezve.");
            }
            const data = await response.json();

            const userDataResponse = await fetch(`api/auth/user/${data.email}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!userDataResponse.ok) {
                throw new Error("Nem található felhasználó.");
            }
            const userData = await userDataResponse.json();
            setUser(userData);

            const warehouseDataResponse = await fetch(`api/inventory/${userData.inventoryId}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!warehouseDataResponse.ok) {
                throw new Error("Nem található raktár.");
            }
            const warehouseData = await warehouseDataResponse.json();
            setWarehouseData(warehouseData);

            if (userData.role === 'Admin') {
                const allWarehousesResponse = await fetch("api/inventory/all", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!allWarehousesResponse.ok) {
                    throw new Error("Nem találhatók raktárak.");
                }
                const allWarehouses = await allWarehousesResponse.json();
                console.log(allWarehouses);
                setAllWarehouses(allWarehouses.$values);
            }

            console.log(warehouseData);

        } catch (error) {
            console.error("An error occurred:", error);
            setModalState({
                open: true,
                title: 'Hiba',
                message: 'Hibaüzenet: ' + error.message,
                actions: [
                    {
                        label: 'OK',
                        onClick: () => {
                            setModalState({ ...modalState, open: false });
                        },
                        color: 'error',
                        startIcon: <CloseIcon />
                    }
                ]
            });
        } finally {
            setLoading(false);
        }
    }


    async function handleSubmit(event) {
        event.preventDefault();
        setIsSubmitting(true);
        if (itemData.name === '' || itemData.taxRate === 0) {
            setModalState({
                open: true,
                title: 'Hiányzó adatok',
                message: 'Kérjük töltse ki az összes mezőt.',
                actions: [
                    {
                        label: 'OK',
                        onClick: () => {
                            setModalState({ ...modalState, open: false });
                        },
                        color: 'error',
                        startIcon: <CloseIcon />
                    }
                ]
            });
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch("api/item/create", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(itemData),
            });
            console.log(itemData);
            if (response.ok) {
                setModalState({
                    open: true,
                    title: 'Siker',
                    message: 'Az új tétel sikeresen hozzáadva.',
                    actions: [
                        {
                            label: 'OK',
                            onClick: () => {
                                setModalState({ ...modalState, open: false });
                                setItemData({
                                    name: '',
                                    isIngredient: false,
                                    isConsumable: false,
                                    isEquipment: false,
                                    weightInGrams: 0,
                                    weightInKilograms: 0,
                                    quantityInPieces: 0,
                                    quantityPerPackage: 0,
                                    netPricePerGram: 0,
                                    netPricePerKilogram: 0,
                                    netPricePerPiece: 0,
                                    netPricePerPackage: 0,
                                    grossPricePerGram: 0,
                                    grossPricePerKilogram: 0,
                                    grossPricePerPiece: 0,
                                    grossPricePerPackage: 0,
                                    taxRate: 0,
                                    shouldOrder: false,
                                    inventoryId: 0,
                                    inventory: {}
                                });
                            },
                            color: 'success',
                            startIcon: <DoneIcon />
                        }
                    ]
                });
            } else {
                setModalState({
                    open: true,
                    title: 'Hiba',
                    message: 'Valami hiba történt, kérjük próbálja újra később.',
                    actions: [
                        {
                            label: 'OK',
                            onClick: () => {
                                setModalState({ ...modalState, open: false });
                            },
                            color: 'error',
                            startIcon: <CloseIcon />
                        }
                    ]
                });
            }
        } catch (error) {
            setModalState({
                open: true,
                title: 'Hiba',
                message: 'Valami hiba történt, kérjük próbálja újra később.',
                actions: [
                    {
                        label: 'OK',
                        onClick: () => {
                            setModalState({ ...modalState, open: false });
                        },
                        color: 'error',
                        startIcon: <CloseIcon />
                    }
                ]
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    function calculateGrossPrice(netPrice, taxRate) {
        let grossPrice = netPrice * (1 + taxRate / 100);
        return Math.ceil(grossPrice * 100) / 100;
    }

    function calculateUnitPrice(netPrice, piecePerPackage) {
        return netPrice * piecePerPackage;
    }

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        const netPricePerPackage = itemData.netPricePerPiece * itemData.quantityPerPackage;
        const grossPricePerPiece = calculateGrossPrice(itemData.netPricePerPiece, itemData.taxRate);
        const grossPricePerPackage = calculateGrossPrice(netPricePerPackage, itemData.taxRate);

        setItemData(prev => ({
            ...prev,
            netPricePerPackage,
            grossPricePerPiece,
            grossPricePerPackage
        }));
    }, [itemData.netPricePerPiece, itemData.quantityPerPackage, itemData.taxRate]);

    if (loading) {
        return (
            <LoadingCircle />
        );
    }

    return (
        <Box display="flex" alignItems="center" justifyContent="center" minHeight="fit-content">
            <Paper elevation={3} sx={{ margin: 6, padding: 6, maxWidth: 400, width: '100%' }}>
                <Typography variant="h3" align="center" gutterBottom>Új tétel hozzáadása</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center" gutterBottom>Termék megnevezése:</Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            onChange={(e) => setItemData({ ...itemData, name: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center" gutterBottom>Típus:</Typography>
                        <Select
                            fullWidth
                            variant="outlined"
                            value={itemType}
                            onChange={(e) => {
                                setItemData({
                                    ...itemData,
                                    isIngredient: e.target.value === 'Hozzávaló',
                                    isConsumable: e.target.value === 'Fogyócikk',
                                    isEquipment: e.target.value === 'Felszerelés'
                                });
                                setItemType(e.target.value)
                            }}
                        >
                            <MenuItem value={false} disabled>Válassz típust</MenuItem>
                            {listOfTypes.map((type) => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center" gutterBottom>Áfa kulcs:</Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            onChange={(e) => setItemData({ ...itemData, taxRate: parseFloat(e.target.value) })}
                        />
                    </Grid>
                    {itemData.isIngredient && (
                        <>
                            <Grid item xs={12}>
                                <Typography variant="h6" align="center" gutterBottom>Mennyiség (gramm):</Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    onChange={(e) => setItemData({ ...itemData, weightInGrams: parseFloat(e.target.value) })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" align="center" gutterBottom>Mennyiség (kilogramm):</Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    onChange={(e) => setItemData({ ...itemData, weightInKilograms: parseFloat(e.target.value) })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" align="center" gutterBottom>Nettó ár/gramm:</Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    onChange={(e) => setItemData({ ...itemData, netPricePerGram: parseFloat(e.target.value) })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" align="center" gutterBottom>Nettó ár/kilogramm:</Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    onChange={(e) => setItemData({ ...itemData, netPricePerKilogram: parseFloat(e.target.value) })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" align="center" gutterBottom>Bruttó ár/gramm:</Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    disabled
                                    value={calculateGrossPrice(itemData.netPricePerGram, itemData.taxRate)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" align="center" gutterBottom>Bruttó ár/kilogramm:</Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    disabled
                                    value={calculateGrossPrice(itemData.netPricePerKilogram, itemData.taxRate)}
                                />
                            </Grid>
                        </>
                    )}
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center" gutterBottom>Mennyiség (darab):</Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            onChange={(e) => setItemData({ ...itemData, quantityInPieces: parseFloat(e.target.value) })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center" gutterBottom>Mennyiség/csomag:</Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            onChange={(e) => setItemData({ ...itemData, quantityPerPackage: parseFloat(e.target.value) })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center" gutterBottom>Nettó ár/darab:</Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            onChange={(e) => setItemData({ ...itemData, netPricePerPiece: parseFloat(e.target.value) })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center" gutterBottom>Nettó ár/csomag:</Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            disabled
                            value={calculateUnitPrice(itemData.netPricePerPiece, itemData.quantityPerPackage)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center" gutterBottom>Bruttó ár/darab:</Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            disabled
                            value={calculateGrossPrice(itemData.netPricePerPiece, itemData.taxRate)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center" gutterBottom>Bruttó ár/csomag:</Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            disabled
                            value={calculateGrossPrice(itemData.netPricePerPackage, itemData.taxRate)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center" gutterBottom>Raktár:</Typography>
                        <Select
                            fullWidth
                            variant="outlined"
                            value={itemData.inventoryId || 0} // Ensure correct value is selected
                            onChange={(e) => {
                                if (user.role === 'Admin') {
                                    // Find the selected warehouse by comparing its ID (ensure uniqueness in your data)
                                    const selectedWarehouse = allWarehouses.find(warehouse => warehouse.inventoryId === e.target.value);
                                    if (selectedWarehouse) {
                                        setItemData({
                                            ...itemData,
                                            inventoryId: selectedWarehouse.inventoryId,
                                            inventory: {
                                                name: selectedWarehouse.name,
                                                address: selectedWarehouse.address,
                                                city: selectedWarehouse.city,
                                                country: selectedWarehouse.country,
                                                postalCode: selectedWarehouse.postalCode,
                                                phone: selectedWarehouse.phone,
                                                email: selectedWarehouse.email,
                                                managerId: selectedWarehouse.managerId
                                            }
                                        });
                                    }
                                } else {
                                    // Non-admin case: Use the user's assigned warehouse
                                    setItemData({
                                        ...itemData,
                                        inventoryId: warehouseData.inventoryId,
                                        inventory: {
                                            name: warehouseData.name,
                                            address: warehouseData.address,
                                            city: warehouseData.city,
                                            country: warehouseData.country,
                                            postalCode: warehouseData.postalCode,
                                            phone: warehouseData.phone,
                                            email: warehouseData.email,
                                            managerId: warehouseData.managerId
                                        }
                                    });
                                }
                            }}
                        >
                            <MenuItem value="0" disabled>Válassz raktárat</MenuItem>
                            {user.role === 'Admin' ? allWarehouses.map((warehouse) => (
                                <MenuItem key={warehouse.inventoryId} value={warehouse.inventoryId}>{warehouse.name}</MenuItem>
                            )) : (
                                <MenuItem key={warehouseData.inventoryId} value={warehouseData.inventoryId}>{warehouseData.name}</MenuItem>
                            )}
                        </Select>

                    </Grid>
                    <Grid item xs={12}>
                        <LoadingButton
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            loading={isSubmitting}
                            startIcon={<AddCircleOutlineIcon />}
                            loadingPosition="start"
                        >
                            Hozzáadás
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Paper>
            <MessageModal
                open={modalState.open}
                onClose={() => setModalState({ ...modalState, open: false })}
                title={modalState.title}
                actions={modalState.actions}
            >
                <Typography variant="body1" align="center">{modalState.message}</Typography>
            </MessageModal>
        </Box>
    );
}

export default AddItem;