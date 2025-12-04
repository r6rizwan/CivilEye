import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserDashboard() {
    const [userName, setUserName] = useState("");
    const [complaints, setComplaints] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        assigned: 0,
        resolved: 0,
    });

    const email = localStorage.getItem("email");

    useEffect(() => {
        if (!email) return;

        const loadData = async () => {
            try {
                // Fetch user name
                const userRes = await axios.get(
                    `http://localhost:7000/api/profile/${email}`
                );
                setUserName(userRes.data?.fullName || "User");
            } catch {
                setUserName("User");
            }

            try {
                // Fetch complaints
                const compRes = await axios.get(
                    `http://localhost:7000/api/complaint/user/${email}`
                );
                const list = compRes.data;

                setComplaints(list);

                setStats({
                    total: list.length,
                    pending: list.filter(c => c.status === "Pending").length,
                    assigned: list.filter(c => c.status === "Assigned").length,
                    resolved: list.filter(c => c.status === "Resolved").length,
                });
            } catch (err) {
                console.error("Error loading complaints:", err);
            }
        };

        loadData();
    }, [email]);

    const recent = complaints.slice(-3).reverse();

    return (
        <div style={styles.page}>
            <div style={styles.container}>

                {/* --- WELCOME CARD --- */}
                <div style={styles.welcomeCard}>
                    <div>
                        <h2 style={styles.welcomeText}>Welcome, {userName}</h2>
                        <p style={styles.welcomeSub}>
                            View your complaint insights & recent updates
                        </p>
                    </div>

                    <img
                        src="https://cdn-icons-png.flaticon.com/512/1077/1077012.png"
                        alt="user"
                        style={styles.avatar}
                    />
                </div>

                {/* --- STATS --- */}
                <div style={styles.statsRow}>
                    <div style={styles.statCard}>
                        <h3 style={styles.statNumber}>{stats.total}</h3>
                        <p style={styles.statLabel}>Total Complaints</p>
                    </div>

                    <div style={styles.statCard}>
                        <h3 style={styles.statNumber}>{stats.pending}</h3>
                        <p style={styles.statLabel}>Pending</p>
                    </div>

                    <div style={styles.statCard}>
                        <h3 style={styles.statNumber}>{stats.assigned}</h3>
                        <p style={styles.statLabel}>Assigned</p>
                    </div>

                    <div style={styles.statCard}>
                        <h3 style={styles.statNumber}>{stats.resolved}</h3>
                        <p style={styles.statLabel}>Resolved</p>
                    </div>
                </div>

                {/* --- FILE COMPLAINT CTA --- */}
                <div style={styles.ctaCard}>
                    <div>
                        <h3 style={styles.ctaTitle}>Need to report a new issue?</h3>
                        <p style={styles.ctaSub}>
                            File a complaint and our team will review it promptly.
                        </p>
                    </div>

                    <a href="/file-complaint" style={styles.ctaBtn}>
                        File a Complaint
                    </a>
                </div>

                {/* --- RECENT COMPLAINTS --- */}
                <div style={styles.recentCard}>
                    <h3 style={styles.recentTitle}>Recent Complaints</h3>

                    {recent.length === 0 ? (
                        <p style={styles.noData}>No recent complaints found.</p>
                    ) : (
                        recent.map((item) => (
                            <div key={item._id} style={styles.recentItem}>
                                <div>
                                    <strong>{item.complaintType}</strong>
                                    <p style={{ margin: 0, color: "#666" }}>
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <span
                                    style={{
                                        ...styles.badge,
                                        background:
                                            item.status === "Pending"
                                                ? "#ff9800"
                                                : item.status === "Assigned"
                                                    ? "#0277bd"
                                                    : item.status === "Resolved"
                                                        ? "#2e7d32"
                                                        : "#616161",
                                    }}
                                >
                                    {item.status}
                                </span>
                            </div>
                        ))
                    )}

                    <p style={styles.recentHint}>
                        View all complaints in <a href="/my-complaints">My Complaints</a>
                    </p>
                </div>

            </div>
        </div>
    );
}

/* ------------------- STYLES ------------------- */

const styles = {
    page: {
        minHeight: "100vh",
        background: "#f4f6ff",
        padding: "30px",
        display: "flex",
        justifyContent: "center",
    },

    container: {
        width: "100%",
        maxWidth: "1000px",
    },

    /* Welcome */
    welcomeCard: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "linear-gradient(135deg, #4a6fff, #304ffe)",
        padding: "28px",
        borderRadius: "18px",
        color: "white",
        marginBottom: "32px",
        boxShadow: "0 10px 22px rgba(0,0,0,0.15)",
    },

    welcomeText: {
        fontSize: "28px",
        fontWeight: "700",
        marginBottom: "4px",
    },

    welcomeSub: {
        opacity: 0.85,
        fontSize: "15px",
    },

    avatar: {
        width: "85px",
        height: "85px",
    },

    /* Stats Section */
    statsRow: {
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
        marginBottom: "35px",
    },

    statCard: {
        flex: 1,
        minWidth: "180px",
        background: "#fff",
        padding: "22px",
        borderRadius: "14px",
        textAlign: "center",
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
    },

    statNumber: {
        fontSize: "30px",
        fontWeight: "700",
        color: "#304ffe",
    },

    statLabel: {
        color: "#555",
        marginTop: "4px",
        fontSize: "14px",
    },

    /* CTA --- File Complaint */
    ctaCard: {
        background: "#fff",
        padding: "24px",
        borderRadius: "16px",
        marginBottom: "35px",
        boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },

    ctaTitle: {
        fontSize: "20px",
        fontWeight: "700",
    },

    ctaSub: {
        color: "#666",
        marginTop: "4px",
    },

    ctaBtn: {
        background: "#304ffe",
        color: "white",
        padding: "12px 22px",
        borderRadius: "10px",
        fontWeight: "600",
        textDecoration: "none",
        fontSize: "15px",
    },

    /* Recent Complaints */
    recentCard: {
        background: "#fff",
        padding: "25px",
        borderRadius: "16px",
        boxShadow: "0 4px 18px rgba(0,0,0,0.07)",
    },

    recentTitle: {
        fontSize: "20px",
        fontWeight: "700",
        marginBottom: "15px",
    },

    recentItem: {
        display: "flex",
        justifyContent: "space-between",
        padding: "12px 0",
        borderBottom: "1px solid #eee",
        alignItems: "center",
    },

    badge: {
        padding: "6px 12px",
        borderRadius: "8px",
        color: "white",
        fontWeight: "600",
    },

    noData: {
        textAlign: "center",
        color: "#777",
    },

    recentHint: {
        marginTop: "12px",
        textAlign: "center",
        color: "#666",
        fontSize: "13px",
    },
};
