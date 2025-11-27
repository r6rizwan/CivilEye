import React from "react";

export default function InvestigatorLayout({ children }) {
    return (
        <div style={styles.container}>

            <aside style={styles.sidebar}>
                <h2 style={styles.heading}>Investigator</h2>

                <a href="/investigator/dashboard" style={styles.link}>Dashboard</a>
                <a href="/investigator/assigned" style={styles.link}>Assigned Cases</a>
                <a href="/investigator/update-status" style={styles.link}>Update Status</a>
                <a href="/investigator/history" style={styles.link}>History</a>
                <a href="/logout" style={styles.logout}>Logout</a>
            </aside>

            <main style={styles.content}>
                {children}
            </main>

        </div>
    );
}

const styles = {
    container: { display: "flex" },

    sidebar: {
        width: "250px",
        background: "#13254a",
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
        color: "#cbe0ff",
        textDecoration: "none",
        fontSize: "15px",
    },

    logout: {
        marginTop: "auto",
        color: "#ffadad",
        textDecoration: "none",
    },

    content: {
        padding: "30px",
        width: "100%",
        background: "#f7f9ff",
        minHeight: "100vh",
    },
};
