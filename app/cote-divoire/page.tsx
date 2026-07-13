"use client";
import { trackEvent } from "@/lib/analytics";

export default function CoteDIvoirePage() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ background: "#f77f00", padding: "10px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, margin: 0 }}>🇨🇮 VetsAI est maintenant disponible en Côte d&apos;Ivoire — <strong>Rejoignez les vétérinaires d&apos;Afrique</strong></p>
        <a href="/demo" style={{ background: "#fff", color: "#f77f00", padding: "7px 20px", borderRadius: 6, fontWeight: 800, fontSize: 13, textDecoration: "none" }}>📅 Réserver une démo gratuite →</a>
      </div>
      <nav style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, background: "#1a3d2b", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🐾</div>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#1a3d2b" }}>VetsAI</span>
        </a>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <a href="/demo" style={{ color: "#64748b", textDecoration: "none", fontSize: 14 }}>Demander une démo</a>
          <a href="/signup" onClick={() => trackEvent("country_page_cta_click", { country: "Côte d'Ivoire", destination: "signup" })} style={{ background: "#1a3d2b", color: "#fff", padding: "8px 20px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>Essai gratuit →</a>
          <a href="/" style={{ fontSize: 12, color: "#64748b", textDecoration: "none", padding: "5px 10px", borderRadius: 6, border: "1px solid #e2e8f0" }}>🇬🇧 EN</a>
        </div>
      </nav>
      <section style={{ background: "linear-gradient(135deg, #1a3d2b 0%, #2d6a4f 100%)", padding: "80px 40px", color: "#fff" }}>
        <div style={{ maxWidth: 760 }}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "6px 16px", fontSize: 13, marginBottom: 24 }}>🇨🇮 Conçu pour la pratique vétérinaire en Côte d&apos;Ivoire · Aligné WOAH</div>
          <h1 style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.1, marginBottom: 24, letterSpacing: "-1px" }}>
            Le système d&apos;exploitation clinique<br />
            <em style={{ color: "#86efac", fontStyle: "normal" }}>pour les vétérinaires de Côte d&apos;Ivoire</em>
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: 24, maxWidth: 580 }}>La Côte d&apos;Ivoire compte plus de 700 vétérinaires enregistrés. L&apos;élevage représente une part importante de l&apos;économie agricole. La plupart des cliniques utilisent encore des cahiers et WhatsApp pour la gestion des patients.</p>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, marginBottom: 40, maxWidth: 580 }}>VetsAI offre aux vétérinaires de Côte d&apos;Ivoire une clinique numérique complète — dossiers patients, IA clinique, gestion de pharmacie, facturation et rapports de maladies alignés WOAH. Tout en un seul endroit.</p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="/demo-login" onClick={() => trackEvent("country_page_cta_click", { country: "Côte d'Ivoire", destination: "demo" })} style={{ background: "#86efac", color: "#1a3d2b", padding: "16px 36px", borderRadius: 10, fontWeight: 800, textDecoration: "none", fontSize: 16 }}>▶ Démo en direct</a>
            <a href="/signup" onClick={() => trackEvent("country_page_cta_click", { country: "Côte d'Ivoire", destination: "signup" })} style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "16px 36px", borderRadius: 10, fontWeight: 600, textDecoration: "none", fontSize: 16, border: "1px solid rgba(255,255,255,0.3)" }}>Essai gratuit →</a>
            <a href="/demo" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "16px 36px", borderRadius: 10, fontWeight: 600, textDecoration: "none", fontSize: 16, border: "1px solid rgba(255,255,255,0.3)" }}>📅 Démo en Côte d&apos;Ivoire</a>
          </div>
          <p style={{ marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Sans carte bancaire · 3 mois gratuits · Configuration en 5 minutes</p>
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
        <h2 style={{ fontSize: 36, fontWeight: 800, color: "#1a3d2b", marginBottom: 12, textAlign: "center" }}>Conçu pour la réalité vétérinaire de Côte d&apos;Ivoire</h2>
        <p style={{ fontSize: 16, color: "#64748b", textAlign: "center", marginBottom: 48 }}>Pas une copie d&apos;un système occidental. Construit à partir de la pratique vétérinaire africaine.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {[
            { icon: "🧠", title: "IA Clinique", desc: "Diagnostics différentiels, dosages médicamenteux et notes SOAP en moins de 60 secondes. Basé sur le Manuel Vétérinaire Merck." },
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
        <h2 style={{ fontSize: 40, fontWeight: 900, marginBottom: 16 }}>Prêt à moderniser votre clinique en Côte d&apos;Ivoire ?</h2>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.75)", marginBottom: 40, maxWidth: 500, margin: "0 auto 40px" }}>Rejoignez les professionnels vétérinaires à travers l&apos;Afrique qui font confiance à VetsAI.</p>
        <a href="/signup" onClick={() => trackEvent("country_page_cta_click", { country: "Côte d'Ivoire", destination: "signup" })} style={{ background: "#86efac", color: "#1a3d2b", padding: "18px 48px", borderRadius: 10, fontWeight: 800, textDecoration: "none", fontSize: 18, display: "inline-block", marginRight: 16 }}>Commencer gratuitement →</a>
        <a href="/demo" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "18px 48px", borderRadius: 10, fontWeight: 600, textDecoration: "none", fontSize: 18, display: "inline-block", border: "1px solid rgba(255,255,255,0.3)" }}>Réserver une démo →</a>
        <p style={{ marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Sans carte bancaire · 3 mois gratuits · Annulez à tout moment</p>
      </section>
      <footer style={{ background: "#0f1f0f", padding: "32px 40px", color: "rgba(255,255,255,0.4)", fontSize: 13, textAlign: "center" }}>
        © {new Date().getFullYear()} VetsAI Technologies · vetsai.vet · +225 · Ordre National des Vétérinaires de Côte d&apos;Ivoire
      </footer>
      <a href="https://wa.me/233208140795?text=Bonjour%20VetsAI%2C%20je%20suis%20vétérinaire%20en%20Côte%20d%27Ivoire%20et%20souhaite%20en%20savoir%20plus" target="_blank" style={{ position: "fixed", bottom: 24, right: 24, background: "#25D366", color: "#fff", width: 56, height: 56, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, textDecoration: "none", boxShadow: "0 4px 16px rgba(37,211,102,0.4)", zIndex: 1000 }}>💬</a>
    </main>
  );
}
