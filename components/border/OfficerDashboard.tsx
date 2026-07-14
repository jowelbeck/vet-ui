"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Tab = "permits" | "documents" | "quarantine" | "compliance";

type Permit = {
  id: string;
  permit_number: string;
  direction: "import" | "export";
  other_country: string;
  species: string;
  breed: string | null;
  quantity: number;
  product_type: string;
  transporter_name: string | null;
  transporter_contact: string | null;
  vehicle_registration: string | null;
  owner_name: string | null;
  owner_contact: string | null;
  health_certificate_number: string | null;
  status: string;
  issued_at: string;
  notes: string | null;
};

type PermitDoc = {
  id: string;
  permit_id: string;
  document_name: string;
  status: string;
  reference_number: string | null;
};

type QuarantineRecord = {
  id: string;
  permit_id: string;
  species: string;
  quantity: number;
  start_date: string;
  expected_release_date: string | null;
  actual_release_date: string | null;
  status: string;
};

type QuarantineLog = {
  id: string;
  quarantine_id: string;
  log_date: string;
  animals_observed: number | null;
  mortality_count: number;
  symptoms_observed: string | null;
  temperature_c: number | null;
  general_notes: string | null;
};

type ComplianceReq = {
  id: string;
  direction: "import" | "export";
  country: string;
  species: string | null;
  required_documents: string[];
  notes: string | null;
};

const inputStyle: React.CSSProperties = {
  padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 13,
  color: "#1e293b", background: "#f8fafc", outline: "none", fontFamily: "inherit", width: "100%",
};
const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase",
  letterSpacing: 0.4, marginBottom: 4, display: "block",
};
const cardStyle: React.CSSProperties = {
  background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20, marginBottom: 16,
};
const btnPrimary: React.CSSProperties = {
  background: "#1a3d2b", color: "#fff", padding: "9px 16px", borderRadius: 7, border: "none",
  fontSize: 13, fontWeight: 600, cursor: "pointer",
};
const btnSecondary: React.CSSProperties = {
  background: "#f1f5f9", color: "#334155", padding: "6px 12px", borderRadius: 6, border: "none",
  fontSize: 12, fontWeight: 600, cursor: "pointer",
};

