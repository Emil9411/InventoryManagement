import { useNavigate, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import swal from 'sweetalert';

function LogoutButton() {
    const navigate = useNavigate();
    const location = useLocation();

    async function handleLogout() {
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
                if (location.pathname !== "/") {
                    swal({
                        title: "Sikeres kilépés",
                        icon: "success",
                        button: "OK"
                    }).then(() => {
                        navigate("/");
                        window.location.reload();
                    })
                } else {
                    swal({
                        title: "Sikeres kilépés",
                        icon: "success",
                        button: "OK"
                    }).then(() => {
                        window.location.reload();
                    })
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <>
            <Button onClick={handleLogout} startIcon={<LogoutIcon />}>Kilépés</Button>
        </>
    );
}

export default LogoutButton;