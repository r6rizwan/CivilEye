import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminInvestigators() {
    const navigate = useNavigate();
    const [investigators, setInvestigators] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadInvestigators = async () => {
        try {
            const res = await axios.get("http://localhost:7000/api/investigators");
            setInvestigators(res.data);
        } catch (err) {
            console.error("Failed to load investigators", err);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
        try {
            await axios.put(`http://localhost:7000/api/investigators/${id}`, {
                status: newStatus,
            });
            loadInvestigators();
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    useEffect(() => {
        loadInvestigators();
    }, []);

    if (loading) {
        return <p style={styles.center}>Loading investigators…</p>;
    }

    return (
        <div style={styles.page}>
            {/* HEADER */}
            <div style={styles.headerRow}>
                <div>
                    <h2 style={styles.title}>Investigators</h2>
                    <p style={styles.subtitle}>
                        Manage investigators and their availability
                    </p>
                </div>

                <button
                    style={styles.primaryBtn}
                    onClick={() => navigate("/admin/investigators/add")}
                >
                    + Add Investigator
                </button>
            </div>

            {/* TABLE CARD */}
            <div style={styles.card}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Department</th>
                            <th>Status</th>
                            <th style={{ textAlign: "right" }}>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {investigators.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={styles.empty}>
                                    No investigators found.
                                </td>
                            </tr>
                        ) : (
                            investigators.map((inv, index) => (
                                <tr
                                    key={inv._id}
                                    style={{
                                        background:
                                            index % 2 === 0 ? "#FAFBFF" : "#FFFFFF",
                                    }}
                                >
                                    <td>{inv.name}</td>
                                    <td>{inv.email}</td>
                                    <td>{inv.phone}</td>
                                    <td>{inv.department}</td>
                                    <td>
                                        <span
                                            style={{
                                                ...styles.badge,
                                                background:
                                                    inv.status === "Active"
                                                        ? "#2E7D32"
                                                        : "#9E9E9E",
                                            }}
                                        >
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        <button
                                            style={
                                                inv.status === "Active"
                                                    ? styles.disableBtn
                                                    : styles.enableBtn
                                            }
                                            onClick={() =>
                                                toggleStatus(inv._id, inv.status)
                                            }
                                        >
                                            {inv.status === "Active"
                                                ? "Disable"
                                                : "Enable"}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* ---------------- STYLES ---------------- */

const styles = {
    page: {
        padding: 30,
        background: "#F4F6FF",
        minHeight: "100vh",
    },

    headerRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 25,
    },

    title: {
        fontSize: 28,
        fontWeight: 700,
    },

    subtitle: {
        color: "#666",
        marginTop: 4,
    },

    primaryBtn: {
        background: "#304FFE",
        color: "#fff",
        padding: "12px 22px",
        borderRadius: 10,
        border: "none",
        fontWeight: 600,
        cursor: "pointer",
        boxShadow: "0 6px 14px rgba(48,79,254,0.3)",
    },

    card: {
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 8px 26px rgba(0,0,0,0.08)",
        overflow: "hidden",
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
    },

    th: {},

    td: {},

    badge: {
        color: "#fff",
        padding: "6px 14px",
        borderRadius: 999,
        fontWeight: 600,
        fontSize: 13,
        display: "inline-block",
        minWidth: 80,
        textAlign: "center",
    },

    enableBtn: {
        background: "#E8F5E9",
        color: "#2E7D32",
        border: "1px solid #C8E6C9",
        padding: "6px 14px",
        borderRadius: 8,
        fontWeight: 600,
        cursor: "pointer",
    },

    disableBtn: {
        background: "#FCE4EC",
        color: "#C2185B",
        border: "1px solid #F8BBD0",
        padding: "6px 14px",
        borderRadius: 8,
        fontWeight: 600,
        cursor: "pointer",
    },

    empty: {
        textAlign: "center",
        padding: 40,
        color: "#777",
        fontWeight: 600,
    },

    center: {
        textAlign: "center",
        marginTop: 60,
        fontWeight: 600,
    },
};

/* TABLE HEADER STYLES */
styles.table && (styles.table.thead = {});