export default function OfficerDashboard({ borderPostId, userId, postCountry, neighboringCountry }: {
  borderPostId: string;
  userId: string;
  postCountry: string;
  neighboringCountry: string;
}) {
  const [tab, setTab] = useState<Tab>("permits");

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px" }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1px solid #e2e8f0" }}>
        {(["permits", "documents", "quarantine", "compliance"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "10px 16px", background: "none", border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 600, textTransform: "capitalize",
              color: tab === t ? "#1a3d2b" : "#94a3b8",
              borderBottom: tab === t ? "2px solid #1a3d2b" : "2px solid transparent",
              marginBottom: -1,
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "permits" && <PermitsTab borderPostId={borderPostId} userId={userId} />}
      {tab === "documents" && <DocumentsTab borderPostId={borderPostId} />}
      {tab === "quarantine" && <QuarantineTab borderPostId={borderPostId} userId={userId} />}
      {tab === "compliance" && (
        <ComplianceTab userId={userId} postCountry={postCountry} neighboringCountry={neighboringCountry} />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// PERMITS
// ─────────────────────────────────────────────────────────────────────────
function PermitsTab({ borderPostId, userId }: { borderPostId: string; userId: string }) {
  const [permits, setPermits] = useState<Permit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [permitNumber, setPermitNumber] = useState("");
  const [direction, setDirection] = useState<"import" | "export">("export");
  const [otherCountry, setOtherCountry] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [quantity, setQuantity] = useState("");
  const [transporterName, setTransporterName] = useState("");
  const [transporterContact, setTransporterContact] = useState("");
  const [vehicleReg, setVehicleReg] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerContact, setOwnerContact] = useState("");
  const [healthCert, setHealthCert] = useState("");

  const load = async () => {
    const { data } = await supabase
      .from("livestock_movement_permits")
      .select("*")
      .eq("border_post_id", borderPostId)
      .order("issued_at", { ascending: false })
      .limit(50);
    if (data) setPermits(data as Permit[]);
  };

  useEffect(() => { load(); }, [borderPostId]);

  const createPermit = async () => {
    if (!permitNumber.trim() || !otherCountry.trim() || !species.trim() || !quantity.trim()) {
      setError("Permit number, country, species, and quantity are required.");
      return;
    }
    setSaving(true);
    setError("");
    const { error } = await supabase.from("livestock_movement_permits").insert({
      permit_number: permitNumber.trim(),
      border_post_id: borderPostId,
      direction,
      other_country: otherCountry.trim(),
      species: species.trim(),
      breed: breed.trim() || null,
      quantity: parseInt(quantity, 10),
      transporter_name: transporterName.trim() || null,
      transporter_contact: transporterContact.trim() || null,
      vehicle_registration: vehicleReg.trim() || null,
      owner_name: ownerName.trim() || null,
      owner_contact: ownerContact.trim() || null,
      health_certificate_number: healthCert.trim() || null,
      issued_by: userId,
    });
    setSaving(false);
    if (error) { setError(error.message); return; }
    setShowForm(false);
    setPermitNumber(""); setOtherCountry(""); setSpecies(""); setBreed(""); setQuantity("");
    setTransporterName(""); setTransporterContact(""); setVehicleReg("");
    setOwnerName(""); setOwnerContact(""); setHealthCert("");
    load();
  };

  const updateStatus = async (permitId: string, status: string) => {
    const { error } = await supabase.from("livestock_movement_permits").update({ status }).eq("id", permitId);
    if (error) { alert(error.message); return; }
    load();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a3d2b" }}>Movement permits</h2>
        <button style={btnSecondary} onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Cancel" : "+ New permit"}
        </button>
      </div>

      {showForm && (
        <div style={cardStyle}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <div><label style={labelStyle}>Permit number</label><input style={inputStyle} value={permitNumber} onChange={(e) => setPermitNumber(e.target.value)} placeholder="e.g. LMP-2026-0001" /></div>
            <div>
              <label style={labelStyle}>Direction</label>
              <select style={inputStyle} value={direction} onChange={(e) => setDirection(e.target.value as "import" | "export")}>
                <option value="export">Export</option>
                <option value="import">Import</option>
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
            <div><label style={labelStyle}>{direction === "export" ? "Destination country" : "Origin country"}</label><input style={inputStyle} value={otherCountry} onChange={(e) => setOtherCountry(e.target.value)} placeholder="e.g. Burkina Faso" /></div>
            <div><label style={labelStyle}>Species</label><input style={inputStyle} value={species} onChange={(e) => setSpecies(e.target.value)} placeholder="e.g. Cattle" /></div>
            <div><label style={labelStyle}>Breed (optional)</label><input style={inputStyle} value={breed} onChange={(e) => setBreed(e.target.value)} /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <div><label style={labelStyle}>Quantity</label><input type="number" min={1} style={inputStyle} value={quantity} onChange={(e) => setQuantity(e.target.value)} /></div>
            <div><label style={labelStyle}>Health certificate number (optional)</label><input style={inputStyle} value={healthCert} onChange={(e) => setHealthCert(e.target.value)} /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <div><label style={labelStyle}>Transporter name (optional)</label><input style={inputStyle} value={transporterName} onChange={(e) => setTransporterName(e.target.value)} /></div>
            <div><label style={labelStyle}>Transporter contact (optional)</label><input style={inputStyle} value={transporterContact} onChange={(e) => setTransporterContact(e.target.value)} /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
            <div><label style={labelStyle}>Vehicle registration (optional)</label><input style={inputStyle} value={vehicleReg} onChange={(e) => setVehicleReg(e.target.value)} /></div>
            <div><label style={labelStyle}>Owner name (optional)</label><input style={inputStyle} value={ownerName} onChange={(e) => setOwnerName(e.target.value)} /></div>
            <div><label style={labelStyle}>Owner contact (optional)</label><input style={inputStyle} value={ownerContact} onChange={(e) => setOwnerContact(e.target.value)} /></div>
          </div>
          {error && <p style={{ fontSize: 12, color: "#dc2626", marginBottom: 10 }}>{error}</p>}
          <button style={btnPrimary} onClick={createPermit} disabled={saving}>{saving ? "Saving…" : "Create permit"}</button>
        </div>
      )}

      {permits.length === 0 && <p style={{ fontSize: 13, color: "#94a3b8" }}>No permits logged yet.</p>}
      {permits.map((p) => (
        <div key={p.id} style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{p.permit_number} — {p.species} × {p.quantity}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                {p.direction === "export" ? "Export to" : "Import from"} {p.other_country}
                {p.breed ? ` · ${p.breed}` : ""}
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Issued {new Date(p.issued_at).toLocaleDateString()}</div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 6, background: "#f1f5f9", color: "#334155", textTransform: "capitalize" }}>{p.status}</span>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
            {["approved", "rejected", "crossed", "quarantined"].filter(s => s !== p.status).map((s) => (
              <button key={s} style={btnSecondary} onClick={() => updateStatus(p.id, s)}>
                Mark {s}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// DOCUMENTS
// ─────────────────────────────────────────────────────────────────────────
function DocumentsTab({ borderPostId }: { borderPostId: string }) {
  const [permits, setPermits] = useState<Permit[]>([]);
  const [selectedPermit, setSelectedPermit] = useState<string>("");
  const [docs, setDocs] = useState<PermitDoc[]>([]);
  const [requiredList, setRequiredList] = useState<string[]>([]);
  const [newDocName, setNewDocName] = useState("");
  const [newDocRef, setNewDocRef] = useState("");

  useEffect(() => {
    supabase.from("livestock_movement_permits").select("*").eq("border_post_id", borderPostId)
      .order("issued_at", { ascending: false }).then(({ data }) => data && setPermits(data as Permit[]));
  }, [borderPostId]);

  const loadDocs = async (permitId: string) => {
    const permit = permits.find(p => p.id === permitId);
    const { data } = await supabase.from("permit_documents").select("*").eq("permit_id", permitId);
    if (data) setDocs(data as PermitDoc[]);

    if (permit) {
      const { data: reqs } = await supabase.from("border_compliance_requirements")
        .select("required_documents")
        .eq("direction", permit.direction)
        .eq("country", permit.other_country)
        .or(`species.is.null,species.eq.${permit.species}`);
      const merged = new Set<string>();
      (reqs ?? []).forEach((r: any) => (r.required_documents ?? []).forEach((d: string) => merged.add(d)));
      setRequiredList(Array.from(merged));
    }
  };

  useEffect(() => { if (selectedPermit) loadDocs(selectedPermit); }, [selectedPermit]);

  const addDoc = async (name: string) => {
    if (!selectedPermit || !name.trim()) return;
    const { error } = await supabase.from("permit_documents").insert({
      permit_id: selectedPermit, document_name: name.trim(), reference_number: newDocRef.trim() || null, status: "submitted",
    });
    if (error) { alert(error.message); return; }
    setNewDocName(""); setNewDocRef("");
    loadDocs(selectedPermit);
  };

  const setDocStatus = async (docId: string, status: string) => {
    const { error } = await supabase.from("permit_documents").update({ status }).eq("id", docId);
    if (error) { alert(error.message); return; }
    loadDocs(selectedPermit);
  };

  const loggedNames = new Set(docs.map(d => d.document_name));

  return (
    <div>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a3d2b", marginBottom: 12 }}>Permit documents</h2>
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Select a permit</label>
        <select style={inputStyle} value={selectedPermit} onChange={(e) => setSelectedPermit(e.target.value)}>
          <option value="">— choose —</option>
          {permits.map(p => <option key={p.id} value={p.id}>{p.permit_number} ({p.species}, {p.other_country})</option>)}
        </select>
      </div>

      {selectedPermit && (
        <>
          {requiredList.length > 0 && (
            <div style={cardStyle}>
              <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Required documents for this route</h3>
              {requiredList.map((name) => (
                <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ fontSize: 13 }}>{name}</span>
                  {loggedNames.has(name) ? (
                    <span style={{ fontSize: 11, color: "#2d6b47" }}>✓ logged</span>
                  ) : (
                    <button style={btnSecondary} onClick={() => addDoc(name)}>Log as submitted</button>
                  )}
                </div>
              ))}
              {requiredList.length === 0 && <p style={{ fontSize: 12, color: "#94a3b8" }}>No requirements set for this route yet — see the Compliance tab.</p>}
            </div>
          )}

          <div style={cardStyle}>
            <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Logged documents</h3>
            {docs.length === 0 && <p style={{ fontSize: 12, color: "#94a3b8" }}>None logged yet.</p>}
            {docs.map((d) => (
              <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{d.document_name}</div>
                  {d.reference_number && <div style={{ fontSize: 11, color: "#94a3b8" }}>Ref: {d.reference_number}</div>}
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: "#f1f5f9", textTransform: "capitalize" }}>{d.status}</span>
                  {d.status !== "verified" && <button style={btnSecondary} onClick={() => setDocStatus(d.id, "verified")}>Verify</button>}
                  {d.status !== "rejected" && <button style={btnSecondary} onClick={() => setDocStatus(d.id, "rejected")}>Reject</button>}
                </div>
              </div>
            ))}

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <input style={inputStyle} placeholder="Other document name" value={newDocName} onChange={(e) => setNewDocName(e.target.value)} />
              <input style={{ ...inputStyle, maxWidth: 160 }} placeholder="Reference #" value={newDocRef} onChange={(e) => setNewDocRef(e.target.value)} />
              <button style={btnPrimary} onClick={() => addDoc(newDocName)}>Add</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// QUARANTINE
// ─────────────────────────────────────────────────────────────────────────
function QuarantineTab({ borderPostId, userId }: { borderPostId: string; userId: string }) {
  const [records, setRecords] = useState<QuarantineRecord[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [logs, setLogs] = useState<QuarantineLog[]>([]);

  const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 10));
  const [animalsObserved, setAnimalsObserved] = useState("");
  const [mortality, setMortality] = useState("0");
  const [symptoms, setSymptoms] = useState("");
  const [temp, setTemp] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    const { data } = await supabase.from("quarantine_records").select("*").eq("border_post_id", borderPostId).order("start_date", { ascending: false });
    if (data) setRecords(data as QuarantineRecord[]);
  };

  useEffect(() => { load(); }, [borderPostId]);

  const loadLogs = async (qid: string) => {
    const { data } = await supabase.from("quarantine_daily_logs").select("*").eq("quarantine_id", qid).order("log_date", { ascending: false });
    if (data) setLogs(data as QuarantineLog[]);
  };

  useEffect(() => { if (selected) loadLogs(selected); }, [selected]);

  const addLog = async () => {
    if (!selected) return;
    setError("");
    const { error } = await supabase.from("quarantine_daily_logs").insert({
      quarantine_id: selected,
      log_date: logDate,
      animals_observed: animalsObserved ? parseInt(animalsObserved, 10) : null,
      mortality_count: parseInt(mortality || "0", 10),
      symptoms_observed: symptoms.trim() || null,
      temperature_c: temp ? parseFloat(temp) : null,
      general_notes: notes.trim() || null,
      logged_by: userId,
    });
    if (error) { setError(error.message.includes("duplicate") ? "Already logged for this date." : error.message); return; }
    setAnimalsObserved(""); setMortality("0"); setSymptoms(""); setTemp(""); setNotes("");
    loadLogs(selected);
  };

  const releaseRecord = async (status: "released" | "rejected" | "destroyed") => {
    if (!selected) return;
    const decisionNotes = window.prompt(`Notes for marking this batch as "${status}"? (optional)`) ?? "";
    const { error } = await supabase.from("quarantine_records").update({
      status, actual_release_date: new Date().toISOString().slice(0, 10),
      release_decision_by: userId, release_decision_notes: decisionNotes,
    }).eq("id", selected);
    if (error) { alert(error.message); return; }
    load();
  };

  const selectedRecord = records.find(r => r.id === selected);

  return (
    <div>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a3d2b", marginBottom: 12 }}>Quarantine</h2>
      <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>
        Records here are created automatically when a permit is marked "quarantined" on the Permits tab.
      </p>

      {records.length === 0 && <p style={{ fontSize: 13, color: "#94a3b8" }}>No quarantine records yet.</p>}

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Select a quarantine record</label>
        <select style={inputStyle} value={selected} onChange={(e) => setSelected(e.target.value)}>
          <option value="">— choose —</option>
          {records.map(r => (
            <option key={r.id} value={r.id}>
              {r.species} × {r.quantity} — started {new Date(r.start_date).toLocaleDateString()} ({r.status})
            </option>
          ))}
        </select>
      </div>

      {selectedRecord && (
        <>
          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{selectedRecord.species} × {selectedRecord.quantity}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  Started {new Date(selectedRecord.start_date).toLocaleDateString()}
                  {selectedRecord.expected_release_date ? ` · Expected release ${new Date(selectedRecord.expected_release_date).toLocaleDateString()}` : ""}
                </div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 6, background: "#f1f5f9", textTransform: "capitalize" }}>{selectedRecord.status}</span>
            </div>
            {selectedRecord.status === "in_quarantine" && (
              <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                <button style={btnPrimary} onClick={() => releaseRecord("released")}>Release</button>
                <button style={btnSecondary} onClick={() => releaseRecord("rejected")}>Reject entry</button>
                <button style={btnSecondary} onClick={() => releaseRecord("destroyed")}>Log destroyed</button>
              </div>
            )}
          </div>

          {selectedRecord.status === "in_quarantine" && (
            <div style={cardStyle}>
              <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Log today's observation</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div><label style={labelStyle}>Date</label><input type="date" style={inputStyle} value={logDate} onChange={(e) => setLogDate(e.target.value)} /></div>
                <div><label style={labelStyle}>Animals observed</label><input type="number" style={inputStyle} value={animalsObserved} onChange={(e) => setAnimalsObserved(e.target.value)} /></div>
                <div><label style={labelStyle}>Deaths today</label><input type="number" min={0} style={inputStyle} value={mortality} onChange={(e) => setMortality(e.target.value)} /></div>
                <div><label style={labelStyle}>Temp (°C)</label><input type="number" step="0.1" style={inputStyle} value={temp} onChange={(e) => setTemp(e.target.value)} /></div>
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={labelStyle}>Symptoms observed</label>
                <input style={inputStyle} value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="e.g. none / lethargy / coughing" />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={labelStyle}>General notes</label>
                <input style={inputStyle} value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
              {error && <p style={{ fontSize: 12, color: "#dc2626", marginBottom: 10 }}>{error}</p>}
              <button style={btnPrimary} onClick={addLog}>Save log</button>
            </div>
          )}

          <div style={cardStyle}>
            <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Observation history</h3>
            {logs.length === 0 && <p style={{ fontSize: 12, color: "#94a3b8" }}>No logs yet.</p>}
            {logs.map((l) => (
              <div key={l.id} style={{ padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{new Date(l.log_date).toLocaleDateString()}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  {l.animals_observed != null ? `${l.animals_observed} observed · ` : ""}
                  {l.mortality_count} deaths
                  {l.temperature_c != null ? ` · ${l.temperature_c}°C` : ""}
                </div>
                {l.symptoms_observed && <div style={{ fontSize: 12, color: "#64748b" }}>Symptoms: {l.symptoms_observed}</div>}
                {l.general_notes && <div style={{ fontSize: 12, color: "#94a3b8" }}>{l.general_notes}</div>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// COMPLIANCE
// ─────────────────────────────────────────────────────────────────────────
function ComplianceTab({ userId, postCountry, neighboringCountry }: { userId: string; postCountry: string; neighboringCountry: string }) {
  const [reqs, setReqs] = useState<ComplianceReq[]>([]);
  const [direction, setDirection] = useState<"import" | "export">("export");
  const [country, setCountry] = useState(neighboringCountry);
  const [species, setSpecies] = useState("");
  const [docsText, setDocsText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    const { data } = await supabase.from("border_compliance_requirements").select("*")
      .in("country", [postCountry, neighboringCountry])
      .order("country");
    if (data) setReqs(data as ComplianceReq[]);
  };

  useEffect(() => { load(); }, [postCountry, neighboringCountry]);

  const save = async () => {
    if (!country.trim() || !docsText.trim()) {
      setError("Country and at least one document are required.");
      return;
    }
    setSaving(true);
    setError("");
    const docList = docsText.split(",").map(d => d.trim()).filter(Boolean);
    const { error } = await supabase.from("border_compliance_requirements").upsert({
      direction, country: country.trim(), species: species.trim() || null,
      required_documents: docList, last_updated_by: userId, updated_at: new Date().toISOString(),
    }, { onConflict: "direction,country,species,product_type" });
    setSaving(false);
    if (error) { setError(error.message); return; }
    setDocsText(""); setSpecies("");
    load();
  };

  return (
    <div>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a3d2b", marginBottom: 4 }}>Compliance requirements</h2>
      <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>
        Document checklists for routes involving {postCountry} and {neighboringCountry}. Keep this current — it's what
        populates the checklist on the Documents tab.
      </p>

      <div style={cardStyle}>
        <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Add or update a requirement</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
          <div>
            <label style={labelStyle}>Direction</label>
            <select style={inputStyle} value={direction} onChange={(e) => setDirection(e.target.value as "import" | "export")}>
              <option value="export">Export</option>
              <option value="import">Import</option>
            </select>
          </div>
          <div><label style={labelStyle}>Country</label><input style={inputStyle} value={country} onChange={(e) => setCountry(e.target.value)} /></div>
          <div><label style={labelStyle}>Species (blank = all)</label><input style={inputStyle} value={species} onChange={(e) => setSpecies(e.target.value)} placeholder="e.g. Cattle" /></div>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label style={labelStyle}>Required documents (comma-separated)</label>
          <input style={inputStyle} value={docsText} onChange={(e) => setDocsText(e.target.value)} placeholder="Veterinary health certificate, Certificate of origin, Movement permit" />
        </div>
        {error && <p style={{ fontSize: 12, color: "#dc2626", marginBottom: 10 }}>{error}</p>}
        <button style={btnPrimary} onClick={save} disabled={saving}>{saving ? "Saving…" : "Save requirement"}</button>
      </div>

      <div style={cardStyle}>
        <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Current requirements</h3>
        {reqs.length === 0 && <p style={{ fontSize: 12, color: "#94a3b8" }}>None set yet.</p>}
        {reqs.map((r) => (
          <div key={r.id} style={{ padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: 13, fontWeight: 600, textTransform: "capitalize" }}>
              {r.direction} — {r.country}{r.species ? ` (${r.species})` : " (all species)"}
            </div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{r.required_documents.join(", ")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
