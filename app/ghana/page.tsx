"use client";
import { trackEvent } from "@/lib/analytics";

export default function GhanaPage() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      {/* Sticky bar */}
      <div style={{ background: "#006b3f", padding: "10px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, margin: 0 }}>🇬🇭 VetsAI is now available in Ghana — <strong>Join veterinary professionals across Africa</strong></p>
        <a href="/demo" style={{ background: "#fff", color: "#006b3f", padding: "7px 20px", borderRadius: 6, fontWeight: 800, fontSize: 13, textDecoration: "none" }}>📅 Book a Free Demo →</a>
      </div>

      {/* Nav */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, background: "#1a3d2b", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🐾</div>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#1a3d2b" }}>VetsAI</span>
        </a>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <a href="/demo" style={{ color: "#64748b", textDecoration: "none", fontSize: 14 }}>Request demo</a>
          <a href="/signup" onClick={() => trackEvent("country_page_cta_click", { country: "Ghana", destination: "signup" })} style={{ background: "#1a3d2b", color: "#fff", padding: "8px 20px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>Start free →</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #2C1810 0%, #4A2C1A 30%, #1B3A2D 70%, #0D2418 100%)", padding: "80px 40px", color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 760 }}>
        
        {/* Animal scene */}
        <div style={{ position: "absolute", bottom: 0, right: 0, width: "50%", height: "100%", pointerEvents: "none", overflow: "hidden" }}>
          <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", bottom: 0, right: 0, width: "100%", height: "100%", opacity: 0.1 }}>
            <ellipse cx="400" cy="490" rx="380" ry="20" fill="rgba(255,255,255,0.3)"/>
            <g transform="translate(60, 180)">
              <ellipse cx="120" cy="160" rx="100" ry="65" fill="white"/>
              <ellipse cx="220" cy="120" rx="45" ry="38" fill="white"/>
              <ellipse cx="258" cy="130" rx="20" ry="15" fill="rgba(255,255,255,0.7)"/>
              <circle cx="238" cy="112" r="6" fill="rgba(0,0,0,0.3)"/>
              <path d="M200,88 Q185,65 175,70" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round"/>
              <rect x="50" y="215" width="22" height="90" rx="8" fill="white"/>
              <rect x="85" y="215" width="22" height="90" rx="8" fill="white"/>
              <rect x="140" y="215" width="22" height="90" rx="8" fill="white"/>
              <rect x="175" y="215" width="22" height="90" rx="8" fill="white"/>
            </g>
            <g transform="translate(340, 230)">
              <ellipse cx="70" cy="115" rx="58" ry="40" fill="white"/>
              <ellipse cx="138" cy="68" rx="30" ry="26" fill="white"/>
              <path d="M118,48 Q105,42 100,65 Q105,75 118,70 Z" fill="white"/>
              <rect x="25" y="148" width="14" height="65" rx="5" fill="white"/>
              <rect x="48" y="148" width="14" height="65" rx="5" fill="white"/>
              <rect x="82" y="148" width="14" height="65" rx="5" fill="white"/>
              <rect x="105" y="148" width="14" height="65" rx="5" fill="white"/>
            </g>
            <g transform="translate(560, 260)">
              <ellipse cx="40" cy="100" rx="32" ry="42" fill="white"/>
              <circle cx="65" cy="48" r="18" fill="white"/>
              <path d="M58,32 Q60,20 65,25 Q67,15 72,22 Q75,12 78,20 Q75,30 65,32 Z" fill="rgba(255,255,255,0.8)"/>
              <rect x="28" y="138" width="10" height="55" rx="3" fill="white"/>
              <rect x="45" y="138" width="10" height="55" rx="3" fill="white"/>
            </g>
            <g transform="translate(680, 300)">
              <ellipse cx="30" cy="120" rx="25" ry="35" fill="white"/>
              <circle cx="32" cy="75" r="22" fill="white"/>
              <polygon points="18,58 12,38 28,52" fill="white"/>
              <polygon points="46,58 52,38 36,52" fill="white"/>
              <ellipse cx="18" cy="152" rx="12" ry="7" fill="rgba(255,255,255,0.8)"/>
              <ellipse cx="42" cy="152" rx="12" ry="7" fill="rgba(255,255,255,0.8)"/>
              <path d="M55,140 Q75,120 70,100 Q65,85 50,90" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round"/>
            </g>
          </svg>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(134,239,172,0.15)", border: "1px solid rgba(134,239,172,0.4)", borderRadius: 24, padding: "6px 16px", marginBottom: 16 }}>
          <span style={{ background: "#86efac", color: "#1a3d2b", fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 20 }}>🚀 New</span>
          <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 13 }}>🚀 Major Upgrade — Disease Surveillance · Mixed Practice · Border Management</span>
        </div>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "6px 16px", fontSize: 13, marginBottom: 24 }}>🇬🇭 Built for Ghanaian Veterinary Practice · WOAH-Aligned</div>
          <h1 style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.1, marginBottom: 24, letterSpacing: "-1px" }}>
            The Clinic Operating System<br />
            <em style={{ color: "#86efac", fontStyle: "normal" }}>for Ghana&apos;s Veterinarians</em>
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: 24, maxWidth: 580 }}>Ghana's veterinary community serves a large and growing livestock sector. Most clinics still use paper records and WhatsApp for patient management.</p>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.9)", lineHeight: 1.7, marginBottom: 40, maxWidth: 580 }}>VetsAI gives Ghana&apos;s veterinary professionals a complete digital clinic — patient records, AI clinical support, pharmacy management, billing, and WOAH-aligned disease reporting. All in one place.</p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="/demo-login" onClick={() => trackEvent("country_page_cta_click", { country: "Ghana", destination: "demo" })} style={{ background: "#86efac", color: "#1a3d2b", padding: "16px 36px", borderRadius: 10, fontWeight: 800, textDecoration: "none", fontSize: 16 }}>▶ Try live demo</a>
            <a href="/signup" onClick={() => trackEvent("country_page_cta_click", { country: "Ghana", destination: "signup" })} style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "16px 36px", borderRadius: 10, fontWeight: 600, textDecoration: "none", fontSize: 16, border: "1px solid rgba(255,255,255,0.3)" }}>Start free trial →</a>
            <a href="/demo" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "16px 36px", borderRadius: 10, fontWeight: 600, textDecoration: "none", fontSize: 16, border: "1px solid rgba(255,255,255,0.3)" }}>📅 Book a Ghana demo</a>
          </div>
          <p style={{ marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>First 10 clinics get 3 months free · No credit card · Set up in 5 minutes</p>
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
        <h2 style={{ fontSize: 36, fontWeight: 800, color: "#1a3d2b", marginBottom: 12, textAlign: "center" }}>Built for how Ghana&apos;s vets actually work</h2>
        <p style={{ fontSize: 16, color: "#64748b", textAlign: "center", marginBottom: 48 }}>Not a copy of a Western system. Built from the ground up for African veterinary practice.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {[
            { icon: "🧠", title: "AI Clinical Support", desc: "Differential diagnoses, drug dosages, and SOAP notes in under 60 seconds. Powered by Merck Veterinary Manual." },
            { icon: "💊", title: "Pharmacy Management", desc: "Track drug stock, expiry dates, and supplier invoices for pets, poultry and livestock." },
            { icon: "📁", title: "Patient Records", desc: "Complete medical history for all species. Works offline. No paper needed." },
            { icon: "⚠", title: "WOAH Disease Reporting", desc: "Auto-detect notifiable diseases and generate official reports for the Ghana Veterinary Council." },
            { icon: "💰", title: "Billing & Invoicing", desc: "Generate invoices, track payments, and manage clinic finances." },
            { icon: "📊", title: "Analytics", desc: "Case trends, pharmacy performance, and clinic growth metrics." },
          ].map(m => (
            <div key={m.title} style={{ background: "#fff", borderRadius: 14, padding: 28, border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{m.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#1a3d2b", marginBottom: 8 }}>{m.title}</div>
              <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>{m.desc.replace("{council}", "Ghana Veterinary Council")}</div>
            </div>
          ))}
        </div>
      </section>


      {/* Upgrade highlights */}
      <section style={{ padding: "48px 40px", background: "#f0fdf4" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ display: "inline-block", background: "#86efac", color: "#1a3d2b", padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 800, marginBottom: 12 }}>🚀 Major Upgrade</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: "#1a3d2b" }}>VetsAI Multisystem Upgrade</h2>
            <p style={{ color: "#64748b", fontSize: 15, marginTop: 8 }}>Disease surveillance, mixed practice and border management — now live</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {[
              { icon: "⚠️", title: "WOAH Disease Surveillance", desc: "Auto-detect 30+ notifiable diseases. One-click report to authorities.", badge: "New" },
              { icon: "🌍", title: "Border & Movement Control", desc: "Animal movement certificates and cross-border disease risk alerts for livestock and poultry.", badge: "New" },
              { icon: "🐔", title: "Mixed Practice Support", desc: "One platform for pets, poultry and livestock with species-specific clinical protocols.", badge: "New" },
              { icon: "🌾", title: "Farmer Portal", desc: "Simplified flock management for poultry farmers — disease alerts and vaccination scheduling.", badge: "Coming soon" },
            ].map(m => (
              <div key={m.title} style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #bbf7d0", position: "relative" }}>
                <span style={{ position: "absolute", top: 10, right: 10, background: m.badge === "New" ? "#86efac" : "#e2e8f0", color: m.badge === "New" ? "#1a3d2b" : "#64748b", fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 20 }}>{m.badge}</span>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{m.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#1a3d2b", marginBottom: 6 }}>{m.title}</div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "48px 40px", background: "#fff" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1a3d2b", marginBottom: 24, textAlign: "center" }}>Frequently Asked Questions</h2>
          {[
            { q: "Is VetsAI free?", a: "The first 10 clinics get 3 months free with no credit card required. After the trial, plans start from GHS 735/month." },
            { q: "Does VetsAI work for poultry and livestock?", a: "Yes — VetsAI is a 3-in-1 platform for pets, poultry and livestock with species-specific clinical protocols for each." },
            { q: "Is the AI aligned with WOAH guidelines?", a: "Yes. VetsAI automatically detects notifiable diseases and generates official reports aligned with the WOAH Terrestrial Animal Health Code." },
            { q: "Can I use VetsAI offline?", a: "Patient records are accessible offline. The AI clinical support requires an internet connection." },
            { q: "How do I get support?", a: `Contact us via WhatsApp at $+233 or email support@vetsai.vet. We respond within 24 hours.` },
          ].map(item => (
            <div key={item.q} style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: 16, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: "#1a3d2b", marginBottom: 6, fontSize: 15 }}>{item.q}</div>
              <div style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7 }}>{item.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "linear-gradient(135deg, #1a3d2b, #2d6a4f)", padding: "72px 40px", textAlign: "center", color: "#fff" }}>
        <h2 style={{ fontSize: 40, fontWeight: 900, marginBottom: 16 }}>Ready to modernize your Ghana clinic?</h2>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.75)", marginBottom: 40, maxWidth: 500, margin: "0 auto 40px" }}>Join veterinary professionals across Africa who trust VetsAI.</p>
        <a href="/signup" onClick={() => trackEvent("country_page_cta_click", { country: "Ghana", destination: "signup" })} style={{ background: "#86efac", color: "#1a3d2b", padding: "18px 48px", borderRadius: 10, fontWeight: 800, textDecoration: "none", fontSize: 18, display: "inline-block", marginRight: 16 }}>Start free →</a>
        <a href="/demo" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "18px 48px", borderRadius: 10, fontWeight: 600, textDecoration: "none", fontSize: 18, display: "inline-block", border: "1px solid rgba(255,255,255,0.3)" }}>Book Ghana demo →</a>
        <p style={{ marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>No credit card · First 3 months free · Cancel anytime</p>
      </section>

      <footer style={{ background: "#0f1f0f", padding: "32px 40px", color: "rgba(255,255,255,0.4)", fontSize: 13, textAlign: "center" }}>
        © {new Date().getFullYear()} VetsAI Technologies · vetsai.vet · +233 · <a href="/privacy" style={{color:"rgba(255,255,255,0.4)"}}>Privacy</a> · <a href="/terms" style={{color:"rgba(255,255,255,0.4)"}}>Terms</a>
      </footer>

      <a href="https://wa.me/233208140795?text=Hello%20VetsAI%2C%20I%20am%20a%20veterinarian%20in%20Ghana%20and%20would%20like%20to%20learn%20more" target="_blank" style={{ position: "fixed", bottom: 24, right: 24, background: "#25D366", color: "#fff", width: 56, height: 56, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, textDecoration: "none", boxShadow: "0 4px 16px rgba(37,211,102,0.4)", zIndex: 1000 }}>
        💬
      </a>
    </main>
  );
}
