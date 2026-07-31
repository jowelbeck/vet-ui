"use client";

import Link from "next/link";

export default function ClinicalDecisionSupportPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        *{margin:0;padding:0;box-sizing:border-box;}

        body{
          font-family:Inter,sans-serif;
          background:#ffffff;
          color:#1e293b;
        }

        .hero{
          background:linear-gradient(135deg,#123524,#1d5b3c,#2e8b57);
          color:white;
          padding:110px 7% 90px;
        }

        .container{
          max-width:1200px;
          margin:auto;
        }

        .badge{
          display:inline-block;
          background:rgba(255,255,255,.15);
          border:1px solid rgba(255,255,255,.25);
          padding:8px 16px;
          border-radius:30px;
          margin-bottom:25px;
          font-size:13px;
          font-weight:600;
        }

        h1{
          font-size:58px;
          line-height:1.1;
          margin-bottom:25px;
          max-width:820px;
          font-weight:800;
        }

        .subtitle{
          font-size:22px;
          max-width:760px;
          line-height:1.7;
          color:#e6f4ea;
          margin-bottom:40px;
        }

        .buttons{
          display:flex;
          gap:20px;
          flex-wrap:wrap;
        }

        .btn{
          text-decoration:none;
          padding:15px 30px;
          border-radius:10px;
          font-weight:700;
          transition:.25s;
        }

        .primary{
          background:white;
          color:#123524;
        }

        .primary:hover{
          transform:translateY(-2px);
        }

        .secondary{
          border:2px solid rgba(255,255,255,.4);
          color:white;
        }

        .secondary:hover{
          background:rgba(255,255,255,.08);
        }

        .stats{
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:30px;
          margin-top:70px;
        }

        .stat{
          background:rgba(255,255,255,.08);
          padding:25px;
          border-radius:14px;
          text-align:center;
        }

        .stat h2{
          font-size:42px;
          margin-bottom:8px;
        }

        .stat p{
          color:#dbe7df;
        }

        @media(max-width:900px){

          h1{
            font-size:42px;
          }

          .subtitle{
            font-size:18px;
          }

          .stats{
            grid-template-columns:1fr 1fr;
          }

        }

        @media(max-width:600px){

          .stats{
            grid-template-columns:1fr;
          }

          .buttons{
            flex-direction:column;
          }

        }
          .why-section{
    padding:100px 7%;
    background:#f8faf9;
}

.section-header{
    max-width:760px;
    margin:0 auto 70px;
    text-align:center;
}

.section-tag{
    display:inline-block;
    color:#2e8b57;
    font-size:13px;
    font-weight:700;
    letter-spacing:1px;
    margin-bottom:18px;
}

.section-header h2{
    font-size:44px;
    color:#123524;
    margin-bottom:20px;
}

.section-header p{
    font-size:19px;
    color:#64748b;
    line-height:1.8;
}

.feature-grid{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
    gap:28px;
}

.feature-card{
    background:#ffffff;
    border-radius:18px;
    padding:35px;
    box-shadow:0 8px 25px rgba(0,0,0,.06);
    transition:.25s;
}

.feature-card:hover{
    transform:translateY(-6px);
}

.icon{
    font-size:38px;
    margin-bottom:18px;
}

.feature-card h3{
    color:#123524;
    margin-bottom:14px;
    font-size:24px;
}

.feature-card p{
    color:#64748b;
    line-height:1.7;
}
    .workflow-section{
    padding:110px 7%;
    background:#ffffff;
}

.workflow{
    max-width:850px;
    margin:60px auto 0;
}

.workflow-step{
    background:#f8faf9;
    border-radius:18px;
    padding:30px;
    text-align:center;
    box-shadow:0 8px 25px rgba(0,0,0,.05);
}

.step-number{
    width:52px;
    height:52px;
    border-radius:50%;
    background:#123524;
    color:#fff;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:22px;
    font-weight:700;
    margin:0 auto 20px;
}

.workflow-step h3{
    color:#123524;
    margin-bottom:12px;
    font-size:26px;
}

.workflow-step p{
    color:#64748b;
    line-height:1.7;
}

.arrow{
    text-align:center;
    font-size:34px;
    color:#2e8b57;
    margin:18px 0;
    font-weight:700;
}
    .capabilities-section{
    background:#f8faf9;
    padding:110px 7%;
}

.capabilities-grid{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(300px,1fr));
    gap:30px;
    margin-top:60px;
}

.capability-card{
    background:#ffffff;
    border-radius:18px;
    padding:35px;
    box-shadow:0 10px 30px rgba(0,0,0,.06);
    transition:.25s;
}

.capability-card:hover{
    transform:translateY(-6px);
}

.capability-card h3{
    color:#123524;
    font-size:24px;
    margin-bottom:16px;
}

