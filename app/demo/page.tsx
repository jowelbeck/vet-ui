"use client";

import { useState } from "react";

// ── Sample demo data ──────────────────────────────────────────────────────────

const DEMO_PATIENTS = [
  {
    id: 1,
    name: "Rasta",
    animal: "Dog",
    breed: "Poodle",
    age: "2 years",
    weight: "8 kg",
    owner: "John Mensah",
    lastVisit: "2026-06-10",
    urgency: "high",
    lastSymptoms: "Vomiting, very weak, cannot eat",
  },
  {
    id: 2,
    name: "Bella",
    animal: "Cat",
    breed: "Persian",
    age: "4 years",
    weight: "4.2 kg",
    owner: "Abena Owusu",
    lastVisit: "2026-06-12",
    urgency: "low",
    lastSymptoms: "Routine checkup, no issues",
  },
  {
    id: 3,
    name: "Max",
    animal: "Dog",
    breed: "German Shepherd",
    age: "6 years",
    weight: "32 kg",
    owner: "Kwame Asante",
    lastVisit: "2026-06-13",
    urgency: "medium",
    lastSymptoms: "Limping on right hind leg after exercise",
  },
];

const DEMO_RESULT = {
  status: "completed",
  urgency: "medium",
  recommendation:
    "Consult a veterinarian for a thorough orthopaedic examination. Rest the animal and avoid strenuous activity until assessed.",
  possible_causes: ["Sprain or strain", "Ligament tear", "Joint inflammation", "Fracture"],
  drug_notes: [
    "Pain management (dog): Meloxicam 0.1–0.2 mg/kg once daily. Never use ibuprofen or acetaminophen — toxic to dogs.",
  ],
  soap_note: {
    subjective:
      "Max is a 6-year-old German Shepherd. Presenting complaint: limping on right hind leg after exercise. Owner reports symptom started yesterday.",
    objective:
      "Weight: 32 kg. No in-clinic examination performed; findings are owner-reported. Reported signs: limping, reluctance to bear weight.",
    assessment:
      "Differential diagnoses include sprain, ligament tear, and joint inflammation, with medium urgency due to reported lameness.",
    plan:
      "Rest and activity restriction for 48 hours. Meloxicam at 0.1–0.2 mg/kg once daily if prescribed. Schedule orthopaedic examination within 24 hours.",
  },
  sources: ["dog_limping.txt", "Merck Veterinary Manual p.1089"],
  disclaimer: "This is not a substitute for professional veterinary advice.",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function urgencyColor(u?: string) {
  if (u === "high") return "#dc2626";
  if (u === "medium") return "#d97706";
  return "#2d8653";
}
function urgencyBg(u?: string) {
  if (u === "high") return "#fee2e2";
  if (u === "medium") return "#fef3c7";
  return "#d4f0e0";
}
function cap(s?: string) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function animalEmoji(a?: string) {
  const m: Record<string, string> = { dog: "🐕", cat: "🐈", rabbit: "🐇", horse: "🐴", bird: "🐦" };
  return m[a?.toLowerCase() ?? ""] ?? "🐾";
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function DemoPage() {
  const [animal, setAnimal] = useState("Dog");
  const [petName, setPetName] = useState("Max");
  const [breed, setBreed] = useState("German Shepherd");
  const [age, setAge] = useState("6 years");
  const [weight, setWeight] = useState("32 kg");
  const [symptoms, setSymptoms] = useState("Limping on right hind leg after exercise, started yesterday");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<typeof DEMO_RESULT | null>(null);
  const [activePatient, setActivePatient] = useState<typeof DEMO_PATIENTS[0] | null>(null);
  const [tab, setTab] = useState<"new-case" | "patients">("patients");

  const handleDemoAnalyze = () => {
    if (!animal.trim() || !symptoms.trim()) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(DEMO_RESULT);
      setLoading(false);
    }, 2000);
  };

  const loadPatient = (patient: typeof DEMO_PATIENTS[0]) => {
    setActivePatient(patient);
    setAnimal(patient.animal);
    setPetName(patient.name);
    setBreed(patient.breed);
    setAge(patient.age);
    setWeight(patient.weight);
    setSymptoms(patient.lastSymptoms);
    setResult(null);
    setTab("new-case");
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, -apple-system, sans-serif; background: #f1f5f9; color: #1e293b; font-size: 14px; line-height: 1.5; }
        .demo-banner {
          background: #1a3d2b; color: #fff;
          padding: 12px 20px;
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;
          position: sticky; top: 0; z-index: 100;
        }
        .demo-banner-left { display: flex; align-items: center; gap: 10px; font-size: 13px; }
        .demo-tag { background: #c9a84c; color: #fff; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; }
        .demo-banner-right { display: flex; gap: 8px; }
        .btn-signup { background: #fff; color: #1a3d2b; padding: 7px 16px; border-radius: 7px; font-size: 13px; font-weight: 700; text-decoration: none; border: none; cursor: pointer; }
        .btn-login { background: transparent; color: rgba(255,255,255,0.8); padding: 7px 16px; border-radius: 7px; font-size: 13px; font-weight: 500; text-decoration: none; border: 1px solid rgba(255,255,255,0.3); cursor: pointer; }

        .app-header { background: #fff; border-bottom: 1px solid #e2e8f0; padding: 0 20px; display: flex; align-items: center; justify-content: space-between; height: 56px; }
        .app-logo { display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 700; color: #1a3d2b; }
        .app-logo-mark { width: 30px; height: 30px; background: #1a3d2b; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 15px; }
        .tab-bar { display: flex; gap: 4px; background: #f1f5f9; border-radius: 6px; padding: 3px; }
        .tab { padding: 5px 14px; border-radius: 5px; border: none; background: transparent; font-size: 13px; font-weight: 500; color: #64748b; cursor: pointer; }
        .tab.active { background: #fff; color: #1e293b; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }

        .app-body { max-width: 860px; margin: 0 auto; padding: 20px 16px 48px; }

        /* Stats */
        .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; }
        .stat-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 16px; }
        .stat-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; margin-bottom: 6px; }
        .stat-value { font-size: 24px; font-weight: 700; color: #1e293b; }
        .stat-card.high .stat-value { color: #dc2626; }
        .stat-card.medium .stat-value { color: #d97706; }
        .stat-card.low .stat-value { color: #2d8653; }

        /* Patient list */
        .patient-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 16px; margin-bottom: 10px; display: flex; align-items: center; gap: 12px; cursor: pointer; transition: box-shadow 0.15s; }
        .patient-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .patient-avatar { width: 38px; height: 38px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
        .patient-info { flex: 1; }
        .patient-name { font-size: 14px; font-weight: 600; color: #1e293b; }
        .patient-meta { font-size: 12px; color: #94a3b8; margin-top: 2px; }
        .urgency-pill { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; }
        .load-btn { font-size: 12px; font-weight: 600; color: #1a3d2b; background: #f0faf4; border: 1px solid #d4f0e0; padding: 5px 12px; border-radius: 6px; cursor: pointer; white-space: nowrap; }

        /* Form */
        .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-bottom: 16px; }
        .card-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; margin-bottom: 16px; }
        .field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
        .field-full { grid-column: 1 / -1; }
        .field { display: flex; flex-direction: column; gap: 5px; }
        .field label { font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.4px; }
        .field input, .field textarea { padding: 9px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; color: #1e293b; background: #f8fafc; outline: none; font-family: inherit; resize: vertical; transition: border-color 0.15s; }
        .field input:focus, .field textarea:focus { border-color: #2d8653; box-shadow: 0 0 0 3px rgba(45,134,83,0.1); background: #fff; }
        .field textarea { min-height: 80px; }
        .btn-row { display: flex; gap: 8px; margin-top: 16px; }
        .btn-analyze { background: #1a3d2b; color: #fff; padding: 10px 20px; border-radius: 7px; border: none; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
        .btn-analyze:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-clear { background: #fff; color: #64748b; padding: 10px 20px; border-radius: 7px; border: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }

        /* Result */
        .result-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
        .result-section { margin-top: 16px; padding-top: 16px; border-top: 1px solid #f1f5f9; }
        .result-section h4 { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; margin-bottom: 10px; }
        .result-section p, .result-section li { font-size: 14px; color: #334155; line-height: 1.6; }
        .result-section ul { padding-left: 18px; }
        .result-section li { margin-bottom: 4px; }
        .soap-key { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; color: #64748b; margin: 10px 0 4px; }
        .soap-val { font-size: 13px; color: #334155; background: #f8fafc; padding: 8px 12px; border-radius: 6px; line-height: 1.6; }
        .disclaimer { font-size: 12px; color: #94a3b8; font-style: italic; margin-top: 12px; }

        /* Demo CTA */
        .demo-cta { background: linear-gradient(135deg, #1a3d2b 0%, #3a8f5f 100%); border-radius: 12px; padding: 24px; text-align: center; margin-top: 20px; color: #fff; }
        .demo-cta h3 { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
        .demo-cta p { font-size: 13px; color: rgba(255,255,255,0.75); margin-bottom: 16px; }
        .demo-cta-btns { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
        .btn-cta-primary { background: #fff; color: #1a3d2b; padding: 10px 22px; border-radius: 8px; font-size: 14px; font-weight: 700; text-decoration: none; }
        .btn-cta-secondary { background: transparent; color: rgba(255,255,255,0.85); padding: 10px 22px; border-radius: 8px; font-size: 14px; font-weight: 500; text-decoration: none; border: 1px solid rgba(255,255,255,0.3); }

        @media (max-width: 560px) {
          .stats { grid-template-columns: repeat(2, 1fr); }
          .field-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Demo Banner */}
      <div className="demo-banner">
        <div className="demo-banner-left">
          <span className="demo-tag">Demo</span>
          <span>You are exploring VetsAI in demo mode. Data is not saved. Sign up to unlock your full clinic.</span>
        </div>
        <div className="demo-banner-right">
          <a href="/signup" className="btn-signup">Start free trial</a>
          <a href="/login" className="btn-login">Log in</a>
        </div>
      </div>

      {/* App Header */}
      <div className="app-header">
        <div className="app-logo">
          <div className="app-logo-mark">🐾</div>
          VetsAI
        </div>
        <div className="tab-bar">
          <button className={`tab ${tab === "patients" ? "active" : ""}`} onClick={() => setTab("patients")}>
            Patients
          </button>
          <button className={`tab ${tab === "new-case" ? "active" : ""}`} onClick={() => setTab("new-case")}>
            New case
          </button>
        </div>
      </div>

      <div className="app-body">

        {/* Stats */}
        <div className="stats">
          <div className="stat-card">
            <div className="stat-label">Total patients</div>
            <div className="stat-value">3</div>
          </div>
          <div className="stat-card high">
            <div className="stat-label">🔴 High</div>
            <div className="stat-value">1</div>
          </div>
          <div className="stat-card medium">
            <div className="stat-label">🟠 Medium</div>
            <div className="stat-value">1</div>
          </div>
          <div className="stat-card low">
            <div className="stat-label">🟢 Low</div>
            <div className="stat-value">1</div>
          </div>
        </div>

        {/* Patients Tab */}
        {tab === "patients" && (
          <div className="card">
            <div className="card-title">Patient records — Demo clinic</div>
            {DEMO_PATIENTS.map((p) => (
              <div className="patient-card" key={p.id} onClick={() => loadPatient(p)}>
                <div
                  className="patient-avatar"
                  style={{ background: urgencyBg(p.urgency) }}
                >
                  {animalEmoji(p.animal)}
                </div>
                <div className="patient-info">
                  <div className="patient-name">{p.name}</div>
                  <div className="patient-meta">
                    {p.animal} · {p.breed} · {p.age} · {p.weight} · Owner: {p.owner}
                  </div>
                  <div className="patient-meta" style={{ marginTop: 3 }}>
                    Last visit: {new Date(p.lastVisit).toLocaleDateString()} · {p.lastSymptoms}
                  </div>
                </div>
                <span
                  className="urgency-pill"
                  style={{ background: urgencyBg(p.urgency), color: urgencyColor(p.urgency) }}
                >
                  {cap(p.urgency)}
                </span>
                <button className="load-btn">Analyze →</button>
              </div>
            ))}
            <div className="demo-cta" style={{ marginTop: 16 }}>
              <h3>Ready to add your own patients?</h3>
              <p>Sign up free and start building your clinic&apos;s patient records today.</p>
              <div className="demo-cta-btns">
                <a href="/signup" className="btn-cta-primary">Start free trial →</a>
                <a href="mailto:hi@vetsai.app" className="btn-cta-secondary">Book a demo</a>
              </div>
            </div>
          </div>
        )}

        {/* New Case Tab */}
        {tab === "new-case" && (
          <>
            {result && (
              <div className="card">
                <div className="result-header">
                  <div className="card-title" style={{ marginBottom: 0 }}>Assessment</div>
                  <span
                    className="urgency-pill"
                    style={{ background: urgencyBg(result.urgency), color: urgencyColor(result.urgency) }}
                  >
                    {cap(result.urgency)}
                  </span>
                </div>

                {result.recommendation && (
                  <div className="result-section">
                    <h4>Recommendation</h4>
                    <p>{result.recommendation}</p>
                  </div>
                )}

                {result.possible_causes.length > 0 && (
                  <div className="result-section">
                    <h4>Possible causes</h4>
                    <ul>{result.possible_causes.map((c, i) => <li key={i}>{c}</li>)}</ul>
                  </div>
                )}

                {result.sources.length > 0 && (
                  <div className="result-section">
                    <h4>Sources</h4>
                    <ul>{result.sources.map((s, i) => <li key={i}>{s}</li>)}</ul>
                  </div>
                )}

                {result.drug_notes.length > 0 && (
                  <div className="result-section">
                    <h4>💊 Drug & dosage notes</h4>
                    <ul>{result.drug_notes.map((n, i) => <li key={i}>{n}</li>)}</ul>
                  </div>
                )}

                {result.soap_note && (
                  <div className="result-section">
                    <h4>📋 SOAP note draft</h4>
                    {(["subjective", "objective", "assessment", "plan"] as const).map((key) =>
                      result.soap_note[key] ? (
                        <div key={key}>
                          <div className="soap-key">{key}</div>
                          <div className="soap-val">{result.soap_note[key]}</div>
                        </div>
                      ) : null
                    )}
                  </div>
                )}

                <p className="disclaimer">{result.disclaimer}</p>

                <div className="demo-cta" style={{ marginTop: 20 }}>
                  <h3>Want to save this case?</h3>
                  <p>Sign up free — your cases, patients, and records will be saved securely to your clinic account.</p>
                  <div className="demo-cta-btns">
                    <a href="/signup" className="btn-cta-primary">Start free trial →</a>
                    <a href="mailto:hi@vetsai.app" className="btn-cta-secondary">Book a demo</a>
                  </div>
                </div>
              </div>
            )}

            <div className="card">
              <div className="card-title">New case — Demo mode</div>
              <div className="field-grid">
                <div className="field">
                  <label>Animal type *</label>
                  <input value={animal} onChange={(e) => setAnimal(e.target.value)} placeholder="Dog, cat, rabbit…" />
                </div>
                <div className="field">
                  <label>Pet name</label>
                  <input value={petName} onChange={(e) => setPetName(e.target.value)} placeholder="Buddy" />
                </div>
                <div className="field">
                  <label>Breed</label>
                  <input value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="Labrador…" />
                </div>
                <div className="field">
                  <label>Age</label>
                  <input value={age} onChange={(e) => setAge(e.target.value)} placeholder="3 years" />
                </div>
                <div className="field">
                  <label>Weight</label>
                  <input value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="12 kg" />
                </div>
                <div className="field field-full">
                  <label>Symptoms *</label>
                  <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Describe what you've observed…"
                  />
                </div>
              </div>
              <div className="btn-row">
                <button className="btn-analyze" onClick={handleDemoAnalyze} disabled={loading}>
                  {loading ? "⏳ Analyzing…" : "Analyze case"}
                </button>
                <button className="btn-clear" onClick={() => { setResult(null); setAnimal(""); setPetName(""); setBreed(""); setAge(""); setWeight(""); setSymptoms(""); }}>
                  Clear
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}