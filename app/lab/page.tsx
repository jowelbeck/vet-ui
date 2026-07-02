"use client";
import AppNav from "@/components/AppNav";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type LabResult = {
  id: string;
  patient_name: string;
  species: string;
  test_type: string;
  result_value: string;
  reference_range: string;
  status: string;
  notes: string;
  ordered_by: string;
  ordered_at: string;
  result_date: string;
};

const TEST_TYPES = ["Complete Blood Count (CBC)", "Biochemistry Panel", "Fecal Exam", "Urinalysis", "Heartworm Test", "FeLV/FIV Test", "Parvo Test", "Skin Scrape", "Ear Cytology", "X-Ray", "Ultrasound", "Other"];

function statusColor(s: string) {
  if (s === "completed") return { bg: "#f0faf4", color: "#16a34a" };
  if (s === "abnormal") return { bg: "#fef2f2", color: "#dc2626" };
  return { bg: "#fffbeb", color: "#d97706" };
}

export default function LabPage() {
  const router = useRouter();
  const [results, setResults] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("all");

  const [patientName, setPatientName] = useState("");
  const [species, setSpecies] = useState("");
  const [testType, setTestType] = useState("");
  const [resultValue, setResultValue] = useState("");
  const [referenceRange, setReferenceRange] = useState("");
  const [orderedBy, setOrderedBy] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      const { getCurrentUserRole, hasAccess } = await import("@/lib/roleCheck");
      const role = await getCurrentUserRole();
      if (!hasAccess("lab", role)) {
        router.push("/patients");
        return;
      }
      loadResults();
    });
  }, []);

  const loadResults = async () => {
    setLoading(true);
    const { data } = await supabase.from("lab_results").select("*").order("ordered_at", { ascending: false });
    if (data) setResults(data);
    setLoading(false);
  };

  const addResult = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("lab_results").insert({
      user_id: user!.id,
      patient_name: patientName, species, test_type: testType,
      result_value: resultValue, reference_range: referenceRange,
      ordered_by: orderedBy, notes, status,
      result_date: status !== "pending" ? new Date().toISOString() : null,
    });
    setPatientName(""); setSpecies(""); setTestType(""); setResultValue(""); setReferenceRange(""); setOrderedBy(""); setNotes(""); setStatus("pending");
    setShowForm(false);
    setSaving(false);
    loadResults();
  };

  const updateStatus = async (id: string, newStatus: string) => {
    await supabase.from("lab_results").update({ status: newStatus, result_date: new Date().toISOString() }).eq("id", id);
    loadResults();
  };

  const filtered = filter === "all" ? results : results.filter(r => r.status === filter);
  const pending = results.filter(r => r.status === "pending").length;
  const abnormal = results.filter(r => r.status === "abnormal").length;

  return (
    <><AppNav /><main style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Arial, sans-serif" }}>
      <header style={{ background: "#1a3d2b", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/app" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: 13 }}>← Back to VetsAI</a>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>|</span>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>🔬 Lab Results</span>
        </div>
        <button onClick={() => setShowForm(true)} style={{ background: "#97bc62", color: "#1a3d2b", border: "none", padding: "8px 20px", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
          + Order Test
        </button>
      </header>

      <div style={{ padding: "24px 32px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Total tests", value: results.length, color: "#1a3d2b", bg: "#f0faf4" },
            { label: "Pending", value: pending, color: "#d97706", bg: "#fffbeb" },
            { label: "Abnormal results", value: abnormal, color: "#dc2626", bg: "#fef2f2" },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: "20px 24px" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["all", "pending", "completed", "abnormal"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: filter === f ? 700 : 400, background: filter === f ? "#1a3d2b" : "#e2e8f0", color: filter === f ? "#fff" : "#64748b", fontSize: 13, textTransform: "capitalize" as const }}>
              {f}
            </button>
          ))}
        </div>

        {loading ? <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>Loading...</div> : (
          filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔬</div>
              <div>No lab tests ordered yet</div>
              <button onClick={() => setShowForm(true)} style={{ marginTop: 16, background: "#1a3d2b", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Order first test</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filtered.map(r => {
                const sc = statusColor(r.status);
                return (
                  <div key={r.id} style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap" as const, gap: 12 }}>
                      <div style={{ flex: 1, minWidth: 220 }}>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#1a3d2b" }}>{r.patient_name} <span style={{ color: "#64748b", fontWeight: 400 }}>({r.species})</span></div>
                        <div style={{ fontSize: 13, color: "#334155", marginTop: 4 }}>🔬 {r.test_type}</div>
                        {r.result_value && <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Result: <strong>{r.result_value}</strong> {r.reference_range && `(Ref: ${r.reference_range})`}</div>}
                        {r.notes && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{r.notes}</div>}
                        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>Ordered by {r.ordered_by || "—"} · {new Date(r.ordered_at).toLocaleDateString()}</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                        <span style={{ background: sc.bg, color: sc.color, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: "uppercase" as const }}>
                          {r.status}
                        </span>
                        {r.status === "pending" && (
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => updateStatus(r.id, "completed")} style={{ background: "#16a34a", color: "#fff", border: "none", padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>✓ Normal</button>
                            <button onClick={() => updateStatus(r.id, "abnormal")} style={{ background: "#dc2626", color: "#fff", border: "none", padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>⚠ Abnormal</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>

      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" as const }}>
            <h2 style={{ color: "#1a3d2b", marginBottom: 20, fontSize: 18 }}>Order Lab Test</h2>
            {[
              { label: "Patient/Animal name *", value: patientName, set: setPatientName, placeholder: "Buddy" },
              { label: "Species", value: species, set: setSpecies, placeholder: "Dog / Cat / Horse..." },
              { label: "Ordered by", value: orderedBy, set: setOrderedBy, placeholder: "Dr. Ama Owusu" },
            ].map(f => (
              <div key={f.label} style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>{f.label}</label>
                <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 14, boxSizing: "border-box" as const }} />
              </div>
            ))}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Test type *</label>
              <select value={testType} onChange={e => setTestType(e.target.value)} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 14, boxSizing: "border-box" as const }}>
                <option value="">Select test...</option>
                {TEST_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Result value (if known)</label>
              <input value={resultValue} onChange={e => setResultValue(e.target.value)} placeholder="e.g. WBC 12.5 x10⁹/L" style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 14, boxSizing: "border-box" as const }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Reference range</label>
              <input value={referenceRange} onChange={e => setReferenceRange(e.target.value)} placeholder="e.g. 6.0-17.0 x10⁹/L" style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 14, boxSizing: "border-box" as const }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Notes</label>
              <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Additional notes..." style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 14, boxSizing: "border-box" as const }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 14, boxSizing: "border-box" as const }}>
                <option value="pending">Pending</option>
                <option value="completed">Completed — Normal</option>
                <option value="abnormal">Completed — Abnormal</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", color: "#64748b" }}>Cancel</button>
              <button onClick={addResult} disabled={!patientName || !testType || saving} style={{ flex: 2, padding: "10px", borderRadius: 8, border: "none", background: "#1a3d2b", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
                {saving ? "Saving..." : "Order Test →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
