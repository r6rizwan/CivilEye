import React, { useState } from "react";
import axios from "axios";

const STEPS = ["Pending", "Assigned", "Resolved"];

const COLORS = {
    Pending: "#FFA726",
    Assigned: "#5C6BC0",
    Resolved: "#2E7D32",
};

export default function ComplaintTracking() {
    const [queryId, setQueryId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);

    const handleSearch = async () => {
        if (!queryId.trim()) return setError("Please enter a complaint ID");

        setError("");
        setLoading(true);
        setResult(null);

        const email = localStorage.getItem("email");

        try {
            const res = await axios.get(
                `http://localhost:7000/api/complaint/complaint-tracking/${queryId}/${email}`
            );
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.error || "Unable to fetch complaint");
        } finally {
            setLoading(false);
        }
    };

    const getStepState = (step, current) => {
        const sIndex = STEPS.indexOf(step);
        const cIndex = STEPS.indexOf(current);

        if (sIndex < cIndex) return "completed";
        if (sIndex === cIndex) return "active";
        return "pending";
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <h2 style={styles.heading}>Track Complaint</h2>

                {/* Search Box */}
                <div style={styles.searchRow}>
                    <input
                        value={queryId}
                        placeholder="Enter Complaint ID"
                        onChange={(e) => setQueryId(e.target.value)}
                        style={styles.input}
                    />
                    <button
                        style={styles.btn}
                        disabled={loading}
                        onClick={handleSearch}
                    >
                        {loading ? "Searching..." : "Track"}
                    </button>
                </div>

                {error && <p style={styles.error}>{error}</p>}

                {!result && !loading && !error && (
                    <p style={styles.placeholder}>
                        Enter your complaint ID above to view its status.
                    </p>
                )}

                {/* Result Card */}
                {result && (
                    <div style={styles.card}>

                        {/* HEADER */}
                        <div style={styles.header}>
                            <div>
                                <h3 style={styles.type}>{result.complaintType}</h3>
                                <p style={styles.id}>ID: {result.complaintId}</p>
                            </div>

                            <span
                                style={{
                                    ...styles.status,
                                    background: COLORS[result.status],
                                }}
                            >
                                {result.status}
                            </span>
                        </div>

                        {/* TOP PRIORITY SECTION */}
                        <div style={styles.infoBox}>
                            <p><strong>Filed On:</strong> {new Date(result.createdAt).toLocaleString()}</p>
                            <p><strong>Assigned Officer:</strong> {result.assignedTo || "Not Assigned"}</p>
                            <p><strong>Solution:</strong> {result.solution || "No update yet"}</p>
                        </div>

                        {/* TIMELINE */}
                        <div style={styles.timelineSection}>
                            <p style={styles.timelineHeading}>Progress</p>

                            <div style={styles.timeline}>
                                {STEPS.map((step, index) => {
                                    const state = getStepState(step, result.status);
                                    const color =
                                        state === "active" || state === "completed"
                                            ? COLORS[result.status]
                                            : "#BDBDBD";

                                    return (
                                        <div style={styles.timelineStep} key={step}>
                                            <div
                                                style={{
                                                    ...styles.dot,
                                                    background: color,
                                                    boxShadow:
                                                        state === "active"
                                                            ? `0 0 0 6px ${color}33`
                                                            : "none",
                                                }}
                                            />
                                            <span
                                                style={{
                                                    ...styles.timelineLabel,
                                                    color: state === "pending" ? "#777" : color,
                                                    fontWeight: state === "active" ? 700 : 500,
                                                }}
                                            >
                                                {step}
                                            </span>

                                            {index < STEPS.length - 1 && (
                                                <div
                                                    style={{ ...styles.line, background: color }}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* DESCRIPTION */}
                        <div style={{ marginTop: 30 }}>
                            <p style={styles.label}>Description</p>
                            <div style={styles.desc}>{result.description}</div>
                        </div>

                        {/* ATTACHMENT */}
                        {result.file && (
                            <div style={{ marginTop: 20 }}>
                                <a
                                    href={encodeURI(`http://localhost:7000/uploads/${String(result.file).replace(/\\/g, "/").replace(/^\/+/, "")}`)}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={styles.link}
                                >
                                    📎 View Attachment
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

//
// STYLES
//

const styles = {
    page: {
        minHeight: "100vh",
        padding: "40px 20px",
        background: "#F4F6FF",
        display: "flex",
        justifyContent: "center",
    },

    container: {
        width: "100%",
        maxWidth: "850px",
    },

    heading: {
        fontSize: "28px",
        fontWeight: 700,
        marginBottom: "20px",
        color: "#1A237E",
    },

    searchRow: {
        display: "flex",
        gap: "12px",
    },

    input: {
        flex: 1,
        padding: "12px",
        borderRadius: "10px",
        border: "1px solid #CDD2E6",
        fontSize: "15px",
    },

    btn: {
        padding: "12px 20px",
        borderRadius: "10px",
        border: "none",
        background: "#304FFE",
        color: "#fff",
        fontWeight: 600,
        cursor: "pointer",
    },

    error: {
        color: "#D32F2F",
        marginTop: 10,
        fontWeight: 600,
    },

    placeholder: {
        color: "#777",
        marginTop: 15,
    },

    card: {
        background: "#fff",
        padding: "25px",
        marginTop: "20px",
        borderRadius: "18px",
        boxShadow: "0 10px 26px rgba(0,0,0,0.1)",
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },

    type: {
        margin: 0,
        fontSize: "22px",
        fontWeight: 700,
    },

    id: {
        marginTop: 4,
        color: "#666",
    },

    status: {
        padding: "8px 14px",
        borderRadius: "10px",
        color: "white",
        fontWeight: 600,
    },

    infoBox: {
        marginTop: 20,
        lineHeight: 1.7,
        fontSize: "15px",
        color: "#333",
        background: "#F8F9FF",
        padding: "14px",
        borderRadius: "12px",
        border: "1px solid #E0E3F1",
    },

    timelineSection: { marginTop: 30 },

    timelineHeading: { fontWeight: 700, marginBottom: 14 },

    timeline: {
        display: "flex",
        alignItems: "center",
        position: "relative",
    },

    timelineStep: {
        flex: 1,
        textAlign: "center",
        position: "relative",
    },

    dot: {
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        margin: "0 auto",
    },

    timelineLabel: {
        marginTop: 5,
        fontSize: "13px",
    },

    line: {
        height: "3px",
        width: "100%",
        position: "absolute",
        left: "50%",
        marginTop: "-13px",
        zIndex: -1,
        opacity: 0.8,
    },

    label: {
        fontWeight: 600,
        marginBottom: 8,
    },

    desc: {
        background: "#F2F4FF",
        padding: "12px",
        borderRadius: "10px",
        border: "1px solid #E0E7FF",
    },

    link: {
        color: "#304FFE",
        fontWeight: 600,
        textDecoration: "none",
    },
};
