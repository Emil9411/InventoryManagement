import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import "../index.css";
import swal from 'sweetalert';

function Registration() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");
    const [formSubmitted, setFormSubmitted] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        setFormSubmitted(true);
        if (!email || !password || !username || !role) {
            return;
        }
        try {
            const response = await fetch("api/auth/register", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    username,
                    password,
                    role
                }),
            });

            if (response.ok) {
                swal({
                    title: "Sikeres regisztráció",
                    text: "Megerősítő email elküldve",
                    icon: "success",
                    button: "OK"
                }).then(() => {
                    navigate("/");
                })
            } else {
                swal({
                    title: "Regisztráció sikertelen",
                    text: "Helytelen adatok",
                    icon: "error",
                    button: "OK"
                });
                throw new Error("Registration failed");
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="login-page">
            <h2>Regisztráció</h2>
            <form onSubmit={handleSubmit}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                {formSubmitted && email === "" ? <p style={{ color: "red" }}>Email szükséges</p> : <p>Email:</p>}
                            </td>
                            <td>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {formSubmitted && username === "" ? <p style={{ color: "red" }}>Felhasználónév szükséges</p> : <p>Felhasználónév:</p>}
                            </td>
                            <td>
                                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {formSubmitted && password === "" ? <p style={{ color: "red" }}>Jelszó szükséges</p> : <p>Jelszó:</p>}
                            </td>
                            <td>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {formSubmitted && role === "" ? <p style={{ color: "red" }}>Szerepkör szükséges</p> : <p>Szerepkör:</p>}
                            </td>
                            <td>
                                <select value={role} onChange={(e) => setRole(e.target.value)}>
                                    <option disabled value="">Válassz...</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Manager">Manager</option>
                                    <option value="User">User</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <Button variant='outlined' startIcon={<PersonAddIcon />} type="submit">Regisztráció</Button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    );
}

export default Registration;