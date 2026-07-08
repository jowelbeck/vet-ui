export default function CameroonPage() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ background: "#007a5e", padding: "10px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, margin: 0 }}>🇨🇲 VetsAI est maintenant disponible au Cameroun — <strong>Rejoignez les professionnels vétérinaires d&apos;Afrique</strong></p>
        <a href="/demo" style={{ background: "#fff", color: "#007a5e", padding: "7px 20px", borderRadius: 6, fontWeight: 800, fontSize: 13, textDecoration: "none" }}>📅 Réserver une démo gratuite →</a>
      </div>
      <nav style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, background: "#1a3d2b", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🐾</div>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#1a3d2b" }}>VetsAI</span>
        </a>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <a href="/demo" style={{ color: "#64748b", textDecoration: "none", fontSize: 14 }}>Demander une démo</a>
          <a href="/signup" style={{ background: "#1a3d2b", color: "#fff", padding: "8px 20px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>Essai gratuit →</a>
        </div>
      </nav>
      <section style={{ background: "linear-gradient(135deg, #1a3d2b 0%, #2d6a4f 100%)", padding: "80px 40px", color: "#fff" }}>
        <div style={{ maxWidth: 760 }}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "6px 16px", fontSize: 13, marginBottom: 24 }}>🇨🇲 Conçu pour la pratique vétérinaire au Cameroun · Aligné WOAH</div>
          <h1 style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.1, marginBottom: 24, letterSpacing: "-1px" }}>
            Le système d&apos;exploitation pour<br />
            <em style={{ color: "#86efac", fontStyle: "normal" }}>les vétérinaires du Cameroun</em>
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: 40, maxWidth: 580 }}>Le Cameroun compte plus de 800 vétérinaires enregistrés. La plupart des cliniques gèrent encore les dossiers sur papier et via WhatsApp.</p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="/demo-login" style={{ background: "#86efac", color: "#1a3d2b", padding: "16px 36px", borderRadius: 10, fontWeight: 800, textDecoration: "none", fontSize: 16 }}>▶ Démo en direct</a>
            <a href="/signup" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "16px 36px", borderRadius: 10, fontWeight: 600, textDecoration: "none", fontSize: 16, border: "1px solid rgba(255,255,255,0.3)" }}>Essai gratuit →</a>
            <a href="/demo" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "16px 36px", borderRadius: 10, fontWeight: 600, textDecoration: "none", fontSize: 16, border: "1px solid rgba(255,255,255,0.3)" }}>📅 Démo au Cameroun</a>
          </div>
          <p style={{ marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Sans carte bancaire · 3 mois gratuits · Configuration en 5 minutes</p>
        </div>
      </section>
      <section style={{ background: "linear-gradient(135deg, #1a3d2b, #2d6a4f)", padding: "72px 40px", textAlign: "center", color: "#fff" }}>
        <h2 style={{ fontSize: 40, fontWeight: 900, marginBottom: 16 }}>Prêt à moderniser votre clinique au Cameroun ?</h2>
        <a href="/signup" style={{ background: "#86efac", color: "#1a3d2b", padding: "18px 48px", borderRadius: 10, fontWeight: 800, textDecoration: "none", fontSize: 18, display: "inline-block", marginRight: 16 }}>Commencer gratuitement →</a>
        <a href="/demo" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "18px 48px", borderRadius: 10, fontWeight: 600, textDecoration: "none", fontSize: 18, display: "inline-block", border: "1px solid rgba(255,255,255,0.3)" }}>Réserver une démo →</a>
      </section>
      <footer style={{ background: "#0f1f0f", padding: "32px 40px", color: "rgba(255,255,255,0.4)", fontSize: 13, textAlign: "center" }}>
        © {new Date().getFullYear()} VetsAI Technologies · vetsai.vet · +237 · Ordre National des Vétérinaires du Cameroun
      </footer>
      <a href="https://wa.me/233208140795?text=Bonjour%20VetsAI%2C%20je%20suis%20vétérinaire%20au%20Cameroun" target="_blank" style={{ position: "fixed", bottom: 24, right: 24, background: "#25D366", color: "#fff", width: 56, height: 56, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, textDecoration: "none", boxShadow: "0 4px 16px rgba(37,211,102,0.4)", zIndex: 1000 }}>💬</a>
    </main>
  );
}
