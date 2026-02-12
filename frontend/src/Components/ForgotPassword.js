import React, { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/api/forgotpassword", { email });
      localStorage.setItem("resetEmail", email);
      setSuccess("OTP sent to your email.");
      setTimeout(() => navigate("/otp-verify"), 600);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Forgot Password</h2>
        <p style={styles.subtitle}>Enter your registered email to receive OTP</p>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "radial-gradient(circle at top, #ffffff 0%, #f6f3ee 40%, #efe9df 100%)",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "#fff",
    padding: 30,
    borderRadius: 18,
    boxShadow: "var(--card-shadow)",
  },
  title: { fontSize: 24, fontWeight: 700, marginBottom: 6 },
  subtitle: { color: "var(--ink-600)", marginBottom: 18 },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  input: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(15,23,42,0.15)",
    background: "rgba(250, 250, 250, 0.9)",
  },
  button: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "none",
    background: "var(--mint-500)",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
  error: {
    background: "rgba(248,113,113,0.15)",
    color: "#b91c1c",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    fontWeight: 600,
  },
  success: {
    background: "rgba(34,197,94,0.15)",
    color: "#166534",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    fontWeight: 600,
  },
};
