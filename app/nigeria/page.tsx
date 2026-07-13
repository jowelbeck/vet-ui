"use client";
import { trackEvent } from "@/lib/analytics";

export default function NigeriaPage() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      {/* Sticky bar */}
      <div style={{ background: "#008751", padding: "10px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, margin: 0 }}>🇳🇬 VetsAI is now available in Nigeria — <strong>Join veterinary professionals across Africa</strong></p>
        <a href="/demo" style={{ background: "#fff", color: "#008751", padding: "7px 20px", borderRadius: 6, fontWeight: 800, fontSize: 13, textDecoration: "none" }}>📅 Book a Free Demo →</a>
      </div>

      {/* Nav */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, background: "#1a3d2b", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🐾</div>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#1a3d2b" }}>VetsAI</span>
        </a>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <a href="/demo" style={{ color: "#64748b", textDecoration: "none", fontSize: 14 }}>Request demo</a>
          <a href="/signup" onClick={() => trackEvent("country_page_cta_click", { country: "Nigeria", destination: "signup" })} style={{ background: "#1a3d2b", color: "#fff", padding: "8px 20px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>Start free →</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #1a3d2b 0%, #2d6a4f 100%)", padding: "80px 40px", color: "#fff" }}>
        <div style={{ maxWidth: 760 }}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "6px 16px", fontSize: 13, marginBottom: 24 }}>🇳🇬 Built for Nigerian Veterinary Practice · WOAH-Aligned</div>
          <h1 style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.1, marginBottom: 24, letterSpacing: "-1px" }}>
            The Clinic Operating System<br />
            <em style={{ color: "#86efac", fontStyle: "normal" }}>for Nigeria&apos;s Veterinarians</em>
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: 24, maxWidth: 580 }}>Nigeria has over 5,000 registered veterinarians serving Africa's largest livestock sector. The need for digital clinic management has never been more urgent.</p>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.9)", lineHeight: 1.7, marginBottom: 40, maxWidth: 580 }}>VetsAI gives Nigeria&apos;s veterinary professionals a complete digital clinic — patient records, AI clinical support, pharmacy management, billing, and WOAH-aligned disease reporting. All in one place.</p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="/demo-login" onClick={() => trackEvent("country_page_cta_click", { country: "Nigeria", destination: "demo" })} style={{ background: "#86efac", color: "#1a3d2b", padding: "16px 36px", borderRadius: 10, fontWeight: 800, textDecoration: "none", fontSize: 16 }}>▶ Try live demo</a>
            <a href="/signup" onClick={() => trackEvent("country_page_cta_click", { country: "Nigeria", destination: "signup" })} style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "16px 36px", borderRadius: 10, fontWeight: 600, textDecoration: "none", fontSize: 16, border: "1px solid rgba(255,255,255,0.3)" }}>Start free trial →</a>
            <a href="/demo" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "16px 36px", borderRadius: 10, fontWeight: 600, textDecoration: "none", fontSize: 16, border: "1px solid rgba(255,255,255,0.3)" }}>📅 Book a Nigeria demo</a>
          </div>
          <p style={{ marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>No credit card · First 3 months free · Set up in 5 minutes</p>
        </div>
      </section>

      {/* Stats */}
      <div style={{ background: "#1a3d2b", padding: "24px 40px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
          {[
            { num: "8", label: "Integrated modules" },
            { num: "3-in-1", label: "Pets · Poultry · Livestock" },
            { num: "< 60s", label: "AI assessment time" },
            { num: "GHS 0", label: "To get started" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: "#86efac", marginBottom: 4 }}>{s.num}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section style={{ padding: "72px 40px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, color: "#1a3d2b", marginBottom: 12, textAlign: "center" }}>Built for how Nigeria&apos;s vets actually work</h2>
        <p style={{ fontSize: 16, color: "#64748b", textAlign: "center", marginBottom: 48 }}>Not a copy of a Western system. Built from the ground up for African veterinary practice.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {[
            { icon: "🧠", title: "AI Clinical Support", desc: "Differential diagnoses, drug dosages, and SOAP notes in under 60 seconds. Powered by Merck Veterinary Manual." },
            { icon: "💊", title: "Pharmacy Management", desc: "Track drug stock, expiry dates, and supplier invoices for pets, poultry and livestock." },
            { icon: "📁", title: "Patient Records", desc: "Complete medical history for all species. Works offline. No paper needed." },
            { icon: "⚠", title: "WOAH Disease Reporting", desc: "Auto-detect notifiable diseases and generate official reports for the Veterinary Council of Nigeria." },
            { icon: "💰", title: "Billing & Invoicing", desc: "Generate invoices, track payments, and manage clinic finances." },
            { icon: "📊", title: "Analytics", desc: "Case trends, pharmacy performance, and clinic growth metrics." },
          ].map(m => (
            <div key={m.title} style={{ background: "#fff", borderRadius: 14, padding: 28, border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{m.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#1a3d2b", marginBottom: 8 }}>{m.title}</div>
              <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>{m.desc.replace("{council}", "Veterinary Council of Nigeria")}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "linear-gradient(135deg, #1a3d2b, #2d6a4f)", padding: "72px 40px", textAlign: "center", color: "#fff" }}>
        <h2 style={{ fontSize: 40, fontWeight: 900, marginBottom: 16 }}>Ready to modernize your Nigeria clinic?</h2>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.75)", marginBottom: 40, maxWidth: 500, margin: "0 auto 40px" }}>Join veterinary professionals across Africa who trust VetsAI.</p>
        <a href="/signup" onClick={() => trackEvent("country_page_cta_click", { country: "Nigeria", destination: "signup" })} style={{ background: "#86efac", color: "#1a3d2b", padding: "18px 48px", borderRadius: 10, fontWeight: 800, textDecoration: "none", fontSize: 18, display: "inline-block", marginRight: 16 }}>Start free →</a>
        <a href="/demo" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "18px 48px", borderRadius: 10, fontWeight: 600, textDecoration: "none", fontSize: 18, display: "inline-block", border: "1px solid rgba(255,255,255,0.3)" }}>Book Nigeria demo →</a>
        <p style={{ marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>No credit card · First 3 months free · Cancel anytime</p>
      </section>

      <footer style={{ background: "#0f1f0f", padding: "32px 40px", color: "rgba(255,255,255,0.4)", fontSize: 13, textAlign: "center" }}>
        © {new Date().getFullYear()} VetsAI Technologies · vetsai.vet · +234 · Registered with Veterinary Council of Nigeria
      </footer>

      <a href="https://wa.me/233208140795?text=Hello%20VetsAI%2C%20I%20am%20a%20veterinarian%20in%20Nigeria%20and%20would%20like%20to%20learn%20more" target="_blank" style={{ position: "fixed", bottom: 24, right: 24, background: "#25D366", color: "#fff", width: 56, height: 56, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, textDecoration: "none", boxShadow: "0 4px 16px rgba(37,211,102,0.4)", zIndex: 1000 }}>
        💬
      </a>
    </main>
  );
}
