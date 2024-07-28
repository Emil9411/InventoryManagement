import { useState, useEffect } from 'react';
import '../index.css';
import swal from 'sweetalert';
import handleUpdateEmployeeData from '../utils/employeeUpdate.jsx';

function Employees() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

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
            <>
                <br />
                <div className="spinner"></div>
            </>
        );
    }

    return (
        <div className="employee-table">
            <table>
                <thead>
                    <tr>
                        <th>Vezetéknév</th>
                        <th>Keresztnév</th>
                        <th>Cím</th>
                        <th>Email</th>
                        <th>Telefonszám</th>
                        <th>Felhasználónév</th>
                        <th>Szerepkör</th>
                        <th>Státusz</th>
                        <th>Adatok módosítása</th>
                        <th>Felhasználó törlése</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.id}>
                            <td>{employee.lastName}</td>
                            <td>{employee.firstName}</td>
                            <td>{employee.city} {employee.postalCode}, {employee.address}</td>
                            <td>{employee.email}</td>
                            <td>{employee.phoneNumber}</td>
                            <td>{employee.userName}</td>
                            <td>{employee.role}</td>
                            <td style={{ color: employee.emailConfirmed ? "green" : "red" }}>
                                {employee.emailConfirmed ? "Aktív" : "Inaktív"}
                            </td>
                            <td>
                                <button className="edit-button" onClick={() => handleUpdateEmployeeData(employee)}>Módosítás</button>
                            </td>
                            <td>
                                <button className="delete-button" onClick={() => handleDeleteEmployee(employee)}>Törlés</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Employees;
