import React from "react";
import { Link } from "react-router-dom";

export default function AdminLayout({ children }) {
    return (
        <div style={styles.container}>

            {/* Sidebar */}
            <aside style={styles.sidebar}>
                <h2 style={styles.logo}>Admin Panel</h2>

                <nav style={styles.nav}>
                    <Link to="/admin/dashboard" style={styles.link}>Dashboard</Link>
                    <Link to="/admin/complaints" style={styles.link}>All Complaints</Link>
                    <Link to="/admin/investigators" style={styles.link}>Investigators</Link>
                    <Link to="/admin/add-investigator" style={styles.link}>Add Investigator</Link>
                    <Link to="/logout" style={styles.logout}>Logout</Link>
                </nav>
            </aside>

            {/* Page Content */}
            <main style={styles.content}>
                {children}
            </main>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        minHeight: "100vh",
        background: "#f5f7ff",
    },

    sidebar: {
        width: "250px",
        background: "#1a237e",
        padding: "25px 20px",
        color: "white",
        display: "flex",
        flexDirection: "column",
    },

    logo: {
        fontSize: "22px",
        fontWeight: "700",
        marginBottom: "30px",
        textAlign: "center",
    },

    nav: {
        display: "flex",
        flexDirection: "column",
        gap: "18px",
    },

    link: {
        color: "white",
        textDecoration: "none",
        fontSize: "16px",
        padding: "10px 0",
        borderRadius: "6px",
        transition: "0.3s",
    },

    logout: {
        marginTop: "50px",
        color: "#ffab91",
        textDecoration: "none",
        fontWeight: "600",
        fontSize: "16px",
    },

    content: {
        flex: 1,
        padding: "30px 40px",
    },
};
