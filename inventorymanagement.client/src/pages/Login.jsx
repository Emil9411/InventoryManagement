import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Box, Typography, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import LoginIcon from '@mui/icons-material/Login';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import MessageModal from '../components/MessageModal';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', message: '', actions: [] });
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    async function handleSubmit(event) {
        event.preventDefault();
        setFormSubmitted(true);

        if (!email || !password) {
            setModalContent({
                title: 'Hiba',
                message: 'Minden mező kitöltése kötelező!',
                actions: [{ label: 'OK', onClick: handleCloseModal, startIcon: <CloseIcon /> }]
            });
            setIsModalOpen(true);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                setModalContent({
                    title: 'Sikeres belépés!',
                    message: '',
                    actions: [{
                        label: 'OK', onClick: () => {
                            handleCloseModal();
                            navigate("/");
                        },
                        startIcon: <DoneIcon />,
                    }]
                });
            } else {
                setModalContent({
                    title: 'Bejelentkezés sikertelen',
                    message: 'Helytelen email vagy jelszó.',
                    actions: [{ label: 'OK', onClick: handleCloseModal, startIcon: <CloseIcon /> }]
                });
            }
        } catch (error) {
            console.error(error);
            setModalContent({
                title: 'Hiba',
                message: 'Hiba történt bejelentkezéskor. Kérjük próbálja újra.',
                actions: [{ label: 'OK', onClick: handleCloseModal, startIcon: <CloseIcon /> }]
            });
        } finally {
            setLoading(false);
            setIsModalOpen(true);
        }
    }

    return (
        <Grid container justifyContent="center" alignItems="center" style={{ marginTop: '5%', marginBottom: '5%' }}>
            <Grid item xs={12} sm={8} md={4}>
                <Box p={3} boxShadow={3} borderRadius={2} bgcolor="background.paper">
                    <Typography variant="h4" component="h1" align="center" gutterBottom>
                        Belépés
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            margin="normal"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            error={formSubmitted && email === ""}
                            helperText={formSubmitted && email === "" ? "Email szükséges" : ""}
                        />
                        <TextField
                            fullWidth
                            label="Jelszó"
                            variant="outlined"
                            type="password"
                            margin="normal"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            error={formSubmitted && password === ""}
                            helperText={formSubmitted && password === "" ? "Jelszó szükséges" : ""}
                        />
                        <Box mt={2} display="flex" justifyContent="space-between">
                            <Button
                                variant="outlined"
                                startIcon={<CloseIcon />}
                                onClick={() => navigate("/")}
                                type="button"
                            >
                                Bezár
                            </Button>
                            <LoadingButton
                                variant="contained"
                                startIcon={<LoginIcon />}
                                type="submit"
                                loading={loading}
                                loadingPosition="start"
                            >
                                Belépés
                            </LoadingButton>
                        </Box>
                    </form>
                </Box>
            </Grid>
            <MessageModal
                open={isModalOpen}
                onClose={handleCloseModal}
                title={modalContent.title}
                actions={modalContent.actions}
            >
                <Typography>{modalContent.message}</Typography>
            </MessageModal>
        </Grid>
    );
}

export default Login;
