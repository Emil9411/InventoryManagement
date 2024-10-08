﻿import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Button, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import MessageModal from './MessageModal';

function LogoutButton() {
    const navigate = useNavigate();
    const location = useLocation();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpen = () => {
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
    };

    const handleConfirm = async () => {
        try {
            const response = await fetch("api/auth/logout", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Logout failed");
            } else {
                setIsModalOpen(false);
                if (location.pathname !== "/") {
                    navigate("/");
                }
                window.location.reload();
            }
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    return (
        <>
            <Button sx={{ mx: 1 }} onClick={handleOpen} startIcon={<LogoutIcon />}>
                Kilépés
            </Button>
            <MessageModal
                open={isModalOpen}
                onClose={handleClose}
                title="Kilépés"
                actions={[
                    { label: 'Kilépés', onClick: handleConfirm, color: 'primary', startIcon: <LogoutIcon /> },
                    { label: 'Bezár', onClick: handleClose , color: 'secondary', startIcon: <CloseIcon /> }
                ]}
            >
                <Typography>Biztosan ki szeretne lépni?</Typography>
            </MessageModal>
        </>
    );
}

export default LogoutButton;
