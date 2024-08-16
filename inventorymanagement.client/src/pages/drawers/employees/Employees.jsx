import { useState, useEffect } from 'react';
import { Button, Table, Paper, TableRow, TableHead, TableContainer, TableCell, TableBody } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import LoadingCircle from '../../../components/LoadingCircle';
import '../../../index.css';
import swal from 'sweetalert';
import UpdateEmployeeModal from '../../../utils/employeeUpdate.jsx';

function Employees() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalUser, setModalUser] = useState(null);

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
        swal({
            text: "Biztosan törli a munkatársat?",
            buttons: {
                cancel: "Mégse",
                confirm: {
                    text: "Törlés",
                    closeModal: false,
                },
            },
        }).then(async (value) => {
            if (value) {
                try {
                    const response = await fetch(`api/auth/delete/${selectedEmployee.email}`, {
                        method: "DELETE",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    const data = await response.json();
                    if (data.success) {
                        swal("Sikeres törlés!", {
                            icon: "success",
                        });
                        getEmployees();
                    } else {
                        swal("Hiba történt a törlés során!", {
                            icon: "error",
                        });
                    }
                } catch (error) {
                    console.error(error);
                }
            } else {
                swal("A törlés megszakítva!", {
                    icon: "info",
                });
            }
        });
    }

    if (loading) {
        return (
            <LoadingCircle />
        );
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
                                    <Button variant='outlined' color='info' onClick={() => { setModalOpen(true); setModalUser(employee); }} startIcon={<EditIcon />}>Módosítás</Button>
                                </TableCell>
                                <TableCell>
                                    <Button variant='outlined' color='error' onClick={() => handleDeleteEmployee(employee)} startIcon={<PersonRemoveIcon />}>Törlés</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
            </Table>
            {modalOpen && <UpdateEmployeeModal open={modalOpen} onClose={() => setModalOpen(false)} selectedEmployee={modalUser} />} }
            </TableContainer>
    );
}

export default Employees;
