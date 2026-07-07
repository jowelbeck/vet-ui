"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DemoLogin() {
  const router = useRouter();

  useEffect(() => {
    const login = async () => {
      await supabase.auth.signOut();
      const { error } = await supabase.auth.signInWithPassword({
        email: "demo@vetsai.vet",
        password: "VetsAIDemo2026",
      });
      if (error) {
        router.push("/signup");
      } else {
        router.push("/app");
      }
    };
    login();
  }, []);

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#1a3d2b", flexDirection: "column", gap: 20 }}>
      <div style={{ width: 56, height: 56, background: "rgba(255,255,255,0.1)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>🐾</div>
      <p style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>Loading VetsAI Demo...</p>
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Preparing your demo environment</p>
    </main>
  );
}
