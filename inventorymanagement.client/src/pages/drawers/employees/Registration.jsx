import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Select, MenuItem, Typography, Grid, Paper, Box } from '@mui/material';
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';
import swal from 'sweetalert';
import "../../../index.css";

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
                });
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
        <Box display="flex" alignItems="center" justifyContent="center" minHeight="fit-content">
            <Paper elevation={3} sx={{ maring: 6, padding: 6, maxWidth: 400, width: '100%' }}>
                <Typography variant="h3" align="center" gutterBottom>Regisztráció</Typography>
                <Grid container spacing={2} direction="column" justifyContent="center" alignItems="center">
                    <Grid item xs={12}>
                        {formSubmitted && email === "" ? (
                            <Typography color="error">Email szükséges</Typography>
                        ) : (
                            <Typography>Email:</Typography>
                        )}
                        <TextField
                            fullWidth
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {formSubmitted && username === "" ? (
                            <Typography color="error">Felhasználónév szükséges</Typography>
                        ) : (
                            <Typography>Felhasználónév:</Typography>
                        )}
                        <TextField
                            fullWidth
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {formSubmitted && password === "" ? (
                            <Typography color="error">Jelszó szükséges</Typography>
                        ) : (
                            <Typography>Jelszó:</Typography>
                        )}
                        <TextField
                            fullWidth
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {formSubmitted && role === "" ? (
                            <Typography color="error">Szerepkör szükséges</Typography>
                        ) : (
                            <Typography>Szerepkör:</Typography>
                        )}
                        <Select
                            fullWidth
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            displayEmpty
                            variant="outlined"
                        >
                            <MenuItem disabled value="">
                                <em>Válassz...</em>
                            </MenuItem>
                            <MenuItem value="Admin">Admin</MenuItem>
                            <MenuItem value="Manager">Manager</MenuItem>
                            <MenuItem value="User">User</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<PersonAddIcon />}
                            onClick={handleSubmit}
                        >
                            Regisztráció
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}

export default Registration;
