import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function ComplaintDetails() {
    const { id } = useParams();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComplaint = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:7000/api/complaint/${id}`
                );
                setComplaint(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching complaint:", error);
                setLoading(false);
            }
        };

        fetchComplaint();
    }, [id]);

    if (loading) {
        return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;
    }

    if (!complaint) {
        return <p style={{ textAlign: "center", marginTop: "50px" }}>Complaint not found.</p>;
    }

    const statusStyle = {
        padding: "8px 14px",
        borderRadius: "10px",
        fontWeight: "700",
        color: "white",
        background:
            complaint.status === "Pending"
                ? "#ff9800"
                : complaint.status === "Assigned"
                    ? "#1565c0"
                    : complaint.status === "Resolved"
                        ? "#2e7d32"
                        : "#616161",
    };

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
                    <span style={statusStyle}>{complaint.status}</span>
                </div>

                {/* Description */}
                <div style={styles.column}>
                    <span style={styles.label}>Description:</span>
                    <p style={styles.description}>{complaint.description}</p>
                </div>

                {/* File */}
                <div style={styles.row}>
                    <span style={styles.label}>Attachment:</span>
                    {complaint.file ? (
                        <a
                            href={`http://localhost:7000/${complaint.file}`}
                            target="_blank"
                            rel="noreferrer"
                            style={styles.fileLink}
                        >
                            View File
                        </a>
                    ) : (
                        <span style={styles.value}>No File Uploaded</span>
                    )}
                </div>

                {/* Assigned To */}
                <div style={styles.row}>
                    <span style={styles.label}>Assigned Investigator:</span>
                    <span style={styles.value}>
                        {complaint.assignedTo || "Not Assigned"}
                    </span>
                </div>

                {/* Created At */}
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

const styles = {
    page: {
        minHeight: "100vh",
        padding: "30px",
        background: "linear-gradient(135deg, #e4edff, #f7faff)",
        display: "flex",
        justifyContent: "center",
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
        fontSize: "26px",
        fontWeight: "700",
        marginBottom: "25px",
        textAlign: "center",
    },

    row: {
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 0",
    },

    column: {
        marginTop: "18px",
        marginBottom: "12px",
    },

    label: {
        fontWeight: "600",
        color: "#333",
        marginRight: "10px",
    },

    value: {
        fontWeight: "500",
        color: "#444",
    },

    description: {
        marginTop: "6px",
        lineHeight: "1.5",
        color: "#444",
        background: "#f8f9ff",
        padding: "12px",
        borderRadius: "10px",
        border: "1px solid #e0e7ff",
    },

    solution: {
        marginTop: "6px",
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
};
