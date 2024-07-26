import { useState, useEffect } from 'react';
import '../index.css';
import swal from 'sweetalert';

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

    function handleUpdateEmployeeData(selectedEmployee) {
        const container = document.createElement("div");
        container.innerHTML = `
            <table>
                <tbody>
                    <tr>
                        <td>Vezetéknév:</td>
                        <td><input type="text" id="lastName" value="${selectedEmployee.lastName === null ? "" : selectedEmployee.lastName}"></td>
                    </tr>
                    <tr>
                        <td>Keresztnév:</td>
                        <td><input type="text" id="firstName" value="${selectedEmployee.firstName == null ? "" : selectedEmployee.firstName}"></td>
                    </tr>
                    <tr>
                        <td>Város:</td>
                        <td><input type="text" id="city" value="${selectedEmployee.city == null ? "" : selectedEmployee.city}"></td>
                    </tr>
                    <tr>
                        <td>Irányítószám:</td>
                        <td><input type="text" id="postalCode" value="${selectedEmployee.postalCode == null ? "" : selectedEmployee.postalCode}"></td>
                    </tr>
                    <tr>
                        <td>Cím:</td>
                        <td><input type="text" id="address" value="${selectedEmployee.address == null ? "" : selectedEmployee.address}"></td>
                    </tr>
                    <tr>
                        <td>Telefonszám:</td>
                        <td><input type="text" id="phoneNumber" value="${selectedEmployee.phoneNumber == null ? "" : selectedEmployee.phoneNumber}"></td>
                    </tr>
                    <tr>
                        <td>Email:</td>
                        <td><input type="text" id="email" value="${selectedEmployee.email}"></td>
                    </tr>
                    <tr>
                        <td>Felhasználónév:</td>
                        <td><input type="text" id="userName" value="${selectedEmployee.userName}"></td>
                    </tr>
                    <tr>
                        <td>Szerepkör:</td>
                        <td><input type="text" id="role" value="${selectedEmployee.role}" disabled></td>
                    </tr>
                    <tr>
                        <td>Státusz:</td>
                        <td><input type="text" id="emailConfirmed" value="${selectedEmployee.emailConfirmed ? "Aktív" : "Inaktív"}" disabled></td>
                    </tr>
                </tbody>
            </table>
        `;

        swal({
            text: "Munkatárs adatainak módosítása",
            content: container,
            buttons: {
                cancel: "Mégse",
                confirm: {
                    text: "Módosítás",
                    closeModal: false,
                },
            },
        }).then((value) => {
            if (value) {
                swal({
                    text: "Biztosan módosítja a munkatárs adatait?",
                    buttons: {
                        cancel: "Mégse",
                        confirm: {
                            text: "Módosítás",
                            closeModal: false,
                        },
                    },
                }).then(async (value) => {
                    if (value) {
                        const updatedEmployeeData = {
                            id: selectedEmployee.id,
                            lastName: container.querySelector("#lastName").value,
                            firstName: container.querySelector("#firstName").value,
                            city: container.querySelector("#city").value,
                            postalCode: container.querySelector("#postalCode").value,
                            address: container.querySelector("#address").value,
                            phoneNumber: container.querySelector("#phoneNumber").value,
                            email: container.querySelector("#email").value,
                            userName: container.querySelector("#userName").value,
                            role: container.querySelector("#role").value,
                            emailConfirmed: container.querySelector("#emailConfirmed").value === "Aktív",
                        };
                        
                        // Check if any field is empty, if yes, reopens the modification window
                        let hasEmptyField = false;
                        for (const key in updatedEmployeeData) {
                            if (updatedEmployeeData[key] === "") {
                                hasEmptyField = true;
                                break;
                            }
                        }

                        if (hasEmptyField) {
                            swal("Minden mező kitöltése kötelező!", {
                                icon: "error",
                                buttons: {
                                    confirm: {
                                        text: "OK",
                                        closeModal: true,
                                    },
                                },
                            }).then(() => {
                                handleUpdateEmployeeData(selectedEmployee);
                            });
                        } else {
                            try {
                                const response = await fetch("api/auth/update", {
                                    method: "PUT",
                                    credentials: "include",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(updatedEmployeeData),
                                });
                                const data = await response.json();
                                if (data.success) {
                                    swal("Sikeres módosítás!", {
                                        icon: "success",
                                    });
                                    getEmployees();
                                } else {
                                    swal("Hiba történt a módosítás során!", {
                                        icon: "error",
                                    });
                                }
                            } catch (error) {
                                console.error(error);
                            }
                        }
                    } else {
                        swal("A módosítás megszakítva!", {
                            icon: "info",
                        });
                    }
                });
            } else {
                swal("A módosítás megszakítva!", {
                    icon: "info",
                });
            }
        });
    }

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
