"use client";
import AppNav from "@/components/AppNav";

import { useState, useRef } from "react";
import QRCode from "react-qr-code";

const QR_LINKS = [
  { label: "Landing page", url: "https://vetsai.vet", desc: "Share with anyone to discover VetsAI", icon: "🌍" },
  { label: "Free trial signup", url: "https://vetsai.vet/signup", desc: "Direct link to start a free trial", icon: "🚀" },
  { label: "Live demo", url: "https://vetsai.vet/demo", desc: "Try VetsAI without signing up", icon: "🎬" },
  { label: "Login", url: "https://vetsai.vet/login", desc: "For existing clinic users", icon: "🔑" },
];

export default function QRPage() {
  const [selected, setSelected] = useState(QR_LINKS[0]);
  const [customUrl, setCustomUrl] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const activeUrl = showCustom && customUrl.trim() ? customUrl.trim() : selected.url;

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      if (!ctx) return;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 400, 400);
      ctx.drawImage(img, 0, 0, 400, 400);
      const link = document.createElement("a");
      link.download = `vetsai-qr-${selected.label.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const printQR = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html>
<html>
<head><title>VetsAI QR Code</title>
<style>
  body { font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 40px; background: #fff; }
  .container { text-align: center; max-width: 400px; }
  .logo { font-size: 32px; margin-bottom: 8px; }
  .title { font-size: 24px; font-weight: 700; color: #1a3d2b; margin-bottom: 4px; }
  .subtitle { font-size: 14px; color: #64748b; margin-bottom: 24px; }
  .qr-wrap { border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 20px; display: inline-block; }
  .url { font-size: 13px; color: #1a3d2b; font-weight: 600; margin-bottom: 8px; }
  .desc { font-size: 12px; color: #94a3b8; }
  .tagline { font-size: 13px; color: #64748b; margin-top: 20px; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
<div class="container">
  <div class="logo">🐾</div>
  <div class="title">VetsAI</div>
  <div class="subtitle">AI-powered clinic operating system</div>
  <div class="qr-wrap">${svgData}</div>
  <div class="url">${activeUrl}</div>
  <div class="desc">${showCustom ? "Custom link" : selected.desc}</div>
  <div class="tagline">Scan to ${selected.label === "Free trial signup" ? "start your free trial" : "visit VetsAI"}</div>
</div>
</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  };

  return (
    <>
      <AppNav />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, -apple-system, sans-serif; background: #f1f5f9; color: #1e293b; font-size: 14px; }
        .app-header { background: #fff; border-bottom: 1px solid #e2e8f0; padding: 0 20px; display: flex; align-items: center; justify-content: space-between; height: 56px; position: sticky; top: 0; z-index: 50; }
        .app-logo { display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 700; color: #1a3d2b; text-decoration: none; }
        .app-logo-mark { width: 30px; height: 30px; background: #1a3d2b; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 15px; }
        .nav-link { font-size: 13px; font-weight: 500; color: #64748b; text-decoration: none; padding: 5px 10px; border-radius: 6px; }
        .nav-link:hover { background: #f1f5f9; color: #1e293b; }
        .page-body { max-width: 760px; margin: 0 auto; padding: 24px 16px 48px; }
        .page-title { font-size: 20px; font-weight: 700; color: #1a3d2b; margin-bottom: 4px; }
        .page-sub { font-size: 14px; color: #64748b; margin-bottom: 24px; }
        .layout { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; }
        .card-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; margin-bottom: 14px; }
        .link-option { display: flex; align-items: center; gap: 10px; padding: 12px; border-radius: 8px; border: 1.5px solid #e2e8f0; cursor: pointer; margin-bottom: 8px; transition: all 0.15s; }
        .link-option:hover { border-color: #1a3d2b; background: #f0faf4; }
        .link-option.active { border-color: #1a3d2b; background: #f0faf4; }
        .link-icon { font-size: 20px; flex-shrink: 0; }
        .link-label { font-size: 13px; font-weight: 600; color: #1e293b; }
        .link-desc { font-size: 12px; color: #94a3b8; margin-top: 2px; }
        .custom-section { margin-top: 12px; }
        .custom-toggle { font-size: 13px; color: #1a3d2b; font-weight: 600; cursor: pointer; background: none; border: none; font-family: inherit; padding: 0; }
        .custom-input { width: 100%; padding: 9px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 13px; margin-top: 8px; outline: none; font-family: inherit; }
        .custom-input:focus { border-color: #1a3d2b; }
        .qr-display { display: flex; flex-direction: column; align-items: center; }
        .qr-wrap { background: #fff; border: 2px solid #e2e8f0; border-radius: 14px; padding: 24px; margin-bottom: 16px; }
        .qr-url { font-size: 12px; color: #1a3d2b; font-weight: 600; text-align: center; margin-bottom: 4px; word-break: break-all; }
        .qr-desc { font-size: 12px; color: #94a3b8; text-align: center; margin-bottom: 16px; }
        .qr-actions { display: flex; gap: 8px; width: 100%; }
        .btn-download { flex: 1; background: #1a3d2b; color: #fff; padding: 10px; border-radius: 8px; border: none; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
        .btn-print { flex: 1; background: #fff; color: #1a3d2b; padding: 10px; border-radius: 8px; border: 1.5px solid #1a3d2b; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
        .use-cases { margin-top: 20px; }
        .use-case { display: flex; align-items: flex-start; gap: 10px; padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
        .use-case:last-child { border-bottom: none; }
        .use-case-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
        .use-case-title { font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 2px; }
        .use-case-desc { font-size: 12px; color: #94a3b8; }
        @media (max-width: 600px) { .layout { grid-template-columns: 1fr; } }
      `}</style>

      <div className="app-header">
        <a href="/app" className="app-logo">
          <img src="/vetsai-icon.svg" alt="VetsAI" width={30} height={30} style={{ borderRadius: "7px" }} />
          VetsAI
        </a>
        <div style={{ display: "flex", gap: 8 }}>
          <a href="/app" className="nav-link">← Back to app</a>
        </div>
      </div>

      <div className="page-body">
        <div className="page-title">📱 QR Codes</div>
        <div className="page-sub">Generate and download QR codes to share VetsAI with clinics, at events, or on printed materials.</div>

        <div className="layout">
          {/* Left — link selector */}
          <div>
            <div className="card">
              <div className="card-title">Choose a link</div>
              {QR_LINKS.map(link => (
                <div
                  key={link.url}
                  className={`link-option ${!showCustom && selected.url === link.url ? "active" : ""}`}
                  onClick={() => { setSelected(link); setShowCustom(false); }}
                >
                  <span className="link-icon">{link.icon}</span>
                  <div>
                    <div className="link-label">{link.label}</div>
                    <div className="link-desc">{link.desc}</div>
                  </div>
                </div>
              ))}

              <div className="custom-section">
                <button className="custom-toggle" onClick={() => setShowCustom(!showCustom)}>
                  {showCustom ? "✕ Cancel custom URL" : "+ Custom URL"}
                </button>
                {showCustom && (
                  <input
                    className="custom-input"
                    placeholder="https://vetsai.vet/..."
                    value={customUrl}
                    onChange={e => setCustomUrl(e.target.value)}
                  />
                )}
              </div>
            </div>

            <div className="card" style={{ marginTop: 16 }}>
              <div className="card-title">Where to use QR codes</div>
              {[
                { icon: "🧾", title: "Printed invoices", desc: "Add to invoices so owners can scan and view their pet's records" },
                { icon: "🏥", title: "Clinic reception", desc: "Print and display in waiting room for walk-in signups" },
                { icon: "💼", title: "Business cards", desc: "Add to your card for quick access at meetings and events" },
                { icon: "📧", title: "Email signature", desc: "Add to your email signature for passive promotion" },
                { icon: "📱", title: "WhatsApp & LinkedIn", desc: "Share the QR image directly in posts and messages" },
              ].map(u => (
                <div className="use-case" key={u.title}>
                  <span className="use-case-icon">{u.icon}</span>
                  <div>
                    <div className="use-case-title">{u.title}</div>
                    <div className="use-case-desc">{u.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — QR display */}
          <div className="card qr-display">
            <div className="card-title" style={{ textAlign: "center", width: "100%" }}>Your QR code</div>
            <div className="qr-wrap" ref={qrRef}>
              <QRCode
                value={activeUrl}
                size={220}
                fgColor="#1a3d2b"
                bgColor="#ffffff"
              />
            </div>
            <a href={activeUrl} target="_blank" rel="noopener noreferrer" className="qr-url" style={{ textDecoration: "none" }}>{activeUrl} ↗</a>
            <div className="qr-desc">{showCustom ? "Custom link" : selected.desc}</div>
            <div className="qr-actions">
              <button className="btn-download" onClick={downloadQR}>⬇ Download PNG</button>
              <button className="btn-print" onClick={printQR}>🖨 Print</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}