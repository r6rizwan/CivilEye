import React, { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function OtpScreen() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const email = localStorage.getItem("resetEmail") || "";

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/api/verifyotp", { email, otp });
      localStorage.setItem("resetToken", res.data.resetToken);
      navigate("/reset-password");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Verify OTP</h2>
        <p style={styles.subtitle}>Enter the OTP sent to your email</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleVerify} style={styles.form}>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
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
};
