import { useState, useEffect } from 'react';
import { Button, Table, Paper, TableRow, TableHead, TableContainer, TableCell, TableBody, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import WrongLocationIcon from '@mui/icons-material/WrongLocation';
import LoadingCircle from '../../../components/LoadingCircle';
import MessageModal from '../../../components/MessageModal';
import UpdateWarehouseModal from '../../../utils/warehouseUpdate.jsx';

function Warehouses() {
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [updateModalWarehouse, setUpdateModalWarehouse] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', message: '', actions: [] });

    async function fetchWarehouses() {
        try {
            const response = await fetch('/api/inventory/all', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setWarehouses(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchWarehouses();
    }, []);

    function handleDeleteWarehouse(selectedWarehouse) {
        setModalContent({
            title: 'Megerősítés',
            message: `Biztosan törölni szeretné a(z) ${selectedWarehouse.name} raktárat?`,
            actions: [
                {
                    label: 'Igen',
                    onClick: () => confirmDeleteWarehouse(selectedWarehouse),
                    color: 'error',
                    startIcon: <WrongLocationIcon />
                },
                { label: 'Nem', onClick: () => setDeleteModalOpen(false), startIcon: <CloseIcon /> }
            ]
        });
        setDeleteModalOpen(true);
    }

    async function confirmDeleteWarehouse(selectedWarehouse) {
        setLoading(true);
        setDeleteModalOpen(false);
        try {
            const response = await fetch(`/api/inventory/delete/${selectedWarehouse.inventoryId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                setWarehouses(warehouses.filter(warehouse => warehouse.inventoryId !== selectedWarehouse.inventoryId));
                setModalContent({
                    title: 'Siker',
                    message: `${selectedWarehouse.name} raktár sikeresen törölve!`,
                    actions: [{ label: 'Rendben', onClick: () => setDeleteModalOpen(false), startIcon: <DoneIcon /> }]
                });
            } else {
                setModalContent({
                    title: 'Hiba',
                    message: 'A raktár törlése sikertelen.',
                    actions: [{ label: 'Rendben', onClick: () => setDeleteModalOpen(false), startIcon: <CloseIcon /> }]
                });
            }
        } catch (error) {
            console.error(error);
            setModalContent({
                title: 'Hiba',
                message: 'A raktár törlése sikertelen.',
                actions: [{ label: 'Rendben', onClick: () => setDeleteModalOpen(false), startIcon: <CloseIcon /> }]
            });
        } finally {
            setLoading(false);
            setDeleteModalOpen(true);
        }                
    }

    if (loading) {
        return <LoadingCircle />;
    }

    return (
        <div>
            <TableContainer component={Paper} sx={{ padding: 6, width: '90vw', marginLeft: 'auto', marginRight: 'auto', marginTop: 6, marginBottom: 6 }}>
                <Table sx={{ width: '80vw', marginLeft: 'auto', marginRight: 'auto' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Raktár neve</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Raktár címe</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Raktár kapacitása</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Raktárban lévő termékek száma</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Alkalmazottak száma</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Adatok módosítása</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Raktár törlése</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {warehouses.map(warehouse => (
                            <TableRow key={warehouse.inventoryId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>{warehouse.name}</TableCell>
                                <TableCell>{warehouse.address}</TableCell>
                                <TableCell>{warehouse.city}</TableCell>
                                <TableCell>{warehouse.items ? warehouse.items.length : 0}</TableCell>
                                <TableCell>{warehouse.employees ? warehouse.employees.length : 0}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" startIcon={<EditLocationAltIcon />} onClick={() => { setUpdateModalOpen(true); setUpdateModalWarehouse(warehouse); }}>Módosítás</Button>
                                </TableCell>
                                <TableCell>
                                    <Button variant="contained" color="error" startIcon={<WrongLocationIcon />} onClick={() => handleDeleteWarehouse(warehouse)}>Törlés</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {updateModalOpen && <UpdateWarehouseModal open={updateModalOpen} selectedWarehouse={updateModalWarehouse} onClose={() => setUpdateModalOpen(false)} />}
            {deleteModalOpen &&
                <MessageModal
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    title={modalContent.title}
                    actions={modalContent.actions}
                >
                    <Typography>{modalContent.message}</Typography>
                </MessageModal>
            }
        </div>
    );
}

export default Warehouses;