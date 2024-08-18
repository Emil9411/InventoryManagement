import { useState, useEffect } from 'react';
import { Button, Table, Paper, TableRow, TableHead, TableContainer, TableCell, TableBody, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import LoadingCircle from '../../../components/LoadingCircle';
import MessageModal from '../../../components/MessageModal';
import UpdateWarehouseModal from '../../../utils/warehouseUpdate.jsx';

function Warehouses() {
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [updateModalWarehouse, setUpdateModalWarehouse] = useState(null);
    const [messageModal, setMessageModal] = useState({ open: false, title: '', message: '' });

    async function fetchWarehouses() {
        try {
            const response = await fetch('/api/inventory/all');
            const data = await response.json();
            if (response.ok) {
                setWarehouses(data);
                setLoading(false);
                console.log(data);
            } else {
                console.log(data);
                setMessageModal({ open: true, title: 'Hiba az adatok betöltése közben', message: data.message });
            }
        } catch (error) {
            setMessageModal({ open: true, title: 'Hiba az adatok betöltése közben', message: error.message });
        }
    }

    useEffect(() => {
        fetchWarehouses();
    }, []);

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
                                    <Button variant="contained" color="primary" startIcon={<EditIcon />} onClick={() => { setUpdateModalOpen(true); setUpdateModalWarehouse(warehouse); }}>Módosítás</Button>
                                </TableCell>
                                <TableCell>
                                    <Button variant="contained" color="error" startIcon={<CloseIcon />}>Törlés</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {updateModalOpen && <UpdateWarehouseModal open={updateModalOpen} selectedWarehouse={updateModalWarehouse} onClose={() => setUpdateModalOpen(false)} />}
        </div>
    );
}

export default Warehouses;