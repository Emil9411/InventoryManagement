import { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, Typography, Grid, Paper, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
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
        inventoryId: "0"
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalState, setModalState] = useState({
        open: false,
        title: '',
        message: '',
        actions: []
    });
    const [loading, setLoading] = useState(true);

    const listOfTypes = ['Hozzávaló', 'Termék', 'Fogyócikk', 'Tartós cikk', 'Felszerelés', 'Eszköz'];

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
        if (userData.role === 'Admin') {
            const allWarehousesResponse = await fetch("api/inventory/all", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const allWarehouses = await allWarehousesResponse.json();
            console.log(allWarehouses);
            setAllWarehouses(allWarehouses);
        }
        console.log(warehouseData);
        setLoading(false);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsSubmitting(true);
        if (itemData.name === '' || itemData.taxRate === 0 || itemData.inventoryId === 0) {
            setModalState({
                open: true,
                title: 'Hiányzó adatok',
                message: 'Kérjük töltse ki az összes mezőt.',
                actions: [
                    {
                        text: 'OK',
                        onClick: () => {
                            setModalState({ ...modalState, open: false });
                        }
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
            const data = await response.json();
            if (data) {
                setModalState({
                    open: true,
                    title: 'Sikeres hozzáadás',
                    message: 'Az új tétel sikeresen hozzáadásra került.',
                    actions: [
                        {
                            text: 'OK',
                            onClick: () => {
                                setModalState({ ...modalState, open: false });
                            }
                        }
                    ]
                });
            } else {
                setModalState({
                    open: true,
                    title: 'Hiba',
                    message: 'Hiba történt a tétel hozzáadása során.',
                    actions: [
                        {
                            text: 'OK',
                            onClick: () => {
                                setModalState({ ...modalState, open: false });
                            }
                        }
                    ]
                });
            }
        } catch (error) {
            setModalState({
                open: true,
                title: 'Hiba',
                message: 'Hiba történt a tétel hozzáadása során.',
                actions: [
                    {
                        text: 'OK',
                        onClick: () => {
                            setModalState({ ...modalState, open: false });
                        }
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
                            value={false}
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
                            onChange={(e) => setItemData({ ...itemData, taxRate: e.target.value })}
                        />
                    </Grid>
                    {itemData.isIngredient && (
                        <>
                            <Grid item xs={12}>
                            <Typography variant="h6" align="center" gutterBottom>Mennyiség (gramm):</Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    onChange={(e) => setItemData({ ...itemData, weightInGrams: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" align="center" gutterBottom>Mennyiség (kilogramm):</Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    onChange={(e) => setItemData({ ...itemData, weightInKilograms: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                            <Typography variant="h6" align="center" gutterBottom>Nettó ár/gramm:</Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    onChange={(e) => setItemData({ ...itemData, netPricePerGram: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                            <Typography variant="h6" align="center" gutterBottom>Nettó ár/kilogramm:</Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    onChange={(e) => setItemData({ ...itemData, netPricePerKilogram: e.target.value })}
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
                            onChange={(e) => setItemData({ ...itemData, quantityInPieces: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                    <Typography variant="h6" align="center" gutterBottom>Mennyiség/csomag:</Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            onChange={(e) => setItemData({ ...itemData, quantityPerPackage: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                    <Typography variant="h6" align="center" gutterBottom>Nettó ár/darab:</Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            onChange={(e) => setItemData({ ...itemData, netPricePerPiece: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                    <Typography variant="h6" align="center" gutterBottom>Nettó ár/csomag:</Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            onChange={(e) => setItemData({ ...itemData, netPricePerPackage: e.target.value })}
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
                            value={itemData.inventoryId}

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
                            loadingPosition="start"
                        >
                            Hozzáadás
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Paper>
            <MessageModal
                open={modalState.open}
                title={modalState.title}
                message={modalState.message}
                actions={modalState.actions}
            />
        </Box>
    );
}

export default AddItem;