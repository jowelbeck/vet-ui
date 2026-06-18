import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
    } else if (type === "invoice") {
      subject = `Invoice for ${data.patientName} — ${data.currency} ${data.amount}`;
      html = invoiceEmail(data.patientName, data.ownerName, data.amount, data.currency, data.services);
    } else {
      return NextResponse.json({ error: "Unknown email type" }, { status: 400 });
    }

    const { data: result, error } = await resend.emails.send({
      from: "VetsAI <onboarding@resend.dev>",
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