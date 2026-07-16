"use client";
import AppNav from "@/components/AppNav";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { trackEvent } from "@/lib/analytics";
import { classifyAnimal } from "@/lib/classify-animal";


type Patient = {
  id: string;
  name: string;
  animal: string;
  breed?: string;
  age?: string;
  weight?: string;
  owner_name?: string;
  owner_phone?: string;
  species_type?: string;
  created_at: string;
};

function animalEmoji(a?: string) {
  const m: Record<string, string> = { dog: "🐕", cat: "🐈", rabbit: "🐇", horse: "🐴", bird: "🐦", goat: "🐐", cow: "🐄" };
  return m[a?.toLowerCase() ?? ""] ?? "🐾";
}

function cap(s?: string) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function PatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [caseHistoryMap, setCaseHistoryMap] = useState<Record<string, any[]>>({});
  const [loadingCasesFor, setLoadingCasesFor] = useState<string | null>(null);

  const loadCaseHistory = async (patientId: string) => {
    if (caseHistoryMap[patientId]) return; // already loaded
    setLoadingCasesFor(patientId);
    const { data, error } = await supabase
      .from("cases")
      .select("id, symptoms, urgency, recommendation, possible_causes, vet_treatment_notes, gps_lat, gps_lng, location_source, created_at")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false });
    setLoadingCasesFor(null);
    if (!error && data) {
      setCaseHistoryMap((prev) => ({ ...prev, [patientId]: data }));
    }
  };

  // Form state
  const [speciesType, setSpeciesType] = useState("pets");
  const [name, setName] = useState("");
  const [animal, setAnimal] = useState("Dog");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const checkAuthAndLoad = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsDemo(user?.email === "demo@vetsai.vet");
    if (!user) { router.push("/login"); return; }
    loadPatients();
  };

  const loadPatients = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setPatients(data);
    setLoading(false);
  };

  const savePatient = async () => {
    if (!name.trim() || !animal.trim()) { setError("Pet name and animal type are required."); return; }
    setSaving(true);
    setError("");
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("patients").insert({
      user_id: user?.id,
      name: name.trim(),
      animal: animal.trim(),
      species_type: classifyAnimal(animal.trim()),
      breed: breed.trim(),
      age: age.trim(),
      weight: weight.trim(),
      owner_name: ownerName.trim(),
      owner_phone: ownerPhone.trim(),
    });
    if (error) { setError(error.message); setSaving(false); return; }
    trackEvent("patient_added", { species: animal.trim() });

    setSuccessMsg("Patient added successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
    setShowForm(false);
    resetForm();
    loadPatients();
    setSaving(false);
  };

  const deletePatient = async (id: string) => {
    if (!window.confirm("Delete this patient?")) return;
    await supabase.from("patients").delete().eq("id", id);
    setPatients((prev) => prev.filter((p) => p.id !== id));
  };

  const resetForm = () => {
    setName(""); setAnimal("Dog"); setBreed(""); setAge("");
    setWeight(""); setOwnerName(""); setOwnerPhone(""); setError("");
  };

  const filtered = patients.filter((p) => {
    if (filterType !== "all" && p.species_type !== filterType) return false;
    const q = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.animal.toLowerCase().includes(q) ||
      (p.owner_name ?? "").toLowerCase().includes(q) ||
      (p.breed ?? "").toLowerCase().includes(q)
    );
  });

  return (
        <>
      <AppNav />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, -apple-system, sans-serif; background: #f1f5f9; color: #1e293b; font-size: 14px; }

        /* Header */
        .app-header { background: #fff; border-bottom: 1px solid #e2e8f0; padding: 0 20px; display: flex; align-items: center; justify-content: space-between; height: 56px; position: sticky; top: 0; z-index: 50; }
        .app-logo { display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 700; color: #1a3d2b; text-decoration: none; }
        .app-logo-mark { width: 30px; height: 30px; background: #1a3d2b; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 15px; }
        .nav-links { display: flex; align-items: center; gap: 16px; }
        .nav-link { font-size: 13px; font-weight: 500; color: #64748b; text-decoration: none; padding: 5px 10px; border-radius: 6px; transition: all 0.15s; }
        .nav-link:hover { background: #f1f5f9; color: #1e293b; }
        .nav-link.active { background: #f0faf4; color: #1a3d2b; font-weight: 600; }
        .btn-logout { font-size: 12px; padding: 6px 12px; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 6px; cursor: pointer; color: #64748b; font-family: inherit; }

        /* Body */
        .page-body { max-width: 860px; margin: 0 auto; padding: 24px 16px 48px; }
        .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
        .page-title { font-size: 20px; font-weight: 700; color: #1a3d2b; }
        .btn-add { background: #1a3d2b; color: #fff; padding: 9px 18px; border-radius: 8px; border: none; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; display: flex; align-items: center; gap: 6px; }
        .btn-add:hover { background: #2d6b47; }

        /* Search */
        .search-wrap { position: relative; margin-bottom: 16px; }
        .search-wrap input { width: 100%; padding: 9px 12px 9px 36px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; background: #fff; outline: none; font-family: inherit; }
        .search-wrap input:focus { border-color: #1a3d2b; box-shadow: 0 0 0 3px rgba(26,61,43,0.1); }
        .search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 15px; pointer-events: none; }
        .search-meta { font-size: 12px; color: #94a3b8; margin-bottom: 12px; }

        /* Alerts */
        .alert { border-radius: 8px; padding: 10px 14px; margin-bottom: 14px; font-size: 13px; }
        .alert-error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; }
        .alert-success { background: #f0faf4; border: 1px solid #d4f0e0; color: #1a3d2b; }

        /* Form card */
        .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
        .card-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; margin-bottom: 16px; }
        .field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
        .field { display: flex; flex-direction: column; gap: 5px; }
        .field label { font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.4px; }
        .field input, .field select { padding: 9px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; color: #1e293b; background: #f8fafc; outline: none; font-family: inherit; transition: border-color 0.15s; }
        .field input:focus, .field select:focus { border-color: #1a3d2b; box-shadow: 0 0 0 3px rgba(26,61,43,0.1); background: #fff; }
        .btn-row { display: flex; gap: 8px; margin-top: 16px; }
        .btn-save { background: #1a3d2b; color: #fff; padding: 9px 18px; border-radius: 7px; border: none; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
        .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-cancel { background: #fff; color: #64748b; padding: 9px 18px; border-radius: 7px; border: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }

        /* Patient cards */
        .patient-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 8px; overflow: hidden; transition: box-shadow 0.15s; }
        .patient-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .patient-header { display: flex; align-items: center; gap: 12px; padding: 13px 16px; cursor: pointer; }
        .patient-avatar { width: 38px; height: 38px; border-radius: 9px; background: #f0faf4; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
        .patient-info { flex: 1; min-width: 0; }
        .patient-name { font-size: 14px; font-weight: 600; color: #1e293b; }
        .patient-meta { font-size: 12px; color: #94a3b8; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .patient-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .btn-analyze { background: #1a3d2b; color: #fff; font-size: 12px; font-weight: 600; padding: 5px 12px; border-radius: 6px; border: none; cursor: pointer; font-family: inherit; text-decoration: none; display: inline-flex; align-items: center; }
        .btn-delete { background: #fff; color: #dc2626; border: 1px solid #fecaca; font-size: 12px; padding: 5px 10px; border-radius: 6px; cursor: pointer; font-family: inherit; }
        .patient-body { padding: 0 16px 16px; border-top: 1px solid #f1f5f9; }
        .patient-detail-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin-top: 14px; background: #f8fafc; border-radius: 8px; padding: 12px; }
        .detail-field strong { display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; color: #94a3b8; margin-bottom: 2px; }
        .detail-field span { font-size: 13px; color: #334155; }
        .date-added { font-size: 12px; color: #94a3b8; margin-top: 10px; }

        /* Empty state */
        .empty { text-align: center; padding: 48px 20px; color: #94a3b8; }
        .empty-icon { font-size: 40px; margin-bottom: 12px; }
        .empty p { font-size: 14px; margin-bottom: 16px; }

        @media (max-width: 560px) {
          .field-grid { grid-template-columns: 1fr; }
          .nav-links .nav-link:not(.active) { display: none; }
        }
      `}</style>

      {/* Header */}
      <div className="app-header">
        <a href="/app" className="app-logo">
          <img src="/vetsai-icon.svg" alt="VetsAI" width={30} height={30} style={{ borderRadius: "7px" }} />
          VetsAI
        </a>
        <div className="nav-links">
          <a href="/app" className="nav-link">New case</a>
          <a href="/patients" className="nav-link active">Patients</a>
          <button
            className="btn-logout"
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/login";
            }}
          >
            Log out
          </button>
        </div>
      </div>

      <div className="page-body">

        {/* Alerts */}
        {error && <div className="alert alert-error">⚠ {error}</div>}
        {successMsg && <div className="alert alert-success">✓ {successMsg}</div>}

        {/* Page header */}
        <div className="page-header">
          <div className="page-title">📁 Patient records</div>
          <button className="btn-add" onClick={() => { setShowForm(!showForm); resetForm(); }}>
            {showForm ? "✕ Cancel" : "+ Add patient"}
          </button>
        </div>

        {/* Add patient form */}
        {showForm && (
          <div className="card">
            <div className="card-title">New patient</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {["pets", "poultry", "livestock"].map(f => (
                <button key={f} onClick={() => { setSpeciesType(f); setAnimal(f === "pets" ? "Dog" : f === "poultry" ? "Chicken" : "Cattle"); }} style={{ padding: "6px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: speciesType === f ? 700 : 400, background: speciesType === f ? "#1a3d2b" : "#e2e8f0", color: speciesType === f ? "#fff" : "#64748b", fontSize: 13 }}>
                  {f === "pets" ? "🐾 Pets" : f === "poultry" ? "🐔 Poultry" : "🐄 Livestock"}
                </button>
              ))}
            </div>
            <div className="field-grid">
              <div className="field">
                <label>{speciesType === "pets" ? "Pet name *" : speciesType === "poultry" ? "Farm name *" : "Animal ID / Tag *"}</label>
                <input placeholder={speciesType === "pets" ? "Buddy" : speciesType === "poultry" ? "Kofi Farms" : "TAG-001"} value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="field">
                <label>Animal *</label>
                <select value={animal} onChange={(e) => setAnimal(e.target.value)}>
                  {(speciesType === "pets"
                    ? ["Dog", "Cat", "Rabbit", "Bird", "Hamster", "Guinea Pig", "Other"]
                    : speciesType === "poultry"
                    ? ["Chicken", "Turkey", "Duck", "Guinea Fowl", "Ostrich", "Quail", "Other"]
                    : ["Cattle", "Goat", "Sheep", "Pig", "Horse", "Donkey", "Camel", "Other"]
                  ).map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>{speciesType === "pets" ? "Breed" : speciesType === "poultry" ? "Breed / Strain" : "Breed"}</label>
                <input placeholder={speciesType === "pets" ? "Labrador" : speciesType === "poultry" ? "Broiler / Layer / Noiler" : "Friesian / Sahiwal"} value={breed} onChange={(e) => setBreed(e.target.value)} />
              </div>
              <div className="field">
                <label>{speciesType === "poultry" ? "Flock size" : "Age"}</label>
                <input placeholder={speciesType === "pets" ? "3 years" : speciesType === "poultry" ? "500 birds" : "4 years"} value={age} onChange={(e) => setAge(e.target.value)} />
              </div>
              <div className="field">
                <label>{speciesType === "poultry" ? "Birds age (weeks)" : speciesType === "livestock" ? "Weight" : "Weight"}</label>
                <input placeholder={speciesType === "pets" ? "12 kg" : speciesType === "poultry" ? "e.g. 6 weeks" : "450 kg"} value={weight} onChange={(e) => setWeight(e.target.value)} />
              </div>
              <div className="field">
                <label>Owner name</label>
                <input placeholder="John Mensah" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
              </div>
              <div className="field">
                <label>Owner phone</label>
                <input placeholder="+233 20 000 0000" value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} />
              </div>
            </div>
            <div className="btn-row">
              <button className="btn-save" onClick={savePatient} disabled={saving}>
                {saving ? "Saving…" : "Save patient"}
              </button>
              <button className="btn-cancel" onClick={() => { setShowForm(false); resetForm(); }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Practice type filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {["all", "pets", "poultry", "livestock"].map(f => (
            <button key={f} onClick={() => setFilterType(f)} style={{ padding: "6px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: filterType === f ? 700 : 400, background: filterType === f ? "#1a3d2b" : "#e2e8f0", color: filterType === f ? "#fff" : "#64748b", fontSize: 13, textTransform: "capitalize" as const }}>
              {f === "all" ? "All" : f === "pets" ? "🐾 Pets" : f === "poultry" ? "🐔 Poultry" : "🐄 Livestock"}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            placeholder={filterType === "poultry" ? "Search by farm name, bird type, strain, or owner…" : filterType === "livestock" ? "Search by animal ID, breed, or owner…" : "Search by pet name, animal, breed, or owner…"}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="search-meta">
          {loading ? "Loading…" : `${filtered.length} of ${patients.length} patient${patients.length !== 1 ? "s" : ""}`}
        </div>

        {/* Patient list */}
        {!loading && filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📋</div>
            <p>{patients.length === 0 ? "No patients yet. Add your first patient above." : "No patients match your search."}</p>
            {patients.length === 0 && !isDemo && (
              <button className="btn-add" onClick={() => setShowForm(true)}>+ Add first patient</button>
            )}
          </div>
        ) : (
          filtered.map((patient) => {
            const isOpen = expandedId === patient.id;
            const meta = [patient.animal, patient.breed, patient.age, patient.weight].filter(Boolean).join(" · ");
            return (
              <div className="patient-card" key={patient.id}>
                <div className="patient-header" onClick={() => {
                  const next = isOpen ? null : patient.id;
                  setExpandedId(next);
                  if (next) loadCaseHistory(next);
                }}>
                  <div className="patient-avatar">{animalEmoji(patient.animal)}</div>
                  <div className="patient-info">
                    <div className="patient-name">{patient.name}</div>
                    <div className="patient-meta">{meta}{patient.owner_name ? ` · Owner: ${patient.owner_name}` : ""}</div>
                  </div>
                  <div className="patient-actions">
                    <a
                      className="btn-analyze"
                      href={`/app?patient=${patient.id}&name=${encodeURIComponent(patient.name)}&animal=${encodeURIComponent(patient.animal)}&breed=${encodeURIComponent(patient.breed ?? "")}&age=${encodeURIComponent(patient.age ?? "")}&weight=${encodeURIComponent(patient.weight ?? "")}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Analyze →
                    </a>
                    <button
                      className="btn-delete"
                      onClick={(e) => { e.stopPropagation(); deletePatient(patient.id); }}
                      style={{ display: isDemo ? "none" : undefined }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="patient-body">
                    <div className="patient-detail-grid">
                      {[
                        ["Name", patient.name],
                        ["Animal", cap(patient.animal)],
                        ["Breed", patient.breed || "—"],
                        ["Age", patient.age || "—"],
                        ["Weight", patient.weight || "—"],
                        ["Owner", patient.owner_name || "—"],
                        ["Phone", patient.owner_phone || "—"],
                      ].map(([label, val]) => (
                        <div className="detail-field" key={label}>
                          <strong>{label}</strong>
                          <span>{val}</span>
                        </div>
                      ))}
                    </div>
                    <div className="date-added">
                      Added: {new Date(patient.created_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                    </div>

                    <div style={{ marginTop: 16, borderTop: "1px solid #f1f5f9", paddingTop: 12 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1a3d2b", marginBottom: 8 }}>Case history</div>
                      {loadingCasesFor === patient.id && (
                        <div style={{ fontSize: 13, color: "#94a3b8" }}>Loading…</div>
                      )}
                      {loadingCasesFor !== patient.id && (caseHistoryMap[patient.id]?.length ?? 0) === 0 && (
                        <div style={{ fontSize: 13, color: "#94a3b8" }}>No AI case analyses linked to this patient yet.</div>
                      )}
                      {(caseHistoryMap[patient.id] ?? []).map((c) => (
                        <div key={c.id} style={{ padding: "10px 0", borderBottom: "1px solid #f8fafc" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#334155" }}>
                              {new Date(c.created_at).toLocaleDateString()}
                            </span>
                            {c.urgency && (
                              <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 5, background: "#f1f5f9", textTransform: "capitalize" }}>
                                {c.urgency}
                              </span>
                            )}
                          </div>
                          {c.symptoms && <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Symptoms: {c.symptoms}</div>}
                          {(c.possible_causes?.length ?? 0) > 0 && (
                            <div style={{ fontSize: 12, color: "#92400e", marginTop: 4 }}>
                              Possible causes: {c.possible_causes.join(", ")}
                            </div>
                          )}
                          {c.recommendation && <div style={{ fontSize: 12, color: "#334155", marginTop: 4 }}>AI recommendation: {c.recommendation}</div>}
                          {c.vet_treatment_notes && (
                            <div style={{ fontSize: 12, color: "#1a3d2b", marginTop: 4, background: "#f0faf4", padding: 8, borderRadius: 6 }}>
                              Vet treatment: {c.vet_treatment_notes}
                            </div>
                          )}
                          {c.gps_lat != null && c.gps_lng != null ? (
                            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
                              📍 <a href={`https://maps.google.com/?q=${c.gps_lat},${c.gps_lng}`} target="_blank" rel="noopener noreferrer" style={{ color: "#94a3b8" }}>
                                {c.gps_lat.toFixed(4)}, {c.gps_lng.toFixed(4)}
                              </a>
                              {c.location_source ? ` (${c.location_source === "device_gps" ? "GPS" : "manual"})` : ""}
                            </div>
                          ) : (
                            <div style={{ fontSize: 11, color: "#cbd5e1", marginTop: 4 }}>📍 No location captured</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );
}