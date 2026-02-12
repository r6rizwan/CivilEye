import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function InvestigatorLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [mode, setMode] = useState("email"); // email | login | setup
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showLoginMenu, setShowLoginMenu] = useState(false);

    /* Close dropdown on outside click */
    useEffect(() => {
        const closeMenu = () => setShowLoginMenu(false);
        window.addEventListener("click", closeMenu);
        return () => window.removeEventListener("click", closeMenu);
    }, []);

    const handleCheckEmail = async () => {
        if (!email) return setError("Email is required");

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await api.post("/api/investigators/password-status", { email });
            if (res.data.hasPassword) {
                setMode("login");
            } else {
                setMode("setup");
            }
        } catch (err) {
            setError(err.response?.data?.error || "Unable to check investigator profile");
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        if (!email || !password) return setError("Email and password are required");
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const res = await api.post("/api/login", { email, password });
            if (res.data.role !== "Investigator") {
                return setError("Not authorized as Investigator");
            }
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("email", email);
            localStorage.setItem("role", "Investigator");

            navigate("/investigator/dashboard");
        } catch (err) {
            setError(err.response?.data?.error || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    const handleSendOtp = async () => {
        if (!email) return setError("Email is required");
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            await api.post("/api/forgotpassword", { email });
            setOtpSent(true);
            setSuccess("OTP sent to your email.");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePassword = async () => {
        if (!otpSent) return setError("Send OTP first");
        if (!otp || !password || !confirmPassword) {
            return setError("OTP, password, and confirm password are required");
        }
        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }
        if (password.length < 6) {
            return setError("Password must be at least 6 characters");
        }

        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const verify = await api.post("/api/verifyotp", { email, otp });
            await api.post("/api/resetpassword", {
                resetToken: verify.data.resetToken,
                newPassword: password,
            });
            setSuccess("Password created successfully. You can now login.");
            setMode("login");
            setPassword("");
            setConfirmPassword("");
            setOtp("");
            setOtpSent(false);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to create password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.glowA} />
            <div style={styles.glowB} />

            {/* NAVBAR */}
            <nav style={styles.navbar}>
                <div style={styles.navLeft}>
                    <span style={styles.logo} onClick={() => navigate("/")}>
                        Crime Reporting Portal
                    </span>
                    <span style={styles.navTag}>Investigator Access</span>
                </div>

                <div style={styles.navRight}>
                    <span style={styles.navLink} onClick={() => navigate("/")}>
                        Home
                    </span>
                    <span style={styles.navLink} onClick={() => navigate("/aboutpage")}>
                        About
                    </span>
                    <span style={styles.navLink} onClick={() => navigate("/contactpage")}>
                        Contact
                    </span>

                    <div style={styles.dropdown} onClick={(e) => e.stopPropagation()}>
                        <span
                            style={styles.navLink}
                            onClick={() => setShowLoginMenu((prev) => !prev)}
                        >
                            Login ▾
                        </span>

                        {showLoginMenu && (
                            <div style={styles.dropdownMenu}>
                                <div
                                    style={styles.dropdownItem}
                                    onClick={() => navigate("/login")}
                                >
                                    Citizen Login
                                </div>
                                <div
                                    style={styles.dropdownItem}
                                    onClick={() => navigate("/investigator/login")}
                                >
                                    Investigator Login
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <div style={styles.container}>
                <div style={styles.sideCard}>
                    <p style={styles.eyebrow}>Authorized Personnel</p>
                    <h2 style={styles.sideTitle}>Secure investigator access.</h2>
                    <p style={styles.sideText}>
                        Access your assigned cases and investigation tools with your
                        registered email and password.
                    </p>
                    <div style={styles.sideNote}>
                        First-time investigators can set their password from this screen.
                    </div>
                </div>

                <div style={styles.card}>
                    <h2 style={styles.title}>Investigator Login</h2>
                    <p style={styles.subtitle}>
                        Secure access for authorized investigators
                    </p>

                    {error && <div style={styles.error}>{error}</div>}
                    {success && <div style={styles.success}>{success}</div>}
                    {mode === "email" && (
                        <>
                            <label style={styles.label}>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter registered email"
                                style={styles.input}
                            />
                            <button
                                onClick={handleCheckEmail}
                                disabled={loading}
                                style={styles.primaryBtn}
                            >
                                {loading ? "Checking..." : "Continue"}
                            </button>
                        </>
                    )}

                    {mode === "login" && (
                        <>
                            <label style={styles.label}>Email</label>
                            <input type="email" value={email} disabled style={styles.input} />

                            <label style={styles.label}>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                style={styles.input}
                            />
                            <button onClick={handleLogin} disabled={loading} style={styles.primaryBtn}>
                                {loading ? "Signing in..." : "Login"}
                            </button>
                            <p style={styles.helper}>
                                Wrong email?{" "}
                                <span style={styles.link} onClick={() => setMode("email")}>
                                    Change email
                                </span>
                            </p>
                        </>
                    )}

                    {mode === "setup" && (
                        <>
                            <label style={styles.label}>Email</label>
                            <input type="email" value={email} disabled style={styles.input} />

                            {!otpSent && (
                                <>
                                    <p style={styles.helper}>
                                        No password found for this investigator. Send OTP to set a new password.
                                    </p>
                                    <button onClick={handleSendOtp} disabled={loading} style={styles.secondaryBtn}>
                                        {loading ? "Sending..." : "Send OTP"}
                                    </button>
                                </>
                            )}

                            {otpSent && (
                                <>
                                    <label style={styles.label}>OTP</label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="Enter OTP"
                                        style={styles.input}
                                    />

                                    <label style={styles.label}>Create Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="New password"
                                        style={styles.input}
                                    />

                                    <label style={styles.label}>Confirm Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm password"
                                        style={styles.input}
                                    />

                                    <button
                                        onClick={handleCreatePassword}
                                        disabled={loading}
                                        style={styles.primaryBtn}
                                    >
                                        {loading ? "Processing..." : "Verify OTP & Create Password"}
                                    </button>
                                    <button
                                        onClick={handleSendOtp}
                                        disabled={loading}
                                        style={styles.secondaryBtn}
                                    >
                                        {loading ? "Sending..." : "Resend OTP"}
                                    </button>
                                </>
                            )}

                            <p style={styles.helper}>
                                Wrong email?{" "}
                                <span style={styles.link} onClick={() => setMode("email")}>
                                    Change email
                                </span>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ---------------- STYLES ---------------- */

const styles = {
    page: {
        background:
            "radial-gradient(circle at top, #ffffff 0%, #f6f3ee 40%, #efe9df 100%)",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
    },
    glowA: {
        position: "absolute",
        width: 260,
        height: 260,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(26,167,155,0.18), transparent 70%)",
        top: -120,
        left: -80,
    },
    glowB: {
        position: "absolute",
        width: 220,
        height: 220,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(58,163,255,0.18), transparent 70%)",
        bottom: -120,
        right: -60,
    },

    /* NAVBAR */
    navbar: {
        height: 72,
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(6px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 40px",
        borderBottom: "1px solid rgba(15, 23, 42, 0.06)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
    },
    navLeft: { display: "flex", alignItems: "center", gap: 14 },
    logo: {
        fontSize: 20,
        fontWeight: 700,
        color: "var(--ink-900)",
        cursor: "pointer",
    },
    navTag: {
        fontSize: 12,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.16em",
        color: "var(--mint-600)",
    },
    navRight: {
        display: "flex",
        alignItems: "center",
        gap: 22,
    },
    navLink: {
        fontWeight: 600,
        color: "var(--ink-600)",
        cursor: "pointer",
    },
    dropdown: { position: "relative" },
    dropdownMenu: {
        position: "absolute",
        top: 34,
        right: 0,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 12px 28px rgba(11,18,32,0.18)",
        minWidth: 190,
        overflow: "hidden",
        zIndex: 2000,
    },
    dropdownItem: {
        padding: "12px 16px",
        cursor: "pointer",
        fontWeight: 600,
        borderBottom: "1px solid #f1f1f1",
    },

    container: {
        width: "100%",
        maxWidth: 1100,
        margin: "40px auto 0",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 24,
        padding: "0 28px",
        position: "relative",
        zIndex: 1,
    },
    sideCard: {
        background: "#0f172a",
        color: "#fff",
        padding: "32px",
        borderRadius: 22,
        boxShadow: "0 18px 40px rgba(11,18,32,0.28)",
        animation: "fadeUp 0.8s ease both",
    },
    eyebrow: {
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: "0.24em",
        color: "rgba(255,255,255,0.7)",
        fontWeight: 700,
        marginBottom: 12,
    },
    sideTitle: {
        fontFamily: '"DM Serif Display", serif',
        fontSize: 30,
        margin: 0,
    },
    sideText: {
        marginTop: 14,
        color: "rgba(255,255,255,0.72)",
        lineHeight: 1.6,
    },
    sideNote: {
        marginTop: 22,
        padding: "12px 14px",
        borderRadius: 12,
        background: "rgba(255,255,255,0.08)",
        fontSize: 13,
    },

    /* CARD */
    card: {
        background: "#fff",
        width: "100%",
        padding: 32,
        borderRadius: 22,
        boxShadow: "var(--card-shadow)",
        animation: "fadeUp 0.9s ease both",
    },
    title: { fontSize: 24, fontWeight: 700, marginBottom: 6 },
    subtitle: { color: "var(--ink-600)", marginBottom: 20 },
    helper: { color: "var(--ink-600)", marginBottom: 10, fontSize: 13 },
    link: {
        color: "var(--mint-600)",
        fontWeight: 600,
        cursor: "pointer",
        textDecoration: "underline",
    },

    label: {
        fontWeight: 600,
        marginBottom: 6,
        display: "block",
        color: "var(--ink-700)",
    },

    error: {
        background: "#FDECEA",
        color: "#C62828",
        padding: 12,
        borderRadius: 10,
        marginBottom: 14,
        fontWeight: 600,
    },
    success: {
        background: "rgba(34,197,94,0.15)",
        color: "#166534",
        padding: 12,
        borderRadius: 10,
        marginBottom: 14,
        fontWeight: 600,
    },

    input: {
        width: "100%",
        padding: "13px 14px",
        borderRadius: 12,
        border: "1px solid rgba(15, 23, 42, 0.15)",
        marginBottom: 16,
        boxSizing: "border-box",
        background: "rgba(250, 250, 250, 0.9)",
    },

    actions: {
        display: "flex",
        gap: 10,
    },

    primaryBtn: {
        flex: 1,
        background: "var(--mint-500)",
        color: "#fff",
        padding: "12px",
        borderRadius: 12,
        border: "none",
        fontWeight: 700,
        cursor: "pointer",
    },

    secondaryBtn: {
        background: "rgba(15, 23, 42, 0.08)",
        padding: "12px",
        borderRadius: 12,
        border: "none",
        fontWeight: 600,
        cursor: "pointer",
    },
};
