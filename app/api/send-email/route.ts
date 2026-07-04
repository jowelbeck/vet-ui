import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

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
function invoiceEmail(patientName: string, ownerName: string, amount: string, currency: string, services: any[]) {
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

  // Day 3 check-in
  if (type === "day3") {
    subject = "How is your first week with VetsAI going? 🐾";
    html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#1a3d2b,#2d6a4f);padding:40px;text-align:center">
        <h1 style="color:#fff;font-size:24px;font-weight:800;margin:0">Checking in 👋</h1>
      </div>
      <div style="padding:40px">
        <p style="color:#374151;font-size:16px;line-height:1.7">Hi ${name},</p>
        <p style="color:#374151;font-size:16px;line-height:1.7">It has been 3 days since you joined VetsAI. Have you tried the <strong>AI clinical support</strong>? Go to Cases → New Case and describe your patient's symptoms to get instant SOAP notes and drug dosages.</p>
        <div style="text-align:center;margin:32px 0">
          <a href="https://vetsai.vet/app" style="background:#1a3d2b;color:#fff;padding:16px 40px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px">Try AI clinical support →</a>
        </div>
        <p style="color:#374151;font-size:15px">Joseph<br/><span style="color:#64748b">VetsAI Technologies</span></p>
      </div>
    </div>`;
  }

  // Day 7 pharmacy
  if (type === "day7") {
    subject = "Your pharmacy is losing money — here is how to stop it 💊";
    html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#1a3d2b,#2d6a4f);padding:40px;text-align:center">
        <h1 style="color:#fff;font-size:24px;font-weight:800;margin:0">Pharmacy tip 💊</h1>
      </div>
      <div style="padding:40px">
        <p style="color:#374151;font-size:16px;line-height:1.7">Hi ${name},</p>
        <p style="color:#374151;font-size:16px;line-height:1.7">Most vet clinics lose 15-20% of pharmacy revenue to expired drugs and untracked dispensing. VetsAI fixes this — track stock, expiry dates, supplier invoices and total stock value by practice type.</p>
        <div style="text-align:center;margin:32px 0">
          <a href="https://vetsai.vet/pharmacy" style="background:#1a3d2b;color:#fff;padding:16px 40px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px">Set up pharmacy →</a>
        </div>
        <p style="color:#374151;font-size:15px">Joseph<br/><span style="color:#64748b">VetsAI Technologies</span></p>
      </div>
    </div>`;
  }

  // Day 14 checklist
  if (type === "day14") {
    subject = "Are you getting the most out of VetsAI? 📊";
    html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#1a3d2b,#2d6a4f);padding:40px;text-align:center">
        <h1 style="color:#fff;font-size:24px;font-weight:800;margin:0">2 weeks in 📊</h1>
      </div>
      <div style="padding:40px">
        <p style="color:#374151;font-size:16px;line-height:1.7">Hi ${name},</p>
        <p style="color:#374151;font-size:16px;line-height:1.7">You have been using VetsAI for 2 weeks. Quick checklist: ☐ Added patients ☐ Set up pharmacy ☐ Used AI support ☐ Created an invoice ☐ Added team members ☐ Checked analytics. Reply if you need help with any of these.</p>
        <div style="text-align:center;margin:32px 0">
          <a href="https://vetsai.vet/app" style="background:#1a3d2b;color:#fff;padding:16px 40px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px">Open VetsAI →</a>
        </div>
        <p style="color:#374151;font-size:15px">Joseph<br/><span style="color:#64748b">VetsAI Technologies</span></p>
      </div>
    </div>`;
  }

  // Day 30 upgrade
  if (type === "day30") {
    subject = "Your free trial is ending — upgrade to keep your data 🔒";
    html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#1a3d2b,#2d6a4f);padding:40px;text-align:center">
        <h1 style="color:#fff;font-size:24px;font-weight:800;margin:0">Trial ending soon 🔒</h1>
      </div>
      <div style="padding:40px">
        <p style="color:#374151;font-size:16px;line-height:1.7">Hi ${name},</p>
        <p style="color:#374151;font-size:16px;line-height:1.7">Your VetsAI free trial is coming to an end. Upgrade now to keep your patient records, cases, pharmacy data and invoices.</p>
        <div style="background:#f0fdf4;border-radius:12px;padding:24px;margin:24px 0;border:1px solid #86efac">
          <p style="color:#1a3d2b;font-weight:700;margin:0 0 8px;font-size:18px">VetsAI Clinic — GHS 299/month</p>
          <p style="color:#374151;font-size:14px;margin:0">Unlimited patients · AI support · Pharmacy · Billing · Analytics · 5 team members</p>
        </div>
        <div style="text-align:center;margin:32px 0">
          <a href="https://vetsai.vet/pricing" style="background:#1a3d2b;color:#fff;padding:16px 40px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px">Upgrade now →</a>
        </div>
        <p style="color:#374151;font-size:15px">Joseph<br/><span style="color:#64748b">VetsAI Technologies · +233 20 8140795</span></p>
      </div>
    </div>`;
  }

  // Demo follow-up 1
  if (type === "demo_followup1") {
    subject = "Your VetsAI demo — here is what to expect 🐾";
    html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#1a3d2b,#2d6a4f);padding:40px;text-align:center">
        <h1 style="color:#fff;font-size:24px;font-weight:800;margin:0">Demo request received 🐾</h1>
      </div>
      <div style="padding:40px">
        <p style="color:#374151;font-size:16px;line-height:1.7">Hi ${name},</p>
        <p style="color:#374151;font-size:16px;line-height:1.7">Thank you for requesting a VetsAI demo. I will personally reach out within 24 hours to schedule a time that works for you.</p>
        <p style="color:#374151;font-size:16px;line-height:1.7">You can also <a href="https://vetsai.vet/signup" style="color:#1a3d2b;font-weight:700">start your free trial right now</a> — no credit card required.</p>
        <p style="color:#374151;font-size:15px">Joseph Okai Welbeck<br/><span style="color:#64748b">Founder, VetsAI Technologies · +233 20 8140795</span></p>
      </div>
    </div>`;
  }

  // Demo follow-up 2
  if (type === "demo_followup2") {
    subject = "Following up on your VetsAI demo request";
    html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#1a3d2b,#2d6a4f);padding:40px;text-align:center">
        <h1 style="color:#fff;font-size:24px;font-weight:800;margin:0">Following up 👋</h1>
      </div>
      <div style="padding:40px">
        <p style="color:#374151;font-size:16px;line-height:1.7">Hi ${name},</p>
        <p style="color:#374151;font-size:16px;line-height:1.7">I wanted to follow up on your demo request. Did you get a chance to review VetsAI? I am available for a 20-minute call this week — just reply with a time that works.</p>
        <div style="text-align:center;margin:32px 0">
          <a href="https://vetsai.vet/signup" style="background:#1a3d2b;color:#fff;padding:16px 40px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px">Start free trial →</a>
        </div>
        <p style="color:#374151;font-size:15px">Joseph<br/><span style="color:#64748b">VetsAI Technologies · +233 20 8140795</span></p>
      </div>
    </div>`;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await req.json();
    const { type, to, data } = body;

    if (!type || !to) {
      return NextResponse.json({ error: "Missing type or to field" }, { status: 400 });
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
    } else {
      return NextResponse.json({ error: "Unknown email type" }, { status: 400 });
    }

    const { data: result, error } = await resend.emails.send({
      from: "VetsAI <onboarding@resend.dev>",
      replyTo: to,
      to: "jowelbeck@aol.com", // Resend free plan - only verified email
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
