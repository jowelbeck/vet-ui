"use client";

export default function FrenchLandingPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --forest: #1a3d2b; --forest-mid: #2d6b47; --green: #3a8f5f;
          --green-light: #5ab57a; --cream: #f7f5f0; --white: #ffffff;
          --slate: #334155; --slate-light: #64748b; --border: #e2e8f0;
          --gold: #c9a84c; --red: #dc2626; --amber: #d97706;
        }
        body { font-family: 'Inter', system-ui, sans-serif; background: var(--white); color: var(--slate); line-height: 1.6; font-size: 15px; }

        nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(255,255,255,0.97); backdrop-filter: blur(8px); border-bottom: 1px solid var(--border); padding: 0 5%; height: 64px; display: flex; align-items: center; justify-content: space-between; }
        .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .nav-logo-mark { width: 36px; height: 36px; background: var(--forest); border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
        .nav-logo-text { font-size: 18px; font-weight: 700; color: var(--forest); }
        .nav-links { display: flex; align-items: center; gap: 20px; }
        .nav-links a { text-decoration: none; color: var(--slate-light); font-size: 14px; font-weight: 500; }
        .nav-links a:hover { color: var(--forest); }
        .nav-cta { background: var(--forest); color: var(--white) !important; padding: 8px 20px; border-radius: 8px; font-size: 14px !important; font-weight: 600 !important; }
        .lang-toggle { display: flex; align-items: center; gap: 6px; }
        .lang-btn { padding: 5px 10px; border-radius: 6px; border: 1px solid var(--border); font-size: 12px; font-weight: 600; cursor: pointer; background: #fff; font-family: inherit; }
        .lang-btn.active { background: var(--forest); color: #fff; border-color: var(--forest); }

        .hero { padding: 140px 5% 100px; background: linear-gradient(160deg, var(--forest) 0%, var(--forest-mid) 60%, var(--green) 100%); color: var(--white); position: relative; overflow: hidden; }
        .hero::before { content: ''; position: absolute; inset: 0; background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Ccircle cx='30' cy='30' r='2' fill='%23ffffff' fill-opacity='0.04'/%3E%3C/g%3E%3C/svg%3E"); }
        .hero-inner { max-width: 860px; margin: 0 auto; position: relative; }
        .hero-tag { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2); padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 28px; color: rgba(255,255,255,0.9); text-transform: uppercase; letter-spacing: 0.5px; }
        .hero h1 { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(36px, 6vw, 62px); font-weight: 700; line-height: 1.1; letter-spacing: -1px; margin-bottom: 24px; color: var(--white); }
        .hero h1 em { font-style: italic; color: rgba(255,255,255,0.7); }
        .hero-sub { font-size: clamp(16px, 2vw, 19px); color: rgba(255,255,255,0.8); max-width: 580px; margin-bottom: 28px; line-height: 1.65; font-weight: 300; }
        .hero-for { display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 36px; }
        .hero-for-item { display: flex; align-items: center; gap: 7px; font-size: 13px; color: rgba(255,255,255,0.8); }
        .hero-for-item::before { content: "✓"; color: var(--green-light); font-weight: 700; }
        .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
        .btn-primary { background: var(--white); color: var(--forest); padding: 14px 28px; border-radius: 10px; font-size: 15px; font-weight: 700; text-decoration: none; transition: all 0.15s; display: inline-flex; align-items: center; gap: 8px; }
        .btn-primary:hover { background: var(--cream); transform: translateY(-1px); }
        .btn-outline { color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; border: 1.5px solid rgba(255,255,255,0.35); padding: 13px 24px; border-radius: 10px; transition: all 0.15s; }
        .btn-outline:hover { background: rgba(255,255,255,0.1); }
        .hero-note { margin-top: 18px; font-size: 12px; color: rgba(255,255,255,0.45); }

        .stats-bar { background: var(--cream); border-bottom: 1px solid var(--border); padding: 24px 5%; }
        .stats-inner { max-width: 860px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 24px; }
        .stat { text-align: center; }
        .stat-num { font-size: 28px; font-weight: 700; color: var(--forest); letter-spacing: -1px; }
        .stat-label { font-size: 12px; color: var(--slate-light); margin-top: 2px; }

        section { padding: 80px 5%; }
        .section-inner { max-width: 860px; margin: 0 auto; }
        .eyebrow { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--green); margin-bottom: 12px; }
        .section-title { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(26px, 4vw, 40px); font-weight: 700; color: var(--forest); letter-spacing: -0.5px; margin-bottom: 16px; line-height: 1.2; }
        .section-sub { font-size: 17px; color: var(--slate-light); max-width: 540px; line-height: 1.6; }

        .problem-bg { background: var(--white); }
        .problem-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 48px; align-items: center; }
        .problem-list { list-style: none; padding: 0; }
        .problem-list li { padding: 14px 0; border-bottom: 1px solid var(--border); font-size: 15px; color: var(--slate); display: flex; gap: 12px; align-items: flex-start; }
        .problem-list li:last-child { border-bottom: none; }
        .problem-icon { font-size: 20px; flex-shrink: 0; }
        .problem-text strong { display: block; font-weight: 600; color: var(--forest); margin-bottom: 3px; }
        .problem-text span { font-size: 13px; color: var(--slate-light); }
        .solution-box { background: var(--forest); border-radius: 16px; padding: 32px; color: var(--white); }
        .solution-box h3 { font-family: 'Playfair Display', Georgia, serif; font-size: 22px; margin-bottom: 16px; color: var(--white); }
        .solution-box p { font-size: 14px; color: rgba(255,255,255,0.75); line-height: 1.7; margin-bottom: 20px; }
        .solution-items { list-style: none; padding: 0; }
        .solution-items li { font-size: 13px; color: rgba(255,255,255,0.85); padding: 6px 0; display: flex; gap: 8px; }
        .solution-items li::before { content: "→"; color: var(--green-light); font-weight: 700; flex-shrink: 0; }

        .before-after-bg { background: var(--cream); }
        .before-after-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 40px; }
        .ba-card { border-radius: 14px; padding: 28px; }
        .ba-before { background: #fef2f2; border: 1px solid #fecaca; }
        .ba-after { background: #f0faf4; border: 1px solid #bbf7d0; }
        .ba-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 16px; }
        .ba-before .ba-label { color: var(--red); }
        .ba-after .ba-label { color: var(--green); }
        .ba-items { list-style: none; padding: 0; }
        .ba-items li { font-size: 14px; padding: 7px 0; border-bottom: 1px solid rgba(0,0,0,0.06); display: flex; gap: 10px; align-items: center; }
        .ba-items li:last-child { border-bottom: none; }
        .ba-before .ba-items li { color: #7f1d1d; }
        .ba-before .ba-items li::before { content: "✗"; color: var(--red); font-weight: 700; }
        .ba-after .ba-items li { color: var(--forest); }
        .ba-after .ba-items li::before { content: "✓"; color: var(--green); font-weight: 700; }

        .modules-bg { background: var(--white); }
        .modules-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-top: 48px; }
        .module-card { background: var(--cream); border: 1px solid var(--border); border-radius: 14px; padding: 24px; position: relative; }
        .module-card.live::after { content: "Disponible"; position: absolute; top: 14px; right: 14px; background: var(--green); color: var(--white); font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px; text-transform: uppercase; }
        .module-card.coming::after { content: "Bientôt"; position: absolute; top: 14px; right: 14px; background: var(--border); color: var(--slate-light); font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px; text-transform: uppercase; }
        .module-icon { font-size: 28px; margin-bottom: 12px; }
        .module-title { font-size: 15px; font-weight: 600; color: var(--forest); margin-bottom: 6px; }
        .module-desc { font-size: 13px; color: var(--slate-light); line-height: 1.6; }

        .how-bg { background: var(--forest); }
        .how-bg .eyebrow { color: var(--green-light); }
        .how-bg .section-title { color: var(--white); }
        .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 32px; margin-top: 48px; }
        .step-num { font-family: 'Playfair Display', Georgia, serif; font-size: 48px; font-weight: 700; color: rgba(255,255,255,0.1); line-height: 1; margin-bottom: 12px; }
        .step-title { font-size: 16px; font-weight: 600; color: var(--white); margin-bottom: 8px; }
        .step-desc { font-size: 13px; color: rgba(255,255,255,0.6); line-height: 1.6; }

        .pricing-bg { background: var(--cream); }
        .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-top: 48px; }
        .pricing-card { background: var(--white); border: 1px solid var(--border); border-radius: 16px; padding: 28px 24px; position: relative; }
        .pricing-card.featured { background: var(--forest); border-color: var(--forest); }
        .pricing-popular { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: var(--gold); color: var(--white); font-size: 11px; font-weight: 700; padding: 4px 14px; border-radius: 20px; white-space: nowrap; }
        .pricing-name { font-size: 13px; font-weight: 600; text-transform: uppercase; margin-bottom: 12px; color: var(--slate-light); }
        .pricing-card.featured .pricing-name { color: rgba(255,255,255,0.6); }
        .pricing-price { font-size: 36px; font-weight: 700; letter-spacing: -1px; color: var(--forest); margin-bottom: 4px; }
        .pricing-card.featured .pricing-price { color: var(--white); }
        .pricing-period { font-size: 13px; color: var(--slate-light); margin-bottom: 20px; }
        .pricing-card.featured .pricing-period { color: rgba(255,255,255,0.6); }
        .pricing-features { list-style: none; padding: 0; margin-bottom: 24px; }
        .pricing-features li { font-size: 13px; color: var(--slate); padding: 5px 0; display: flex; gap: 8px; border-bottom: 1px solid var(--border); }
        .pricing-card.featured .pricing-features li { color: rgba(255,255,255,0.85); border-color: rgba(255,255,255,0.1); }
        .pricing-features li:last-child { border-bottom: none; }
        .pricing-features li::before { content: "✓"; color: var(--green); font-weight: 700; flex-shrink: 0; }
        .pricing-card.featured .pricing-features li::before { color: var(--green-light); }
        .btn-pricing { display: block; text-align: center; padding: 11px; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none; border: 1.5px solid var(--forest); color: var(--forest); }
        .pricing-card.featured .btn-pricing { background: var(--white); color: var(--forest); border-color: var(--white); }

        .cta-bg { background: linear-gradient(135deg, var(--forest) 0%, var(--green) 100%); text-align: center; }
        .cta-bg .section-title { color: var(--white); }
        .cta-sub { font-size: 18px; color: rgba(255,255,255,0.8); margin-bottom: 36px; max-width: 560px; margin-left: auto; margin-right: auto; line-height: 1.6; }
        .cta-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

        footer { background: var(--forest); color: rgba(255,255,255,0.6); padding: 40px 5%; text-align: center; font-size: 13px; }
        footer a { color: rgba(255,255,255,0.6); text-decoration: none; }
        footer a:hover { color: var(--white); }

        @media (max-width: 700px) {
          .nav-links { display: none; }
          .problem-grid, .before-after-grid { grid-template-columns: 1fr; }
          .hero { padding: 120px 5% 60px; }
        }
      `}</style>

      {/* Nav */}
      <nav>
        <a href="/fr" className="nav-logo">
          <div className="nav-logo-mark">🐾</div>
          <span className="nav-logo-text">VetsAI</span>
        </a>
        <div className="nav-links">
          <a href="#modules">Plateforme</a>
          <a href="#how-it-works">Comment ça marche</a>
          <a href="#pricing">Tarifs</a>
          <a href="mailto:hi@vetsai.vet">Démo</a>
          <div className="lang-toggle">
            <a href="/" className="lang-btn">🇬🇧 EN</a>
            <span className="lang-btn active">🇫🇷 FR</span>
          </div>
          <a href="/fr/signup" className="nav-cta">Essai gratuit →</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-tag">🐾 Système de gestion de clinique · Intelligence clinique</div>
          <h1>
            Gérez votre clinique vétérinaire —<br />
            <em>avec un support clinique intelligent.</em>
          </h1>
          <p className="hero-sub">
            VetsAI est le système d&apos;exploitation de clinique pour les professionnels vétérinaires — combinant dossiers patients, support clinique et flux de travail IA en un seul endroit.
          </p>
          <div className="hero-for">
            <div className="hero-for-item">Cliniques vétérinaires</div>
            <div className="hero-for-item">Cabinets privés</div>
            <div className="hero-for-item">Vétérinaires mobiles</div>
            <div className="hero-for-item">Écoles vétérinaires</div>
          </div>
          <div className="hero-actions">
            <a href="/fr/signup" className="btn-primary">Commencer l&apos;essai gratuit →</a>
            <a href="mailto:hi@vetsai.vet" className="btn-outline">📅 Réserver une démo</a>
          </div>
          <p className="hero-note">Sans carte bancaire · 3 mois gratuits · Annulez à tout moment</p>
        </div>
      </section>

      {/* Stats */}
      <div className="stats-bar">
        <div className="stats-inner">
          <div className="stat"><div className="stat-num">3 367+</div><div className="stat-label">Pages de recherche vétérinaire</div></div>
          <div className="stat"><div className="stat-num">&lt;60s</div><div className="stat-label">Temps d&apos;évaluation complète</div></div>
          <div className="stat"><div className="stat-num">15+</div><div className="stat-label">Espèces animales prises en charge</div></div>
          <div className="stat"><div className="stat-num">0€</div><div className="stat-label">Pour commencer aujourd&apos;hui</div></div>
        </div>
      </div>

      {/* Problem */}
      <section className="problem-bg">
        <div className="section-inner">
          <div className="eyebrow">Le problème que nous résolvons</div>
          <h2 className="section-title">Les vétérinaires passent trop de temps<br />sur la paperasse, pas sur les patients</h2>
          <div className="problem-grid">
            <ul className="problem-list">
              {[
                { icon: "⏱️", title: "30+ minutes par cas", desc: "Rédaction des notes SOAP, recherche des dosages, documentation manuelle" },
                { icon: "📋", title: "Dossiers incohérents", desc: "Fichiers papier, notes éparpillées, aucune continuité entre les consultations" },
                { icon: "💊", title: "Vérification des dosages", desc: "Les calculs manuels prennent du temps et nécessitent des références constantes" },
                { icon: "🚨", title: "Urgences manquées", desc: "Aucun système pour signaler et prioriser automatiquement les cas urgents" },
              ].map((p) => (
                <li key={p.title}>
                  <span className="problem-icon">{p.icon}</span>
                  <span className="problem-text">
                    <strong>{p.title}</strong>
                    <span>{p.desc}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="solution-box">
              <h3>VetsAI résout tout cela</h3>
              <p>Une seule plateforme qui gère l&apos;administration clinique — pour que vos vétérinaires puissent se concentrer sur ce qui compte : les animaux.</p>
              <ul className="solution-items">
                <li>Notes cliniques générées automatiquement pour révision</li>
                <li>Guide de dosage par espèce et poids — pour vérification</li>
                <li>Triage d&apos;urgence automatique pour chaque cas</li>
                <li>Historique complet du patient en un seul endroit</li>
                <li>Basé sur la recherche vétérinaire de référence mondiale</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Before/After */}
      <section className="before-after-bg">
        <div className="section-inner">
          <div className="eyebrow">Pourquoi les cliniques changent</div>
          <h2 className="section-title">Une meilleure façon de gérer votre clinique</h2>
          <div className="before-after-grid">
            <div className="ba-card ba-before">
              <div className="ba-label">Avant VetsAI</div>
              <ul className="ba-items">
                <li>Notes manuscrites et dossiers papier</li>
                <li>Rédaction manuelle des notes SOAP</li>
                <li>Historique patient éparpillé</li>
                <li>Recherche lente des dosages</li>
                <li>Aucun système de triage d&apos;urgence</li>
                <li>Suivi retardé des soins</li>
              </ul>
            </div>
            <div className="ba-card ba-after">
              <div className="ba-label">Après VetsAI</div>
              <ul className="ba-items">
                <li>Dossiers numériques, toujours accessibles</li>
                <li>Notes cliniques rédigées instantanément</li>
                <li>Historique patient centralisé</li>
                <li>Guide de dosage en quelques secondes</li>
                <li>Détection automatique des urgences</li>
                <li>Consultations plus rapides et mieux informées</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="modules-bg" id="modules">
        <div className="section-inner">
          <div className="eyebrow">La plateforme</div>
          <h2 className="section-title">Tout ce dont votre clinique a besoin,<br />en un seul endroit</h2>
          <p className="section-sub">VetsAI est un système d&apos;exploitation complet pour cliniques — pas seulement un outil de diagnostic.</p>
          <div className="modules-grid">
            {[
              { icon: "🧠", title: "Support Clinique", desc: "Orientation clinique intelligente sur les symptômes, la race, l'âge et le poids — générée pour révision vétérinaire.", live: true },
              { icon: "💊", title: "Guide de Dosage", desc: "Plages de dosage par espèce et poids, notes d'interaction — pour vérification avant prescription.", live: true },
              { icon: "📋", title: "Notes SOAP", desc: "Brouillons de notes cliniques générés automatiquement — prêts pour révision et signature.", live: true },
              { icon: "🚨", title: "Triage d'Urgence", desc: "Chaque cas est automatiquement signalé haute, moyenne ou faible urgence pour prioriser.", live: true },
              { icon: "📁", title: "Dossiers Patients", desc: "Historique médical complet, journaux de consultation et coordonnées du propriétaire.", live: true },
              { icon: "📅", title: "Rendez-vous", desc: "Planification, rappels et gestion du calendrier avec notifications WhatsApp et email.", live: true },
              { icon: "💰", title: "Facturation", desc: "Créez des factures, suivez les paiements et gérez les finances de la clinique.", live: true },
              { icon: "👥", title: "Accès Multi-utilisateurs", desc: "Accès basé sur les rôles pour vétérinaires, infirmiers et personnel administratif.", live: true },
              { icon: "📊", title: "Analytique Clinique", desc: "Tendances des cas, diagnostics fréquents, patterns d'urgence et rapports de performance.", live: true },
            ].map((m) => (
              <div className={`module-card ${m.live ? "live" : "coming"}`} key={m.title}>
                <div className="module-icon">{m.icon}</div>
                <div className="module-title">{m.title}</div>
                <div className="module-desc">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-bg" id="how-it-works">
        <div className="section-inner">
          <div className="eyebrow">Comment ça marche</div>
          <h2 className="section-title">Opérationnel en quelques minutes</h2>
          <p className="section-sub" style={{ color: "rgba(255,255,255,0.65)" }}>Pas d&apos;installation. Pas de formation. Commencez à gérer les cas immédiatement.</p>
          <div className="steps">
            {[
              { num: "01", title: "Saisissez le cas", desc: "Entrez le type d'animal, la race, l'âge, le poids et les symptômes. Plus de détails = meilleur support." },
              { num: "02", title: "Le support clinique est généré", desc: "VetsAI analyse les symptômes, vérifie les dosages, trie l'urgence et prépare un résumé clinique automatiquement." },
              { num: "03", title: "Le vétérinaire révise et agit", desc: "Votre vétérinaire examine les diagnostics différentiels, le guide de dosage et le brouillon SOAP — puis prend la décision clinique." },
              { num: "04", title: "Sauvegardé dans les dossiers", desc: "Chaque cas est automatiquement sauvegardé dans l'historique du patient pour une continuité des soins." },
            ].map((s) => (
              <div className="step" key={s.num}>
                <div className="step-num">{s.num}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing-bg" id="pricing">
        <div className="section-inner">
          <div className="eyebrow">Tarifs</div>
          <h2 className="section-title">Tarification simple et transparente</h2>
          <p className="section-sub">Commencez gratuitement pendant 3 mois. Sans carte bancaire. Annulez à tout moment.</p>
          <div className="pricing-grid">
            {[
              {
                name: "Débutant", price: "$49", period: "par mois",
                features: ["1 compte vétérinaire", "Jusqu&apos;à 200 cas/mois", "Support clinique & triage", "Guide de dosage", "Brouillons SOAP", "Rapports imprimables", "Support email"],
                featured: false, popular: false,
              },
              {
                name: "Professionnel", price: "$99", period: "par mois",
                features: ["3 comptes vétérinaires", "Cas illimités", "Support clinique & triage", "Guide de dosage", "Brouillons SOAP", "Dossiers patients", "Historique & export", "Support prioritaire"],
                featured: true, popular: true,
              },
              {
                name: "Clinique OS", price: "$199", period: "par mois",
                features: ["10 comptes vétérinaires", "Cas illimités", "Accès OS clinique complet", "Dossiers patients", "Rendez-vous", "Facturation", "Analytique avancée", "Support dédié"],
                featured: false, popular: false,
              },
            ].map((p) => (
              <div className={`pricing-card ${p.featured ? "featured" : ""}`} key={p.name}>
                {p.popular && <div className="pricing-popular">Le plus populaire</div>}
                <div className="pricing-name">{p.name}</div>
                <div className="pricing-price">{p.price}</div>
                <div className="pricing-period">{p.period}</div>
                <ul className="pricing-features">
                  {p.features.map((f) => <li key={f} dangerouslySetInnerHTML={{ __html: f }} />)}
                </ul>
                <a href="/fr/signup" className="btn-pricing">Commencer l&apos;essai gratuit</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-bg">
        <div className="section-inner">
          <div className="eyebrow" style={{ color: "rgba(255,255,255,0.6)" }}>Commencez aujourd&apos;hui</div>
          <h2 className="section-title">Prêt à gérer une clinique plus intelligente ?</h2>
          <p className="cta-sub">Conçu pour les professionnels vétérinaires d&apos;Afrique et au-delà — VetsAI fournit un support clinique intelligent où que vous exerciez.</p>
          <div className="cta-actions">
            <a href="/fr/signup" className="btn-primary">Commencer l&apos;essai gratuit →</a>
            <a href="mailto:hi@vetsai.vet" className="btn-outline">📅 Réserver une démo</a>
          </div>
          <p style={{ marginTop: 20, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Les 10 premières cliniques bénéficient de 3 mois entièrement gratuits</p>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div style={{ marginBottom: 12 }}>
          <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>🐾 VetsAI</span>
          &nbsp;·&nbsp; Système d&apos;exploitation de clinique pour professionnels vétérinaires dans le monde entier
        </div>
        <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
          <a href="#modules">Plateforme</a>
          <a href="#how-it-works">Comment ça marche</a>
          <a href="#pricing">Tarifs</a>
          <a href="/fr/signup">Essai gratuit</a>
          <a href="mailto:hi@vetsai.vet">Contact</a>
          <a href="/">🇬🇧 English</a>
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
          © {new Date().getFullYear()} VetsAI. Conçu pour les professionnels vétérinaires d&apos;Afrique et au-delà.
        </div>
      </footer>
    </>
  );
}