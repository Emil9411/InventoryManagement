import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Box, Typography, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { LoadingButton } from '@mui/lab';
import MessageModal from '../components/MessageModal';

function Verification() {
    const { userId } = useParams();
    const [verificationCode, setVerificationCode] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', message: '', actions: [] });
    const [loading, setLoading] = useState(false);  // State to manage the loading state
    const navigate = useNavigate();

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    async function handleSubmit(event) {
        event.preventDefault();
        if (!verificationCode) {
            setModalContent({
                title: "Visszaigazolás sikertelen",
                message: "A visszaigazoló kód megadása kötelező",
                actions: [{ label: 'OK', onClick: handleCloseModal, color: 'warning', startIcon: <CloseIcon /> }]
            });
            setIsModalOpen(true);
            return;
        }

        setLoading(true);  // Start loading
        try {
            const response = await fetch(`/api/auth/verify/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ verificationCode }),
            });

            if (response.ok) {
                setModalContent({
                    title: "Email-cím sikeresen visszaigazolva",
                    message: "",
                    actions: [{
                        label: 'OK', onClick: () => {
                            handleCloseModal();
                            navigate("/login");
                        }, color: 'success', startIcon: <DoneIcon />
                    }]
                });
            } else {
                const errorData = await response.text();
                setModalContent({
                    title: "Visszaigazolás sikertelen",
                    message: "Helytelen adatok: " + errorData,
                    actions: [{ label: 'OK', onClick: handleCloseModal, color: 'error', startIcon: <CloseIcon /> }]
                });
            }
        } catch (error) {
            console.error(error);
            setModalContent({
                title: "Visszaigazolás sikertelen",
                message: "Hiba történt: " + error.message,
                actions: [{ label: 'OK', onClick: handleCloseModal, color: 'error', startIcon: <CloseIcon /> }]
            });
        } finally {
            setLoading(false);  // Stop loading
            setIsModalOpen(true);
        }
    }

    return (
        <Grid container justifyContent="center" alignItems="center" style={{ marginTop: '5%', marginBottom: '5%' }}>
            <Grid item xs={12} sm={8} md={4}>
                <Box p={3} boxShadow={3} borderRadius={2} bgcolor="background.paper">
                    <Typography variant="h5" component="h1" align="center" gutterBottom>
                        Email-cím visszaigazolása
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Visszaigazoló kód"
                            variant="outlined"
                            margin="normal"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                        />
                        <Box mt={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <LoadingButton
                                size="large"
                                variant="contained"
                                type="submit"
                                color="primary"
                                startIcon={<VerifiedUserIcon />}
                                loading={loading}  // Loading state
                                loadingPosition="start"
                            >
                                Visszaigazolás
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

export default Verification;
