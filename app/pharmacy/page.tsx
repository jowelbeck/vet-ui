"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Drug = {
  id: string;
  drug_name: string;
  generic_name: string;
  category: string;
  category_type: string;
  quantity: number;
  unit: string;
  reorder_level: number;
  expiry_date: string;
  supplier: string;
  unit_price: number;
};

type Dispensing = {
  id: string;
  patient_name: string;
  species: string;
  drug_name: string;
  quantity: number;
  doctor: string;
  notes: string;
  dispensed_at: string;
};

const CATEGORIES: Record<string, string[]> = {
  pets: ['Anaesthetics', 'Anti-inflammatories', 'Antibiotics', 'Antifungals', 'Antiparasitics', 'Hormones', 'Leashes', 'Pet Bowls', 'Pet Food', 'Toys', 'Vaccines', 'Vitamins & Supplements', 'Other'],
  poultry: ['Antibiotics', 'Anticoccidials', 'Delousing', 'Dewormers', 'Disinfectants', 'Feed Additives', 'Feeders & Drinkers', 'Solubles', 'Vaccination Equipment', 'Vaccines', 'Vitamins & Electrolytes', 'Other'],
  livestock: ['Anti-inflammatories', 'Antibiotics', 'Antiparasitics', 'Dewormers', 'Ectoparasiticides', 'Hormones', 'IV Fluids', 'Vaccines', 'Vitamins & Supplements', 'Other'],
};

const COMMON_VET_DRUGS: Record<string, {name: string, category: string}[]> = {
  pets: [
    { name: "Amoxicillin 500mg", category: "Antibiotics" },
    { name: "Ivermectin 1%", category: "Antiparasitics" },
    { name: "Meloxicam 5mg/ml", category: "Anti-inflammatories" },
    { name: "Ketamine 500mg/10ml", category: "Anaesthetics" },
    { name: "Dexamethasone 2mg/ml", category: "Anti-inflammatories" },
    { name: "Vitamin B Complex", category: "Vitamins & Supplements" },
    { name: "Praziquantel 50mg", category: "Antiparasitics" },
    { name: "Penicillin G", category: "Antibiotics" },
  ],
  poultry: [
    { name: "Newcastle Disease Vaccine", category: "Vaccines" },
    { name: "Gumboro (IBD) Vaccine", category: "Vaccines" },
    { name: "Marek's Disease Vaccine", category: "Vaccines" },
    { name: "Infectious Bronchitis Vaccine", category: "Vaccines" },
    { name: "Fowlpox Vaccine", category: "Vaccines" },
    { name: "Tylosin Soluble Powder", category: "Solubles" },
    { name: "Enrofloxacin 10% Solution", category: "Solubles" },
    { name: "Vitamin C + Electrolytes", category: "Vitamins & Electrolytes" },
    { name: "Amprolium 20%", category: "Anticoccidials" },
    { name: "Toltrazuril 2.5%", category: "Anticoccidials" },
    { name: "Piperazine Citrate", category: "Dewormers" },
    { name: "Virkon S Disinfectant", category: "Disinfectants" },
  ],
  livestock: [
    { name: "Oxytetracycline 20%", category: "Antibiotics" },
    { name: "Penicillin-Streptomycin", category: "Antibiotics" },
    { name: "Albendazole 10%", category: "Dewormers" },
    { name: "Ivermectin 1% Injectable", category: "Antiparasitics" },
    { name: "Oxytocin 10IU", category: "Hormones" },
    { name: "Dexamethasone 2mg/ml", category: "Anti-inflammatories" },
    { name: "Normal Saline 1L", category: "IV Fluids" },
    { name: "Lugol's Iodine", category: "Vitamins & Supplements" },
    { name: "Multivitamin Injectable", category: "Vitamins & Supplements" },
    { name: "Tick & Lice Grease", category: "Ectoparasiticides" },
  ],
};

