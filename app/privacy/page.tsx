export default function PrivacyPolicy() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 800, margin: "0 auto", padding: "60px 24px", color: "#1e293b" }}>
      <a href="/" style={{ color: "#1a3d2b", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>← Back to VetsAI</a>
      <h1 style={{ fontSize: 36, fontWeight: 900, color: "#1a3d2b", marginTop: 32, marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 40 }}>Last updated: July 8, 2026</p>
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a3d2b", marginBottom: 12 }}>1. Who We Are</h2>
        <p style={{ lineHeight: 1.8, color: "#374151" }}>VetsAI Technologies is a veterinary clinic management platform built for veterinary professionals across Africa. We are registered in Accra, Ghana. Contact us at <a href="mailto:privacy@vetsai.vet" style={{ color: "#1a3d2b" }}>privacy@vetsai.vet</a> or +233 20 8140795.</p>
      </section>
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a3d2b", marginBottom: 12 }}>2. What Data We Collect</h2>
        <ul style={{ lineHeight: 2, color: "#374151", paddingLeft: 24 }}>
          <li><strong>Account data:</strong> Name, email, phone number, clinic name and country</li>
          <li><strong>Clinical data:</strong> Patient records, case notes, diagnoses, drug records and lab results</li>
          <li><strong>Payment data:</strong> Subscription plan and status — processed by Paystack, we do not store card details</li>
          <li><strong>Usage data:</strong> Pages visited, features used and device information</li>
        </ul>
      </section>
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a3d2b", marginBottom: 12 }}>3. How We Use Your Data</h2>
        <ul style={{ lineHeight: 2, color: "#374151", paddingLeft: 24 }}>
          <li>To provide and improve the VetsAI platform</li>
          <li>To process subscription payments via Paystack</li>
          <li>To send product updates and support communications</li>
          <li>To comply with WOAH disease reporting obligations</li>
        </ul>
      </section>
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a3d2b", marginBottom: 12 }}>4. Data Security</h2>
        <p style={{ lineHeight: 1.8, color: "#374151" }}>All data is stored on Supabase PostgreSQL with row-level security — each clinic accesses only their own data. All data is encrypted at rest and in transit using TLS. We enforce authentication on all API endpoints.</p>
      </section>
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a3d2b", marginBottom: 12 }}>5. Data Sharing</h2>
        <p style={{ lineHeight: 1.8, color: "#374151" }}>We do not sell your data. We share data only with Supabase, Vercel, Railway, Paystack, OpenAI (symptom data only, no patient identifiers), Resend, and regulatory authorities when legally required for WOAH disease reporting.</p>
      </section>
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a3d2b", marginBottom: 12 }}>6. Your Rights</h2>
        <p style={{ lineHeight: 1.8, color: "#374151" }}>You may access, correct, export or delete your data at any time by emailing <a href="mailto:privacy@vetsai.vet" style={{ color: "#1a3d2b" }}>privacy@vetsai.vet</a>. We respond within 7 business days.</p>
      </section>
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a3d2b", marginBottom: 12 }}>7. Data Retention</h2>
        <p style={{ lineHeight: 1.8, color: "#374151" }}>We retain data while your account is active. On cancellation, data is retained for 90 days then permanently deleted unless you request earlier deletion.</p>
      </section>
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a3d2b", marginBottom: 12 }}>8. Cookies</h2>
        <p style={{ lineHeight: 1.8, color: "#374151" }}>We use essential cookies only for authentication and session management. No advertising or tracking cookies.</p>
      </section>
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a3d2b", marginBottom: 12 }}>9. Contact</h2>
        <p style={{ lineHeight: 1.8, color: "#374151" }}>Email: <a href="mailto:privacy@vetsai.vet" style={{ color: "#1a3d2b" }}>privacy@vetsai.vet</a><br />Phone: +233 20 8140795<br />Address: Accra, Ghana</p>
      </section>
      <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 24, marginTop: 40 }}>
        <p style={{ fontSize: 13, color: "#94a3b8" }}>© 2026 VetsAI Technologies · <a href="/terms" style={{ color: "#1a3d2b" }}>Terms of Service</a> · <a href="/privacy" style={{ color: "#1a3d2b" }}>Privacy Policy</a></p>
      </div>
    </main>
  );
}
