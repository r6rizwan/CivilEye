import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import {
    clearSuperAdminToken,
    superAdminAuthHeader,
} from "../../utils/superAdminAuth";
import { useNavigate } from "react-router-dom";

export default function AdminManager() {
    const navigate = useNavigate();
    const [admins, setAdmins] = useState([]);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [resetOpen, setResetOpen] = useState(false);
    const [resetAdminId, setResetAdminId] = useState("");
    const [resetPassword, setResetPassword] = useState("");
    const [resetSaving, setResetSaving] = useState(false);

    const loadAdmins = async () => {
        try {
            const res = await api.get(
                "/api/super-admin/admins",
                { headers: superAdminAuthHeader() }
            );
            setAdmins(res.data || []);
        } catch (err) {
            if (err.response?.status === 401) {
                clearSuperAdminToken();
                navigate("/super-admin/login");
                return;
            }
            setError(err.response?.data?.error || "Failed to load admins");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAdmins();
        // eslint-disable-next-line
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setError("");
        setSaving(true);

        try {
            await api.post(
                "/api/super-admin/create-admin",
                { email, password },
                { headers: superAdminAuthHeader() }
            );
            setEmail("");
            setPassword("");
            await loadAdmins();
        } catch (err) {
            setError(err.response?.data?.error || "Failed to create admin");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this admin?")) return;
        setError("");
        try {
            await api.delete(
                `/api/super-admin/admin/${id}`,
                { headers: superAdminAuthHeader() }
            );
            await loadAdmins();
        } catch (err) {
            setError(err.response?.data?.error || "Failed to delete admin");
        }
    };

    const openResetModal = (id) => {
        setResetAdminId(id);
        setResetPassword("");
        setResetOpen(true);
    };

    const handleResetPassword = async () => {
        if (!resetAdminId || !resetPassword.trim()) return;

        setError("");
        setResetSaving(true);
        try {
            await api.post(
                `/api/super-admin/admin/${resetAdminId}/reset-password`,
                { password: resetPassword },
                { headers: superAdminAuthHeader() }
            );
            setResetOpen(false);
            setResetAdminId("");
            setResetPassword("");
            await loadAdmins();
        } catch (err) {
            setError(err.response?.data?.error || "Failed to reset password");
        } finally {
            setResetSaving(false);
        }
    };

    if (loading) {
        return <p style={styles.center}>Loading admins…</p>;
    }

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <div>
                    <p style={styles.eyebrow}>Super Admin</p>
                    <h2 style={styles.title}>Admin Management</h2>
                    <p style={styles.subtitle}>
                        Create and manage admin credentials for the system.
                    </p>
                </div>
            </div>

            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.grid}>
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Create Admin</h3>
                    <form onSubmit={handleCreate} style={styles.form}>
                        <input
                            type="email"
                            placeholder="Admin email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Temporary password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            required
                        />
                        <button type="submit" style={styles.primaryBtn} disabled={saving}>
                            {saving ? "Creating..." : "Create Admin"}
                        </button>
                    </form>
                </div>

                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Existing Admins</h3>
                    {admins.length === 0 ? (
                        <p style={styles.empty}>No admins found.</p>
                    ) : (
                        <div style={styles.list}>
                            {admins.map((a) => (
                                <div key={a._id} style={styles.listRow}>
                                    <div>
                                        <div style={styles.email}>{a.email}</div>
                                        <div style={styles.meta}>
                                            Created: {new Date(a.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div style={styles.actions}>
                                        <button
                                            style={styles.secondaryBtn}
                                            onClick={() => openResetModal(a._id)}
                                        >
                                            Reset Password
                                        </button>
                                        <button
                                            style={styles.dangerBtn}
                                            onClick={() => handleDelete(a._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {resetOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h3 style={styles.modalTitle}>Reset Admin Password</h3>
                        <p style={styles.modalText}>
                            Set a new password for this admin. This takes effect immediately.
                        </p>
                        <input
                            type="password"
                            placeholder="New password"
                            value={resetPassword}
                            onChange={(e) => setResetPassword(e.target.value)}
                            style={styles.modalInput}
                        />
                        <div style={styles.modalActions}>
                            <button
                                style={styles.secondaryBtn}
                                onClick={() => setResetOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                style={styles.primaryBtn}
                                onClick={handleResetPassword}
                                disabled={resetSaving || !resetPassword.trim()}
                            >
                                {resetSaving ? "Resetting..." : "Reset Password"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        padding: 30,
        background:
            "radial-gradient(circle at top, #ffffff 0%, #f6f3ee 40%, #efe9df 100%)",
    },
    header: {
        marginBottom: 20,
    },
    eyebrow: {
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: "0.24em",
        color: "var(--mint-600)",
        fontWeight: 700,
        marginBottom: 8,
    },
    title: { fontSize: 28, fontWeight: 700, marginBottom: 6 },
    subtitle: { color: "var(--ink-600)" },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 18,
    },
    card: {
        background: "#fff",
        padding: 24,
        borderRadius: 18,
        boxShadow: "var(--card-shadow)",
    },
    cardTitle: { fontSize: 18, fontWeight: 700, marginBottom: 14 },
    form: { display: "flex", flexDirection: "column", gap: 12 },
    input: {
        padding: "12px 14px",
        borderRadius: 12,
        border: "1px solid rgba(15,23,42,0.15)",
        background: "rgba(250, 250, 250, 0.9)",
    },
    primaryBtn: {
        background: "var(--mint-500)",
        color: "#fff",
        border: "none",
        borderRadius: 12,
        padding: "12px 16px",
        fontWeight: 700,
        cursor: "pointer",
    },
    list: { display: "flex", flexDirection: "column", gap: 12 },
    listRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: "1px solid rgba(15,23,42,0.08)",
    },
    actions: {
        display: "flex",
        gap: 8,
        alignItems: "center",
    },
    email: { fontWeight: 700 },
    meta: { fontSize: 12, color: "var(--ink-600)" },
    dangerBtn: {
        background: "rgba(248, 113, 113, 0.16)",
        color: "#b91c1c",
        border: "1px solid rgba(248, 113, 113, 0.3)",
        padding: "8px 12px",
        borderRadius: 10,
        fontWeight: 600,
        cursor: "pointer",
    },
    secondaryBtn: {
        background: "rgba(15, 23, 42, 0.08)",
        color: "var(--ink-900)",
        border: "1px solid rgba(15, 23, 42, 0.12)",
        padding: "8px 12px",
        borderRadius: 10,
        fontWeight: 600,
        cursor: "pointer",
    },
    empty: { color: "var(--ink-600)" },
    error: {
        background: "rgba(248,113,113,0.15)",
        color: "#b91c1c",
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
        fontWeight: 600,
    },
    modalOverlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(11,18,32,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
    },
    modal: {
        background: "#fff",
        padding: 24,
        borderRadius: 16,
        width: 420,
        boxShadow: "var(--card-shadow)",
    },
    modalTitle: { margin: 0, fontSize: 20, fontWeight: 700 },
    modalText: { color: "var(--ink-600)", marginTop: 8 },
    modalInput: {
        width: "100%",
        marginTop: 16,
        padding: "12px 14px",
        borderRadius: 12,
        border: "1px solid rgba(15,23,42,0.15)",
        background: "rgba(250, 250, 250, 0.9)",
    },
    modalActions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: 10,
        marginTop: 18,
    },
    center: {
        textAlign: "center",
        marginTop: 40,
        fontWeight: 600,
    },
};
