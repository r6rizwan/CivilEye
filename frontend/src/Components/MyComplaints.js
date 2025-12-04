import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    const email = localStorage.getItem("email");

    useEffect(() => {
        if (!email) return;

        const fetchComplaints = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:7000/api/complaint/user/${email}`
                );
                setComplaints(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching complaints:", error);
                setLoading(false);
            }
        };

        fetchComplaints();
    }, [email]);

    const statusColor = {
        Pending: "#F59E0B",
        Assigned: "#1E88E5",
        Open: "#7E57C2",
        Resolved: "#2E7D32",
        Closed: "#D32F2F",
    };

    if (loading) {
        return (
            <p style={{ textAlign: "center", marginTop: "60px", fontSize: "18px" }}>
                Loading your complaints…
            </p>
        );
    }

    return (
        <div style={styles.page}>
            <div style={styles.wrapper}>
                <h2 style={styles.title}>My Complaints</h2>

                {complaints.length === 0 ? (
                    <p style={styles.noData}>No complaints filed yet.</p>
                ) : (
                    <div style={styles.grid}>
                        {complaints.map((c) => (
                            <div key={c._id} style={styles.card}>
                                {/* TITLE + STATUS */}
                                <div style={styles.headerRow}>
                                    <span style={styles.complaintId}>{c.complaintId}</span>

                                    <span
                                        style={{
                                            ...styles.statusBadge,
                                            background: statusColor[c.status] || "#555",
                                        }}
                                    >
                                        {c.status}
                                    </span>
                                </div>

                                {/* TYPE */}
                                <p style={styles.type}>{c.complaintType}</p>

                                {/* DATE */}
                                <p style={styles.infoText}>
                                    <strong>Date:</strong>{" "}
                                    {new Date(c.createdAt).toLocaleDateString()}
                                </p>

                                {/* ASSIGNED */}
                                <p style={styles.infoText}>
                                    <strong>Assigned To:</strong>{" "}
                                    {c.assignedTo || "Not Assigned"}
                                </p>

                                {/* VIEW BUTTON */}
                                <button
                                    style={styles.viewBtn}
                                    onClick={() =>
                                        (window.location.href = `/complaint/${c._id}`)
                                    }
                                >
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ------------------- STYLES -------------------- */
const styles = {
    page: {
        minHeight: "100vh",
        padding: "40px 20px",
        background: "linear-gradient(135deg, #e0eaff, #f6f9ff)",
        display: "flex",
        justifyContent: "center",
    },

    wrapper: {
        width: "100%",
        maxWidth: "1100px",
    },

    title: {
        fontSize: "30px",
        fontWeight: "700",
        marginBottom: "25px",
        color: "#1a1a1a",
    },

    noData: {
        textAlign: "center",
        fontSize: "18px",
        color: "#555",
        marginTop: "20px",
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "20px",
    },

    card: {
        background: "#ffffff",
        padding: "20px",
        borderRadius: "16px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        border: "1px solid #e1e7ff",
        display: "flex",
        flexDirection: "column",
    },

    headerRow: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "10px",
    },

    complaintId: {
        fontWeight: "700",
        fontSize: "16px",
    },

    statusBadge: {
        padding: "6px 12px",
        borderRadius: "10px",
        fontSize: "13px",
        fontWeight: "600",
        color: "white",
    },

    type: {
        fontSize: "17px",
        fontWeight: "600",
        marginBottom: "12px",
    },

    infoText: {
        fontSize: "14px",
        marginBottom: "6px",
        color: "#333",
    },

    viewBtn: {
        marginTop: "15px",
        padding: "10px",
        background: "#304FFE",
        color: "white",
        border: "none",
        borderRadius: "10px",
        fontWeight: "600",
        cursor: "pointer",
        fontSize: "15px",
    },
};