.capability-card p{
    color:#64748b;
    line-height:1.8;
}
    .audience-section{
    padding:110px 7%;
    background:#ffffff;
}

.audience-grid{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
    gap:28px;
    margin-top:60px;
}

.audience-card{
    background:#f8faf9;
    border-radius:18px;
    padding:35px;
    border:1px solid #e5e7eb;
    transition:.25s;
}

.audience-card:hover{
    transform:translateY(-6px);
    box-shadow:0 10px 25px rgba(0,0,0,.06);
}

.audience-card h3{
    color:#123524;
    margin-bottom:16px;
    font-size:24px;
}

.audience-card p{
    color:#64748b;
    line-height:1.8;
}
    .difference-section{
    padding:110px 7%;
    background:#f5f8f6;
}

.difference-grid{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(320px,1fr));
    gap:30px;
    margin-top:60px;
}

.difference-item{
    background:white;
    padding:35px;
    border-radius:18px;
    border-left:5px solid #2e8b57;
    box-shadow:0 8px 24px rgba(0,0,0,.05);
    transition:.25s;
}

.difference-item:hover{
    transform:translateY(-6px);
}

.difference-item h3{
    color:#123524;
    margin-bottom:15px;
    font-size:24px;
}

.difference-item p{
    color:#64748b;
    line-height:1.8;
}
    .faq-section{
    padding:110px 7%;
    background:#ffffff;
}

.faq-grid{
    display:grid;
    gap:24px;
    margin-top:60px;
}

.faq-item{
    background:#f8faf9;
    padding:30px;
    border-radius:18px;
    border-left:5px solid #2e8b57;
}

.faq-item h3{
    color:#123524;
    margin-bottom:14px;
    font-size:22px;
}

