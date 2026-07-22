"use client";

import { useState, useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const STEPS = [
  { id: 1, title: "Welcome to VetsAI", icon: "🐾" },
  { id: 2, title: "Set up your clinic", icon: "🏥" },
  { id: 3, title: "Add your first patient", icon: "🐕" },
  { id: 4, title: "You're ready!", icon: "🎉" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (step === 4) {
      trackEvent("onboarding_completed");
    }
  }, [step]);

  // Step 2 — clinic info
  const [clinicName, setClinicName] = useState("");
  const [clinicPhone, setClinicPhone] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");
  const [clinicCountry, setClinicCountry] = useState("Ghana");

  // Step 3 — first patient
  const [petName, setPetName] = useState("");
  const [petAnimal, setPetAnimal] = useState("Dog");
  const [petBreed, setPetBreed] = useState("");
  const [petAge, setPetAge] = useState("");
  const [petWeight, setPetWeight] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const saveClinicInfo = async () => {
    if (!clinicName.trim()) { setError("Please enter your clinic name."); return; }
    setSaving(true);
    setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("clinics").upsert({
        user_id: user.id,
        name: clinicName.trim(),
        phone: clinicPhone.trim(),
        address: clinicAddress.trim(),
        country: clinicCountry.trim(),
      });
    }
    setSaving(false);
    setStep(3);
  };

  const saveFirstPatient = async () => {
    if (!petName.trim() || !petAnimal.trim()) { setError("Please enter at least the pet name and animal type."); return; }
    setSaving(true);
    setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("patients").insert({
        user_id: user.id,
        name: petName.trim(),
        animal: petAnimal.trim(),
        breed: petBreed.trim(),
        age: petAge.trim(),
        weight: petWeight.trim(),
        owner_name: ownerName.trim(),
        owner_phone: ownerPhone.trim(),
      });
    }
    setSaving(false);
    setStep(4);
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, -apple-system, sans-serif; background: #f1f5f9; color: #1e293b; }
        .page { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; }
        .logo { display: flex; align-items: center; gap: 10px; text-decoration: none; margin-bottom: 32px; }
        .logo-mark { width: 40px; height: 40px; background: #1a3d2b; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
        .logo-text { font-size: 20px; font-weight: 700; color: #1a3d2b; }

        /* Progress */
        .progress { display: flex; align-items: center; gap: 0; margin-bottom: 32px; }
        .prog-step { display: flex; align-items: center; gap: 8px; }
        .prog-dot { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; transition: all 0.2s; }
        .prog-dot.done { background: #1a3d2b; color: #fff; }
        .prog-dot.active { background: #1a3d2b; color: #fff; box-shadow: 0 0 0 4px rgba(26,61,43,0.15); }
        .prog-dot.pending { background: #e2e8f0; color: #94a3b8; }
        .prog-label { font-size: 12px; font-weight: 500; color: #64748b; white-space: nowrap; }
        .prog-label.active { color: #1a3d2b; font-weight: 600; }
        .prog-line { width: 32px; height: 2px; background: #e2e8f0; margin: 0 4px; flex-shrink: 0; }
        .prog-line.done { background: #1a3d2b; }

        .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 32px; width: 100%; max-width: 480px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
        .step-icon { font-size: 40px; margin-bottom: 16px; }
        .step-title { font-size: 22px; font-weight: 700; color: #1a3d2b; margin-bottom: 8px; }
        .step-sub { font-size: 14px; color: #64748b; margin-bottom: 24px; line-height: 1.6; }

        .field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
        .field label { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.4px; }
        .field input, .field select { padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; color: #1e293b; background: #f8fafc; outline: none; font-family: inherit; transition: border-color 0.15s; }
        .field input:focus, .field select:focus { border-color: #1a3d2b; box-shadow: 0 0 0 3px rgba(26,61,43,0.1); background: #fff; }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        .btn-next { width: 100%; background: #1a3d2b; color: #fff; padding: 12px; border-radius: 8px; border: none; font-size: 15px; font-weight: 600; cursor: pointer; font-family: inherit; margin-top: 8px; transition: background 0.15s; }
        .btn-next:hover { background: #2d6b47; }
        .btn-next:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-skip { width: 100%; background: transparent; color: #94a3b8; padding: 10px; border-radius: 8px; border: none; font-size: 14px; cursor: pointer; font-family: inherit; margin-top: 6px; }
        .btn-skip:hover { color: #64748b; }
        .error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 14px; }

        /* Welcome step */
        .welcome-list { list-style: none; padding: 0; margin-bottom: 24px; }
        .welcome-list li { padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #334155; display: flex; gap: 10px; align-items: center; }
        .welcome-list li:last-child { border-bottom: none; }
        .welcome-list li::before { content: "✓"; color: #1a3d2b; font-weight: 700; flex-shrink: 0; }

        /* Ready step */
        .ready-box { background: #f0faf4; border: 1px solid #d4f0e0; border-radius: 10px; padding: 20px; text-align: center; margin-bottom: 20px; }
        .ready-box h3 { font-size: 16px; font-weight: 700; color: #1a3d2b; margin-bottom: 6px; }
        .ready-box p { font-size: 13px; color: #2d6b47; }
        .quick-links { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
        .quick-link { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; text-align: center; text-decoration: none; transition: all 0.15s; }
        .quick-link:hover { background: #f0faf4; border-color: #d4f0e0; }
        .quick-link-icon { font-size: 20px; margin-bottom: 6px; }
        .quick-link-label { font-size: 13px; font-weight: 500; color: #334155; }
      `}</style>

      <div className="page">
        <a href="/" className="logo">
          <img src="/vetsai-icon.svg" alt="VetsAI" width={40} height={40} style={{ borderRadius: "10px" }} />
          <span className="logo-text">VetsAI</span>
        </a>

        {/* Progress */}
        <div className="progress">
          {STEPS.map((s, i) => (
            <div key={s.id} className="prog-step">
              {i > 0 && <div className={`prog-line ${step > s.id - 1 ? "done" : ""}`} />}
              <div className={`prog-dot ${step > s.id ? "done" : step === s.id ? "active" : "pending"}`}>
                {step > s.id ? "✓" : s.id}
              </div>
              <span className={`prog-label ${step === s.id ? "active" : ""}`}>{s.title.split(" ")[0]}</span>
            </div>
          ))}
        </div>

        <div className="card">

          {/* Step 1 — Welcome */}
          {step === 1 && (
            <>
              <div className="step-icon">🐾</div>
              <div className="step-title">Welcome to VetsAI!</div>
              <div className="step-sub">
                Your free trial is active. Let&apos;s get your clinic set up in 2 minutes.
              </div>
              <ul className="welcome-list">
                <li>AI-powered clinical support for every case</li>
                <li>Drug dosage guidance for clinician verification</li>
                <li>Auto-generated SOAP note drafts</li>
                <li>Patient records and case history</li>
                <li>Powered by gold standard veterinary research</li>
              </ul>
              <button className="btn-next" onClick={() => setStep(2)}>
                Set up my clinic →
              </button>
            </>
          )}

          {/* Step 2 — Clinic info */}
          {step === 2 && (
            <>
              <div className="step-icon">🏥</div>
              <div className="step-title">Set up your clinic</div>
              <div className="step-sub">Tell us about your clinic so we can personalise your experience.</div>

              {error && <div className="error">⚠ {error}</div>}

              <div className="field">
                <label>Clinic name *</label>
                <input placeholder="Accra Vet Clinic" value={clinicName} onChange={(e) => setClinicName(e.target.value)} />
              </div>
              <div className="field">
                <label>Phone number</label>
                <input placeholder="+233 20 000 0000" value={clinicPhone} onChange={(e) => setClinicPhone(e.target.value)} />
              </div>
              <div className="field">
                <label>Address</label>
                <input placeholder="123 Main Street, Accra" value={clinicAddress} onChange={(e) => setClinicAddress(e.target.value)} />
              </div>
              <div className="field">
                <label>Country</label>
                <select value={clinicCountry} onChange={(e) => setClinicCountry(e.target.value)}>
                  {["Ghana", "Nigeria", "Kenya", "South Africa", "United Kingdom", "United States", "Other"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              <button className="btn-next" onClick={saveClinicInfo} disabled={saving}>
                {saving ? "Saving…" : "Continue →"}
              </button>
              <button className="btn-skip" onClick={() => setStep(3)}>Skip for now</button>
            </>
          )}

          {/* Step 3 — First patient */}
          {step === 3 && (
            <>
              <div className="step-icon">🐕</div>
              <div className="step-title">Add your first patient</div>
              <div className="step-sub">Add a patient to your records. You can add more anytime from the app.</div>

              {error && <div className="error">⚠ {error}</div>}

              <div className="field-row">
                <div className="field">
                  <label>Pet name *</label>
                  <input placeholder="Buddy" value={petName} onChange={(e) => setPetName(e.target.value)} />
                </div>
                <div className="field">
                  <label>Animal *</label>
                  <select value={petAnimal} onChange={(e) => setPetAnimal(e.target.value)}>
                    {["Dog", "Cat", "Rabbit", "Bird", "Horse", "Goat", "Cow", "Other"].map((a) => (
                      <option key={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Breed</label>
                  <input placeholder="Labrador" value={petBreed} onChange={(e) => setPetBreed(e.target.value)} />
                </div>
                <div className="field">
                  <label>Age</label>
                  <input placeholder="3 years" value={petAge} onChange={(e) => setPetAge(e.target.value)} />
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Weight</label>
                  <input placeholder="12 kg" value={petWeight} onChange={(e) => setPetWeight(e.target.value)} />
                </div>
                <div className="field">
                  <label>Owner name</label>
                  <input placeholder="John Mensah" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
                </div>
              </div>
              <div className="field">
                <label>Owner phone</label>
                <input placeholder="+233 20 000 0000" value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} />
              </div>

              <button className="btn-next" onClick={saveFirstPatient} disabled={saving}>
                {saving ? "Saving…" : "Add patient →"}
              </button>
              <button className="btn-skip" onClick={() => { trackEvent("onboarding_completed", { skipped_patient: true }); setStep(4); }}>Skip for now</button>
            </>
          )}

          {/* Step 4 — Ready */}
          {step === 4 && (
            <>
              <div className="step-icon">🎉</div>
              <div className="step-title">You&apos;re all set!</div>
              <div className="step-sub">Your clinic is ready. Start analyzing cases right now.</div>

              <div className="ready-box">
                <h3>Your free trial is active</h3>
                <p>First 10 clinics get 3 months free · No credit card required · Cancel anytime</p>
              </div>

              <div className="quick-links">
                <a href="/app" className="quick-link">
                  <div className="quick-link-icon">🧠</div>
                  <div className="quick-link-label">Analyze a case</div>
                </a>
                <a href="/app" className="quick-link">
                  <div className="quick-link-icon">📁</div>
                  <div className="quick-link-label">View patients</div>
                </a>
                <a href="/demo" className="quick-link">
                  <div className="quick-link-icon">🎬</div>
                  <div className="quick-link-label">Watch demo</div>
                </a>
                <a href="mailto:hi@vetsai.app" className="quick-link">
                  <div className="quick-link-icon">💬</div>
                  <div className="quick-link-label">Get support</div>
                </a>
              </div>

              <button className="btn-next" onClick={() => router.push("/app")}>
                Go to my clinic →
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}