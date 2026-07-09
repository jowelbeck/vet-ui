export default function TermsOfService() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 800, margin: "0 auto", padding: "60px 24px", color: "#1e293b" }}>
      <a href="/" style={{ color: "#1a3d2b", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>← Back to VetsAI</a>
      <h1 style={{ fontSize: 36, fontWeight: 900, color: "#1a3d2b", marginTop: 32, marginBottom: 8 }}>Terms of Service</h1>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 40 }}>Last updated: July 8, 2026</p>
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a3d2b", marginBottom: 12 }}>1. Agreement</h2>
        <p style={{ lineHeight: 1.8, color: "#374151" }}>By using VetsAI you agree to these terms. VetsAI is operated by VetsAI Technologies, registered in Accra, Ghana.</p>
      </section>
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a3d2b", marginBottom: 12 }}>2. Who Can Use VetsAI</h2>
        <p style={{ lineHeight: 1.8, color: "#374151" }}>VetsAI is for licensed veterinary professionals, students and clinic staff. You confirm you will use AI outputs as decision support only — not as a replacement for professional judgment. You are responsible for all clinical decisions.</p>
      </section>
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a3d2b", marginBottom: 12 }}>3. AI Clinical Support</h2>
        <p style={{ lineHeight: 1.8, color: "#374151" }}>AI-generated content must be verified against current clinical guidelines before application. It does not constitute a definitive diagnosis or prescription. VetsAI Technologies accepts no liability for clinical outcomes resulting from AI-generated content.</p>
      </section>
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a3d2b", marginBottom: 12 }}>4. Subscription and Payment</h2>
        <ul style={{ lineHeight: 2, color: "#374151", paddingLeft: 24 }}>
          <li>Subscriptions are billed monthly via Paystack</li>
          <li>Cancel any time — takes effect at end of billing period</li>
          <li>No refunds for partial months</li>
          <li>Pricing may change with 30 days notice</li>
          <li>First 3 months free on all plans</li>
        </ul>
      </section>
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a3d2b", marginBottom: 12 }}>5. Your Data</h2>
        <p style={{ lineHeight: 1.8, color: "#374151" }}>You own all clinical data you enter. We do not claim ownership of your records. You may export your data at any time. See our <a href="/privacy" style={{ color: "#1a3d2b" }}>Privacy Policy</a> for details.</p>
      </section>
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a3d2b", marginBottom: 12 }}>6. Acceptable Use</h2>
        <ul style={{ lineHeight: 2, color: "#374151", paddingLeft: 24 }}>
          <li>Do not share login credentials</li>
          <li>Do not use VetsAI for unlawful purposes</li>
          <li>Do not attempt to reverse engineer the platform</li>
          <li>Do not use AI clinical support without a valid veterinary licence</li>
        </ul>
      </section>
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a3d2b", marginBottom: 12 }}>7. WOAH Disease Reporting</h2>
        <p style={{ lineHeight: 1.8, color: "#374151" }}>VetsAI assists with WOAH notifiable disease reporting. The responsibility to report to national authorities remains with the licensed veterinarian. All generated reports must be reviewed before official submission.</p>
      </section>
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a3d2b", marginBottom: 12 }}>8. Limitation of Liability</h2>
        <p style={{ lineHeight: 1.8, color: "#374151" }}>VetsAI Technologies shall not be liable for clinical outcomes, data loss or business interruption. Our total liability shall not exceed the amount paid in the 3 months preceding any claim.</p>
      </section>
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a3d2b", marginBottom: 12 }}>9. Governing Law</h2>
        <p style={{ lineHeight: 1.8, color: "#374151" }}>These terms are governed by the laws of Ghana. Disputes shall be resolved in the courts of Accra, Ghana.</p>
      </section>
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a3d2b", marginBottom: 12 }}>10. Contact</h2>
        <p style={{ lineHeight: 1.8, color: "#374151" }}>Email: <a href="mailto:legal@vetsai.vet" style={{ color: "#1a3d2b" }}>legal@vetsai.vet</a><br />Phone: +233 20 8140795<br />Address: Accra, Ghana</p>
      </section>
      <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 24, marginTop: 40 }}>
        <p style={{ fontSize: 13, color: "#94a3b8" }}>© 2026 VetsAI Technologies · <a href="/terms" style={{ color: "#1a3d2b" }}>Terms of Service</a> · <a href="/privacy" style={{ color: "#1a3d2b" }}>Privacy Policy</a></p>
      </div>
    </main>
  );
}
