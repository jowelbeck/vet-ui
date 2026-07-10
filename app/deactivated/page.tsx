"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function DeactivatedPage() {
  // Ensure any lingering session is cleared when a deactivated user lands here.
  useEffect(() => {
    supabase.auth.signOut().catch(() => {});
  }, []);

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9", fontFamily: "system-ui, sans-serif", padding: 20 }}>
      <div style={{ maxWidth: 460, background: "#fff", borderRadius: 16, padding: 40, textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1a3d2b", marginBottom: 12 }}>Account deactivated</h1>
        <p style={{ color: "#64748b", lineHeight: 1.7, fontSize: 15, marginBottom: 24 }}>
          Your account has been deactivated and you no longer have access. If you
          believe this is a mistake, please contact support.
        </p>
        <a href="mailto:support@vetsai.vet" style={{ background: "#1a3d2b", color: "#fff", padding: "12px 28px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 15, display: "inline-block" }}>
          Contact support
        </a>
        <p style={{ marginTop: 20, fontSize: 13 }}>
          <a href="/login" style={{ color: "#64748b" }}>Back to login</a>
        </p>
      </div>
    </main>
  );
}
