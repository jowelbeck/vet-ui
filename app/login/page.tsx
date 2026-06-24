"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const email = emailRef.current?.value ?? "";
    const password = passwordRef.current?.value ?? "";

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/app");
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
        .card-title { font-size: 22px; font-weight: 700; color: #1a3d2b; margin-bottom: 6px; }
        .card-sub { font-size: 14px; color: #64748b; margin-bottom: 24px; }
        .field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
        .field label { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.4px; }
        .field input { padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; color: #1e293b; background: #f8fafc; outline: none; font-family: inherit; transition: border-color 0.15s; }
        .field input:focus { border-color: #1a3d2b; box-shadow: 0 0 0 3px rgba(26,61,43,0.1); background: #fff; }
        .btn-login { width: 100%; background: #1a3d2b; color: #fff; padding: 12px; border-radius: 8px; border: none; font-size: 15px; font-weight: 600; cursor: pointer; font-family: inherit; margin-top: 6px; transition: background 0.15s; }
        .btn-login:hover { background: #2d6b47; }
        .btn-login:disabled { opacity: 0.5; cursor: not-allowed; }
        .error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 14px; }
        .divider { text-align: center; font-size: 13px; color: #94a3b8; margin: 16px 0; }
        .link { color: #1a3d2b; font-weight: 600; text-decoration: none; }
        .link:hover { text-decoration: underline; }
      `}</style>

      <div className="page">
        <a href="/" className="logo">
          <img src="/vetsai-icon.svg" alt="VetsAI" width={40} height={40} style={{ borderRadius: "10px" }} />
          <span className="logo-text">VetsAI</span>
        </a>

        <div className="card">
          <div className="card-title">Welcome back</div>
          <div className="card-sub">Log in to your VetsAI clinic account.</div>

          {error && <div className="error">⚠ {error}</div>}

          <div className="field">
            <label>Email address</label>
            <input
              ref={emailRef}
              type="email"
              placeholder="you@clinic.com"
              autoComplete="email"
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              ref={passwordRef}
              type="password"
              placeholder="Your password"
              autoComplete="current-password"
            />
          </div>

          <button className="btn-login" onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in…" : "Log in →"}
          </button>

          <div className="divider">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="link">Start free trial</a>
          </div>

          <div style={{ textAlign: "center" }}>
            <a href="/demo" style={{ fontSize: 13, color: "#94a3b8", textDecoration: "none" }}>
              Try the demo first →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
