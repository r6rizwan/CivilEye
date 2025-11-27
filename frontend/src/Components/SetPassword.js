import React, { useState } from "react";
import axios from "axios";

export default function SetPassword() {

    const query = new URLSearchParams(window.location.search);
    const emailFromOtp = query.get("email") || "";

    const [email] = useState(emailFromOtp);  // email locked
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            await axios.post("http://localhost:7000/api/create-password", {
                email,
                password
            });

            setSuccess("Password created successfully! Redirecting to login...");

            setTimeout(() => {
                window.location.href = "/login";
            }, 1000);

        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong");
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>

                <h2 style={styles.title}>Set Your Password</h2>
                <p style={styles.subtitle}>For: {email}</p>

                {error && <p style={styles.error}>{error}</p>}
                {success && <p style={styles.success}>{success}</p>}

                <form onSubmit={handleSubmit} style={styles.form}>

                    <input
                        type="password"
                        style={styles.input}
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        style={styles.input}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <button style={styles.button} type="submit">
                        Save Password
                    </button>

                </form>

            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0eaff, #f6f9ff)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        width: "400px",
        background: "#fff",
        padding: "30px",
        borderRadius: "16px",
        boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
    },
    title: {
        textAlign: "center",
        fontSize: "24px",
        fontWeight: "700",
    },
    subtitle: {
        textAlign: "center",
        marginTop: "6px",
        color: "#555",
        marginBottom: "20px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
    input: {
        padding: "14px",
        borderRadius: "10px",
        border: "1px solid #d2dae6",
        background: "#fafafa",
        fontSize: "15px",
    },
    button: {
        padding: "14px",
        border: "none",
        borderRadius: "10px",
        background: "#4B6FFF",
        color: "#fff",
        fontWeight: "600",
        cursor: "pointer",
        marginTop: "10px",
    },
    error: {
        color: "#e63946",
        textAlign: "center",
        fontWeight: 600,
    },
    success: {
        color: "#2ea44f",
        textAlign: "center",
        fontWeight: 600,
    },
};
