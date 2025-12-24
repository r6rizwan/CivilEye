import React, { useState } from "react";
import axios from "axios";

export default function FileComplaint() {
    const [form, setForm] = useState({
        complaintType: "",
        description: "",
        file: null,
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setForm((prev) => ({
            ...prev,
            file: e.target.files[0],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        const email = localStorage.getItem("email"); // email saved at login

        if (!email) {
            setError("User email not found. Login again.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("complaintType", form.complaintType);
            formData.append("description", form.description);
            formData.append("email", email);

            if (form.file) {
                formData.append("file", form.file);
            }

            const res = await axios.post("http://localhost:7000/api/complaint", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMessage("Complaint submitted successfully!", res);
            setForm({ complaintType: "", description: "", file: null });

        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong.");
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>

                <h2 style={styles.title}>File a Complaint</h2>
                <p style={styles.subtitle}>Provide details about your complaint</p>

                {message && <p style={styles.success}>{message}</p>}
                {error && <p style={styles.error}>{error}</p>}

                <form onSubmit={handleSubmit} style={styles.form}>

                    {/* Complaint Type */}
                    <select
                        name="complaintType"
                        value={form.complaintType}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    >
                        <option value="">Select Complaint Type</option>
                        <option value="Cyber Crime">Cyber Crime</option>
                        <option value="Harassment">Harassment</option>
                        <option value="Fraud">Fraud</option>
                        <option value="Theft">Theft</option>
                        <option value="Other">Other</option>
                    </select>

                    {/* Description */}
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describe the issue"
                        style={{ ...styles.input, height: "120px" }}
                        required
                    />

                    {/* File Upload */}
                    <input
                        type="file"
                        style={styles.input}
                        onChange={handleFileChange}
                        accept="image/*,.pdf"
                    />

                    <button type="submit" style={styles.button}>
                        Submit Complaint
                    </button>
                </form>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        padding: "40px 20px",
        display: "flex",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e0eaff, #f6f9ff)",
    },

    card: {
        width: "100%",
        maxWidth: "500px",
        background: "#fff",
        padding: "30px",
        borderRadius: "16px",
        boxShadow: "0px 10px 30px rgba(0,0,0,0.12)",
    },

    title: {
        fontSize: "26px",
        fontWeight: "700",
        textAlign: "center",
    },

    subtitle: {
        fontSize: "14px",
        textAlign: "center",
        marginBottom: "25px",
        color: "#666",
    },

    form: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },

    input: {
        padding: "14px",
        borderRadius: "10px",
        border: "1px solid #dce1ef",
        fontSize: "15px",
        background: "#fafafa",
    },

    button: {
        padding: "14px",
        background: "#304ffe",
        color: "white",
        border: "none",
        borderRadius: "10px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
    },

    success: {
        color: "green",
        textAlign: "center",
        fontWeight: "600",
    },

    error: {
        color: "red",
        textAlign: "center",
        fontWeight: "600",
    },
};