export default function VetPharmacyPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"stock"|"history">("stock");
  const [stock, setStock] = useState<Drug[]>([]);
  const [history, setHistory] = useState<Dispensing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDrug, setShowAddDrug] = useState(false);
  const [showDispense, setShowDispense] = useState(false);
  const [saving, setSaving] = useState(false);

  const [categoryType, setCategoryType] = useState("pets");
  const [filterType, setFilterType] = useState("all");
  const [drugName, setDrugName] = useState("");
  const [genericName, setGenericName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [reorderLevel, setReorderLevel] = useState("10");
  const [expiryDate, setExpiryDate] = useState("");
  const [supplier, setSupplier] = useState("");
  const [unitPrice, setUnitPrice] = useState("");

  const [dispPatient, setDispPatient] = useState("");
  const [dispSpecies, setDispSpecies] = useState("");
  const [dispDrug, setDispDrug] = useState("");
  const [dispQty, setDispQty] = useState("");
  const [dispDoctor, setDispDoctor] = useState("");
  const [dispNotes, setDispNotes] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      const { getCurrentUserRole, hasAccess } = await import("@/lib/roleCheck");
      const role = await getCurrentUserRole();
      if (!hasAccess("pharmacy", role)) {
        router.push("/patients");
        return;
      }
      loadData();
    });
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [{ data: s }, { data: h }] = await Promise.all([
      supabase.from("vet_pharmacy_stock").select("*").order("drug_name"),
      supabase.from("vet_pharmacy_dispensing").select("*").order("dispensed_at", { ascending: false }),
    ]);
    if (s) setStock(s);
    if (h) setHistory(h);
    setLoading(false);
  };

  const addDrug = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("vet_pharmacy_stock").insert({
      user_id: user!.id,
      drug_name: drugName, generic_name: genericName, category,
      quantity: parseInt(quantity), unit, reorder_level: parseInt(reorderLevel),
      expiry_date: expiryDate, supplier, unit_price: parseFloat(unitPrice), category_type: categoryType,
    });
    setDrugName(""); setGenericName(""); setCategory(""); setQuantity(""); setUnit(""); setReorderLevel("10"); setExpiryDate(""); setSupplier(""); setUnitPrice("");
    setShowAddDrug(false);
    setSaving(false);
    loadData();
  };

  const dispenseDrug = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    const drug = stock.find(d => d.drug_name === dispDrug);
    if (drug) {
      await supabase.from("vet_pharmacy_stock").update({ quantity: drug.quantity - parseInt(dispQty) }).eq("id", drug.id);
    }
    const dispensedDrug = stock.find(d => d.drug_name === dispDrug);
    await supabase.from("vet_pharmacy_dispensing").insert({
      user_id: user!.id,
      patient_name: dispPatient, species: dispSpecies, drug_name: dispDrug,
      quantity: parseInt(dispQty), doctor: dispDoctor, notes: dispNotes,
      category_type: dispensedDrug?.category_type || "pets",
    });
    setDispPatient(""); setDispSpecies(""); setDispDrug(""); setDispQty(""); setDispDoctor(""); setDispNotes("");
    setShowDispense(false);
    setSaving(false);
    loadData();
  };

  const lowStock = stock.filter(d => d.quantity <= d.reorder_level);
  const expiringSoon = stock.filter(d => {
    if (!d.expiry_date) return false;
    const days = Math.ceil((new Date(d.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days <= 30 && days > 0;
  });

  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Arial, sans-serif" }}>
      <header style={{ background: "#1a3d2b", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/app" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: 13 }}>← Back to VetsAI</a>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>|</span>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>💊 Veterinary Pharmacy</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setShowDispense(true)} style={{ background: "#97bc62", color: "#1a3d2b", border: "none", padding: "8px 16px", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>+ Dispense</button>
          <button onClick={() => setShowAddDrug(true)} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", padding: "8px 16px", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 13 }}>+ Add Drug</button>
        </div>
      </header>

      <div style={{ padding: "24px 32px", maxWidth: 1100, margin: "0 auto" }}>
        {lowStock.length > 0 && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", marginBottom: 16, color: "#dc2626", fontSize: 14 }}>
            ⚠️ <strong>{lowStock.length} drug{lowStock.length > 1 ? "s" : ""} low on stock:</strong> {lowStock.map(d => d.drug_name).join(", ")}
          </div>
        )}
        {expiringSoon.length > 0 && (
          <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "12px 16px", marginBottom: 16, color: "#d97706", fontSize: 14 }}>
            ⏰ <strong>{expiringSoon.length} drug{expiringSoon.length > 1 ? "s" : ""} expiring within 30 days:</strong> {expiringSoon.map(d => d.drug_name).join(", ")}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Total drugs", value: stock.length, color: "#1a3d2b", bg: "#f0faf4" },
            { label: "Low stock alerts", value: lowStock.length, color: "#dc2626", bg: "#fef2f2" },
            { label: "Dispensed today", value: history.filter(h => new Date(h.dispensed_at).toDateString() === new Date().toDateString()).length, color: "#2d6b47", bg: "#f0faf4" },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: "20px 24px" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Practice type filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {["all", "pets", "poultry", "livestock"].map(f => (
            <button key={f} onClick={() => setFilterType(f)} style={{ padding: "6px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: filterType === f ? 700 : 400, background: filterType === f ? "#1a3d2b" : "#e2e8f0", color: filterType === f ? "#fff" : "#64748b", fontSize: 13, textTransform: "capitalize" as const }}>
              {f === "all" ? "All" : f === "pets" ? "🐾 Pets" : f === "poultry" ? "🐔 Poultry" : "🐄 Livestock"}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {(["stock", "history"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "6px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: tab === t ? 700 : 400, background: tab === t ? "#1a3d2b" : "#e2e8f0", color: tab === t ? "#fff" : "#64748b", fontSize: 13, textTransform: "capitalize" as const }}>
              {t === "stock" ? "Stock" : "Dispensing History"}
            </button>
          ))}
        </div>

        {tab === "stock" && (
          loading ? <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>Loading...</div> :
          (() => { const filteredStock = filterType === "all" ? stock : stock.filter(d => d.category_type === filterType); return filteredStock; })().length === 0 && filterType !== "all" ? (
            <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{filterType === "pets" ? "🐾" : filterType === "poultry" ? "🐔" : "🐄"}</div>
              <div>No {filterType} drugs in stock yet</div>
              <button onClick={() => setShowAddDrug(true)} style={{ marginTop: 16, background: "#1a3d2b", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Add {filterType} drug</button>
            </div>
          ) :
          stock.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>💊</div>
              <div>No drugs in stock yet</div>
              <button onClick={() => setShowAddDrug(true)} style={{ marginTop: 16, background: "#1a3d2b", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Add first drug</button>
            </div>
          ) : (
            <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #e2e8f0" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" as const }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {["Drug Name", "Category", "Qty", "Unit", "Expiry", "Price", "Status"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left" as const, fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase" as const }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(filterType === "all" ? stock : stock.filter(d => d.category_type === filterType)).map((d, i) => {
                    const isLow = d.quantity <= d.reorder_level;
                    return (
                      <tr key={d.id} style={{ borderTop: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ fontWeight: 600, color: "#1a3d2b", fontSize: 14 }}>{d.drug_name}</div>
                          <div style={{ fontSize: 12, color: "#94a3b8" }}>{d.generic_name}</div>
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748b" }}>{d.category}</td>
                        <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 700, color: isLow ? "#dc2626" : "#1a3d2b" }}>{d.quantity}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748b" }}>{d.unit}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748b" }}>{d.expiry_date ? new Date(d.expiry_date).toLocaleDateString() : "—"}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748b" }}>GHS {d.unit_price}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ background: isLow ? "#fef2f2" : "#f0faf4", color: isLow ? "#dc2626" : "#16a34a", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                            {isLow ? "LOW" : "OK"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        )}

        {tab === "history" && (
          history.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
              <div>No dispensing history yet</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {history.map(h => (
                <div key={h.id} style={{ background: "#fff", borderRadius: 10, padding: 16, border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 600, color: "#1a3d2b" }}>{h.patient_name} <span style={{ color: "#64748b", fontWeight: 400 }}>({h.species})</span></div>
                    <div style={{ fontSize: 13, color: "#64748b" }}>{h.drug_name} · {h.quantity} units · Dr. {h.doctor}</div>
                    {h.notes && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{h.notes}</div>}
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{new Date(h.dispensed_at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {showAddDrug && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" as const }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
              <button onClick={() => setShowAddDrug(false)} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", color: "#64748b", fontSize: 16, marginRight: 12 }}>✕</button>
              <h2 style={{ color: "#1a3d2b", margin: 0, fontSize: 18 }}>Add Veterinary Drug</h2>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Quick select common drugs</label>
              <select onChange={e => { const activeType = filterType !== "all" ? filterType : categoryType; const list = COMMON_VET_DRUGS[activeType] || COMMON_VET_DRUGS.pets; const d = list.find(x => x.name === e.target.value); if (d) { setDrugName(d.name); setCategory(d.category); } }} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 14, boxSizing: "border-box" as const }}>
                <option value="">Select common drug...</option>
                {(COMMON_VET_DRUGS[filterType !== "all" ? filterType : categoryType] || COMMON_VET_DRUGS.pets).map(d => <option key={d.name}>{d.name}</option>)}
              </select>
            </div>
            {[
              { label: "Drug name *", value: drugName, set: setDrugName, placeholder: "Amoxicillin 500mg" },
              { label: "Generic name", value: genericName, set: setGenericName, placeholder: "Amoxicillin" },
              { label: "Quantity *", value: quantity, set: setQuantity, placeholder: "100", type: "number" },
              { label: "Unit", value: unit, set: setUnit, placeholder: "tablets / vials / bottles" },
              { label: "Reorder level", value: reorderLevel, set: setReorderLevel, placeholder: "10", type: "number" },
              { label: "Expiry date", value: expiryDate, set: setExpiryDate, placeholder: "", type: "date" },
              { label: "Supplier", value: supplier, set: setSupplier, placeholder: "Supplier name" },
              { label: "Unit price (GHS)", value: unitPrice, set: setUnitPrice, placeholder: "15.00", type: "number" },
            ].map(f => (
              <div key={f.label} style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>{f.label}</label>
                <input type={f.type || "text"} value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 14, boxSizing: "border-box" as const }} />
              </div>
            ))}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Drug category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 14, boxSizing: "border-box" as const }}>
                <option value="">Select...</option>
                {(CATEGORIES[filterType !== "all" ? filterType : categoryType] || CATEGORIES.pets).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowAddDrug(false)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", color: "#64748b" }}>Cancel</button>
              <button onClick={addDrug} disabled={!drugName || !quantity || saving} style={{ flex: 2, padding: "10px", borderRadius: 8, border: "none", background: "#1a3d2b", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
                {saving ? "Adding..." : "Add to Stock →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDispense && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: "100%", maxWidth: 440 }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
              <button onClick={() => setShowDispense(false)} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", color: "#64748b", fontSize: 16, marginRight: 12 }}>✕</button>
              <h2 style={{ color: "#1a3d2b", margin: 0, fontSize: 18 }}>Dispense Drug</h2>
            </div>
            {[
              { label: "Patient/Animal name *", value: dispPatient, set: setDispPatient, placeholder: "Buddy" },
              { label: "Species", value: dispSpecies, set: setDispSpecies, placeholder: "Dog / Cat / Horse..." },
              { label: "Quantity *", value: dispQty, set: setDispQty, placeholder: "10", type: "number" },
              { label: "Veterinarian", value: dispDoctor, set: setDispDoctor, placeholder: "Dr. Ama Owusu" },
              { label: "Instructions", value: dispNotes, set: setDispNotes, placeholder: "Once daily with food for 7 days" },
            ].map(f => (
              <div key={f.label} style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>{f.label}</label>
                <input type={f.type || "text"} value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 14, boxSizing: "border-box" as const }} />
              </div>
            ))}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Drug *</label>
              <select value={dispDrug} onChange={e => setDispDrug(e.target.value)} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 14, boxSizing: "border-box" as const }}>
                <option value="">Select drug...</option>
                {stock.filter(d => d.quantity > 0 && (filterType === "all" || d.category_type === filterType)).map(d => (
                  <option key={d.id} value={d.drug_name}>{d.drug_name} ({d.quantity} {d.unit} available) [{d.category_type}]</option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowDispense(false)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", color: "#64748b" }}>Cancel</button>
              <button onClick={dispenseDrug} disabled={!dispPatient || !dispDrug || !dispQty || saving} style={{ flex: 2, padding: "10px", borderRadius: 8, border: "none", background: "#1a3d2b", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
                {saving ? "Dispensing..." : "Dispense →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
