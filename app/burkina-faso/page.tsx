"use client";
import { trackEvent } from "@/lib/analytics";

export default function BurkinaFasoPage() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ background: "#ef2b2d", padding: "10px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, margin: 0 }}>🇧🇫 VetsAI est maintenant disponible  — <strong>Rejoignez les vétérinaires d&apos;Afrique</strong></p>
        <a href="/demo" style={{ background: "#fff", color: "#ef2b2d", padding: "7px 20px", borderRadius: 6, fontWeight: 800, fontSize: 13, textDecoration: "none" }}>📅 Réserver une démo gratuite →</a>
      </div>
      <nav style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, background: "#1a3d2b", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🐾</div>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#1a3d2b" }}>VetsAI</span>
        </a>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <a href="/demo" style={{ color: "#64748b", textDecoration: "none", fontSize: 14 }}>Demander une démo</a>
          <a href="/signup" onClick={() => trackEvent("country_page_cta_click", { country: "Burkina Faso", destination: "signup" })} style={{ background: "#1a3d2b", color: "#fff", padding: "8px 20px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>Essai gratuit →</a>
          <a href="/" style={{ fontSize: 12, color: "#64748b", textDecoration: "none", padding: "5px 10px", borderRadius: 6, border: "1px solid #e2e8f0" }}>🇬🇧 EN</a>
        </div>
      </nav>
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
          <span style={{ background: "#86efac", color: "#1a3d2b", fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 20 }}>🚀 Nouveau</span>
          <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 13 }}>🚀 Mise à niveau — Surveillance des maladies · Pratique mixte · Gestion des frontières</span>
        </div>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "6px 16px", fontSize: 13, marginBottom: 24 }}>🇧🇫 Conçu pour la pratique vétérinaire professionnelle · Aligné WOAH</div>
          <h1 style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.1, marginBottom: 24, letterSpacing: "-1px" }}>
            Le système d&apos;exploitation clinique<br />
            <em style={{ color: "#86efac", fontStyle: "normal" }}>pour les professionnels vétérinaires</em>
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: 24, maxWidth: 580 }}>Le Burkina Faso possède un important secteur de l'élevage avec plus de 9 millions de bovins. Les vétérinaires ont besoin d'outils numériques adaptés à leur réalité.</p>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, marginBottom: 40, maxWidth: 580 }}>VetsAI offre aux vétérinaires du Burkina Faso une clinique numérique complète — dossiers patients, IA clinique, gestion de pharmacie, facturation et rapports de maladies alignés WOAH. Tout en un seul endroit.</p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="/demo-login" onClick={() => trackEvent("country_page_cta_click", { country: "Burkina Faso", destination: "demo" })} style={{ background: "#86efac", color: "#1a3d2b", padding: "16px 36px", borderRadius: 10, fontWeight: 800, textDecoration: "none", fontSize: 16 }}>▶ Démo en direct</a>
            <a href="/signup" onClick={() => trackEvent("country_page_cta_click", { country: "Burkina Faso", destination: "signup" })} style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "16px 36px", borderRadius: 10, fontWeight: 600, textDecoration: "none", fontSize: 16, border: "1px solid rgba(255,255,255,0.3)" }}>Essai gratuit →</a>
            <a href="/demo" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "16px 36px", borderRadius: 10, fontWeight: 600, textDecoration: "none", fontSize: 16, border: "1px solid rgba(255,255,255,0.3)" }}>📅 Réserver une démo</a>
          </div>
          <p style={{ marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Les 10 premières cliniques obtiennent 3 mois gratuits · Sans carte bancaire · Configuration en 5 minutes</p>
        </div>
      </section>
      <div style={{ background: "#1a3d2b", padding: "24px 40px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
          {[
            { num: "8", label: "Modules intégrés" },
            { num: "3-en-1", label: "Animaux · Volailles · Bétail" },
            { num: "< 60s", label: "Évaluation IA" },
            { num: "0 FCFA", label: "Pour commencer" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: "#86efac", marginBottom: 4 }}>{s.num}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <section style={{ padding: "72px 40px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, color: "#1a3d2b", marginBottom: 12, textAlign: "center" }}>Conçu pour la réalité vétérinaire africaine</h2>
        <p style={{ fontSize: 16, color: "#64748b", textAlign: "center", marginBottom: 48 }}>Pas une copie d&apos;un système occidental. Construit à partir de la pratique vétérinaire africaine.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {[
            { icon: "🧠", title: "IA Clinique", desc: "Diagnostics différentiels, dosages médicamenteux et notes SOAP en moins de 60 secondes. Basé sur le recherche vétérinaire scientifique de référence mondiale." },
            { icon: "💊", title: "Pharmacie Vétérinaire", desc: "Gestion des stocks pour animaux, volailles et bétail — alertes péremption et historique des fournisseurs." },
            { icon: "📁", title: "Dossiers Patients", desc: "Historique médical complet pour toutes les espèces. Fonctionne hors ligne." },
            { icon: "⚠", title: "Rapports WOAH", desc: "Détection automatique des maladies à déclaration obligatoire et génération de rapports officiels." },
            { icon: "💰", title: "Facturation", desc: "Générez des factures, suivez les paiements et gérez les finances de la clinique." },
            { icon: "📊", title: "Analytique", desc: "Tendances des cas, performance de la pharmacie et croissance de la clinique." },
          ].map(m => (
            <div key={m.title} style={{ background: "#fff", borderRadius: 14, padding: 28, border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{m.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#1a3d2b", marginBottom: 8 }}>{m.title}</div>
              <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </section>
      <section style={{ background: "linear-gradient(135deg, #1a3d2b, #2d6a4f)", padding: "72px 40px", textAlign: "center", color: "#fff" }}>
        <h2 style={{ fontSize: 40, fontWeight: 900, marginBottom: 16 }}>Prêt à moderniser votre clinique ?</h2>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.75)", marginBottom: 40, maxWidth: 500, margin: "0 auto 40px" }}>Rejoignez les professionnels vétérinaires à travers l&apos;Afrique qui font confiance à VetsAI.</p>
        <a href="/signup" onClick={() => trackEvent("country_page_cta_click", { country: "Burkina Faso", destination: "signup" })} style={{ background: "#86efac", color: "#1a3d2b", padding: "18px 48px", borderRadius: 10, fontWeight: 800, textDecoration: "none", fontSize: 18, display: "inline-block", marginRight: 16 }}>Commencer gratuitement →</a>
        <a href="/demo" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "18px 48px", borderRadius: 10, fontWeight: 600, textDecoration: "none", fontSize: 18, display: "inline-block", border: "1px solid rgba(255,255,255,0.3)" }}>Réserver une démo →</a>
        <p style={{ marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Sans carte bancaire · 3 mois gratuits · Annulez à tout moment</p>
      </section>
      <footer style={{ background: "#0f1f0f", padding: "32px 40px", color: "rgba(255,255,255,0.4)", fontSize: 13, textAlign: "center" }}>
        © {new Date().getFullYear()} VetsAI Technologies · vetsai.vet · +226 · <a href="/privacy" style={{color:"rgba(255,255,255,0.4)"}}>Confidentialité</a> · <a href="/terms" style={{color:"rgba(255,255,255,0.4)"}}>Conditions</a>
      </footer>
      <a href="https://wa.me/233208140795?text=Bonjour%20VetsAI%2C%20je%20suis%20vétérinaire%20au%20Burkina Faso%20et%20souhaite%20en%20savoir%20plus" target="_blank" style={{ position: "fixed", bottom: 24, right: 24, background: "#25D366", color: "#fff", width: 56, height: 56, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, textDecoration: "none", boxShadow: "0 4px 16px rgba(37,211,102,0.4)", zIndex: 1000 }}>💬</a>
    </main>
  );
}
