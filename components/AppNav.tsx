"use client";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const NAV_LINKS = [
  { href: "/app", label: "🧠 Cases" },
  { href: "/patients", label: "📁 Patients" },
  { href: "/appointments", label: "📅 Appts" },
  { href: "/pharmacy", label: "💊 Pharmacy" },
  { href: "/lab", label: "🔬 Lab" },
  { href: "/billing", label: "💳 Billing" },
  { href: "/analytics", label: "📊 Analytics" },
  { href: "/team", label: "👥 Team" },
  { href: "/qr", label: "📱 QR" },
];

export default function AppNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav style={{
      background: "#1a3d2b",
      padding: "0 16px",
      display: "flex",
      alignItems: "center",
      gap: 4,
      overflowX: "auto" as const,
      whiteSpace: "nowrap" as const,
      position: "sticky" as const,
      top: 0,
      zIndex: 100,
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    }}>
      <a href="/app" style={{ color: "#97bc62", fontWeight: 800, fontSize: 15, textDecoration: "none", padding: "12px 12px 12px 4px", flexShrink: 0 }}>
        🐾 VetsAI
      </a>
      <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.2)", margin: "0 4px", flexShrink: 0 }} />
      {NAV_LINKS.map(link => (
        
          key={link.href}
          href={link.href}
          style={{
            color: pathname === link.href ? "#97bc62" : "rgba(255,255,255,0.75)",
            textDecoration: "none",
            fontSize: 13,
            fontWeight: pathname === link.href ? 700 : 400,
            padding: "12px 10px",
            borderBottom: pathname === link.href ? "2px solid #97bc62" : "2px solid transparent",
            flexShrink: 0,
            transition: "color 0.15s",
          }}
        >
          {link.label}
        </a>
      ))}
      <div style={{ flex: 1 }} />
      <button
        onClick={handleLogout}
        style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12, flexShrink: 0 }}
      >
        Log out
      </button>
    </nav>
  );
}
