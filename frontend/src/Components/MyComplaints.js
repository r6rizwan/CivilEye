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

    const statusStyle = (status) => ({
        padding: "6px 12px",
        borderRadius: "8px",
        fontWeight: "600",
        color: "white",
        background:
            status === "Pending"
                ? "#ff9800"
                : status === "Assigned"
                    ? "#0277bd"
                    : status === "Resolved"
                        ? "#2e7d32"
                        : "#616161",
    });

    if (loading) {
        return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;
    }

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h2 style={styles.title}>My Complaints</h2>

                {complaints.length === 0 ? (
                    <p style={styles.noData}>No complaints found.</p>
                ) : (
                    complaints.map((item) => (
                        <div key={item._id} style={styles.complaintBox}>
                            <div style={styles.row}>
                                <span style={styles.label}>Complaint ID:</span>
                                <span style={styles.value}>{item.complaintId}</span>
                            </div>

                            <div style={styles.row}>
                                <span style={styles.label}>Type:</span>
                                <span style={styles.value}>{item.complaintType}</span>
                            </div>

                            <div style={styles.row}>
                                <span style={styles.label}>Status:</span>
                                <span style={statusStyle(item.status)}>{item.status}</span>
                            </div>

                            <div style={styles.row}>
                                <span style={styles.label}>Date:</span>
                                <span style={styles.value}>
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <div style={styles.row}>
                                <span style={styles.label}>Assigned To:</span>
                                <span style={styles.value}>
                                    {item.assignedTo || "Not Assigned"}
                                </span>
                            </div>

                            <a
                                href={`/complaint/${item._id}`}
                                style={styles.viewButton}
                            >
                                View Details
                            </a>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        padding: "30px",
        background: "linear-gradient(135deg, #e0eaff, #f6f9ff)",
        display: "flex",
        justifyContent: "center",
    },

    card: {
        width: "100%",
        maxWidth: "900px",
        background: "#fff",
        padding: "25px",
        borderRadius: "18px",
        boxShadow: "0px 10px 26px rgba(0,0,0,0.12)",
    },

    title: {
        fontSize: "26px",
        fontWeight: "700",
        marginBottom: "20px",
    },

    complaintBox: {
        background: "#f3f6ff",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "20px",
        border: "1px solid #dde3ff",
    },

    row: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "10px",
    },

    label: {
        fontWeight: "600",
        color: "#444",
    },

    value: {
        color: "#222",
    },

    viewButton: {
        marginTop: "12px",
        display: "inline-block",
        padding: "8px 16px",
        background: "#304ffe",
        borderRadius: "8px",
        color: "white",
        textDecoration: "none",
        fontSize: "14px",
    },

    noData: {
        textAlign: "center",
        color: "#444",
        marginTop: "20px",
        fontSize: "16px",
    },
};
