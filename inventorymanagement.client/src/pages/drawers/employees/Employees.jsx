import { useState, useEffect } from 'react';
import { Button, Table, Paper, TableRow, TableHead, TableContainer, TableCell, TableBody, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import LoadingCircle from '../../../components/LoadingCircle';
import MessageModal from '../../../components/MessageModal';
import UpdateEmployeeModal from '../../../utils/employeeUpdate.jsx';
import '../../../index.css';

function Employees() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [updateModalUser, setUpdateModalUser] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', message: '', actions: [] });

    async function getEmployees() {
        try {
            const response = await fetch("api/auth/users", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            setEmployees(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getEmployees();
    }, []);

    function handleDeleteEmployee(selectedEmployee) {
        setModalContent({
            title: 'Megerősítés',
            message: `Biztosan törölni szeretné ${selectedEmployee.lastName} ${selectedEmployee.firstName} alkalmazottat?`,
            actions: [
                {
                    label: 'Igen',
                    onClick: () => confirmDeleteEmployee(selectedEmployee),
                    color: 'error',
                    startIcon: <PersonRemoveIcon />
                },
                { label: 'Nem', onClick: () => setDeleteModalOpen(false), startIcon: <CloseIcon /> }
            ]
        });
        setDeleteModalOpen(true);
    }

    async function confirmDeleteEmployee(selectedEmployee) {
        setLoading(true);
        setDeleteModalOpen(false);
        try {
            const response = await fetch(`api/auth/delete/${selectedEmployee.email}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                setEmployees(employees.filter(emp => emp.id !== selectedEmployee.id));
                setModalContent({
                    title: 'Siker',
                    message: `${selectedEmployee.lastName} ${selectedEmployee.firstName} sikeresen törölve.`,
                    actions: [{ label: 'Rendben', onClick: () => setDeleteModalOpen(false), startIcon: <DoneIcon /> }]
                });
            } else {
                setModalContent({
                    title: 'Hiba',
                    message: 'Nem sikerült törölni az alkalmazottat. Próbálja újra.',
                    actions: [{ label: 'Rendben', onClick: () => setDeleteModalOpen(false), startIcon: <CloseIcon /> }]
                });
            }
        } catch (error) {
            console.error(error);
            setModalContent({
                title: 'Hiba',
                message: 'Hiba történt az alkalmazott törlésekor. Próbálja újra.',
                actions: [{ label: 'Rendben', onClick: () => setDeleteModalOpen(false), startIcon: <CloseIcon /> }]
            });
        } finally {
            setDeleteModalOpen(true);
            setLoading(false);
        }
    }

    if (loading) {
        return <LoadingCircle />;
    }

    return (
        <TableContainer component={Paper} sx={{ padding: 6, width: '90vw', marginLeft: 'auto', marginRight: 'auto', marginTop: 6, marginBottom: 6 }}>
            <Table sx={{ width: '80vw', marginLeft: 'auto', marginRight: 'auto' }} aria-label="employee table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Vezetéknév</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Keresztnév</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Cím</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Telefonszám</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Felhasználónév</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Szerepkör</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Státusz</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Adatok módosítása</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Felhasználó törlése</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {employees.map((employee) => (
                        <TableRow key={employee.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">{employee.lastName}</TableCell>
                            <TableCell>{employee.firstName}</TableCell>
                            <TableCell>{employee.city} {employee.postalCode}, {employee.address}</TableCell>
                            <TableCell>{employee.email}</TableCell>
                            <TableCell>{employee.phoneNumber}</TableCell>
                            <TableCell>{employee.userName}</TableCell>
                            <TableCell>{employee.role}</TableCell>
                            <TableCell sx={{ color: employee.emailConfirmed ? "green" : "red" }}>
                                {employee.emailConfirmed ? "Aktív" : "Inaktív"}
                            </TableCell>
                            <TableCell>
                                <Button variant='outlined' color='info' onClick={() => { setUpdateModalOpen(true); setUpdateModalUser(employee); }} startIcon={<EditIcon />}>Módosítás</Button>
                            </TableCell>
                            <TableCell>
                                <Button variant='outlined' color='error' onClick={() => handleDeleteEmployee(employee)} startIcon={<PersonRemoveIcon />}>Törlés</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {updateModalOpen && <UpdateEmployeeModal open={updateModalOpen} onClose={() => setUpdateModalOpen(false)} selectedEmployee={updateModalUser} />}
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

export default Employees;
