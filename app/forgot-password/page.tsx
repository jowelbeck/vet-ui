"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email) { setError("Please enter your email."); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });
    if (err) { setError(err.message); setLoading(false); return; }
    setSent(true);
    setLoading(false);
  };

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1a3d2b 0%, #2d6a4f 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 48, width: "100%", maxWidth: 400, boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🐾</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1a3d2b", marginBottom: 4 }}>Forgot password?</h1>
          <p style={{ fontSize: 13, color: "#94a3b8" }}>Enter your email to receive a reset link</p>
        </div>
        {sent ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📧</div>
            <div style={{ color: "#16a34a", fontWeight: 700, fontSize: 15, marginBottom: 8 }}>Reset link sent!</div>
            <div style={{ color: "#64748b", fontSize: 13 }}>Check your email and click the link to reset your password.</div>
            <a href="/login" style={{ display: "block", marginTop: 20, fontSize: 13, color: "#1a3d2b", textDecoration: "none", fontWeight: 600 }}>← Back to login</a>
          </div>
        ) : (
          <>
            {error && <div style={{ background: "#fef2f2", color: "#dc2626", padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 13 }}>{error}</div>}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@clinic.com" style={{ width: "100%", padding: "11px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, boxSizing: "border-box" as const }} />
            </div>
            <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", background: "#1a3d2b", color: "#fff", padding: "13px", borderRadius: 8, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>
              {loading ? "Sending..." : "Send reset link →"}
            </button>
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <a href="/login" style={{ fontSize: 13, color: "#94a3b8", textDecoration: "none" }}>← Back to login</a>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
