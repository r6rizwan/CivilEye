import React from "react";

export default function AdminLayout({ children }) {
    return (
        <div style={styles.container}>

            {/* SIDEBAR */}
            <aside style={styles.sidebar}>
                <h2 style={styles.heading}>Admin Panel</h2>

                <a href="/admin/dashboard" style={styles.link}>Dashboard</a>
                <a href="/admin/users" style={styles.link}>Users</a>
                <a href="/admin/complaints" style={styles.link}>Complaints</a>
                <a href="/admin/investigators" style={styles.link}>Investigators</a>
                <a href="/admin/feedback" style={styles.link}>Feedback</a>
                <a href="/logout" style={styles.logout}>Logout</a>
            </aside>

            {/* PAGE CONTENT */}
            <main style={styles.content}>
                {children}
            </main>

        </div>
    );
}

const styles = {
    container: {
        display: "flex",
    },

    sidebar: {
        width: "250px",
        background: "#1c2b5a",
        minHeight: "100vh",
        padding: "30px 20px",
        color: "white",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
    },

    heading: {
        fontSize: "22px",
        fontWeight: "700",
        marginBottom: "30px",
    },

    link: {
        color: "#d7e3ff",
        textDecoration: "none",
        fontSize: "15px",
    },

    logout: {
        marginTop: "auto",
        color: "#ffb1b1",
        textDecoration: "none",
    },

    content: {
        padding: "30px",
        width: "100%",
        background: "#f4f6ff",
        minHeight: "100vh",
    },
};
