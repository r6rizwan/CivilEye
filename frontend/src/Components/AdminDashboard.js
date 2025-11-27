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
                console.error("Admin Dashboard Error:", error);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <h3 style={{ textAlign: "center" }}>Loading Dashboard...</h3>;

    return (
        <div>
            <h1 style={styles.title}>Dashboard Overview</h1>

            <div style={styles.grid}>
                <div style={styles.cardBlue}>
                    <p>Total Complaints</p>
                    <h2>{stats.total}</h2>
                </div>

                <div style={styles.cardOrange}>
                    <p>Pending</p>
                    <h2>{stats.pending}</h2>
                </div>

                <div style={styles.cardSky}>
                    <p>Assigned</p>
                    <h2>{stats.assigned}</h2>
                </div>

                <div style={styles.cardGreen}>
                    <p>Resolved</p>
                    <h2>{stats.resolved}</h2>
                </div>

                <div style={styles.cardGrey}>
                    <p>Closed</p>
                    <h2>{stats.closed}</h2>
                </div>
            </div>
        </div>
    );
}

const styles = {
    title: {
        fontSize: "26px",
        fontWeight: "700",
        marginBottom: "25px",
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px",
    },

    cardBase: {
        padding: "25px",
        borderRadius: "14px",
        color: "#fff",
        boxShadow: "0 6px 22px rgba(0,0,0,0.15)",
    },

    cardBlue: {
        background: "#3f51b5",
        padding: "25px",
        borderRadius: "14px",
        color: "white",
    },
    cardOrange: {
        background: "#fb8c00",
        padding: "25px",
        borderRadius: "14px",
        color: "white",
    },
    cardSky: {
        background: "#29b6f6",
        padding: "25px",
        borderRadius: "14px",
        color: "white",
    },
    cardGreen: {
        background: "#43a047",
        padding: "25px",
        borderRadius: "14px",
        color: "white",
    },
    cardGrey: {
        background: "#757575",
        padding: "25px",
        borderRadius: "14px",
        color: "white",
    },
};
