"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "What is VetsAI?",
    a: "VetsAI is a clinic operating system for veterinary professionals across Africa — combining AI-powered clinical decision support, patient records, pharmacy management, billing, appointments, and WOAH-aligned disease reporting in one platform. It works for pets, poultry, and livestock practices from a single interface.",
  },
  {
    q: "Is the free trial really free?",
    a: "Yes. New clinics get first 10 clinics — 3 months free on the Starter plan, no credit card required. You can cancel anytime during or after the trial with no obligation.",
  },
  {
    q: "What species does VetsAI support?",
    a: "Pets (dogs, cats, and other companion animals), poultry (chickens, layers, broilers, and other birds), and livestock (cattle, goats, sheep, pigs, and more). Choose your practice type when you sign up.",
  },
  {
    q: "How accurate is the AI clinical support?",
    a: "VetsAI's differential diagnoses and treatment guidance are grounded in the gold standard scientific veterinary research and a curated veterinary knowledge base. That said, VetsAI is a clinical decision-support tool, not a replacement for professional veterinary judgment — the attending veterinarian is always responsible for the final diagnosis and treatment decision.",
  },
  {
    q: "What is WOAH-aligned disease reporting?",
    a: "When a case matches a WOAH (World Organisation for Animal Health) notifiable disease, VetsAI flags it clearly and lets you generate a structured disease report — including GPS location, species, and timing — for submission to your national veterinary authority.",
  },
  {
    q: "Is my clinic's data secure?",
    a: "Yes. Data is encrypted in transit and at rest, access is scoped per user and clinic, and only authorized team members can see your patient records. We do not sell or share your data with third parties.",
  },
  {
    q: "Which countries and languages does VetsAI support?",
    a: "VetsAI works for veterinary professionals in any country — the platform isn't restricted to a fixed list. It's currently available in English and French, with more languages planned.",
  },
  {
    q: "How do I add team members to my clinic?",
    a: "Go to the Team page inside the app, enter your colleague's email and role, and send an invite. They'll be added as soon as they accept.",
  },
  {
    q: "Can I use VetsAI on my phone?",
    a: "Yes — VetsAI works in any modern mobile browser, no app install required. Features like GPS-tagged case reporting work directly from your phone's browser.",
  },
  {
    q: "How do I cancel or change my plan?",
    a: "Go to Billing inside the app to upgrade, downgrade, or cancel at any time. If you need help, contact us and we'll take care of it.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, -apple-system, sans-serif; background: #f1f5f9; color: #1e293b; }
      `}</style>
      <div style={{ minHeight: "100vh", padding: "60px 24px", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 720 }}>
          <a href="/" style={{ fontSize: 13, color: "#64748b", textDecoration: "none", marginBottom: 24, display: "inline-block" }}>← Back to VetsAI</a>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1a3d2b", marginBottom: 8 }}>Frequently asked questions</h1>
          <p style={{ fontSize: 15, color: "#64748b", marginBottom: 32 }}>
            Can't find what you're looking for? <a href="/contact" style={{ color: "#1a3d2b" }}>Contact us</a> directly.
          </p>

          {FAQS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, marginBottom: 10, overflow: "hidden" }}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  style={{ width: "100%", textAlign: "left", padding: "16px 20px", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}
                >
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#1e293b" }}>{item.q}</span>
                  <span style={{ fontSize: 18, color: "#94a3b8", flexShrink: 0 }}>{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div style={{ padding: "0 20px 18px", fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
