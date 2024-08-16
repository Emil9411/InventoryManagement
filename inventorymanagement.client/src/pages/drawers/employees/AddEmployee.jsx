import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Select, MenuItem, Typography, Grid, Paper, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import CloseIcon from '@mui/icons-material/Close';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import MessageModal from '../../../components/MessageModal';
import LoadingCircle from '../../../components/LoadingCircle';
import "../../../index.css";

function AddEmployee() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");
    const [inventories, setInventories] = useState([]);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [modalState, setModalState] = useState({
        open: false,
        title: '',
        message: '',
        actions: []
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    async function getInventories() {
        try {
            const response = await fetch("api/inventory/all", {
                method: "GET",
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                if (data.length > 0) {
                    setInventories(data);
                } else {
                    setModalState({
                        open: true,
                        title: "Nincs raktár létrehozva",
                        message: "Alkalmazott hozzáadása előtt szükséges raktárt létrehozni",
                        actions: [
                            {
                                label: 'Új Raktár Létrehozása',
                                onClick: () => {
                                    setModalState({ ...modalState, open: false });
                                    navigate("/addwarehouse");
                                },
                                color: 'primary',
                                startIcon: <AddLocationAltIcon />
                            }
                        ]
                    });
                }
            } else {
                throw new Error("Failed to fetch inventories");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getInventories();
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        setFormSubmitted(true);
        setIsSubmitting(true);
        if (!email || !password || !username || !role) {
            setIsSubmitting(false);
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
                setModalState({
                    open: true,
                    title: "Regisztráció sikeres",
                    message: "Megerősító email a megadott címre elküldve.",
                    actions: [
                        {
                            label: 'OK',
                            onClick: () => {
                                setModalState({ ...modalState, open: false });
                                navigate("/");
                            },
                            color: 'success',
                            startIcon: <HowToRegIcon />
                        }
                    ]
                });
            } else {
                setModalState({
                    open: true,
                    title: "Registráció sikertelen",
                    message: "Helytelen adatok.",
                    actions: [
                        {
                            label: 'OK',
                            onClick: () => setModalState({ ...modalState, open: false }),
                            color: 'error',
                            startIcon: <CloseIcon />
                        }
                    ]
                });
            }
        } catch (error) {
            console.error(error);
            setModalState({
                open: true,
                title: "Registráció sikertelen",
                message: "Váratlan hiba történt.",
                actions: [
                    {
                        label: 'OK',
                        onClick: () => setModalState({ ...modalState, open: false }),
                        color: 'error',
                        startIcon: <CloseIcon />
                    }
                ]
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    if (loading) {
        return <LoadingCircle />;
    }

    return (
        <>
            <Box display="flex" alignItems="center" justifyContent="center" minHeight="fit-content">
                <Paper elevation={3} sx={{ margin: 6, padding: 6, maxWidth: 600, width: '100%' }}>
                    <Typography variant="h3" align="center" gutterBottom>Alkalmazott hozzáadása</Typography>
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
                        {inventories.length > 0 && (
                            <Grid item xs={12}>
                                <Typography>Melyik raktár:</Typography>
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
                                    {inventories.map((inventory) => (
                                        <MenuItem key={inventory.id} value={inventory.id}>{inventory.name}</MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <LoadingButton
                                fullWidth
                                variant="outlined"
                                startIcon={<PersonAddIcon />}
                                loading={isSubmitting}
                                onClick={handleSubmit}
                            >
                                Hozzáadás
                            </LoadingButton>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
            <MessageModal
                open={modalState.open}
                onClose={() => setModalState({ ...modalState, open: false })}
                title={modalState.title}
                actions={modalState.actions}
            >
                <Typography>{modalState.message}</Typography>
            </MessageModal>
        </>
    );
}

export default AddEmployee;
