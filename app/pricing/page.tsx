"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { trackEvent } from "@/lib/analytics";

const PLANS = [
  {
    name: "Starter",
    price: "$49",
    ghs: "GHS 735",
    period: "/month",
    planCode: process.env.NEXT_PUBLIC_PAYSTACK_STARTER_PLAN!,
    features: [
      "1 vet account",
      "200 cases/month",
      "AI clinical support & triage",
      "Drug dosage guidance",
      "SOAP note drafts",
      "Printable reports",
      "Email support",
    ],
    highlight: false,
  },
  {
    name: "Professional",
    price: "$99",
    ghs: "GHS 1,485",
    period: "/month",
    planCode: process.env.NEXT_PUBLIC_PAYSTACK_PROFESSIONAL_PLAN!,
    features: [
      "3 vet accounts",
      "Unlimited cases",
      "AI clinical support & triage",
      "Drug dosage guidance",
      "SOAP note drafts",
      "Patient records",
      "Case history & export",
      "Priority support",
    ],
    highlight: true,
  },
  {
    name: "Clinic OS",
    price: "$199",
    ghs: "GHS 2,985",
    period: "/month",
    planCode: process.env.NEXT_PUBLIC_PAYSTACK_CLINIC_OS_PLAN!,
    features: [
      "10 vet accounts",
      "Unlimited cases",
      "Full clinic OS access",
      "Patient records",
      "Appointments",
      "Billing & invoicing",
      "Advanced analytics",
      "Dedicated support",
    ],
    highlight: false,
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setUserEmail(data.user.email);
      else router.push("/signup");
    });
  }, [router]);

  const handleSubscribe = (plan: typeof PLANS[0]) => {
    if (!userEmail) return;
    trackEvent("plan_selected", { plan: plan.name });
    setLoading(plan.name);

    const handler = (window as any).PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
      email: userEmail,
      plan: plan.planCode,
      currency: "GHS",
      callback: (response: any) => {
        if (response.status === "success") {
          router.push(`/app?subscribed=${plan.name.toLowerCase()}`);
        }
        setLoading(null);
      },
      onClose: () => setLoading(null),
    });
    handler.openIframe();
  };

  return (
    <>
      <script src="https://js.paystack.co/v1/inline.js" async />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, -apple-system, sans-serif; background: #f8fafc; color: #1e293b; }
        .page { min-height: 100vh; padding: 60px 20px; }
        .logo { display: flex; align-items: center; gap: 10px; text-decoration: none; justify-content: center; margin-bottom: 48px; }
        .logo-text { font-size: 22px; font-weight: 700; color: #1a3d2b; }
        .heading { text-align: center; margin-bottom: 48px; }
        .heading h1 { font-size: 36px; font-weight: 700; color: #1a3d2b; margin-bottom: 10px; }
        .heading p { font-size: 16px; color: #64748b; }
        .plans { display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; max-width: 1100px; margin: 0 auto; }
        .plan { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px; width: 320px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); position: relative; }
        .plan.highlight { background: #1a3d2b; border-color: #1a3d2b; }
        .popular { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #97bc62; color: #1a3d2b; font-size: 11px; font-weight: 700; padding: 4px 14px; border-radius: 20px; letter-spacing: 1px; white-space: nowrap; }
        .plan-name { font-size: 18px; font-weight: 700; color: #1a3d2b; margin-bottom: 8px; }
        .plan.highlight .plan-name { color: #97bc62; }
        .plan-price { font-size: 42px; font-weight: 700; color: #1e293b; margin-bottom: 4px; }
        .plan.highlight .plan-price { color: #fff; }
        .plan-ghs { font-size: 13px; color: #64748b; margin-bottom: 24px; }
        .plan.highlight .plan-ghs { color: #97bc62; }
        .features { list-style: none; margin-bottom: 28px; }
        .features li { padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #334155; display: flex; gap: 8px; }
        .plan.highlight .features li { border-color: #2d6b47; color: #d1fae5; }
        .features li::before { content: "✓"; color: #1a3d2b; font-weight: 700; flex-shrink: 0; }
        .plan.highlight .features li::before { color: #97bc62; }
        .btn { width: 100%; padding: 13px; border-radius: 10px; border: none; font-size: 15px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.15s; }
        .btn-dark { background: #1a3d2b; color: #fff; }
        .btn-dark:hover { background: #2d6b47; }
        .btn-light { background: #fff; color: #1a3d2b; }
        .btn-light:hover { background: #f0faf4; }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .trial-note { text-align: center; margin-top: 32px; font-size: 13px; color: #94a3b8; }
        .back { display: block; text-align: center; margin-bottom: 32px; color: #1a3d2b; font-size: 14px; font-weight: 600; text-decoration: none; }
        .back:hover { text-decoration: underline; }
      `}</style>

      <div className="page">
        <a href="/" className="logo">
          <img src="/vetsai-icon.svg" alt="VetsAI" width={40} height={40} style={{ borderRadius: "10px" }} />
          <span className="logo-text">VetsAI</span>
        </a>

        <a href="/app" className="back">← Back to my clinic</a>

        <div className="heading">
          <h1>Choose your plan</h1>
          <p>Start with First 10 clinics get 3 months free. No credit card required until your trial ends.</p>
        </div>

        <div className="plans">
          {PLANS.map((plan) => (
            <div key={plan.name} className={`plan ${plan.highlight ? "highlight" : ""}`}>
              {plan.highlight && <div className="popular">MOST POPULAR</div>}
              <div className="plan-name">{plan.name}</div>
              <div className="plan-price">{plan.price}</div>
              <div className="plan-ghs">{plan.ghs}/month · billed in GHS</div>
              <ul className="features">
                {plan.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <button
                className={`btn ${plan.highlight ? "btn-light" : "btn-dark"}`}
                onClick={() => handleSubscribe(plan)}
                disabled={loading === plan.name}
              >
                {loading === plan.name ? "Opening checkout…" : `Choose ${plan.name} →`}
              </button>
            </div>
          ))}
        </div>

        <div className="trial-note">
          First 10 clinics get 3 months completely free · Cancel anytime · Secure payments by Paystack
        </div>
      </div>
    </>
  );
}
