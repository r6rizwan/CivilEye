import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function ComplaintDetails() {
    const { id } = useParams();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadComplaint = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:7000/api/complaint/${id}`
                );
                setComplaint(res.data);
            } catch (error) {
                console.error("Error loading complaint:", error);
            } finally {
                setLoading(false);
            }
        };

        loadComplaint();
    }, [id]);

    if (loading) {
        return <p style={styles.loading}>Loading complaint details…</p>;
    }

    if (!complaint) {
        return <p style={styles.error}>Complaint not found.</p>;
    }

    const statusColor = {
        Pending: "#ff9800",
        Assigned: "#1565c0",
        Resolved: "#2e7d32",
        Closed: "#c62828",
        Open: "#0277bd",
    };

    // Build a safe public URL for the saved filename (stored as filename by server)
    const fileUrl = complaint && complaint.file
        ? `http://localhost:7000/uploads/${String(complaint.file).replace(/\\/g, "/").replace(/^\/+/, "")}`
        : null;

    // Encode URL to handle spaces and other unsafe characters
    const fileUrlEncoded = fileUrl ? encodeURI(fileUrl) : null;

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h2 style={styles.title}>Complaint Details</h2>

                {/* Complaint ID */}
                <div style={styles.row}>
                    <span style={styles.label}>Complaint ID:</span>
                    <span style={styles.value}>{complaint.complaintId}</span>
                </div>

                {/* Complaint Type */}
                <div style={styles.row}>
                    <span style={styles.label}>Type:</span>
                    <span style={styles.value}>{complaint.complaintType}</span>
                </div>

                {/* Status */}
                <div style={styles.row}>
                    <span style={styles.label}>Status:</span>
                    <span
                        style={{
                            ...styles.statusBadge,
                            background: statusColor[complaint.status] || "#444",
                        }}
                    >
                        {complaint.status}
                    </span>
                </div>

                {/* Description */}
                <div style={styles.column}>
                    <span style={styles.label}>Description:</span>
                    <p style={styles.description}>{complaint.description}</p>
                </div>

                {/* Attachment */}
                <div style={styles.row}>
                    <span style={styles.label}>Attachment:</span>
                    {complaint.file ? (
                        <a
                            href={fileUrlEncoded}
                            target="_blank"
                            rel="noreferrer"
                            style={styles.fileLink}
                        >
                            View File
                        </a>
                    ) : (
                        <span style={styles.value}>No file uploaded</span>
                    )}
                </div>

                {/* Assigned To */}
                <div style={styles.row}>
                    <span style={styles.label}>Assigned Officer:</span>
                    <span style={styles.value}>
                        {complaint.assignedTo || "Not Assigned"}
                    </span>
                </div>

                {/* Created Date */}
                <div style={styles.row}>
                    <span style={styles.label}>Filed On:</span>
                    <span style={styles.value}>
                        {new Date(complaint.createdAt).toLocaleString()}
                    </span>
                </div>

                {/* Solution */}
                <div style={styles.column}>
                    <span style={styles.label}>Solution / Remarks:</span>
                    <p style={styles.solution}>
                        {complaint.solution || "No solution provided yet."}
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ====================== STYLES ====================== */

const styles = {
    page: {
        minHeight: "100vh",
        padding: "30px",
        background: "linear-gradient(135deg, #e4edff, #f7faff)",
        display: "flex",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
    },

    loading: {
        textAlign: "center",
        marginTop: "50px",
        color: "#555",
        fontSize: "18px",
    },

    error: {
        textAlign: "center",
        marginTop: "50px",
        color: "#c62828",
        fontSize: "18px",
        fontWeight: 600,
    },

    card: {
        width: "100%",
        maxWidth: "700px",
        background: "#fff",
        padding: "30px",
        borderRadius: "18px",
        boxShadow: "0px 10px 28px rgba(0,0,0,0.12)",
    },

    title: {
        fontSize: "28px",
        fontWeight: "700",
        marginBottom: "25px",
        textAlign: "center",
        color: "#1a237e",
    },

    row: {
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 0",
        borderBottom: "1px solid #f1f1f1",
    },

    column: {
        marginTop: "18px",
        marginBottom: "12px",
    },

    label: {
        fontWeight: "600",
        color: "#333",
    },

    value: {
        fontWeight: "500",
        color: "#444",
    },

    description: {
        marginTop: "8px",
        lineHeight: "1.6",
        color: "#444",
        background: "#f8f9ff",
        padding: "12px",
        borderRadius: "10px",
        border: "1px solid #e0e7ff",
    },

    solution: {
        marginTop: "8px",
        background: "#f1f7f5",
        padding: "12px",
        borderRadius: "10px",
        border: "1px solid #d7eee4",
        color: "#333",
    },

    fileLink: {
        color: "#304ffe",
        fontWeight: "600",
        textDecoration: "none",
    },

    statusBadge: {
        padding: "8px 14px",
        borderRadius: "10px",
        fontWeight: "700",
        color: "white",
    },
};
