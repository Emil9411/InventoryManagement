import { useState, useEffect } from 'react';
import { Button, Table, Paper, TableRow, TableHead, TableContainer, TableCell, TableBody, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import LoadingCircle from '../../../components/LoadingCircle';
import MessageModal from '../../../components/MessageModal';
import "../../../index.css";

function AllItems() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', message: '', actions: [] });

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

    function deleteItem(itemId) {
        // ask for confirmation before deleting
        setModalContent({
            title: 'Megerősítés',
            message: 'Biztosan törölni szeretné ezt az elemet?',
            actions: [
                {
                    label: 'Igen',
                    onClick: () => confirmDeleteItem(itemId),
                    color: 'error',
                    startIcon: <DeleteForeverIcon />
                },
                { label: 'Nem', onClick: () => setDeleteModalOpen(false), startIcon: <CloseIcon /> }
            ]
        });
        setDeleteModalOpen(true);
    }

    async function confirmDeleteItem(itemId) {
        setLoading(true);
        setDeleteModalOpen(false);
        try {
            const response = await fetch(`/api/item/delete/${itemId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                setItems(items.filter(item => item.id !== itemId));
                setModalContent({
                    title: 'Siker',
                    message: 'Elem sikeresen törölve!',
                    actions: [{ label: 'Rendben', onClick: () => setDeleteModalOpen(false), startIcon: <DoneIcon /> }]
                });
            } else {
                setModalContent({
                    title: 'Hiba',
                    message: 'Hiba történt az elem törlése közben.',
                    actions: [{ label: 'Rendben', onClick: () => setDeleteModalOpen(false), startIcon: <CloseIcon /> }]
                });
            }
        } catch (error) {
            console.error(error);
            setModalContent({
                title: 'Hiba',
                message: 'Hiba történt az elem törlése közben: ' + error,
                actions: [{ label: 'Rendben', onClick: () => setDeleteModalOpen(false), startIcon: <CloseIcon /> }]
            });
        } finally {
            setDeleteModalOpen(true);
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
                                <Button variant="outlined" color="primary" sx={{ marginRight: 1 }} startIcon={<EditIcon />}>Szerkesztés</Button>
                                <Button variant="outlined" color="error" startIcon={<DeleteForeverIcon />} onClick={() => deleteItem(item.id)}>Törlés</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {deleteModalOpen && (
                <MessageModal
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    title={modalContent.title}
                    actions={modalContent.actions}
                >
                    <Typography>{modalContent.message}</Typography>
                </MessageModal>
            )}
        </TableContainer>
    );
}

export default AllItems;