import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function AdminComplaintDetails() {
    const { id } = useParams();
    const [complaint, setComplaint] = useState(null);
    const [investigators, setInvestigators] = useState([]);
    const [selectedOfficer, setSelectedOfficer] = useState("");
    const [solution, setSolution] = useState("");
    const [statusMessage, setStatusMessage] = useState("");

    useEffect(() => {
        const loadComplaint = async () => {
            try {
                const res = await axios.get(`http://localhost:7000/api/complaint/complaints/${id}`);
                setComplaint(res.data);
            } catch (err) {
                console.error("Error fetching complaint:", err);
            }
        };

        const loadInvestigators = async () => {
            try {
                const res = await axios.get("http://localhost:7000/api/investigators");
                setInvestigators(res.data);
            } catch (err) {
                console.error("Error fetching investigators:", err);
            }
        };

        loadComplaint();
        loadInvestigators();
    }, [id]);
    
    const assignOfficer = async () => {
        if (!selectedOfficer) {
            return alert("Please select an investigator");
        }

        try {
            await axios.put(
                `http://localhost:7000/api/complaint/complaints/${id}/assign`,
                { assignedTo: selectedOfficer }
            );
            setStatusMessage("Investigator assigned successfully!");
            fetchComplaint();
        } catch (err) {
            console.error(err);
        }
    };

    const addSolutionHandler = async () => {
        if (!solution.trim()) {
            return alert("Please enter a solution/remark");
        }

        try {
            await axios.put(
                `http://localhost:7000/api/complaint/complaints/${id}/solution`,
                { solution }
            );
            setStatusMessage("Solution added! Complaint marked Resolved.");
            fetchComplaint();
        } catch (err) {
            console.error(err);
        }
    };

    if (!complaint) {
        return <h2 style={{ padding: 40 }}>Loading complaint details…</h2>;
    }

    return (
        <div style={styles.page}>
            <h2 style={styles.heading}>Complaint Details</h2>

            {statusMessage && <p style={styles.success}>{statusMessage}</p>}

            <div style={styles.cardsWrap}>

                {/* LEFT — Complaint Info */}
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Complaint Information</h3>

                    <div style={styles.infoRow}>
                        <span>ID:</span>
                        <strong>{complaint.complaintId}</strong>
                    </div>

                    <div style={styles.infoRow}>
                        <span>Type:</span>
                        <strong>{complaint.complaintType}</strong>
                    </div>

                    <div style={styles.infoRow}>
                        <span>Status:</span>
                        <span style={{ ...styles.badge, background: "#304FFE" }}>
                            {complaint.status}
                        </span>
                    </div>

                    <div style={styles.infoRow}>
                        <span>Date Filed:</span>
                        <strong>{new Date(complaint.createdAt).toLocaleDateString()}</strong>
                    </div>

                    <div style={styles.textBlock}>
                        <span>Description:</span>
                        <p>{complaint.description}</p>
                    </div>

                    {complaint.file && (
                        <div style={{ marginTop: "15px" }}>
                            <span>Attached File:</span>
                            <a
                                href={`http://localhost:7000/uploads/${complaint.file}`}
                                target="_blank"
                                rel="noreferrer"
                                style={styles.fileLink}
                            >
                                View File
                            </a>
                        </div>
                    )}
                </div>

                {/* RIGHT — Assignment Panel */}
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Assign Investigator</h3>

                    <select
                        style={styles.dropdown}
                        value={selectedOfficer}
                        onChange={(e) => setSelectedOfficer(e.target.value)}
                    >
                        <option value="">Select Investigator</option>
                        {investigators.map((inv) => (
                            <option key={inv._id} value={inv.email}>
                                {inv.name} ({inv.department})
                            </option>
                        ))}
                    </select>

                    <button style={styles.primaryBtn} onClick={assignOfficer}>
                        Assign Officer
                    </button>

                    <h3 style={{ ...styles.cardTitle, marginTop: "30px" }}>
                        Add Solution / Remarks
                    </h3>

                    <textarea
                        style={styles.textArea}
                        rows={4}
                        placeholder="Enter solution or remarks…"
                        value={solution}
                        onChange={(e) => setSolution(e.target.value)}
                    />

                    <button style={styles.secondaryBtn} onClick={addSolutionHandler}>
                        Submit Solution
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        padding: "35px",
        background: "#EEF1F7",
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
    },

    heading: {
        fontSize: "28px",
        fontWeight: "700",
        marginBottom: "25px",
    },

    success: {
        background: "#D1F5DA",
        padding: "12px 16px",
        borderRadius: "10px",
        color: "#1B5E20",
        fontWeight: "600",
        marginBottom: "20px",
        maxWidth: "500px",
    },

    cardsWrap: {
        display: "flex",
        gap: "25px",
    },

    card: {
        flex: 1,
        background: "#fff",
        padding: "25px",
        borderRadius: "16px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
    },

    cardTitle: {
        fontSize: "20px",
        fontWeight: "700",
        marginBottom: "18px",
    },

    infoRow: {
        display: "flex",
        justifyContent: "space-between",
        padding: "8px 0",
        fontSize: "15px",
        borderBottom: "1px solid #EEE",
    },

    dropdown: {
        width: "100%",
        padding: "12px",
        marginBottom: "15px",
        borderRadius: "12px",
        border: "1px solid #D1D5E2",
        fontSize: "15px",
    },

    textBlock: {
        marginTop: "15px",
        fontSize: "15px",
    },

    textArea: {
        width: "100%",
        padding: "12px",
        borderRadius: "10px",
        border: "1px solid #D1D5E2",
        fontSize: "15px",
        marginBottom: "12px",
        resize: "none",
    },

    primaryBtn: {
        width: "100%",
        background: "#304FFE",
        color: "#fff",
        padding: "12px",
        borderRadius: "10px",
        border: "none",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
    },

    secondaryBtn: {
        width: "100%",
        background: "#00A86B",
        color: "#fff",
        padding: "12px",
        borderRadius: "10px",
        border: "none",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
        marginTop: "5px",
    },

    badge: {
        padding: "6px 12px",
        color: "#fff",
        borderRadius: "6px",
        fontSize: "13px",
        fontWeight: "600",
    },

    fileLink: {
        color: "#1E4FFF",
        fontWeight: "600",
        textDecoration: "none",
    },
};
