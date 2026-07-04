"use client";

export default function LandingPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --forest: #1a3d2b;
          --forest-mid: #2d6b47;
          --green: #3a8f5f;
          --green-light: #5ab57a;
          --cream: #f7f5f0;
          --white: #ffffff;
          --slate: #334155;
          --slate-light: #64748b;
          --border: #e2e8f0;
          --gold: #c9a84c;
          --red: #dc2626;
          --amber: #d97706;
        }

        body { font-family: 'Inter', system-ui, sans-serif; background: var(--white); color: var(--slate); line-height: 1.6; font-size: 15px; }

        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: rgba(255,255,255,0.97); backdrop-filter: blur(8px);
          border-bottom: 1px solid var(--border); padding: 0 5%;
          height: 64px; display: flex; align-items: center; justify-content: space-between;
        }
        .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .nav-logo-mark { width: 36px; height: 36px; background: var(--forest); border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
        .nav-logo-text { font-size: 18px; font-weight: 700; color: var(--forest); letter-spacing: -0.3px; }
        .nav-links { display: flex; align-items: center; gap: 28px; }
        .nav-links a { text-decoration: none; color: var(--slate-light); font-size: 14px; font-weight: 500; transition: color 0.15s; }
        .nav-links a:hover { color: var(--forest); }
        .nav-cta { background: var(--forest); color: var(--white) !important; padding: 8px 20px; border-radius: 8px; font-size: 14px !important; font-weight: 600 !important; }
        .nav-cta:hover { background: var(--forest-mid) !important; }

        .hero {
          padding: 140px 5% 100px;
          background: linear-gradient(160deg, var(--forest) 0%, var(--forest-mid) 60%, var(--green) 100%);
          color: var(--white); position: relative; overflow: hidden;
        }
        .hero::before {
          content: ''; position: absolute; inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Ccircle cx='30' cy='30' r='2' fill='%23ffffff' fill-opacity='0.04'/%3E%3C/g%3E%3C/svg%3E");
        }
        .hero-inner { max-width: 860px; margin: 0 auto; position: relative; }
        .hero-tag {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);
          padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: 600;
          margin-bottom: 28px; color: rgba(255,255,255,0.9); text-transform: uppercase; letter-spacing: 0.5px;
        }
        .hero h1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(36px, 6vw, 62px); font-weight: 700;
          line-height: 1.1; letter-spacing: -1px; margin-bottom: 24px; color: var(--white);
        }
        .hero h1 em { font-style: italic; color: rgba(255,255,255,0.7); }
        .hero-sub { font-size: clamp(16px, 2vw, 19px); color: rgba(255,255,255,0.8); max-width: 580px; margin-bottom: 28px; line-height: 1.65; font-weight: 300; }
        .hero-for { display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 36px; }
        .hero-for-item { display: flex; align-items: center; gap: 7px; font-size: 13px; color: rgba(255,255,255,0.8); }
        .hero-for-item::before { content: "✓"; color: var(--green-light); font-weight: 700; }
        .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
        .btn-primary { background: var(--white); color: var(--forest); padding: 14px 28px; border-radius: 10px; font-size: 15px; font-weight: 700; text-decoration: none; transition: all 0.15s; display: inline-flex; align-items: center; gap: 8px; }
        .btn-primary:hover { background: var(--cream); transform: translateY(-1px); }
        .btn-outline { color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; border: 1.5px solid rgba(255,255,255,0.35); padding: 13px 24px; border-radius: 10px; transition: all 0.15s; }
        .btn-outline:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.6); }
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

        /* Problem */
        .problem-bg { background: var(--white); }
        .problem-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 48px; align-items: center; }
        .problem-list { list-style: none; padding: 0; }
        .problem-list li { padding: 14px 0; border-bottom: 1px solid var(--border); font-size: 15px; color: var(--slate); display: flex; gap: 12px; align-items: flex-start; }
        .problem-list li:last-child { border-bottom: none; }
        .problem-icon { font-size: 20px; flex-shrink: 0; margin-top: 1px; }
        .problem-text strong { display: block; font-weight: 600; color: var(--forest); margin-bottom: 3px; }
        .problem-text span { font-size: 13px; color: var(--slate-light); }
        .solution-box { background: var(--forest); border-radius: 16px; padding: 32px; color: var(--white); }
        .solution-box h3 { font-family: 'Playfair Display', Georgia, serif; font-size: 22px; margin-bottom: 16px; color: var(--white); }
        .solution-box p { font-size: 14px; color: rgba(255,255,255,0.75); line-height: 1.7; margin-bottom: 20px; }
        .solution-items { list-style: none; padding: 0; }
        .solution-items li { font-size: 13px; color: rgba(255,255,255,0.85); padding: 6px 0; display: flex; gap: 8px; }
        .solution-items li::before { content: "→"; color: var(--green-light); font-weight: 700; flex-shrink: 0; }

        /* Before / After */
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
        .ba-before .ba-items li::before { content: "✗"; color: var(--red); font-weight: 700; flex-shrink: 0; }
        .ba-after .ba-items li { color: var(--forest); }
        .ba-after .ba-items li::before { content: "✓"; color: var(--green); font-weight: 700; flex-shrink: 0; }

        /* Continuity */
        .continuity-bg { background: var(--forest); color: var(--white); }
        .continuity-bg .eyebrow { color: var(--green-light); }
        .continuity-bg .section-title { color: var(--white); }
        .continuity-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; margin-top: 40px; }
        .continuity-item { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; text-align: center; }
        .continuity-icon { font-size: 24px; margin-bottom: 10px; }
        .continuity-label { font-size: 13px; color: rgba(255,255,255,0.8); font-weight: 500; }

        /* Modules */
        .modules-bg { background: var(--white); }
        .modules-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-top: 48px; }
        .module-card { background: var(--cream); border: 1px solid var(--border); border-radius: 14px; padding: 24px; transition: box-shadow 0.15s, transform 0.15s; position: relative; }
        .module-card:hover { box-shadow: 0 8px 24px rgba(26,61,43,0.08); transform: translateY(-2px); }
        .module-card.live::after { content: "Live"; position: absolute; top: 14px; right: 14px; background: var(--green); color: var(--white); font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px; text-transform: uppercase; }
        .module-card.coming::after { content: "Coming soon"; position: absolute; top: 14px; right: 14px; background: var(--border); color: var(--slate-light); font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px; text-transform: uppercase; }
        .module-icon { font-size: 28px; margin-bottom: 12px; }
        .module-title { font-size: 15px; font-weight: 600; color: var(--forest); margin-bottom: 6px; }
        .module-desc { font-size: 13px; color: var(--slate-light); line-height: 1.6; }

        /* How it works */
        .how-bg { background: var(--cream); }
        .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 32px; margin-top: 48px; }
        .step-num { font-family: 'Playfair Display', Georgia, serif; font-size: 48px; font-weight: 700; color: rgba(26,61,43,0.12); line-height: 1; margin-bottom: 12px; }
        .step-title { font-size: 16px; font-weight: 600; color: var(--forest); margin-bottom: 8px; }
        .step-desc { font-size: 13px; color: var(--slate-light); line-height: 1.6; }

        /* Urgency */
        .urgency-bg { background: var(--white); }
        .urgency-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 40px; }
        .urgency-card { border-radius: 12px; padding: 20px; border: 1px solid; }
        .urgency-high { background: #fef2f2; border-color: #fecaca; }
        .urgency-medium { background: #fffbeb; border-color: #fde68a; }
        .urgency-low { background: #f0faf4; border-color: #bbf7d0; }
        .urgency-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px; }
        .urgency-high .urgency-label { color: var(--red); }
        .urgency-medium .urgency-label { color: var(--amber); }
        .urgency-low .urgency-label { color: var(--green); }
        .urgency-title { font-size: 14px; font-weight: 600; color: var(--slate); margin-bottom: 6px; }
        .urgency-examples { font-size: 12px; color: var(--slate-light); line-height: 1.6; }

        /* Pricing */
        .pricing-bg { background: var(--cream); }
        .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-top: 48px; }
        .pricing-card { background: var(--white); border: 1px solid var(--border); border-radius: 16px; padding: 28px 24px; position: relative; transition: box-shadow 0.15s; }
        .pricing-card:hover { box-shadow: 0 8px 24px rgba(26,61,43,0.08); }
        .pricing-card.featured { background: var(--forest); border-color: var(--forest); }
        .pricing-popular { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: var(--gold); color: var(--white); font-size: 11px; font-weight: 700; padding: 4px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; }
        .pricing-name { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; color: var(--slate-light); }
        .pricing-card.featured .pricing-name { color: rgba(255,255,255,0.6); }
        .pricing-price { font-size: 36px; font-weight: 700; letter-spacing: -1px; color: var(--forest); margin-bottom: 4px; }
        .pricing-card.featured .pricing-price { color: var(--white); }
        .pricing-period { font-size: 13px; color: var(--slate-light); margin-bottom: 20px; }
        .pricing-card.featured .pricing-period { color: rgba(255,255,255,0.6); }
        .pricing-features { list-style: none; padding: 0; margin-bottom: 24px; }
        .pricing-features li { font-size: 13px; color: var(--slate); padding: 5px 0; display: flex; gap: 8px; align-items: flex-start; border-bottom: 1px solid var(--border); }
        .pricing-card.featured .pricing-features li { color: rgba(255,255,255,0.85); border-color: rgba(255,255,255,0.1); }
        .pricing-features li:last-child { border-bottom: none; }
        .pricing-features li::before { content: "✓"; color: var(--green); font-weight: 700; flex-shrink: 0; }
        .pricing-card.featured .pricing-features li::before { color: var(--green-light); }
        .btn-pricing { display: block; text-align: center; padding: 11px; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none; transition: all 0.15s; border: 1.5px solid var(--forest); color: var(--forest); }
        .btn-pricing:hover { background: var(--forest); color: var(--white); }
        .pricing-card.featured .btn-pricing { background: var(--white); color: var(--forest); border-color: var(--white); }

        /* CTA */
        .cta-bg { background: linear-gradient(135deg, var(--forest) 0%, var(--green) 100%); text-align: center; }
        .cta-bg .section-title { color: var(--white); }
        .cta-sub { font-size: 18px; color: rgba(255,255,255,0.8); margin-bottom: 36px; max-width: 560px; margin-left: auto; margin-right: auto; line-height: 1.6; }
        .cta-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

        footer { background: var(--forest); color: rgba(255,255,255,0.6); padding: 40px 5%; text-align: center; font-size: 13px; }
        footer a { color: rgba(255,255,255,0.6); text-decoration: none; }
        footer a:hover { color: var(--white); }

        @media (max-width: 700px) {
          .nav-links { display: none; }
          .urgency-cards, .before-after-grid, .problem-grid { grid-template-columns: 1fr; }
          .hero { padding: 120px 5% 60px; }
        }
      `}</style>

      {/* Nav */}
      <nav>
        <a href="/" className="nav-logo">
          <img src="/vetsai-icon.svg" alt="VetsAI" width={36} height={36} style={{ borderRadius: "9px" }} />
          <span className="nav-logo-text">VetsAI</span>
        </a>
        <div className="nav-links">
          <a href="#modules">Platform</a>
          <a href="#how-it-works">How it works</a>
          <a href="#pricing">Pricing</a>
          <a href="mailto:hi@vetsai.vet">Book demo</a>
          <a href="/demo">Request demo</a>
          <a href="/signup" className="nav-cta">Start free →</a>
        </div>
        <a href="/fr" style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textDecoration: "none", padding: "5px 10px", borderRadius: 6, border: "1px solid #e2e8f0" }}>🇫🇷 FR</a>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-tag">🐾 Clinic Operating System · Clinical Intelligence</div>
          <h1>
            Run your veterinary clinic —<br />
            <em>with intelligent clinical support.</em>
          </h1>
          <p className="hero-sub">
            VetsAI is the clinic operating system for veterinary professionals — combining patient records, AI clinical support, pharmacy management, and billing in one place. Built for pets, poultry and livestock.
          </p>
          <div className="hero-for">
            <div className="hero-for-item">Veterinary clinics</div>
            <div className="hero-for-item">Private practices</div>
            <div className="hero-for-item">Mobile veterinarians</div>
            <div className="hero-for-item">Vet schools</div>
          </div>
          <div className="hero-actions">
            <a href="/signup" className="btn-primary">Start free trial →</a>
            <a href="mailto:hi@vetsai.vet" className="btn-outline">📅 Book a clinic demo</a>
          </div>
          <p className="hero-note">No credit card required · First 3 months free · Cancel anytime</p>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 20, flexWrap: "wrap" }}>
            <div style={{ background: "rgba(255,255,255,0.95)", padding: 10, borderRadius: 10, display: "inline-block" }}>
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://vetsai.vet&color=1a3d2b" alt="VetsAI QR Code" width={80} height={80} style={{ display: "block" }} />
            </div>
            <div>
              <a href="https://vetsai.vet" style={{ color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none", display: "block", marginBottom: 4 }}>vetsai.vet</a>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>📱 Scan to share with your clinic</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="stats-bar">
        <div className="stats-inner">
          <div className="stat"><div className="stat-num">3,367+</div><div className="stat-label">Pages of Veterinary Research</div></div>
          <div className="stat"><div className="stat-num">&lt;60s</div><div className="stat-label">Time to full assessment</div></div>
          <div className="stat"><div className="stat-num">3-in-1</div><div className="stat-label">Pets, Poultry & Livestock</div></div>
          <div className="stat"><div className="stat-num">$0</div><div className="stat-label">To get started today</div></div>
        </div>
      </div>

      {/* Problem */}
      <section className="problem-bg">
        <div className="section-inner">
          <div className="eyebrow">The problem we solve</div>
          <h2 className="section-title">Vets spend too much time<br />on paperwork, not patients</h2>
          <div className="problem-grid">
            <ul className="problem-list">
              {[
                { icon: "⏱️", title: "30+ minutes per case", desc: "Writing SOAP notes, looking up drug dosages, and documenting history manually" },
                { icon: "📋", title: "Inconsistent records", desc: "Paper files, scattered notes, no continuity between consultations" },
                { icon: "💊", title: "Dosage verification", desc: "Manual dosage calculations take time and require constant cross-referencing" },
                { icon: "🚨", title: "Missed urgencies", desc: "No system to automatically flag and prioritise high-urgency cases" },
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
              <h3>VetsAI solves all of this</h3>
              <p>One platform that handles the clinical administration — so your vets can focus on what matters: the animals.</p>
              <ul className="solution-items">
                <li>Clinical notes generated automatically for clinician review</li>
                <li>Drug dosage guidance by species and weight — for clinician verification</li>
                <li>Automatic urgency flagging for every case</li>
                <li>Full patient history in one place</li>
                <li>Powered by the Gold Standard Veterinary Research</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Before / After */}
      <section className="before-after-bg">
        <div className="section-inner">
          <div className="eyebrow">Why clinics switch</div>
          <h2 className="section-title">A better way to run your clinic</h2>
          <p className="section-sub">See what changes when your team uses VetsAI every day.</p>
          <div className="before-after-grid">
            <div className="ba-card ba-before">
              <div className="ba-label">Before VetsAI</div>
              <ul className="ba-items">
                <li>Paper notes and handwritten records</li>
                <li>Manual SOAP note writing</li>
                <li>Scattered patient history</li>
                <li>Slow drug dosage lookups</li>
                <li>No urgency triage system</li>
                <li>Delayed follow-up care</li>
              </ul>
            </div>
            <div className="ba-card ba-after">
              <div className="ba-label">After VetsAI</div>
              <ul className="ba-items">
                <li>Digital records, always accessible</li>
                <li>Clinical notes drafted instantly</li>
                <li>Central patient history per case</li>
                <li>Dosage guidance in seconds</li>
                <li>Automatic urgency detection</li>
                <li>Faster, better-informed consultations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Continuity of care */}
      <section className="continuity-bg">
        <div className="section-inner">
          <div className="eyebrow">Built for continuity of care</div>
          <h2 className="section-title">Every visit becomes part of<br />a living patient record</h2>
          <p className="section-sub" style={{ color: "rgba(255,255,255,0.65)" }}>
            VetsAI is not a chatbot. It is clinical infrastructure — every case, note, and recommendation is saved and searchable, building a complete picture of every patient over time.
          </p>
          <div className="continuity-grid">
            {[
              { icon: "⚖️", title: "Weight history" },
              { icon: "🩺", title: "Symptom tracking" },
              { icon: "💊", title: "Treatment log" },
              { icon: "📋", title: "SOAP notes" },
              { icon: "📊", title: "Case history" },
              { icon: "🔁", title: "Follow-up care" },
            ].map((c) => (
              <div className="continuity-item" key={c.title}>
                <div className="continuity-icon">{c.icon}</div>
                <div className="continuity-label">{c.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="modules-bg" id="modules">
        <div className="section-inner">
          <div className="eyebrow">The platform</div>
          <h2 className="section-title">Everything your clinic needs,<br />in one place</h2>
          <p className="section-sub">VetsAI is a full clinic operating system — not just a diagnostic tool.</p>
          <div className="modules-grid">
            {[
              { icon: "🧠", title: "Clinical Support", desc: "AI-powered clinical guidance for pets, poultry and livestock — symptoms, dosages, SOAP notes, and urgency triage.", live: true },
              { icon: "💊", title: "Drug Guidance", desc: "Dosage ranges by species and weight, plus interaction notes — for clinician verification before prescribing.", live: true },
              { icon: "📋", title: "SOAP Notes", desc: "Clinical note drafts generated automatically — ready for your vet to review, edit and sign off.", live: true },
              { icon: "🚨", title: "Urgency Triage", desc: "Every case is automatically flagged as high, medium or low urgency so your team knows what to prioritise.", live: true },
              { icon: "📁", title: "Patient Records", desc: "Full medical history for pets, farm animals and livestock — with species-specific fields, owner details and consultation logs.", live: true },
              { icon: "📅", title: "Appointments", desc: "Scheduling, reminders, and calendar management for your entire clinic team.", live: true },
              { icon: "🔬", title: "Lab Results", desc: "Order and track lab tests — CBC, urinalysis, fecal exams and more — with normal/abnormal flagging.", live: true },
              { icon: "💊", title: "Veterinary Pharmacy", desc: "Stock management for pets, poultry and livestock drugs — expiry alerts, low stock warnings, supplier invoicing and dispensing history.", live: true },
              { icon: "💰", title: "Billing & Invoicing", desc: "Generate invoices, track payments, and manage clinic finances from one dashboard.", live: true },
              { icon: "👥", title: "Multi-user Access", desc: "Role-based access for vets, nurses, technicians, and receptionists — each sees only what they need.", live: true },
              { icon: "📊", title: "Clinic Analytics", desc: "Case trends, common diagnoses, urgency patterns, and clinic performance reports.", live: true },
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
          <div className="eyebrow">How it works</div>
          <h2 className="section-title">Up and running in minutes</h2>
          <p className="section-sub">No installation. No training. Start managing cases immediately.</p>
          <div className="steps">
            {[
              { num: "01", title: "Enter the case", desc: "Input the animal type, breed, age, weight and symptoms. The more detail, the more complete the clinical support." },
              { num: "02", title: "Clinical support is generated", desc: "VetsAI searches the Veterinary Research Database, checks drug dosages, triages urgency, and prepares a clinical summary — automatically." },
              { num: "03", title: "Veterinarian reviews and acts", desc: "Your vet reviews the differential diagnoses, drug guidance, and SOAP note draft — then makes the clinical decision." },
              { num: "04", title: "Saved to patient records", desc: "Every case is automatically saved to the patient's history for full continuity of care across every visit." },
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

      {/* Urgency */}
      <section className="urgency-bg">
        <div className="section-inner">
          <div className="eyebrow">Urgency detection</div>
          <h2 className="section-title">Never miss a critical case</h2>
          <p className="section-sub">VetsAI automatically triages every case so your team always knows what to prioritise.</p>
          <div className="urgency-cards">
            <div className="urgency-card urgency-high">
              <div className="urgency-label">🔴 High urgency</div>
              <div className="urgency-title">Immediate care required</div>
              <div className="urgency-examples">Collapse · Seizures · Cannot breathe · Severe bleeding · Unconsciousness · Blue/pale gums</div>
            </div>
            <div className="urgency-card urgency-medium">
              <div className="urgency-label">🟠 Medium urgency</div>
              <div className="urgency-title">See vet within 24 hours</div>
              <div className="urgency-examples">Limping · Vomiting · Diarrhea · Swelling · Infection signs · Reduced appetite</div>
            </div>
            <div className="urgency-card urgency-low">
              <div className="urgency-label">🟢 Low urgency</div>
              <div className="urgency-title">Monitor and schedule</div>
              <div className="urgency-examples">Mild symptoms · No distress · No warning signs · Routine checkup needed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing-bg" id="pricing">
        <div className="section-inner">
          <div className="eyebrow">Pricing</div>
          <h2 className="section-title">Simple, transparent pricing</h2>
          <p className="section-sub">Start free for 3 months. No credit card required. Cancel anytime.</p>
          <div className="pricing-grid">
            {[
              {
                name: "Starter", price: "$49", period: "per month",
                features: ["1 vet account", "Up to 200 cases/month", "Clinical support & triage", "Drug dosage guidance", "SOAP note drafts", "Printable reports", "Email support"],
                featured: false, popular: false,
              },
              {
                name: "Professional", price: "$99", period: "per month",
                features: ["3 vet accounts", "Unlimited cases", "Clinical support & triage", "Drug dosage guidance", "SOAP note drafts", "Patient records", "Case history & export", "Priority support"],
                featured: true, popular: true,
              },
              {
                name: "Clinic OS", price: "$199", period: "per month",
                features: ["10 vet accounts", "Unlimited cases", "Full clinic OS access", "Patient records", "Appointments", "Billing & invoicing", "Advanced analytics", "Dedicated support"],
                featured: false, popular: false,
              },
            ].map((p) => (
              <div className={`pricing-card ${p.featured ? "featured" : ""}`} key={p.name}>
                {p.popular && <div className="pricing-popular">Most popular</div>}
                <div className="pricing-name">{p.name}</div>
                <div className="pricing-price">{p.price}</div>
                <div className="pricing-period">{p.period}</div>
                <ul className="pricing-features">
                  {p.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
                <a href="/signup" className="btn-pricing">Start free trial</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-bg">
        <div className="section-inner">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 28 }}>
            <div style={{ background: "#fff", padding: 16, borderRadius: 12, display: "inline-block", marginBottom: 10 }}>
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://vetsai.vet&color=1a3d2b" alt="VetsAI QR Code" width={120} height={120} style={{ display: "block" }} />
            </div>
            <a href="https://vetsai.vet" style={{ color: "#fff", fontWeight: 700, fontSize: 15, letterSpacing: 0.5, textDecoration: "none", background: "rgba(255,255,255,0.15)", padding: "6px 16px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.3)" }}>vetsai.vet</a>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>Scan or click to visit</p>
          </div>
          <div className="eyebrow" style={{ color: "rgba(255,255,255,0.6)" }}>Get started today</div>
          <h2 className="section-title">Ready to run a smarter clinic?</h2>
          <p className="cta-sub">
            Designed for veterinary professionals across Africa and beyond — VetsAI delivers intelligent clinical support wherever you practice.
          </p>
          <div className="cta-actions">
            <a href="/signup" className="btn-primary">Start free trial →</a>
            <a href="mailto:hi@vetsai.vet" className="btn-outline">📅 Book a clinic demo</a>
          </div>
          <p style={{ marginTop: 20, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>First 10 clinics get 3 months completely free</p>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div style={{ marginBottom: 12 }}>
          <span style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.9)", fontWeight: 600 }}><img src="/vetsai-icon.svg" alt="VetsAI" width={24} height={24} style={{ borderRadius: "6px" }} /> VetsAI</span>
          &nbsp;·&nbsp; Clinic operating system for veterinary professionals worldwide
        </div>
        <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
          <a href="#modules">Platform</a>
          <a href="#how-it-works">How it works</a>
          <a href="#pricing">Pricing</a>
          <a href="/signup">Try free</a>
          <a href="mailto:hi@vetsai.vet">Contact</a>
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
          © {new Date().getFullYear()} VetsAI. Designed for veterinary professionals across Africa and beyond.
        </div>
      </footer>
    </>
  );
}