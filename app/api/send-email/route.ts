import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// ── Security helpers ──────────────────────────────────────────────────────────

// Escape user-supplied values before they are interpolated into email HTML, so a
// caller can't inject arbitrary markup/links (branded-phishing content) into a
// message sent from our DKIM-signed domain.
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function deepEscape<T>(value: T): T {
  if (typeof value === "string") return escapeHtml(value) as unknown as T;
  if (Array.isArray(value)) return value.map(deepEscape) as unknown as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = deepEscape(v);
    return out as T;
  }
  return value;
}

// Accept exactly one well-formed address — no arrays/comma lists (blocks mass
// sending) and no phone numbers slipping through as recipients.
const EMAIL_RE = /^[^\s@,]+@[^\s@,]+\.[^\s@,]+$/;
function isValidEmail(to: unknown): to is string {
  return typeof to === "string" && to.length <= 254 && EMAIL_RE.test(to.trim());
}

// In-process per-IP sliding-window rate limit. Backstop against abuse of this
// (session-less) endpoint until it's moved behind auth.
const RATE_MAX = 10;
const RATE_WINDOW_MS = 60_000;
const rateHits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (rateHits.get(ip) || []).filter((t) => t > now - RATE_WINDOW_MS);
  if (hits.length >= RATE_MAX) return true;
  hits.push(now);
  rateHits.set(ip, hits);
  return false;
}

// Resend client initialized per request

// ── Email templates ───────────────────────────────────────────────────────────

function welcomeEmail(clinicName: string) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="font-family:system-ui,sans-serif;background:#f1f5f9;padding:40px 20px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.06);">
    <div style="background:linear-gradient(135deg,#1a3d2b,#3a8f5f);padding:32px;text-align:center;">
      <div style="font-size:32px;margin-bottom:8px;">🐾</div>
      <h1 style="color:#fff;font-size:22px;font-weight:700;margin:0;">Welcome to VetsAI</h1>
      <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">Your clinic operating system is ready</p>
    </div>
    <div style="padding:32px;">
      <h2 style="font-size:18px;color:#1a3d2b;margin-bottom:16px;">Hi ${clinicName}! 👋</h2>
      <p style="color:#64748b;line-height:1.7;margin-bottom:20px;">
        Your free trial is now active. You have <strong>3 months free</strong> to explore everything VetsAI has to offer.
      </p>
      <div style="background:#f0faf4;border-radius:10px;padding:20px;margin-bottom:24px;">
        <p style="font-weight:700;color:#1a3d2b;margin:0 0 12px;">What you can do right now:</p>
        <ul style="color:#334155;line-height:2;margin:0;padding-left:20px;">
          <li>🧠 Analyze your first case with AI</li>
          <li>📁 Add patients to your records</li>
          <li>💊 Get drug dosage guidance</li>
          <li>📋 Generate SOAP note drafts</li>
          <li>💰 Create and send invoices</li>
        </ul>
      </div>
      <div style="text-align:center;">
        <a href="https://vetsai.vet/app" style="background:#1a3d2b;color:#fff;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block;">
          Go to my clinic →
        </a>
      </div>
      <p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:24px;">
        Need help? Reply to this email or visit <a href="https://vetsai.vet" style="color:#1a3d2b;">vetsai.vet</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}
