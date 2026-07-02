"use client";
import AppNav from "@/components/AppNav";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Service = {
  name: string;
  quantity: number;
  price: number;
};

type Invoice = {
  id: string;
  patient_name: string;
  owner_name: string;
  owner_phone: string;
  services: Service[];
  total: number;
  currency: string;
  status: string;
  notes: string;
  created_at: string;
};

const COMMON_SERVICES = [
  { name: "Consultation", price: 50 },
  { name: "Vaccination", price: 30 },
  { name: "Blood test", price: 45 },
  { name: "X-ray", price: 80 },
  { name: "Surgery", price: 200 },
  { name: "Medication", price: 25 },
  { name: "Deworming", price: 20 },
  { name: "Grooming", price: 35 },
];

export default function BillingPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");

  // Form state
  const [patientName, setPatientName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [notes, setNotes] = useState("");
  const [services, setServices] = useState<Service[]>([
    { name: "", quantity: 1, price: 0 }
  ]);

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const checkAuthAndLoad = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { getCurrentUserRole, hasAccess } = await import("@/lib/roleCheck");
    const role = await getCurrentUserRole();
    if (!hasAccess("billing", role)) {
      router.push("/app");
      return;
    }
    loadInvoices();
  };

  const loadInvoices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setInvoices(data);
    setLoading(false);
  };

  const addService = () => {
    setServices([...services, { name: "", quantity: 1, price: 0 }]);
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const updateService = (index: number, field: keyof Service, value: string | number) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  const applyTemplate = (index: number, template: { name: string; price: number }) => {
    const updated = [...services];
    updated[index] = { ...updated[index], name: template.name, price: template.price };
    setServices(updated);
  };

  const total = services.reduce((sum, s) => sum + (s.quantity * s.price), 0);

  const saveInvoice = async () => {
    if (!patientName.trim()) { setError("Please enter the patient name."); return; }
    if (services.every(s => !s.name.trim())) { setError("Please add at least one service."); return; }

    setSaving(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    const validServices = services.filter(s => s.name.trim());

    const { error } = await supabase.from("invoices").insert({
      user_id: user?.id,
      patient_name: patientName.trim(),
      owner_name: ownerName.trim(),
      owner_phone: ownerPhone.trim(),
      services: validServices,
      total,
      currency,
      status: "unpaid",
      notes: notes.trim(),
    });

    if (error) { setError(error.message); setSaving(false); return; }

    // Send invoice email to owner
    if (ownerName.trim()) {
      fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "invoice",
          to: ownerPhone.trim() || "clinic@vetsai.vet",
          data: {
            patientName: patientName.trim(),
            ownerName: ownerName.trim(),
            amount: total.toFixed(2),
            currency,
            services: services.filter(s => s.name.trim())
          }
        })
      }).catch(console.error);
    }
    setSuccessMsg("Invoice created successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
    setShowForm(false);
    resetForm();
    loadInvoices();
    setSaving(false);
  };

  const markAsPaid = async (id: string) => {
    await supabase.from("invoices").update({ status: "paid" }).eq("id", id);
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: "paid" } : inv));
    setSuccessMsg("Invoice marked as paid!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const deleteInvoice = async (id: string) => {
    if (!window.confirm("Delete this invoice?")) return;
    await supabase.from("invoices").delete().eq("id", id);
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  };

  const printInvoice = (inv: Invoice) => {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Invoice — ${inv.patient_name}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; font-size: 13px; color: #1e293b; padding: 40px; max-width: 680px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #1a3d2b; padding-bottom: 16px; margin-bottom: 24px; }
    .logo { font-size: 20px; font-weight: 700; color: #1a3d2b; }
    .logo span { font-size: 12px; font-weight: 400; color: #64748b; display: block; }
    .invoice-info { text-align: right; font-size: 12px; color: #64748b; }
    .invoice-info strong { display: block; font-size: 16px; color: #1e293b; margin-bottom: 4px; }
    .section { margin-bottom: 20px; }
    .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
    .patient-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .field strong { display: block; font-size: 11px; color: #94a3b8; margin-bottom: 2px; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
    td { padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
    .total-row { font-weight: 700; font-size: 15px; border-top: 2px solid #1a3d2b; }
    .status-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; background: ${inv.status === 'paid' ? '#f0faf4' : '#fef3c7'}; color: ${inv.status === 'paid' ? '#1a3d2b' : '#92400e'}; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">🐾 VetsAI<span>Veterinary Clinic Management</span></div>
    <div class="invoice-info">
      <strong>INVOICE</strong>
      Date: ${new Date(inv.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
      <br/>Status: <span class="status-badge">${inv.status.toUpperCase()}</span>
    </div>
  </div>
  <div class="section">
    <div class="section-title">Patient & owner details</div>
    <div class="patient-grid">
      <div class="field"><strong>Patient</strong>${inv.patient_name}</div>
      <div class="field"><strong>Owner</strong>${inv.owner_name || '—'}</div>
      <div class="field"><strong>Phone</strong>${inv.owner_phone || '—'}</div>
    </div>
  </div>
  <div class="section">
    <div class="section-title">Services</div>
    <table>
      <tr><th>Service</th><th>Qty</th><th>Unit price</th><th style="text-align:right">Total</th></tr>
      ${inv.services.map(s => `<tr><td>${s.name}</td><td>${s.quantity}</td><td>${inv.currency} ${s.price.toFixed(2)}</td><td style="text-align:right">${inv.currency} ${(s.quantity * s.price).toFixed(2)}</td></tr>`).join('')}
      <tr class="total-row"><td colspan="3">Total</td><td style="text-align:right">${inv.currency} ${inv.total.toFixed(2)}</td></tr>
    </table>
  </div>
  ${inv.notes ? `<div class="section"><div class="section-title">Notes</div><p>${inv.notes}</p></div>` : ''}
  <div class="footer">VetsAI · vetsai.vet · Thank you for your business</div>
</body>
</html>`;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  };

  const resetForm = () => {
    setPatientName(""); setOwnerName(""); setOwnerPhone("");
    setCurrency("USD"); setNotes("");
    setServices([{ name: "", quantity: 1, price: 0 }]);
    setError("");
  };

  const filtered = filterStatus === "all" ? invoices : invoices.filter(inv => inv.status === filterStatus);
  const totalRevenue = invoices.filter(inv => inv.status === "paid").reduce((sum, inv) => sum + inv.total, 0);
  const unpaidTotal = invoices.filter(inv => inv.status === "unpaid").reduce((sum, inv) => sum + inv.total, 0);

  return (
    <AppNav />
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, -apple-system, sans-serif; background: #f1f5f9; color: #1e293b; font-size: 14px; }
        .app-header { background: #fff; border-bottom: 1px solid #e2e8f0; padding: 0 20px; display: flex; align-items: center; justify-content: space-between; height: 56px; position: sticky; top: 0; z-index: 50; }
        .app-logo { display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 700; color: #1a3d2b; text-decoration: none; }
        .app-logo-mark { width: 30px; height: 30px; background: #1a3d2b; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 15px; }
        .nav-links { display: flex; align-items: center; gap: 12px; }
        .nav-link { font-size: 13px; font-weight: 500; color: #64748b; text-decoration: none; padding: 5px 10px; border-radius: 6px; transition: all 0.15s; }
        .nav-link:hover { background: #f1f5f9; color: #1e293b; }
        .nav-link.active { background: #f0faf4; color: #1a3d2b; font-weight: 600; }
        .btn-logout { font-size: 12px; padding: 6px 12px; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 6px; cursor: pointer; color: #64748b; font-family: inherit; }
        .page-body { max-width: 860px; margin: 0 auto; padding: 24px 16px 48px; }
        .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
        .page-title { font-size: 20px; font-weight: 700; color: #1a3d2b; }
        .btn-add { background: #1a3d2b; color: #fff; padding: 9px 18px; border-radius: 8px; border: none; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
        .btn-add:hover { background: #2d6b47; }
        .alert { border-radius: 8px; padding: 10px 14px; margin-bottom: 14px; font-size: 13px; }
        .alert-error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; }
        .alert-success { background: #f0faf4; border: 1px solid #d4f0e0; color: #1a3d2b; }
        .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; }
        .stat-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 16px; }
        .stat-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; margin-bottom: 6px; }
        .stat-value { font-size: 22px; font-weight: 700; color: #1e293b; }
        .stat-card.paid .stat-value { color: #1a3d2b; }
        .stat-card.unpaid .stat-value { color: #d97706; }
        .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-bottom: 16px; }
        .card-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; margin-bottom: 16px; }
        .field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
        .field { display: flex; flex-direction: column; gap: 5px; }
        .field label { font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.4px; }
        .field input, .field select, .field textarea { padding: 9px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; color: #1e293b; background: #f8fafc; outline: none; font-family: inherit; transition: border-color 0.15s; }
        .field input:focus, .field select:focus, .field textarea:focus { border-color: #1a3d2b; box-shadow: 0 0 0 3px rgba(26,61,43,0.1); background: #fff; }
        .services-header { display: grid; grid-template-columns: 2fr 80px 100px 36px; gap: 8px; margin-bottom: 8px; }
        .services-header span { font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.4px; }
        .service-row { display: grid; grid-template-columns: 2fr 80px 100px 36px; gap: 8px; margin-bottom: 8px; align-items: center; }
        .service-row input { padding: 8px 10px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 13px; background: #f8fafc; outline: none; font-family: inherit; }
        .service-row input:focus { border-color: #1a3d2b; background: #fff; }
        .btn-remove-svc { background: #fff; border: 1px solid #fecaca; color: #dc2626; width: 32px; height: 32px; border-radius: 6px; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; }
        .templates { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
        .template-btn { background: #f1f5f9; border: 1px solid #e2e8f0; color: #64748b; font-size: 11px; padding: 4px 10px; border-radius: 20px; cursor: pointer; font-family: inherit; transition: all 0.15s; }
        .template-btn:hover { background: #f0faf4; border-color: #d4f0e0; color: #1a3d2b; }
        .service-total { background: #f0faf4; border-radius: 8px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; margin: 12px 0; }
        .service-total span { font-size: 13px; color: #64748b; }
        .service-total strong { font-size: 18px; font-weight: 700; color: #1a3d2b; }
        .btn-row { display: flex; gap: 8px; margin-top: 16px; }
        .btn-save { background: #1a3d2b; color: #fff; padding: 9px 18px; border-radius: 7px; border: none; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
        .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-cancel { background: #fff; color: #64748b; padding: 9px 18px; border-radius: 7px; border: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
        .filter-row { display: flex; gap: 8px; margin-bottom: 14px; }
        .filter-btn { padding: 6px 14px; border-radius: 20px; border: 1px solid #e2e8f0; background: #fff; font-size: 12px; font-weight: 500; color: #64748b; cursor: pointer; font-family: inherit; transition: all 0.15s; }
        .filter-btn.active { background: #1a3d2b; color: #fff; border-color: #1a3d2b; }
        .invoice-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 8px; overflow: hidden; transition: box-shadow 0.15s; }
        .invoice-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .invoice-header { display: flex; align-items: center; gap: 12px; padding: 13px 16px; cursor: pointer; }
        .invoice-icon { width: 36px; height: 36px; border-radius: 8px; background: #f0faf4; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
        .invoice-info { flex: 1; min-width: 0; }
        .invoice-name { font-size: 14px; font-weight: 600; color: #1e293b; }
        .invoice-meta { font-size: 12px; color: #94a3b8; margin-top: 2px; }
        .invoice-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .invoice-amount { font-size: 15px; font-weight: 700; color: #1e293b; }
        .status-badge { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; }
        .status-paid { background: #f0faf4; color: #1a3d2b; }
        .status-unpaid { background: #fef3c7; color: #92400e; }
        .invoice-body { padding: 0 16px 16px; border-top: 1px solid #f1f5f9; }
        .invoice-body-inner { padding-top: 14px; }
        .services-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
        .services-table th { text-align: left; font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; padding: 6px 0; border-bottom: 1px solid #e2e8f0; }
        .services-table td { padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
        .invoice-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
        .btn-pay { background: #1a3d2b; color: #fff; font-size: 12px; font-weight: 600; padding: 6px 14px; border-radius: 6px; border: none; cursor: pointer; font-family: inherit; }
        .btn-print { background: #fff; color: #64748b; font-size: 12px; font-weight: 600; padding: 6px 14px; border-radius: 6px; border: 1px solid #e2e8f0; cursor: pointer; font-family: inherit; }
        .btn-del { background: #fff; color: #dc2626; font-size: 12px; padding: 6px 12px; border-radius: 6px; border: 1px solid #fecaca; cursor: pointer; font-family: inherit; }
        .empty { text-align: center; padding: 40px 20px; color: #94a3b8; }
        .empty-icon { font-size: 36px; margin-bottom: 10px; }
        @media (max-width: 560px) {
          .field-grid, .stats { grid-template-columns: 1fr; }
          .services-header, .service-row { grid-template-columns: 1fr 60px 80px 36px; }
        }
      `}</style>

      <div className="app-header">
        <a href="/app" className="app-logo">
          <img src="/vetsai-icon.svg" alt="VetsAI" width={30} height={30} style={{ borderRadius: "7px" }} />
          VetsAI
        </a>
        <div className="nav-links">
          <a href="/app" className="nav-link">New case</a>
          <a href="/patients" className="nav-link">Patients</a>
          <a href="/team" className="nav-link">Team</a><a href="/billing" style={{ fontSize: 13, fontWeight: 500, color: "var(--slate-500)", textDecoration: "none", padding: "5px 10px", borderRadius: 6, background: "var(--slate-100)" }}>
            💰 Billing
            </a>
          <a href="/billing" className="nav-link active">Billing</a>
          <button className="btn-logout" onClick={async () => { await supabase.auth.signOut(); window.location.href = "/login"; }}>Log out</button>
        </div>
      </div>

      <div className="page-body">
        {error && <div className="alert alert-error">⚠ {error}</div>}
        {successMsg && <div className="alert alert-success">✓ {successMsg}</div>}

        <div className="page-header">
          <div className="page-title">💰 Billing & invoicing</div>
          <button className="btn-add" onClick={() => { setShowForm(!showForm); resetForm(); }}>
            {showForm ? "✕ Cancel" : "+ New invoice"}
          </button>
        </div>

        <div className="stats">
          <div className="stat-card">
            <div className="stat-label">Total invoices</div>
            <div className="stat-value">{invoices.length}</div>
          </div>
          <div className="stat-card paid">
            <div className="stat-label">💚 Revenue collected</div>
            <div className="stat-value">$ {totalRevenue.toFixed(2)}</div>
          </div>
          <div className="stat-card unpaid">
            <div className="stat-label">🟠 Outstanding</div>
            <div className="stat-value">$ {unpaidTotal.toFixed(2)}</div>
          </div>
        </div>

        {showForm && (
          <div className="card">
            <div className="card-title">New invoice</div>

            <div className="field-grid">
              <div className="field">
                <label>Patient name *</label>
                <input placeholder="Rasta" value={patientName} onChange={e => setPatientName(e.target.value)} />
              </div>
              <div className="field">
                <label>Owner name</label>
                <input placeholder="John Mensah" value={ownerName} onChange={e => setOwnerName(e.target.value)} />
              </div>
              <div className="field">
                <label>Owner phone</label>
                <input placeholder="+233 20 000 0000" value={ownerPhone} onChange={e => setOwnerPhone(e.target.value)} />
              </div>
              <div className="field">
                <label>Currency</label>
                <select value={currency} onChange={e => setCurrency(e.target.value)}>
                  {["USD", "GHS", "GBP", "EUR", "NGN", "KES"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>Quick add service</div>
              <div className="templates">
                {COMMON_SERVICES.map(t => (
                  <button key={t.name} className="template-btn" onClick={() => {
                    const emptyIndex = services.findIndex(s => !s.name.trim());
                    if (emptyIndex >= 0) applyTemplate(emptyIndex, t);
                    else setServices([...services, { name: t.name, quantity: 1, price: t.price }]);
                  }}>
                    + {t.name} (${t.price})
                  </button>
                ))}
              </div>
            </div>

            <div className="services-header">
              <span>Service</span><span>Qty</span><span>Price ({currency})</span><span></span>
            </div>
            {services.map((svc, i) => (
              <div className="service-row" key={i}>
                <input placeholder="Service name" value={svc.name} onChange={e => updateService(i, "name", e.target.value)} />
                <input type="number" min="1" value={svc.quantity} onChange={e => updateService(i, "quantity", parseInt(e.target.value) || 1)} />
                <input type="number" min="0" step="0.01" value={svc.price} onChange={e => updateService(i, "price", parseFloat(e.target.value) || 0)} />
                <button className="btn-remove-svc" onClick={() => removeService(i)}>✕</button>
              </div>
            ))}
            <button className="template-btn" onClick={addService} style={{ marginTop: 4 }}>+ Add service</button>

            <div className="service-total">
              <span>Total</span>
              <strong>{currency} {total.toFixed(2)}</strong>
            </div>

            <div className="field">
              <label>Notes (optional)</label>
              <textarea placeholder="Any additional notes for this invoice…" rows={2} value={notes} onChange={e => setNotes(e.target.value)} />
            </div>

            <div className="btn-row">
              <button className="btn-save" onClick={saveInvoice} disabled={saving}>
                {saving ? "Saving…" : "Create invoice"}
              </button>
              <button className="btn-cancel" onClick={() => { setShowForm(false); resetForm(); }}>Cancel</button>
            </div>
          </div>
        )}

        <div className="filter-row">
          {["all", "unpaid", "paid"].map(f => (
            <button key={f} className={`filter-btn ${filterStatus === f ? "active" : ""}`} onClick={() => setFilterStatus(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="empty"><p>Loading…</p></div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🧾</div>
            <p>{invoices.length === 0 ? "No invoices yet. Create your first invoice above." : "No invoices match this filter."}</p>
          </div>
        ) : (
          filtered.map(inv => {
            const isOpen = expandedId === inv.id;
            return (
              <div className="invoice-card" key={inv.id}>
                <div className="invoice-header" onClick={() => setExpandedId(isOpen ? null : inv.id)}>
                  <div className="invoice-icon">🧾</div>
                  <div className="invoice-info">
                    <div className="invoice-name">{inv.patient_name}{inv.owner_name ? ` — ${inv.owner_name}` : ""}</div>
                    <div className="invoice-meta">
                      {new Date(inv.created_at).toLocaleDateString()} · {inv.services.length} service{inv.services.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <div className="invoice-right">
                    <span className="invoice-amount">{inv.currency} {inv.total.toFixed(2)}</span>
                    <span className={`status-badge ${inv.status === "paid" ? "status-paid" : "status-unpaid"}`}>
                      {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                    </span>
                  </div>
                </div>
                {isOpen && (
                  <div className="invoice-body">
                    <div className="invoice-body-inner">
                      <table className="services-table">
                        <thead>
                          <tr><th>Service</th><th>Qty</th><th>Unit price</th><th>Total</th></tr>
                        </thead>
                        <tbody>
                          {inv.services.map((s, i) => (
                            <tr key={i}>
                              <td>{s.name}</td>
                              <td>{s.quantity}</td>
                              <td>{inv.currency} {s.price.toFixed(2)}</td>
                              <td>{inv.currency} {(s.quantity * s.price).toFixed(2)}</td>
                            </tr>
                          ))}
                          <tr style={{ fontWeight: 700, borderTop: "2px solid #e2e8f0" }}>
                            <td colSpan={3}>Total</td>
                            <td>{inv.currency} {inv.total.toFixed(2)}</td>
                          </tr>
                        </tbody>
                      </table>
                      {inv.notes && <p style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>Notes: {inv.notes}</p>}
                      <div className="invoice-actions">
                        {inv.status === "unpaid" && (
                          <button className="btn-pay" onClick={() => markAsPaid(inv.id)}>✓ Mark as paid</button>
                        )}
                        <button className="btn-print" onClick={() => printInvoice(inv)}>🖨 Print invoice</button>
                        <button className="btn-del" onClick={() => deleteInvoice(inv.id)}>Delete</button>
                      </div>
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