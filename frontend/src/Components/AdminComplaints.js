import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        loadComplaints();
    }, []);

    const loadComplaints = async () => {
        try {
            const res = await axios.get("http://localhost:7000/api/complaint/all");
            setComplaints(res.data);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    const statusStyles = {
        Pending: "#FFA726",
        Open: "#42A5F5",
        Assigned: "#7E57C2",
        Closed: "#EF5350",
        Resolved: "#66BB6A",
    };

    const filtered = complaints.filter((c) => {
        const text = search.toLowerCase();

        const matches =
            c.complaintId.toLowerCase().includes(text) ||
            c.email.toLowerCase().includes(text) ||
            c.complaintType.toLowerCase().includes(text);

        const matchStatus = filter === "All" || c.status === filter;

        return matches && matchStatus;
    });

    return (
        <div style={styles.page}>

            {/* TITLE */}
            <h2 style={styles.heading}>All Complaints</h2>

            {/* 🟦 Search + Filters */}
            <div style={styles.controls}>
                <div style={styles.searchBox}>
                    <span style={styles.searchIcon}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search by ID, email or type…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={styles.searchInput}
                    />
                </div>

                <select
                    style={styles.filter}
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Open">Open</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Closed">Closed</option>
                    <option value="Resolved">Resolved</option>
                </select>
            </div>

            {/* 📄 MODERN TABLE */}
            <div style={styles.card}>
                <table style={styles.table}>
                    <thead style={styles.thead}>
                        <tr>
                            <th style={{ padding: "5px" }}>Complaint ID</th>
                            <th>Type</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Assigned</th>
                            <th>Date</th>
                            <th style={{ textAlign: "center" }}>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.map((c, index) => (
                            <tr
                                key={c._id}
                                style={{
                                    ...styles.row,
                                    background: index % 2 === 0 ? "#FAFBFF" : "#FFFFFF",
                                }}
                            >
                                <td style={{ padding: "5px" }}>{c.complaintId}</td>
                                <td>{c.complaintType}</td>
                                <td>{c.email}</td>

                                <td>
                                    <span
                                        style={{
                                            ...styles.badge,
                                            background: statusStyles[c.status],
                                        }}
                                    >
                                        {c.status}
                                    </span>
                                </td>

                                <td>{c.assignedTo || "—"}</td>

                                <td>
                                    {new Date(c.createdAt).toLocaleDateString("en-IN")}
                                </td>

                                <td style={{ textAlign: "center", padding: "5px" }}>
                                    <button
                                        style={styles.viewBtn}
                                        onClick={() =>
                                            (window.location.href = `/admin/complaints/${c._id}`)
                                        }
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filtered.length === 0 && (
                    <p style={styles.noData}>No complaints found.</p>
                )}
            </div>
        </div>
    );
}

/* --------------------------------------------- */
/*                    STYLES                     */
/* --------------------------------------------- */

const styles = {
    page: {
        padding: "35px",
        minHeight: "100vh",
        background: "#EEF1F7",
        fontFamily: "Inter, sans-serif",
    },

    heading: {
        fontSize: "28px",
        fontWeight: 700,
        marginBottom: "20px",
        color: "#1D1F2C",
    },

    controls: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "20px",
        gap: "15px",
    },

    searchBox: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        background: "#fff",
        padding: "12px 16px",
        borderRadius: "12px",
        border: "1px solid #D5D9E2",
        boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
    },

    searchIcon: {
        marginRight: "10px",
        opacity: 0.6,
    },

    searchInput: {
        width: "100%",
        border: "none",
        fontSize: "15px",
        outline: "none",
        background: "transparent",
    },

    filter: {
        width: "180px",
        padding: "12px",
        borderRadius: "12px",
        border: "1px solid #D5D9E2",
        background: "#fff",
        fontSize: "15px",
    },

    card: {
        // padding: "10px",
        background: "#FFFFFF",
        borderRadius: "16px",
        boxShadow: "0 8px 28px rgba(0,0,0,0.08)",
        overflow: "hidden",
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "15px",
    },

    thead: {
        textAlign: "left",
        background: "#F6F7FC",
        borderBottom: "2px solid #E2E5EE",
    },

    row: {
        transition: "0.2s",
        padding: "12px 20px 0px 20px",
    },

    badge: {
        padding: "6px 12px",
        color: "white",
        borderRadius: "8px",
        fontWeight: 600,
        fontSize: "13px",
    },

    viewBtn: {
        padding: "8px 16px",
        background: "#304FFE",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: 600,
        transition: "0.2s",
    },

    noData: {
        padding: "20px",
        textAlign: "center",
        color: "#777",
    },
};
