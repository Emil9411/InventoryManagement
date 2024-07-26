import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
                    //check if any user is logged in
                    const response = fetch("api/auth/check", {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    if (response.ok) {
                        //if any user logged in, logout
                        fetch("api/auth/logout", {
                            method: "POST",
                            credentials: "include",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        });
                        navigate("/login");
                    } else {
                        navigate("/login");
                    }
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
                <button type="submit">Visszaigazolás</button>
            </form>
        </div>
    );
}

export default Verification;
