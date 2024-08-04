import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import "../index.css";
import swal from 'sweetalert';

function Verification() {
    const { userId } = useParams();
    const [verificationCode, setVerificationCode] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        if (!verificationCode) {
            swal({
                title: "Visszaigazolás sikertelen",
                text: "A visszaigazoló kód megadása kötelező",
                icon: "warning",
                button: "OK"
            });
            return;
        }
        try {
            const response = await fetch(`/api/auth/verify/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    verificationCode: verificationCode
                }),
            });

            if (response.ok) {
                swal({
                    title: "Email-cím sikeresen visszaigazolva",
                    icon: "success",
                    button: "OK"
                }).then(() => {
                    navigate("/login");
                });
            } else {
                const errorData = await response.text();
                swal({
                    title: "Visszaigazolás sikertelen",
                    text: "Helytelen adatok: " + errorData,
                    icon: "error",
                    button: "OK"
                });
            }
        } catch (error) {
            console.error(error);
            swal({
                title: "Visszaigazolás sikertelen",
                text: "Hiba történt: " + error.message,
                icon: "error",
                button: "OK"
            });
        }
    }

    return (
        <div className="login-page">
            <form onSubmit={handleSubmit}>
                <h2>Email-cím visszaigazolása</h2>
                <label>
                    <input
                        type="text"
                        placeholder="Visszaigazoló kód"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                    />
                </label>
                <Button type="submit">Visszaigazolás</Button>
            </form>
        </div>
    );
}

export default Verification;
