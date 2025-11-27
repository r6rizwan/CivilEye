import React from "react";

export default function UserDashboard() {

    return (
        <div style={styles.page}>

            <div style={styles.container}>
                <h2 style={styles.heading}>Welcome to Your Dashboard</h2>
                <p style={styles.subHeading}>Track your complaint status and manage your profile</p>

                {/* Stats Section */}
                <div style={styles.statsRow}>

                    <div style={styles.statCard}>
                        <h3 style={styles.statNumber}>0</h3>
                        <p style={styles.statLabel}>Total Complaints</p>
                    </div>

                    <div style={styles.statCard}>
                        <h3 style={styles.statNumber}>0</h3>
                        <p style={styles.statLabel}>Pending</p>
                    </div>

                    <div style={styles.statCard}>
                        <h3 style={styles.statNumber}>0</h3>
                        <p style={styles.statLabel}>Resolved</p>
                    </div>

                </div>

                {/* Buttons */}
                <div style={styles.buttonRow}>
                    <a href="/file-complaint" style={styles.primaryBtn}>File New Complaint</a>
                    <a href="/my-complaints" style={styles.secondaryBtn}>My Complaints</a>
                    <a href="/profile" style={styles.secondaryBtn}>Profile</a>
                </div>

            </div>

        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0eaff, #f6f9ff)",
        padding: "40px 20px",
        display: "flex",
        justifyContent: "center",
    },

    container: {
        width: "100%",
        maxWidth: "900px",
        background: "#fff",
        padding: "35px",
        borderRadius: "16px",
        boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
    },

    heading: {
        fontSize: "28px",
        fontWeight: "700",
        textAlign: "center",
        color: "#222",
    },

    subHeading: {
        textAlign: "center",
        marginBottom: "40px",
        color: "#555",
        fontSize: "15px",
    },

    statsRow: {
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "20px",
        marginBottom: "40px",
    },

    statCard: {
        flex: "1",
        minWidth: "180px",
        background: "#f5f7ff",
        padding: "20px",
        borderRadius: "12px",
        textAlign: "center",
        boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
    },

    statNumber: {
        fontSize: "26px",
        fontWeight: "700",
        color: "#304ffe",
    },

    statLabel: {
        marginTop: "6px",
        fontSize: "14px",
        color: "#555",
    },

    buttonRow: {
        display: "flex",
        gap: "20px",
        justifyContent: "center",
    },

    primaryBtn: {
        padding: "12px 24px",
        background: "#304ffe",
        color: "#fff",
        textDecoration: "none",
        borderRadius: "10px",
        fontWeight: "600",
        fontSize: "15px",
    },

    secondaryBtn: {
        padding: "12px 22px",
        background: "#fff",
        border: "2px solid #304ffe",
        color: "#304ffe",
        textDecoration: "none",
        borderRadius: "10px",
        fontWeight: "600",
        fontSize: "14px",
    },
};