.faq-item p{
    color:#64748b;
    line-height:1.8;
}
    .cta-section{
    padding:120px 7%;
    background:linear-gradient(135deg,#123524,#1d5b3c,#2e8b57);
    color:white;
    text-align:center;
}

.cta-section h2{
    font-size:48px;
    margin-bottom:24px;
}

.cta-section p{
    max-width:760px;
    margin:0 auto 45px;
    font-size:20px;
    line-height:1.8;
    color:rgba(255,255,255,.9);
}

.cta-buttons{
    display:flex;
    justify-content:center;
    gap:18px;
    flex-wrap:wrap;
}
    .species-section{
    padding:110px 7%;
    background:#f8faf9;
}

.species-grid{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
    gap:20px;
    margin-top:60px;
}

.species-card{
    background:#ffffff;
    border-radius:16px;
    padding:24px;
    text-align:center;
    font-size:20px;
    font-weight:600;
    color:#123524;
    box-shadow:0 8px 20px rgba(0,0,0,.05);
    transition:.25s;
}

.species-card:hover{
    transform:translateY(-5px);
}

      `}</style>

      <section className="hero">

        <div className="container">

          <div className="badge">
            AI Clinical Intelligence for Veterinary Medicine
          </div>

          <h1>
            Clinical Decision Support for Modern Veterinary Practice
          </h1>

          <p className="subtitle">
            VetsAI helps veterinarians make faster, evidence-based clinical
            decisions using AI grounded in trusted veterinary references.
            Generate differential diagnoses, drug dosage guidance, SOAP notes,
            urgency triage and complete patient records in under 60 seconds.
          </p>

          <div className="buttons">

            <Link href="/signup" className="btn primary">
              Start Free
            </Link>

            <Link href="/demo" className="btn secondary">
              Watch Demo
            </Link>

          </div>

          <div className="stats">

            <div className="stat">
              <h2>60s</h2>
              <p>Average clinical analysis</p>
            </div>

            <div className="stat">
              <h2>3</h2>
              <p>Pet • Poultry • Livestock</p>
            </div>

            <div className="stat">
              <h2>AI</h2>
              <p>Evidence-based recommendations</p>
            </div>

            <div className="stat">
              <h2>24/7</h2>
              <p>Clinical decision support</p>
            </div>

          </div>

        </div>

      </section>
<section className="why-section">

  <div className="container">

    <div className="section-header">

      <span className="section-tag">
        WHY VETERINARIANS CHOOSE VETSAI
      </span>

      <h2>
        Clinical decisions deserve more than guesswork.
      </h2>

      <p>
        VetsAI combines trusted veterinary knowledge with AI to help clinicians make faster, more consistent, and evidence-based decisions while reducing documentation time.
      </p>

    </div>

    <div className="feature-grid">

      <div className="feature-card">
        <div className="icon">⚡</div>
        <h3>Faster Decisions</h3>
        <p>
          Generate clinical insights in seconds without interrupting your consultation.
        </p>
      </div>

      <div className="feature-card">
        <div className="icon">🩺</div>
        <h3>Evidence-Based Care</h3>
        <p>
          Support every diagnosis with trusted veterinary references and structured clinical reasoning.
        </p>
      </div>

      <div className="feature-card">
        <div className="icon">📋</div>
        <h3>Less Documentation</h3>
        <p>
          Automatically create SOAP notes, patient records and consultation summaries.
        </p>
      </div>

      <div className="feature-card">
        <div className="icon">🌍</div>
        <h3>Built for Africa</h3>
        <p>
          Designed for veterinary clinics, universities and livestock professionals across Africa.
        </p>
      </div>

    </div>

  </div>

</section>
<section className="workflow-section">

  <div className="container">

    <div className="section-header">

      <span className="section-tag">
        HOW IT WORKS
      </span>

      <h2>
        From patient presentation to clinical decision in minutes
      </h2>

      <p>
        VetsAI assists veterinarians throughout the consultation by combining clinical reasoning, trusted veterinary knowledge, and intelligent documentation into one seamless workflow.
      </p>

    </div>

    <div className="workflow">

      <div className="workflow-step">
        <div className="step-number">1</div>
        <h3>Patient Presentation</h3>
        <p>Record species, breed, age, history and presenting complaints.</p>
      </div>

      <div className="arrow">↓</div>

      <div className="workflow-step">
        <div className="step-number">2</div>
        <h3>AI Clinical Analysis</h3>
        <p>Clinical findings are analysed using evidence-based veterinary knowledge.</p>
      </div>

      <div className="arrow">↓</div>

      <div className="workflow-step">
        <div className="step-number">3</div>
        <h3>Differential Diagnosis</h3>
        <p>Receive prioritized differential diagnoses with supporting clinical reasoning.</p>
      </div>

      <div className="arrow">↓</div>

      <div className="workflow-step">
        <div className="step-number">4</div>
        <h3>Clinical Documentation</h3>
        <p>Generate SOAP notes, treatment plans and complete patient records.</p>
      </div>

    </div>

  </div>

</section>
<section className="capabilities-section">

  <div className="container">

    <div className="section-header">

      <span className="section-tag">
        KEY CAPABILITIES
      </span>

      <h2>
        Everything veterinarians need in one intelligent platform
      </h2>

      <p>
        VetsAI combines clinical decision support with modern practice management, helping veterinary professionals deliver better care while improving operational efficiency.
      </p>

    </div>

    <div className="capabilities-grid">

      <div className="capability-card">
        <h3>🩺 Differential Diagnosis</h3>
        <p>Generate evidence-informed differential diagnoses based on clinical signs, history and examination findings.</p>
      </div>

      <div className="capability-card">
        <h3>💊 Drug Dosage Guidance</h3>
        <p>Access dosage guidance and treatment recommendations to support safer prescribing decisions.</p>
      </div>

      <div className="capability-card">
        <h3>📝 SOAP Notes</h3>
        <p>Automatically create structured SOAP notes and consultation summaries in seconds.</p>
      </div>

      <div className="capability-card">
        <h3>📂 Electronic Medical Records</h3>
        <p>Maintain complete digital patient records that are easy to retrieve and update.</p>
      </div>

      <div className="capability-card">
        <h3>📅 Appointment Management</h3>
        <p>Organize consultations, follow-ups and daily schedules from one dashboard.</p>
      </div>

      <div className="capability-card">
        <h3>🌍 Disease Surveillance</h3>
        <p>Support disease monitoring and reporting workflows that contribute to improved animal health management.</p>
      </div>

    </div>

  </div>

</section>
<section className="audience-section">

  <div className="container">

    <div className="section-header">

      <span className="section-tag">
        WHO WE SERVE
      </span>

      <h2>
        Built for every part of the veterinary ecosystem
      </h2>

      <p>
        Whether you're treating companion animals, managing livestock health, educating future veterinarians, or supporting national animal health programs, VetsAI adapts to your workflow.
      </p>

    </div>

    <div className="audience-grid">

      <div className="audience-card">
        <h3>🏥 Veterinary Clinics</h3>
        <p>Improve consultations, patient records, scheduling, billing and day-to-day clinical operations.</p>
      </div>

      <div className="audience-card">
        <h3>🎓 Universities</h3>
        <p>Support veterinary education with AI-assisted clinical reasoning and interactive case discussions.</p>
      </div>

      <div className="audience-card">
        <h3>🐄 Livestock Professionals</h3>
        <p>Assist veterinarians serving cattle, poultry, sheep, goats and other food-producing animals.</p>
      </div>

      <div className="audience-card">
        <h3>🌍 Governments & NGOs</h3>
        <p>Strengthen surveillance, reporting and veterinary service delivery at regional and national levels.</p>
      </div>

    </div>

  </div>

</section>
<section className="difference-section">

  <div className="container">

    <div className="section-header">

      <span className="section-tag">
        WHY VETSAI
      </span>

      <h2>
        Built specifically for veterinary medicine—not adapted from human healthcare.
      </h2>

      <p>
        VetsAI was designed from the ground up for veterinarians, combining clinical intelligence, practice management and animal health workflows in one secure platform.
      </p>

    </div>

    <div className="difference-grid">

      <div className="difference-item">
        <h3>🧠 Veterinary AI</h3>
        <p>Purpose-built to support veterinary clinical reasoning across companion animals, livestock and poultry.</p>
      </div>

      <div className="difference-item">
        <h3>📚 Trusted Knowledge</h3>
        <p>Clinical recommendations are grounded in recognised veterinary references to support evidence-informed decisions.</p>
      </div>

      <div className="difference-item">
        <h3>🌍 Designed for Africa</h3>
        <p>Created with African veterinary practice in mind, while remaining suitable for clinics anywhere in the world.</p>
      </div>

      <div className="difference-item">
        <h3>⚡ One Complete Platform</h3>
        <p>Clinical decision support, patient records, appointments, pharmacy, billing and reporting work together seamlessly.</p>
      </div>

      <div className="difference-item">
  <h3>💾 Intelligent Data Recovery</h3>
  <p>
    Protect valuable clinical records with automated backup and data recovery capabilities, helping clinics recover critical information and maintain business continuity.
  </p>
</div>

      <div className="difference-item">
  <h3>🌍 WOAH-Compliant Disease Reporting</h3>
  <p>
    Support identification of WOAH-notifiable diseases and streamline disease reporting workflows, helping veterinary services strengthen surveillance and improve outbreak response.
  </p>
</div>

    </div>

  </div>

</section>
<section className="faq-section">

  <div className="container">

    <div className="section-header">

      <span className="section-tag">
        FREQUENTLY ASKED QUESTIONS
      </span>

      <h2>
        Questions veterinary professionals ask most often
      </h2>

    </div>

    <div className="faq-grid">

      <div className="faq-item">
        <h3>Is VetsAI a replacement for clinical judgement?</h3>
        <p>No. VetsAI is designed to support veterinarians by providing evidence-informed clinical guidance. Final clinical decisions always remain with the attending veterinarian.</p>
      </div>

      <div className="faq-item">
        <h3>Can I use VetsAI in a small veterinary clinic?</h3>
        <p>Yes. VetsAI is suitable for independent practices, multi-doctor clinics, universities and larger veterinary organisations.</p>
      </div>

      <div className="faq-item">
        <h3>Which animal species does VetsAI support?</h3>
        <p>VetsAI is designed for companion animals, livestock and poultry, with workflows that support a broad range of veterinary practice settings.</p>
      </div>

      <div className="faq-item">
        <h3>Can VetsAI support disease surveillance?</h3>
        <p>Yes. The platform includes workflows that assist with surveillance and reporting, including support for WOAH-compliant disease reporting processes.</p>
      </div>

    </div>

  </div>

</section>
<section className="cta-section">

  <div className="container">

    <h2>Ready to transform your veterinary practice?</h2>

    <p>
      Join veterinary professionals using VetsAI to improve clinical decision-making,
      streamline practice management and deliver better animal healthcare.
    </p>

    <div className="cta-buttons">

      <Link href="/signup" className="btn primary">
        Start Free
      </Link>

      <Link href="/demo" className="btn secondary">
        Book a Demo
      </Link>

      <Link href="/pricing" className="btn secondary">
        View Pricing
      </Link>

    </div>

  </div>

</section>
<section className="species-section">

  <div className="container">

    <div className="section-header">

      <span className="section-tag">
        SPECIES SUPPORTED
      </span>

      <h2>
        Built for veterinary professionals working across diverse animal species
      </h2>

      <p>
        VetsAI is designed to assist veterinary professionals caring for companion animals, livestock, equine and other species, with capabilities continuing to expand.
      </p>

    </div>

    <div className="species-grid">

      <div className="species-card">🐶 Dogs</div>
      <div className="species-card">🐱 Cats</div>
      <div className="species-card">🐴 Horses</div>
      <div className="species-card">🐄 Cattle</div>
      <div className="species-card">🐐 Goats</div>
      <div className="species-card">🐑 Sheep</div>
      <div className="species-card">🐖 Pigs</div>
      <div className="species-card">🐔 Poultry</div>
      <div className="species-card">🐪 Camels</div>
      <div className="species-card">🫏 Donkeys</div>
      <div className="species-card">🐇 Rabbits</div>
      <div className="species-card">🦌 Wildlife & Exotic Animals</div>

    </div>

  </div>

</section>
    </>
  );
}
