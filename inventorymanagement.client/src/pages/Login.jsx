import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import CloseIcon from '@mui/icons-material/Close';
import "../index.css";
import swal from 'sweetalert';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [formSubmitted, setFormSubmitted] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        setFormSubmitted(true);
        if (!email || !password) {
            return;
        }
        try {
            const response = await fetch("api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password
                }),
            });

            if (response.ok) {
                swal({
                    title: "Sikeres belépés",
                    text: "",
                    icon: "success",
                    button: "OK"
                }).then(() => {
                    navigate("/");
                })
            } else {
                swal({
                    title: "Belépés sikertelen",
                    text: "Helytelen email/jelszó",
                    icon: "error",
                    button: "OK"
                });
                throw new Error("Login failed");
            }
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <div className="login-page">
            <h2>Belépés</h2>
            <form onSubmit={handleSubmit}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                {formSubmitted && email === "" ? <p style={{ color: "red" }}>Email szükséges</p> : <p>Email:</p>}
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {formSubmitted && password === "" ? <p style={{ color: "red" }}>Jelszó szükséges</p> : <p>Jelszó:</p>}
                            </td>
                            <td>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Button variant='outlined' startIcon={<CloseIcon />} onClick={() => navigate("/")} type="button">Bezár</Button>
                            </td>
                            <td>
                                <Button variant='outlined' startIcon={<LoginIcon />}type="submit">Belépés</Button>
                            </td>
                        </tr>
                        <tr rowSpan="2">
                            <td colSpan="2"></td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    );
}

export default Login;