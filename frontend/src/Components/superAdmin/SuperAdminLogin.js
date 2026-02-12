import React, { useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { setSuperAdminToken } from "../../utils/superAdminAuth";

export default function SuperAdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await api.post("/api/super-admin/login", {
                email,
                password,
            });

            setSuperAdminToken(res.data.token);
            navigate("/super-admin/admins");
        } catch (err) {
            setError(err.response?.data?.error || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <p style={styles.eyebrow}>Super Admin</p>
                <h2 style={styles.title}>Secure Access</h2>
                <p style={styles.subtitle}>Enter your super admin credentials</p>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleLogin} style={styles.form}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
            "radial-gradient(circle at top, #ffffff 0%, #f6f3ee 40%, #efe9df 100%)",
        padding: 20,
    },
    card: {
        width: "100%",
        maxWidth: 420,
        background: "#fff",
        padding: 30,
        borderRadius: 18,
        boxShadow: "var(--card-shadow)",
    },
    eyebrow: {
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: "0.24em",
        color: "var(--mint-600)",
        fontWeight: 700,
        marginBottom: 10,
    },
    title: { fontSize: 26, fontWeight: 700, marginBottom: 6 },
    subtitle: { color: "var(--ink-600)", marginBottom: 20 },
    form: { display: "flex", flexDirection: "column", gap: 14 },
    input: {
        padding: "12px 14px",
        borderRadius: 12,
        border: "1px solid rgba(15,23,42,0.15)",
        background: "rgba(250, 250, 250, 0.9)",
    },
    button: {
        padding: "12px 14px",
        borderRadius: 12,
        border: "none",
        background: "var(--mint-500)",
        color: "#fff",
        fontWeight: 700,
        cursor: "pointer",
    },
    error: {
        background: "rgba(248,113,113,0.15)",
        color: "#b91c1c",
        padding: 12,
        borderRadius: 12,
        marginBottom: 14,
        fontWeight: 600,
    },
};
