"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignup = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) { setError(error.message); setLoading(false); return; }

    fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "welcome",
        to: email.trim(),
        data: { clinicName: "your clinic" }
      })
    }).catch(console.error);

    setSuccess(true);
    setTimeout(() => router.push("/onboarding"), 2000);
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/onboarding`,
      },
    });
    if (error) { setError(error.message); setGoogleLoading(false); }
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, -apple-system, sans-serif; background: #f1f5f9; color: #1e293b; }
        .page { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; }
        .logo { display: flex; align-items: center; gap: 10px; text-decoration: none; margin-bottom: 32px; }
        .logo-mark { width: 40px; height: 40px; background: #1a3d2b; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
        .logo-text { font-size: 20px; font-weight: 700; color: #1a3d2b; }
        .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 32px; width: 100%; max-width: 420px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
        .free-badge { background: #f0faf4; border: 1px solid #d4f0e0; color: #1a3d2b; font-size: 12px; font-weight: 600; padding: 6px 14px; border-radius: 20px; display: inline-block; margin-bottom: 20px; text-align: center; width: 100%; }
        .card-title { font-size: 22px; font-weight: 700; color: #1a3d2b; margin-bottom: 6px; }
        .card-sub { font-size: 14px; color: #64748b; margin-bottom: 24px; }
        .btn-google { width: 100%; background: #fff; color: #334155; padding: 11px; border-radius: 8px; border: 1.5px solid #e2e8f0; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.15s; margin-bottom: 16px; }
        .btn-google:hover { background: #f8fafc; border-color: #cbd5e1; }
        .btn-google:disabled { opacity: 0.5; cursor: not-allowed; }
        .divider { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .divider-line { flex: 1; height: 1px; background: #e2e8f0; }
        .divider-text { font-size: 12px; color: #94a3b8; white-space: nowrap; }
        .field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
        .field label { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.4px; }
        .field input { padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; color: #1e293b; background: #f8fafc; outline: none; font-family: inherit; transition: border-color 0.15s; }
        .field input:focus { border-color: #1a3d2b; box-shadow: 0 0 0 3px rgba(26,61,43,0.1); background: #fff; }
        .btn-signup { width: 100%; background: #1a3d2b; color: #fff; padding: 12px; border-radius: 8px; border: none; font-size: 15px; font-weight: 600; cursor: pointer; font-family: inherit; margin-top: 6px; transition: background 0.15s; }
        .btn-signup:hover { background: #2d6b47; }
        .btn-signup:disabled { opacity: 0.5; cursor: not-allowed; }
        .error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 14px; }
        .success { background: #f0faf4; border: 1px solid #d4f0e0; color: #1a3d2b; padding: 16px; border-radius: 8px; font-size: 14px; text-align: center; }
        .success h3 { font-size: 16px; font-weight: 700; margin-bottom: 6px; }
        .footer-links { text-align: center; margin-top: 16px; font-size: 13px; color: #94a3b8; }
        .link { color: #1a3d2b; font-weight: 600; text-decoration: none; }
        .trust-row { display: flex; gap: 16px; justify-content: center; margin-top: 20px; flex-wrap: wrap; }
        .trust-item { font-size: 12px; color: #94a3b8; display: flex; align-items: center; gap: 4px; }
      `}</style>

      <div className="page">
        <a href="/" className="logo">
          <img src="/vetsai-icon.svg" alt="VetsAI" width={40} height={40} style={{ borderRadius: "10px" }} />
          <span className="logo-text">VetsAI</span>
        </a>

        <div className="card">
          <div className="free-badge">🎉 3 months free — no credit card required</div>
          <div className="card-title">Start your free trial</div>
          <div className="card-sub">Join veterinary professionals using VetsAI worldwide.</div>

          {success ? (
            <div className="success">
              <h3>✓ Account created!</h3>
              <p>Taking you to your clinic setup…</p>
            </div>
          ) : (
            <>
              {error && <div className="error">⚠ {error}</div>}

              <button className="btn-google" onClick={handleGoogleLogin} disabled={googleLoading}>
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {googleLoading ? "Connecting…" : "Continue with Google"}
              </button>

              <div className="divider">
                <div className="divider-line" />
                <span className="divider-text">or sign up with email</span>
                <div className="divider-line" />
              </div>

              <div className="field">
                <label>Email address</label>
                <input
                  type="email"
                  placeholder="you@clinic.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                />
              </div>

              <div className="field">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                />
              </div>

              <button className="btn-signup" onClick={handleSignup} disabled={loading}>
                {loading ? "Creating account…" : "Start free trial →"}
              </button>

              <div className="footer-links">
                Already have an account?{" "}
                <a href="/login" className="link">Log in</a>
                {" · "}
                <a href="/demo" className="link">Try demo first</a>
              </div>
            </>
          )}
        </div>

        <div className="trust-row">
          <span className="trust-item">✓ No credit card</span>
          <span className="trust-item">✓ 3 months free</span>
          <span className="trust-item">✓ Cancel anytime</span>
          <span className="trust-item">✓ Gold standard research</span>
        </div>
      </div>
    </>
  );
}