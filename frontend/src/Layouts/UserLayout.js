import React, { useState } from "react";

export default function UserLayout({ children }) {

    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div>

            {/* NAVBAR */}
            <nav style={styles.nav}>

                {/* Logo */}
                <div style={styles.logo}>Crime Report Portal</div>

                {/* Desktop Links */}
                <div style={styles.linksDesktop}>
                    <a href="/user/dashboard" style={styles.link}>Dashboard</a>
                    <a href="/file-complaint" style={styles.link}>Report</a>
                    <a href="/my-complaints" style={styles.link}>My Cases</a>
                    <a href="/profile" style={styles.link}>Profile</a>
                    <a href="/logout" style={styles.logout}>Logout</a>
                </div>

                {/* Hamburger button for mobile */}
                <div
                    style={styles.hamburger}
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <div style={styles.bar}></div>
                    <div style={styles.bar}></div>
                    <div style={styles.bar}></div>
                </div>

            </nav>

            {/* MOBILE MENU */}
            {menuOpen && (
                <div style={styles.mobileMenu}>
                    <a href="/user/dashboard" style={styles.mobileLink}>Dashboard</a>
                    <a href="/file-complaint" style={styles.mobileLink}>Report</a>
                    <a href="/my-complaints" style={styles.mobileLink}>My Cases</a>
                    <a href="/profile" style={styles.mobileLink}>Profile</a>
                    <a href="/logout" style={styles.mobileLogout}>Logout</a>
                </div>
            )}

            {/* Page Content */}
            <div style={{ marginTop: "80px" }}>
                {children}
            </div>

        </div>
    );
}

const styles = {
    nav: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        padding: "14px 24px",
        background: "#304ffe",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 20,
        boxSizing: "border-box",
    },

    logo: {
        fontSize: "20px",
        fontWeight: "700",
        whiteSpace: "nowrap",
    },

    /* DESKTOP LINKS */
    linksDesktop: {
        display: "flex",
        gap: "20px",
    },

    link: {
        color: "white",
        textDecoration: "none",
        fontWeight: "500",
        whiteSpace: "nowrap",
    },

    logout: {
        color: "#ffbaba",
        textDecoration: "none",
        fontWeight: "600",
        whiteSpace: "nowrap",
    },

    /* HAMBURGER BUTTON */
    hamburger: {
        display: "none",
        flexDirection: "column",
        gap: "4px",
        cursor: "pointer",
    },

    bar: {
        width: "25px",
        height: "3px",
        background: "white",
        borderRadius: "2px",
    },

    /* MOBILE MENU PANEL */
    mobileMenu: {
        position: "fixed",
        top: "60px",
        right: 0,
        width: "200px",
        background: "#1f2dbf",
        padding: "20px",
        boxShadow: "-2px 4px 12px rgba(0,0,0,0.18)",
        zIndex: 19,
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        borderRadius: "0 0 0 12px",
        animation: "slideIn 0.25s ease-out",
    },

    mobileLink: {
        color: "#e8ebff",
        textDecoration: "none",
        fontSize: "16px",
        fontWeight: "500",
    },

    mobileLogout: {
        color: "#ffd3d3",
        textDecoration: "none",
        fontSize: "16px",
        fontWeight: "600",
        marginTop: "10px",
    },

    /* Responsive rules */
    "@media (max-width: 768px)": {},

};

// Add keyframe animation (REACT inline trick)
styles.mobileMenu["@keyframes slideIn"] = {
    from: { transform: "translateX(100%)" },
    to: { transform: "translateX(0)" },
};

/* Apply responsive behavior manually */
if (window.innerWidth < 768) {
    styles.linksDesktop.display = "none";
    styles.hamburger.display = "flex";
}
