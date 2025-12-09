import React, { useState, useEffect, useRef } from "react";
import { logoutUser } from "../utils/logout";

export default function UserLayout({ children }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const profileRef = useRef();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div style={styles.wrapper}>

            {/* NAVBAR */}
            <nav style={styles.navbar}>
                <div style={styles.navInner}> {/* ⭐ CENTERED CONTENT */}

                    <div style={styles.logo}>Crime Report Portal</div>

                    {/* Desktop Links */}
                    <div style={styles.navLinks}>
                        <a href="/user/dashboard" style={styles.link}>Dashboard</a>
                        <a href="/complaint-tracking" style={styles.link}>Track</a>
                        <a href="/file-complaint" style={styles.link}>Report</a>
                        <a href="/my-complaints" style={styles.link}>My Cases</a>

                        {/* PROFILE DROPDOWN */}
                        <div style={styles.profileWrapper} ref={profileRef}>
                            <div
                                style={styles.profileIcon}
                                onClick={() => setProfileOpen(!profileOpen)}
                            >
                                👤
                            </div>

                            {profileOpen && (
                                <div style={styles.dropdown}>
                                    <a href="/profile" style={styles.dropdownItem}>My Profile</a>

                                    <button onClick={logoutUser} style={styles.dropdownLogout}>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* MOBILE HAMBURGER */}
                    <div
                        style={styles.hamburger}
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <span style={styles.bar}></span>
                        <span style={styles.bar}></span>
                        <span style={styles.bar}></span>
                    </div>

                </div>
            </nav>

            {/* MOBILE MENU */}
            {menuOpen && (
                <div style={styles.mobileMenu}>
                    <a href="/user/dashboard" style={styles.mobileLink}>Dashboard</a>
                    <a href="/complaint-tracking" style={styles.mobileLink}>Track</a>
                    <a href="/file-complaint" style={styles.mobileLink}>Report</a>
                    <a href="/my-complaints" style={styles.mobileLink}>My Cases</a>
                    <a href="/profile" style={styles.mobileLink}>Profile</a>

                    <button onClick={logoutUser} style={styles.mobileLogoutBtn}>
                        Logout
                    </button>
                </div>
            )}

            {/* CONTENT */}
            <main style={{ marginTop: 90 }}>{children}</main>
        </div>
    );
}

//
// UPDATED STYLES
//
const styles = {
    wrapper: { fontFamily: "Inter, sans-serif" },

    navbar: {
        position: "fixed",
        top: 0,
        width: "100%",
        background: "#0E1A33",
        padding: "12px 0",
        zIndex: 200,
        boxShadow: "0 2px 10px rgba(0,0,0,0.20)",
    },

    navInner: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 26px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },

    logo: { fontSize: 20, fontWeight: 700, color: "white" },

    navLinks: {
        display: "flex",
        gap: 22,
        alignItems: "center",
    },

    link: {
        color: "#c8d5ff",
        textDecoration: "none",
        fontSize: 15,
        transition: "0.25s",
    },

    /******** PROFILE ICON ********/
    profileWrapper: {
        position: "relative",
    },

    profileIcon: {
        width: 38,
        height: 38,
        borderRadius: "50%",
        background: "#1f2d4f",
        border: "1px solid rgba(255,255,255,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontSize: 18,
    },

    dropdown: {
        position: "absolute",
        top: 48,
        right: 0,
        width: 170,
        background: "#142646",
        borderRadius: 10,
        boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
        padding: "10px 0",
        animation: "fadeIn 0.2s ease-out",
        zIndex: 300,
    },

    dropdownItem: {
        display: "block",
        padding: "10px 16px",
        color: "#d6e2ff",
        textDecoration: "none",
        fontSize: 15,
    },

    dropdownLogout: {
        width: "100%",
        padding: "10px 16px",
        textAlign: "left",
        color: "#ff7373",
        background: "transparent",
        border: "none",
        fontSize: 15,
        cursor: "pointer",
        fontWeight: 600,
    },

    /******** HAMBURGER ********/
    hamburger: {
        display: "none",
        flexDirection: "column",
        gap: 4,
        cursor: "pointer",
    },

    bar: {
        width: 24,
        height: 3,
        background: "white",
        borderRadius: 2,
    },

    /******** MOBILE MENU ********/
    mobileMenu: {
        position: "fixed",
        top: 65,
        right: 0,
        width: 220,
        background: "#142646",
        padding: 20,
        borderRadius: "0 0 0 14px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        boxShadow: "-4px 4px 12px rgba(0,0,0,0.25)",
        animation: "slideIn 0.25s forwards",
        zIndex: 150,
    },

    mobileLink: {
        color: "#d6e2ff",
        textDecoration: "none",
        fontSize: 16,
    },

    mobileLogoutBtn: {
        marginTop: 10,
        padding: "10px",
        background: "#ff4f4f",
        border: "none",
        borderRadius: 6,
        color: "white",
        fontWeight: 700,
        cursor: "pointer",
    },
};

/* Responsive Behaviour */
if (window.innerWidth < 768) {
    styles.navLinks.display = "none";
    styles.hamburger.display = "flex";
}
