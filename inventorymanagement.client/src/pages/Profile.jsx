import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import '../index.css';
import handleUpdateEmployeeData from '../utils/employeeUpdate.jsx';

function Profile() {
    const [user, setUser] = useState(null);

    async function getUser() {
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
    }

    useEffect(() => {
        getUser();
    }, []);

    return (
        <div className="profile">
            <h1>Profil</h1>
            <div className="employee-table">
                <table>
                    <tbody>
                        <tr>
                            <td>Vezetéknév:</td>
                            <td>{user?.lastName}</td>
                        </tr>
                        <tr>
                            <td>Keresztnév:</td>
                            <td>{user?.firstName}</td>
                        </tr>
                        <tr>
                            <td>Város:</td>
                            <td>{user?.city}</td>
                        </tr>
                        <tr>
                            <td>Irányítószám:</td>
                            <td>{user?.postalCode}</td>
                        </tr>
                        <tr>
                            <td>Cím:</td>
                            <td>{user?.address}</td>
                        </tr>
                        <tr>
                            <td>Telefonszám:</td>
                            <td>{user?.phoneNumber}</td>
                        </tr>
                        <tr>
                            <td>Email:</td>
                            <td>{user?.email}</td>
                        </tr>
                        <tr>
                            <td>Szerepkör:</td>
                            <td>{user?.role}</td>
                        </tr>
                    </tbody>
                </table>
                <Button onClick={() => handleUpdateEmployeeData(user)}>Adatok módosítása</Button>
            </div>
        </div>
    );
}

export default Profile;