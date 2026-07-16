"use client";
import { trackEvent } from "@/lib/analytics";

export default function KenyaPage() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ background: "#006600", padding: "10px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, margin: 0 }}>🇰🇪 VetsAI is now available in Kenya — <strong>Join veterinary professionals across Africa</strong></p>
        <a href="/demo" style={{ background: "#fff", color: "#006600", padding: "7px 20px", borderRadius: 6, fontWeight: 800, fontSize: 13, textDecoration: "none" }}>📅 Book a Free Demo →</a>
      </div>
      <nav style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, background: "#1a3d2b", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🐾</div>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#1a3d2b" }}>VetsAI</span>
        </a>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <a href="/demo" style={{ color: "#64748b", textDecoration: "none", fontSize: 14 }}>Request demo</a>
          <a href="/signup" onClick={() => trackEvent("country_page_cta_click", { country: "Kenya", destination: "signup" })} style={{ background: "#1a3d2b", color: "#fff", padding: "8px 20px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>Start free →</a>
        </div>
      </nav>
      <section style={{ background: "linear-gradient(135deg, #1a3d2b 0%, #2d6a4f 100%)", padding: "80px 40px", color: "#fff" }}>
        <div style={{ maxWidth: 760 }}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "6px 16px", fontSize: 13, marginBottom: 24 }}>🇰🇪 Built for Kenyan Veterinary Practice · WOAH-Aligned</div>
          <h1 style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.1, marginBottom: 24, letterSpacing: "-1px" }}>
            The Clinic Operating System<br />
            <em style={{ color: "#86efac", fontStyle: "normal" }}>for Kenya&apos;s Veterinarians</em>
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: 40, maxWidth: 580 }}>Kenya's veterinary professionals serve one of East Africa's largest livestock sectors. Digital clinic management is now essential for modern veterinary practice.</p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="/demo-login" onClick={() => trackEvent("country_page_cta_click", { country: "Kenya", destination: "demo" })} style={{ background: "#86efac", color: "#1a3d2b", padding: "16px 36px", borderRadius: 10, fontWeight: 800, textDecoration: "none", fontSize: 16 }}>▶ Try live demo</a>
            <a href="/signup" onClick={() => trackEvent("country_page_cta_click", { country: "Kenya", destination: "signup" })} style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "16px 36px", borderRadius: 10, fontWeight: 600, textDecoration: "none", fontSize: 16, border: "1px solid rgba(255,255,255,0.3)" }}>Start free trial →</a>
            <a href="/demo" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "16px 36px", borderRadius: 10, fontWeight: 600, textDecoration: "none", fontSize: 16, border: "1px solid rgba(255,255,255,0.3)" }}>📅 Book a Kenya demo</a>
          </div>
          <p style={{ marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>No credit card · First 3 months free · Set up in 5 minutes</p>
        </div>
      </section>
      <section style={{ background: "linear-gradient(135deg, #1a3d2b, #2d6a4f)", padding: "72px 40px", textAlign: "center", color: "#fff" }}>
        <h2 style={{ fontSize: 40, fontWeight: 900, marginBottom: 16 }}>Ready to modernize your Kenya clinic?</h2>
        <a href="/signup" onClick={() => trackEvent("country_page_cta_click", { country: "Kenya", destination: "signup" })} style={{ background: "#86efac", color: "#1a3d2b", padding: "18px 48px", borderRadius: 10, fontWeight: 800, textDecoration: "none", fontSize: 18, display: "inline-block", marginRight: 16 }}>Start free →</a>
        <a href="/demo" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "18px 48px", borderRadius: 10, fontWeight: 600, textDecoration: "none", fontSize: 18, display: "inline-block", border: "1px solid rgba(255,255,255,0.3)" }}>Book Kenya demo →</a>
      </section>
      <footer style={{ background: "#0f1f0f", padding: "32px 40px", color: "rgba(255,255,255,0.4)", fontSize: 13, textAlign: "center" }}>
        © {new Date().getFullYear()} VetsAI Technologies · vetsai.vet · +254 · Kenya Veterinary Board
      </footer>
      <a href="https://wa.me/233208140795?text=Hello%20VetsAI%2C%20I%20am%20a%20veterinarian%20in%20Kenya" target="_blank" style={{ position: "fixed", bottom: 24, right: 24, background: "#25D366", color: "#fff", width: 56, height: 56, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, textDecoration: "none", boxShadow: "0 4px 16px rgba(37,211,102,0.4)", zIndex: 1000 }}>💬</a>
    </main>
  );
}
