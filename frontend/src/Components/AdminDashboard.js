import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        assigned: 0,
        resolved: 0,
        closed: 0,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get("http://localhost:7000/api/complaint/all");

                const complaints = res.data;

                setStats({
                    total: complaints.length,
                    pending: complaints.filter(c => c.status === "Pending").length,
                    assigned: complaints.filter(c => c.status === "Assigned").length,
                    resolved: complaints.filter(c => c.status === "Resolved").length,
                    closed: complaints.filter(c => c.status === "Closed").length,
                });

                setLoading(false);
            } catch (error) {
                console.error("Failed to load admin stats:", error);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <p style={{ textAlign: "center", marginTop: "80px" }}>Loading dashboard...</p>;
    }

    return (
        <div style={styles.page}>
            <h2 style={styles.title}>Admin Dashboard</h2>

            <div style={styles.grid}>
                <div style={styles.card}>
                    <p style={styles.cardTitle}>Total Complaints</p>
                    <h3 style={styles.number}>{stats.total}</h3>
                </div>

                <div style={{ ...styles.card, background: "#ffcc80" }}>
                    <p style={styles.cardTitle}>Pending</p>
                    <h3 style={styles.number}>{stats.pending}</h3>
                </div>

                <div style={{ ...styles.card, background: "#90caf9" }}>
                    <p style={styles.cardTitle}>Assigned</p>
                    <h3 style={styles.number}>{stats.assigned}</h3>
                </div>

                <div style={{ ...styles.card, background: "#a5d6a7" }}>
                    <p style={styles.cardTitle}>Resolved</p>
                    <h3 style={styles.number}>{stats.resolved}</h3>
                </div>

                <div style={{ ...styles.card, background: "#eeeeee" }}>
                    <p style={styles.cardTitle}>Closed</p>
                    <h3 style={styles.number}>{stats.closed}</h3>
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        padding: "30px",
    },

    title: {
        fontSize: "28px",
        fontWeight: "700",
        marginBottom: "25px",
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px",
    },

    card: {
        background: "#e3e7ff",
        padding: "25px",
        borderRadius: "14px",
        boxShadow: "0px 8px 20px rgba(0,0,0,0.1)",
    },

    cardTitle: {
        fontSize: "16px",
        color: "#333",
        fontWeight: "600",
    },

    number: {
        marginTop: "10px",
        fontSize: "32px",
        fontWeight: "700",
        color: "#1a237e",
    },
};