function day3Email(clinicName: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/></head>
<body style="font-family:system-ui,sans-serif;background:#f1f5f9;padding:40px 20px;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.06);">
<div style="background:linear-gradient(135deg,#1a3d2b,#3a8f5f);padding:32px;text-align:center;">
<h1 style="color:#fff;font-size:22px;font-weight:700;margin:0;">Have you tried your first case?</h1>
<p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">VetsAI — Clinic Operating System</p>
</div>
<div style="padding:32px;">
<h2 style="font-size:18px;color:#1a3d2b;margin-bottom:16px;">Hi ${clinicName} 👋</h2>
<p style="color:#64748b;line-height:1.7;margin-bottom:20px;">
You signed up 3 days ago. Have you had a chance to analyze your first case yet?
</p>
<div style="background:#f0faf4;border-radius:10px;padding:20px;margin-bottom:24px;">
<p style="font-weight:700;color:#1a3d2b;margin:0 0 8px;">It takes less than 60 seconds:</p>
<ol style="color:#334155;line-height:2;margin:0;padding-left:20px;">
<li>Enter the animal type, age, weight and symptoms</li>
<li>Click Analyze case</li>
<li>Get differential diagnoses, drug notes and a SOAP draft</li>
</ol>
</div>
<div style="text-align:center;">
<a href="https://vet-ui-beta.vercel.app/app" style="background:#1a3d2b;color:#fff;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block;">
Analyze my first case →
</a>
</div>
<p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:24px;">
Questions? Reply to this email — we read every one.
</p>
</div>
</div>
</body></html>`;
}

function day7Email(clinicName: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/></head>
<body style="font-family:system-ui,sans-serif;background:#f1f5f9;padding:40px 20px;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.06);">
<div style="background:linear-gradient(135deg,#1a3d2b,#3a8f5f);padding:32px;text-align:center;">
<h1 style="color:#fff;font-size:22px;font-weight:700;margin:0;">What VetsAI can do for your clinic</h1>
<p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">VetsAI — Clinic Operating System</p>
</div>
<div style="padding:32px;">
<h2 style="font-size:18px;color:#1a3d2b;margin-bottom:16px;">Hi ${clinicName} 👋</h2>
<p style="color:#64748b;line-height:1.7;margin-bottom:20px;">
One week in — here's everything your clinic has access to right now.
</p>
<div style="background:#f0faf4;border-radius:10px;padding:20px;margin-bottom:24px;">
<table style="width:100%;border-collapse:collapse;">
<tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;"><strong style="color:#1a3d2b;">🧠 Clinical Support</strong><br><span style="color:#64748b;font-size:13px;">Differential diagnoses in under 60 seconds</span></td></tr>
<tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;"><strong style="color:#1a3d2b;">💊 Drug Guidance</strong><br><span style="color:#64748b;font-size:13px;">Dosage by species and weight for clinician verification</span></td></tr>
<tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;"><strong style="color:#1a3d2b;">📋 SOAP Notes</strong><br><span style="color:#64748b;font-size:13px;">Auto-generated drafts ready for your review</span></td></tr>
<tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;"><strong style="color:#1a3d2b;">🚨 Urgency Triage</strong><br><span style="color:#64748b;font-size:13px;">Every case flagged High, Medium or Low automatically</span></td></tr>
<tr><td style="padding:10px 0;"><strong style="color:#1a3d2b;">📁 Patient Records</strong><br><span style="color:#64748b;font-size:13px;">Full medical history saved for every patient</span></td></tr>
</table>
</div>
<div style="text-align:center;">
<a href="https://vet-ui-beta.vercel.app/app" style="background:#1a3d2b;color:#fff;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block;">
Go to my clinic →
</a>
</div>
</div>
</div>
</body></html>`;
}

