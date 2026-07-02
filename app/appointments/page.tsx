"use client";
import AppNav from "@/components/AppNav";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Appointment = {
  id: string;
  patient_name: string;
  owner_name: string;
  owner_phone: string;
  date: string;
  time: string;
  type: string;
  notes: string;
  status: string;
  created_at: string;
};

const APPOINTMENT_TYPES = ["Consultation", "Vaccination", "Surgery", "Follow-up", "Checkup", "Emergency", "Grooming", "Other"];
const TIMES = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];

function statusColor(s: string) {
  if (s === "scheduled") return { bg: "#eff6ff", color: "#1d4ed8" };
  if (s === "completed") return { bg: "#f0faf4", color: "#1a3d2b" };
  if (s === "cancelled") return { bg: "#fef2f2", color: "#dc2626" };
  return { bg: "#f1f5f9", color: "#64748b" };
}

function typeIcon(t: string) {
  const m: Record<string, string> = { consultation: "🩺", vaccination: "💉", surgery: "🔬", "follow-up": "🔁", checkup: "✅", emergency: "🚨", grooming: "✂️", other: "📋" };
  return m[t?.toLowerCase()] ?? "📅";
}

function buildWhatsAppLink(phone: string, patientName: string, ownerName: string, date: string, time: string, type: string) {
  const formattedDate = new Date(date + "T00:00:00").toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const message = `Hello ${ownerName}, your appointment for *${patientName}* (${type}) is confirmed for *${formattedDate} at ${time}*. Please arrive 10 minutes early. Thank you — VetsAI Clinic`;
  const cleanPhone = phone.replace(/\s+/g, "").replace(/^\+/, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export default function AppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");

  // Form
  const [patientName, setPatientName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [type, setType] = useState("Consultation");
  const [notes, setNotes] = useState("");
  const [notifyMethod, setNotifyMethod] = useState("none");

  useEffect(() => { checkAuthAndLoad(); }, []);

  const checkAuthAndLoad = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { getCurrentUserRole, hasAccess } = await import("@/lib/roleCheck");
    const role = await getCurrentUserRole();
    if (!hasAccess("appointments", role)) {
      router.push("/patients");
      return;
    }
    loadAppointments();
  };

  const loadAppointments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("date", { ascending: true })
      .order("time", { ascending: true });
    if (!error && data) setAppointments(data);
    setLoading(false);
  };

  const saveAppointment = async () => {
    if (!patientName.trim() || !date) { setError("Patient name and date are required."); return; }
    setSaving(true);
    setError("");
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("appointments").insert({
      user_id: user?.id,
      patient_name: patientName.trim(),
      owner_name: ownerName.trim(),
      owner_phone: ownerPhone.trim(),
      date,
      time,
      type,
      notes: notes.trim(),
      status: "scheduled",
    });
    if (error) { setError(error.message); setSaving(false); return; }

    // Send email notification
    if (notifyMethod === "email" && ownerEmail.trim()) {
      fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "appointment",
          to: ownerEmail.trim(),
          data: {
            patientName: patientName.trim(),
            ownerName: ownerName.trim(),
            date,
            time,
            appointmentType: type,
          }
        })
      }).catch(console.error);
      setSuccessMsg("Appointment booked! Email notification sent.");
    } else if (notifyMethod === "whatsapp" && ownerPhone.trim()) {
      const waLink = buildWhatsAppLink(ownerPhone.trim(), patientName.trim(), ownerName.trim(), date, time, type);
      window.open(waLink, "_blank");
      setSuccessMsg("Appointment booked! WhatsApp opened to notify owner.");
    } else {
      setSuccessMsg("Appointment booked!");
    }

    setTimeout(() => setSuccessMsg(""), 4000);
    setShowForm(false);
    resetForm();
    loadAppointments();
    setSaving(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("appointments").update({ status }).eq("id", id);
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const deleteAppointment = async (id: string) => {
    if (!window.confirm("Delete this appointment?")) return;
    await supabase.from("appointments").delete().eq("id", id);
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  const sendWhatsAppReminder = (appt: Appointment) => {
    if (!appt.owner_phone) { alert("No phone number for this owner."); return; }
    const waLink = buildWhatsAppLink(appt.owner_phone, appt.patient_name, appt.owner_name, appt.date, appt.time, appt.type);
    window.open(waLink, "_blank");
  };

  const resetForm = () => {
    setPatientName(""); setOwnerName(""); setOwnerPhone(""); setOwnerEmail("");
    setDate(""); setTime("09:00"); setType("Consultation"); setNotes("");
    setNotifyMethod("none"); setError("");
  };

  const today = new Date().toISOString().split("T")[0];
  const filtered = appointments.filter(a => {
    if (filterStatus !== "all" && a.status !== filterStatus) return false;
    if (filterDate && a.date !== filterDate) return false;
    return true;
  });
  const todayAppts = appointments.filter(a => a.date === today && a.status === "scheduled");
  const upcomingAppts = appointments.filter(a => a.date > today && a.status === "scheduled");
  const totalScheduled = appointments.filter(a => a.status === "scheduled").length;

  return (
    <AppNav />
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, -apple-system, sans-serif; background: #f1f5f9; color: #1e293b; font-size: 14px; }
        .app-header { background: #fff; border-bottom: 1px solid #e2e8f0; padding: 0 20px; display: flex; align-items: center; justify-content: space-between; height: 56px; position: sticky; top: 0; z-index: 50; }
        .app-logo { display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 700; color: #1a3d2b; text-decoration: none; }
        .app-logo-mark { width: 30px; height: 30px; background: #1a3d2b; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 15px; }
        .nav-links { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .nav-link { font-size: 12px; font-weight: 500; color: #64748b; text-decoration: none; padding: 5px 8px; border-radius: 6px; transition: all 0.15s; }
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
        .stat-value { font-size: 24px; font-weight: 700; color: #1e293b; }
        .stat-card.today .stat-value { color: #1a3d2b; }
        .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-bottom: 16px; }
        .card-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; margin-bottom: 16px; }
        .field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
        .field { display: flex; flex-direction: column; gap: 5px; }
        .field label { font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.4px; }
        .field input, .field select, .field textarea { padding: 9px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; color: #1e293b; background: #f8fafc; outline: none; font-family: inherit; transition: border-color 0.15s; }
        .field input:focus, .field select:focus, .field textarea:focus { border-color: #1a3d2b; box-shadow: 0 0 0 3px rgba(26,61,43,0.1); background: #fff; }
        .notify-section { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 12px; }
        .notify-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 10px; }
        .notify-options { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }
        .notify-btn { padding: 7px 14px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fff; font-size: 13px; font-weight: 500; color: #64748b; cursor: pointer; font-family: inherit; transition: all 0.15s; display: flex; align-items: center; gap: 6px; }
        .notify-btn.active { border-color: #1a3d2b; background: #f0faf4; color: #1a3d2b; font-weight: 600; }
        .btn-row { display: flex; gap: 8px; margin-top: 16px; }
        .btn-save { background: #1a3d2b; color: #fff; padding: 9px 18px; border-radius: 7px; border: none; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
        .btn-cancel { background: #fff; color: #64748b; padding: 9px 18px; border-radius: 7px; border: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
        .filter-row { display: flex; gap: 8px; margin-bottom: 14px; align-items: center; flex-wrap: wrap; }
        .filter-btn { padding: 6px 14px; border-radius: 20px; border: 1px solid #e2e8f0; background: #fff; font-size: 12px; font-weight: 500; color: #64748b; cursor: pointer; font-family: inherit; }
        .filter-btn.active { background: #1a3d2b; color: #fff; border-color: #1a3d2b; }
        .date-filter { padding: 6px 10px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 12px; background: #fff; outline: none; font-family: inherit; color: #64748b; }
        .appt-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 8px; overflow: hidden; }
        .appt-header { display: flex; align-items: center; gap: 12px; padding: 13px 16px; }
        .appt-icon { width: 38px; height: 38px; border-radius: 9px; background: #f0faf4; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
        .appt-info { flex: 1; min-width: 0; }
        .appt-name { font-size: 14px; font-weight: 600; color: #1e293b; }
        .appt-meta { font-size: 12px; color: #94a3b8; margin-top: 2px; }
        .appt-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; flex-wrap: wrap; justify-content: flex-end; }
        .appt-time { font-size: 13px; font-weight: 600; color: #1e293b; }
        .status-badge { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; }
        .appt-actions { display: flex; gap: 6px; padding: 0 16px 12px; flex-wrap: wrap; }
        .btn-complete { background: #f0faf4; color: #1a3d2b; font-size: 12px; font-weight: 600; padding: 5px 12px; border-radius: 6px; border: 1px solid #d4f0e0; cursor: pointer; font-family: inherit; }
        .btn-whatsapp { background: #f0fdf4; color: #15803d; font-size: 12px; font-weight: 600; padding: 5px 12px; border-radius: 6px; border: 1px solid #bbf7d0; cursor: pointer; font-family: inherit; }
        .btn-cancel-appt { background: #fef2f2; color: #dc2626; font-size: 12px; font-weight: 600; padding: 5px 12px; border-radius: 6px; border: 1px solid #fecaca; cursor: pointer; font-family: inherit; }
        .btn-delete { background: #fff; color: #94a3b8; font-size: 12px; padding: 5px 10px; border-radius: 6px; border: 1px solid #e2e8f0; cursor: pointer; font-family: inherit; }
        .today-banner { background: #1a3d2b; color: #fff; border-radius: 10px; padding: 14px 18px; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
        .today-banner-count { font-size: 20px; font-weight: 700; color: #fff; }
        .today-banner-text { font-size: 13px; color: rgba(255,255,255,0.85); }
        .empty { text-align: center; padding: 40px 20px; color: #94a3b8; }
        .empty-icon { font-size: 36px; margin-bottom: 10px; }
        @media (max-width: 560px) {
          .field-grid, .stats { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="app-header">
        <a href="/app" className="app-logo">
          <img src="/vetsai-icon.svg" alt="VetsAI" width={30} height={30} style={{ borderRadius: "7px" }} />
          VetsAI
        </a>
        <div className="nav-links">
          <a href="/app" className="nav-link">Cases</a>
          <a href="/patients" className="nav-link">Patients</a>
          <a href="/appointments" className="nav-link active">Appointments</a>
          <a href="/billing" className="nav-link">Billing</a>
          <a href="/analytics" className="nav-link">Analytics</a>
          <button className="btn-logout" onClick={async () => { await supabase.auth.signOut(); window.location.href = "/login"; }}>Log out</button>
        </div>
      </div>

      <div className="page-body">
        {error && <div className="alert alert-error">⚠ {error}</div>}
        {successMsg && <div className="alert alert-success">✓ {successMsg}</div>}

        <div className="page-header">
          <div className="page-title">📅 Appointments</div>
          <button className="btn-add" onClick={() => { setShowForm(!showForm); resetForm(); }}>
            {showForm ? "✕ Cancel" : "+ Book appointment"}
          </button>
        </div>

        {todayAppts.length > 0 && (
          <div className="today-banner">
            <div className="today-banner-count">{todayAppts.length}</div>
            <div className="today-banner-text">
              appointment{todayAppts.length !== 1 ? "s" : ""} today — {todayAppts.map(a => a.patient_name).join(", ")}
            </div>
          </div>
        )}

        <div className="stats">
          <div className="stat-card today">
            <div className="stat-label">📅 Today</div>
            <div className="stat-value">{todayAppts.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">⏳ Upcoming</div>
            <div className="stat-value">{upcomingAppts.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">📋 Total scheduled</div>
            <div className="stat-value">{totalScheduled}</div>
          </div>
        </div>

        {showForm && (
          <div className="card">
            <div className="card-title">Book new appointment</div>
            <div className="field-grid">
              <div className="field">
                <label>Patient name *</label>
                <input placeholder="Buddy" value={patientName} onChange={e => setPatientName(e.target.value)} />
              </div>
              <div className="field">
                <label>Appointment type</label>
                <select value={type} onChange={e => setType(e.target.value)}>
                  {APPOINTMENT_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Date *</label>
                <input type="date" value={date} min={today} onChange={e => setDate(e.target.value)} />
              </div>
              <div className="field">
                <label>Time</label>
                <select value={time} onChange={e => setTime(e.target.value)}>
                  {TIMES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Owner name</label>
                <input placeholder="John Mensah" value={ownerName} onChange={e => setOwnerName(e.target.value)} />
              </div>
              <div className="field">
                <label>Owner phone</label>
                <input placeholder="+233 20 000 0000" value={ownerPhone} onChange={e => setOwnerPhone(e.target.value)} />
              </div>
            </div>

            {/* Notification options */}
            <div className="notify-section">
              <div className="notify-title">📣 Notify owner</div>
              <div className="notify-options">
                <button className={`notify-btn ${notifyMethod === "none" ? "active" : ""}`} onClick={() => setNotifyMethod("none")}>
                  🔕 No notification
                </button>
                <button className={`notify-btn ${notifyMethod === "email" ? "active" : ""}`} onClick={() => setNotifyMethod("email")}>
                  📧 Send email
                </button>
                <button className={`notify-btn ${notifyMethod === "whatsapp" ? "active" : ""}`} onClick={() => setNotifyMethod("whatsapp")}>
                  💬 WhatsApp
                </button>
              </div>

              {notifyMethod === "email" && (
                <div className="field">
                  <label>Owner email *</label>
                  <input type="email" placeholder="owner@email.com" value={ownerEmail} onChange={e => setOwnerEmail(e.target.value)} />
                </div>
              )}
              {notifyMethod === "whatsapp" && (
                <p style={{ fontSize: 12, color: "#64748b" }}>
                  WhatsApp will open with a pre-filled message to {ownerPhone || "the owner's number"}. Make sure the owner phone is filled in above.
                </p>
              )}
            </div>

            <div className="field">
              <label>Notes</label>
              <textarea placeholder="Any notes about this appointment…" rows={2} value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
            <div className="btn-row">
              <button className="btn-save" onClick={saveAppointment} disabled={saving}>
                {saving ? "Saving…" : "Book appointment"}
              </button>
              <button className="btn-cancel" onClick={() => { setShowForm(false); resetForm(); }}>Cancel</button>
            </div>
          </div>
        )}

        <div className="filter-row">
          {["all", "scheduled", "completed", "cancelled"].map(f => (
            <button key={f} className={`filter-btn ${filterStatus === f ? "active" : ""}`} onClick={() => setFilterStatus(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
          <input type="date" className="date-filter" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
          {filterDate && <button className="filter-btn" onClick={() => setFilterDate("")}>Clear date</button>}
        </div>

        {loading ? (
          <div className="empty"><p>Loading…</p></div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📅</div>
            <p>{appointments.length === 0 ? "No appointments yet. Book your first one above." : "No appointments match this filter."}</p>
          </div>
        ) : (
          filtered.map(appt => {
            const sc = statusColor(appt.status);
            const isToday = appt.date === today;
            return (
              <div className="appt-card" key={appt.id} style={{ borderLeft: isToday ? "3px solid #1a3d2b" : undefined }}>
                <div className="appt-header">
                  <div className="appt-icon">{typeIcon(appt.type)}</div>
                  <div className="appt-info">
                    <div className="appt-name">
                      {appt.patient_name}
                      {isToday && <span style={{ fontSize: 11, fontWeight: 700, color: "#1a3d2b", marginLeft: 8, background: "#f0faf4", padding: "2px 8px", borderRadius: 20 }}>Today</span>}
                    </div>
                    <div className="appt-meta">
                      {appt.type} · {new Date(appt.date + "T00:00:00").toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                      {appt.owner_name ? ` · ${appt.owner_name}` : ""}
                      {appt.owner_phone ? ` · ${appt.owner_phone}` : ""}
                    </div>
                  </div>
                  <div className="appt-right">
                    <span className="appt-time">{appt.time}</span>
                    <span className="status-badge" style={{ background: sc.bg, color: sc.color }}>
                      {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="appt-actions">
                  {appt.status === "scheduled" && (
                    <>
                      <button className="btn-complete" onClick={() => updateStatus(appt.id, "completed")}>✓ Complete</button>
                      <button className="btn-whatsapp" onClick={() => sendWhatsAppReminder(appt)}>💬 WhatsApp reminder</button>
                      <button className="btn-cancel-appt" onClick={() => updateStatus(appt.id, "cancelled")}>✕ Cancel</button>
                    </>
                  )}
                  {appt.status === "cancelled" && (
                    <button className="btn-complete" onClick={() => updateStatus(appt.id, "scheduled")}>↺ Reschedule</button>
                  )}
                  <button className="btn-delete" onClick={() => deleteAppointment(appt.id)}>Delete</button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}