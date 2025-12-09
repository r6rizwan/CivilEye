import React, { useEffect, useState } from "react";
import axios from "axios";

export default function InvestigatorDashboard() {
    const [investigator, setInvestigator] = useState(null);
    const [complaints, setComplaints] = useState([]);

    const email = localStorage.getItem("email");

    useEffect(() => {
        if (!email) return;

        const loadInvestigator = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:7000/api/investigators/by-email/${email}`
                );
                setInvestigator(res.data);
            } catch (err) {
                console.error("Error fetching investigator:", err);
            }
        };

        const loadComplaints = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:7000/api/complaint/assigned/${email}`
                );
                setComplaints(res.data);
            } catch (err) {
                console.error("Error loading complaints:", err);
            }
        };

        loadInvestigator();
        loadComplaints();
    }, [email]);

    if (!investigator) {
        return <p style={{ textAlign: "center", marginTop: 40 }}>Loading...</p>;
    }

    // Stats
    const stats = {
        total: complaints.length,
        pending: complaints.filter(c => c.status === "Pending").length,
        inProgress: complaints.filter(c => ["Assigned", "In Progress"].includes(c.status)).length,
        resolved: complaints.filter(c => c.status === "Resolved").length
    };

    const priorities = complaints.slice(0, 3);

    return (
        <div style={styles.page}>
            <div style={styles.container}>

                {/* HEADER CARD */}
                <div style={styles.headerCard}>
                    <div style={{ flex: 1 }}>
                        <h2 style={styles.headerTitle}>Welcome, {investigator.name}</h2>
                        <p style={styles.headerSub}>
                            {investigator.department} • {investigator.investigatorId}
                        </p>
                    </div>

                    <img
                        src="https://cdn-icons-png.flaticon.com/512/3033/3033143.png"
                        alt="investigator"
                        style={styles.avatar}
                    />
                </div>

                {/* STATS GRID */}
                <div style={styles.statsGrid}>
                    {renderStat("Assigned Complaints", stats.total, "#304FFE")}
                    {renderStat("Pending", stats.pending, "#FF9800")}
                    {renderStat("In Progress", stats.inProgress, "#0288D1")}
                    {renderStat("Resolved", stats.resolved, "#2E7D32")}
                </div>

                {/* ACTION BUTTONS */}
                <div style={styles.actionsBar}>
                    <a href="/investigator/assigned" style={styles.primaryBtn}>View Complaints</a>
                    <a href="/profile" style={styles.outlineBtn}>Profile</a>
                </div>

                {/* PRIORITY COMPLAINTS */}
                <div style={styles.block}>
                    <h3 style={styles.blockTitle}>Today's Priority Complaints</h3>

                    {priorities.length === 0 ? (
                        <p style={styles.noData}>No assigned complaints yet.</p>
                    ) : (
                        priorities.map((item) => (
                            <div key={item._id} style={styles.priorityItem}>
                                <div>
                                    <strong style={{ fontSize: 16 }}>{item.complaintType}</strong>
                                    <p style={styles.dateText}>
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <span
                                    style={{
                                        ...styles.badge,
                                        background:
                                            item.status === "Pending" ? "#FF9800" :
                                            item.status === "Assigned" ? "#3F51B5" :
                                            item.status === "Resolved" ? "#2E7D32" :
                                            "#616161"
                                    }}
                                >
                                    {item.status}
                                </span>
                            </div>
                        ))
                    )}
                </div>

                {/* ACTIVITY FEED */}
                <div style={styles.block}>
                    <h3 style={styles.blockTitle}>Recent Activity</h3>

                    <div style={styles.activityBox}>
                        <p style={styles.activityItem}>You logged in recently.</p>
                        <p style={styles.activityItem}>Complaint records synced.</p>
                        <p style={styles.activityEmpty}>More activity tracking coming soon...</p>
                    </div>
                </div>

            </div>
        </div>
    );
}

/* Small helper to render stats cleanly */
const renderStat = (label, value, color) => {
    return (
        <div style={styles.statCard}>
            <h3 style={{ ...styles.statNumber, color }}>{value}</h3>
            <p style={styles.statLabel}>{label}</p>
        </div>
    );
};

//
// STYLES
//

const styles = {
    page: {
        background: "#F4F6FF",
        minHeight: "100vh",
        padding: "28px",
        display: "flex",
        justifyContent: "center",
    },

    container: {
        width: "100%",
        maxWidth: "1100px",
    },

    /* Header */
    headerCard: {
        background: "linear-gradient(135deg, #4A6EFF, #304FFE)",
        padding: "28px",
        borderRadius: "18px",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "32px",
        boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
    },

    headerTitle: {
        fontSize: "28px",
        fontWeight: "700",
    },

    headerSub: {
        opacity: 0.85,
        marginTop: 4,
    },

    avatar: {
        width: 90,
        height: 90,
        borderRadius: "50%",
    },

    /* Stats Grid */
    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "22px",
        marginBottom: "38px",
    },

    statCard: {
        background: "#fff",
        padding: "22px",
        borderRadius: "14px",
        textAlign: "center",
        boxShadow: "0 6px 16px rgba(0,0,0,0.10)",
    },

    statNumber: {
        fontSize: "30px",
        fontWeight: "700",
    },

    statLabel: {
        marginTop: 6,
        color: "#666",
        fontWeight: "500",
    },

    /* Actions */
    actionsBar: {
        display: "flex",
        gap: "18px",
        marginBottom: "32px",
    },

    primaryBtn: {
        background: "#304FFE",
        color: "#fff",
        padding: "12px 26px",
        borderRadius: "10px",
        textDecoration: "none",
        fontWeight: "600",
    },

    outlineBtn: {
        border: "2px solid #304FFE",
        padding: "12px 26px",
        borderRadius: "10px",
        color: "#304FFE",
        textDecoration: "none",
        fontWeight: "600",
        background: "#fff",
    },

    /* Blocks */
    block: {
        background: "#fff",
        padding: "26px",
        borderRadius: "16px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        marginBottom: "26px",
    },

    blockTitle: {
        fontSize: "20px",
        fontWeight: "700",
        marginBottom: "18px",
    },

    priorityItem: {
        display: "flex",
        justifyContent: "space-between",
        borderBottom: "1px solid #eee",
        padding: "12px 0",
    },

    dateText: {
        margin: 0,
        color: "#666",
        fontSize: 13,
    },

    badge: {
        padding: "6px 12px",
        borderRadius: "8px",
        fontWeight: "600",
        color: "#fff",
    },

    noData: {
        color: "#777",
        textAlign: "center",
    },

    /* Activity Feed */
    activityBox: {
        paddingLeft: 6,
    },

    activityItem: {
        margin: "8px 0",
        color: "#444",
        fontSize: 14,
    },

    activityEmpty: {
        marginTop: 8,
        color: "#888",
        fontStyle: "italic",
    },
};