function day14Email(clinicName: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/></head>
<body style="font-family:system-ui,sans-serif;background:#f1f5f9;padding:40px 20px;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.06);">
<div style="background:linear-gradient(135deg,#1a3d2b,#3a8f5f);padding:32px;text-align:center;">
<h1 style="color:#fff;font-size:22px;font-weight:700;margin:0;">Your free trial — what happens next</h1>
<p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">VetsAI — Clinic Operating System</p>
</div>
<div style="padding:32px;">
<h2 style="font-size:18px;color:#1a3d2b;margin-bottom:16px;">Hi ${clinicName} 👋</h2>
<p style="color:#64748b;line-height:1.7;margin-bottom:20px;">
You're 2 weeks into your free trial. Here's what you get when you stay with VetsAI.
</p>
<div style="background:#f0faf4;border-radius:10px;padding:20px;margin-bottom:24px;">
<p style="font-weight:700;color:#1a3d2b;margin:0 0 12px;">Choose the plan that fits your clinic:</p>
<table style="width:100%;border-collapse:collapse;">
<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:10px 0;"><strong style="color:#1a3d2b;">Starter — $49/month</strong><br><span style="color:#64748b;font-size:13px;">1 vet · 200 cases/month</span></td></tr>
<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:10px 0;"><strong style="color:#1a3d2b;">Professional — $99/month</strong><br><span style="color:#64748b;font-size:13px;">3 vets · Unlimited cases · Patient records</span></td></tr>
<tr><td style="padding:10px 0;"><strong style="color:#1a3d2b;">Clinic OS — $199/month</strong><br><span style="color:#64748b;font-size:13px;">10 vets · Full platform · Appointments · Billing</span></td></tr>
</table>
</div>
<p style="color:#64748b;line-height:1.7;margin-bottom:24px;">
Your first 3 months are completely free — no credit card needed until then.
</p>
<div style="text-align:center;">
<a href="https://vet-ui-beta.vercel.app/app" style="background:#1a3d2b;color:#fff;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block;">
Continue using VetsAI →
</a>
</div>
</div>
</div>
</body></html>`;
}

function day28Email(clinicName: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/></head>
<body style="font-family:system-ui,sans-serif;background:#f1f5f9;padding:40px 20px;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.06);">
<div style="background:linear-gradient(135deg,#1a3d2b,#3a8f5f);padding:32px;text-align:center;">
<h1 style="color:#fff;font-size:22px;font-weight:700;margin:0;">Last week of your free trial</h1>
<p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">VetsAI — Clinic Operating System</p>
</div>
<div style="padding:32px;">
<h2 style="font-size:18px;color:#1a3d2b;margin-bottom:16px;">Hi ${clinicName} 👋</h2>
<p style="color:#64748b;line-height:1.7;margin-bottom:20px;">
Your free trial has one week left. We'd love to keep supporting your clinic.
</p>
<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:20px;margin-bottom:24px;">
<p style="font-weight:700;color:#dc2626;margin:0 0 8px;">⏰ Trial ends in 7 days</p>
<p style="color:#64748b;margin:0;font-size:14px;">After your trial, choose a plan to keep access to all your patient records and case history.</p>
</div>
<p style="color:#64748b;line-height:1.7;margin-bottom:24px;">
Not ready to commit? Reply to this email and tell us what's holding you back — we want to make VetsAI work for your clinic.
</p>
<div style="text-align:center;">
<a href="https://vet-ui-beta.vercel.app/app" style="background:#1a3d2b;color:#fff;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block;">
Keep my clinic →
</a>
</div>
<p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:24px;">
Reply to this email anytime — we read every message.
</p>
</div>
</div>
</body></html>`;
}
function invoiceEmail(patientName: string, ownerName: string, amount: string, currency: string, services: { name: string; quantity: number; price: number }[]) {
  const serviceRows = services.map(s =>
    `<tr><td style="padding:8px 0;border-bottom:1px solid #f1f5f9;">${s.name}</td><td style="padding:8px 0;border-bottom:1px solid #f1f5f9;">${s.quantity}</td><td style="padding:8px 0;border-bottom:1px solid #f1f5f9;text-align:right;">${currency} ${(s.quantity * s.price).toFixed(2)}</td></tr>`
  ).join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="font-family:system-ui,sans-serif;background:#f1f5f9;padding:40px 20px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.06);">
    <div style="background:linear-gradient(135deg,#1a3d2b,#3a8f5f);padding:32px;text-align:center;">
      <div style="font-size:32px;margin-bottom:8px;">🧾</div>
      <h1 style="color:#fff;font-size:22px;font-weight:700;margin:0;">Invoice from VetsAI</h1>
      <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">Your veterinary invoice</p>
    </div>
    <div style="padding:32px;">
      <p style="color:#64748b;margin-bottom:20px;">Dear <strong>${ownerName || "Pet Owner"}</strong>,</p>
      <p style="color:#64748b;line-height:1.7;margin-bottom:20px;">
        Please find below your invoice for veterinary services provided to <strong>${patientName}</strong>.
      </p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <thead>
          <tr style="border-bottom:2px solid #1a3d2b;">
            <th style="text-align:left;padding:8px 0;font-size:12px;color:#94a3b8;text-transform:uppercase;">Service</th>
            <th style="text-align:left;padding:8px 0;font-size:12px;color:#94a3b8;text-transform:uppercase;">Qty</th>
            <th style="text-align:right;padding:8px 0;font-size:12px;color:#94a3b8;text-transform:uppercase;">Total</th>
          </tr>
        </thead>
        <tbody>${serviceRows}</tbody>
        <tfoot>
          <tr style="border-top:2px solid #1a3d2b;">
            <td colspan="2" style="padding:12px 0;font-weight:700;font-size:16px;">Total</td>
            <td style="padding:12px 0;font-weight:700;font-size:16px;text-align:right;color:#1a3d2b;">${currency} ${amount}</td>
          </tr>
        </tfoot>
      </table>
      <div style="background:#fef3c7;border-radius:8px;padding:14px;text-align:center;margin-bottom:20px;">
        <p style="color:#92400e;font-weight:600;margin:0;">Payment due upon receipt</p>
      </div>
      <p style="color:#94a3b8;font-size:12px;text-align:center;">
        Questions? Contact your veterinary clinic · Powered by <a href="https://vetsai.vet" style="color:#1a3d2b;">VetsAI</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

// ── API Route ─────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    if (rateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { type } = body;
    // Escape all caller-supplied template data before it reaches the HTML.
    const data = deepEscape(body.data ?? {});

    if (!type) {
      return NextResponse.json({ error: "Missing type field" }, { status: 400 });
    }
    // Internal-notification email types must always go to a fixed inbox -
    // never trust a caller-supplied `to` for these, since that would let
    // anyone use this endpoint as an open relay through our Resend account.
    const INTERNAL_NOTIFICATION_TYPES = new Set(["contact"]);
    let to: string;
    if (INTERNAL_NOTIFICATION_TYPES.has(type)) {
      to = "jowelbeck@aol.com";
    } else {
      to = body.to;
      if (!to) {
        return NextResponse.json({ error: "Missing to field" }, { status: 400 });
      }
    }
    if (!isValidEmail(to)) {
      return NextResponse.json(
        { error: "Invalid recipient address" },
        { status: 400 }
      );
    }

    let subject = "";
    let html = "";

    if (type === "welcome") {
      subject = `Welcome to VetsAI — Your free trial is active 🐾`;
      html = welcomeEmail(data.clinicName || "there");
          } else if (type === "day3") {
      subject = `Have you tried your first case analysis?`;
      html = day3Email(data.clinicName || "there");
    } else if (type === "day7") {
      subject = `What VetsAI can do for your clinic`;
      html = day7Email(data.clinicName || "there");
    } else if (type === "day14") {
      subject = `Your free trial — here's what happens next`;
      html = day14Email(data.clinicName || "there");
    } else if (type === "day28") {
      subject = `Last week of your free trial`;
      html = day28Email(data.clinicName || "there");
      
    } else if (type === "invoice") {
      subject = `Invoice for ${data.patientName} — ${data.currency} ${data.amount}`;
      html = invoiceEmail(data.patientName, data.ownerName, data.amount, data.currency, data.services);
    } else if (type === "appointment") {
      subject = `Appointment confirmed — ${data.patientName} on ${new Date(data.date + "T00:00:00").toLocaleDateString("en-GB", { weekday: "long", month: "long", day: "numeric" })} at ${data.time}`;
      html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;background:#f1f5f9;padding:40px 20px;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.06);">
<div style="background:linear-gradient(135deg,#1a3d2b,#3a8f5f);padding:32px;text-align:center;">
<div style="font-size:32px;margin-bottom:8px;">📅</div>
<h1 style="color:#fff;font-size:22px;font-weight:700;margin:0;">Appointment Confirmed</h1>
</div>
<div style="padding:32px;">
<p style="color:#64748b;margin-bottom:20px;">Dear <strong>${data.ownerName || "Pet Owner"}</strong>,</p>
<p style="color:#64748b;line-height:1.7;margin-bottom:20px;">Your appointment has been confirmed. Here are the details:</p>
<div style="background:#f0faf4;border-radius:10px;padding:20px;margin-bottom:24px;">
<table style="width:100%;border-collapse:collapse;">
<tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;">Patient</td><td style="padding:8px 0;font-weight:600;color:#1e293b;">${data.patientName}</td></tr>
<tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;">Type</td><td style="padding:8px 0;font-weight:600;color:#1e293b;">${data.appointmentType}</td></tr>
<tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;">Date</td><td style="padding:8px 0;font-weight:600;color:#1e293b;">${new Date(data.date + "T00:00:00").toLocaleDateString("en-GB", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</td></tr>
<tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;">Time</td><td style="padding:8px 0;font-weight:600;color:#1e293b;">${data.time}</td></tr>
</table>
</div>
<p style="color:#94a3b8;font-size:12px;text-align:center;">Please arrive 10 minutes early · Powered by <a href="https://vetsai.vet" style="color:#1a3d2b;">VetsAI</a></p>
</div>
</div>
</body></html>`;
    } else if (type === "contact") {
      subject = `New contact form message from ${data.name || "a visitor"}`;
      html = `<!DOCTYPE html><html><body style="margin:0;padding:0;font-family:system-ui,-apple-system,sans-serif;background:#f1f5f9;">
<div style="max-width:560px;margin:0 auto;background:#fff;">
<div style="background:linear-gradient(135deg,#1a3d2b,#3a8f5f);padding:32px;text-align:center;">
<div style="font-size:32px;margin-bottom:8px;">✉️</div>
<h1 style="color:#fff;font-size:22px;font-weight:700;margin:0;">New Contact Message</h1>
</div>
<div style="padding:32px;">
<table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
<tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;">Name</td><td style="padding:8px 0;font-weight:600;color:#1e293b;">${data.name || "—"}</td></tr>
<tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;">Email</td><td style="padding:8px 0;font-weight:600;color:#1e293b;">${data.email || "—"}</td></tr>
<tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;">Subject</td><td style="padding:8px 0;font-weight:600;color:#1e293b;">${data.subject || "—"}</td></tr>
</table>
<div style="background:#f0faf4;border-radius:10px;padding:20px;">
<p style="color:#1e293b;line-height:1.7;margin:0;white-space:pre-wrap;">${data.message || ""}</p>
</div>
</div>
</div>
</body></html>`;
    } else {
      return NextResponse.json({ error: "Unknown email type" }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    // From must be on a Resend-verified domain. Reply-to is a monitored inbox
    // (the templates invite replies). Both overridable via env.
    const { data: result, error } = await resend.emails.send({
      from: process.env.RESEND_FROM || "VetsAI <onboarding@vetsai.vet>",
      replyTo: process.env.RESEND_REPLY_TO || "jowelbeck@aol.com",
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: result?.id });
  } catch (err) {
    console.error("Email API error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
// Force redeploy
