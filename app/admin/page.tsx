"use client";
import { useEffect, useState, useCallback } from "react";

type User = {
  id: string;
  email: string;
  product: string;
  deactivated: boolean;
  deactivation_reason: string | null;
  is_platform_admin: boolean;
  created_at: string;
};

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [search, setSearch] = useState("");
  const [product, setProduct] = useState("all");
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    if (res.status === 401 || res.status === 403) { setDenied(true); setLoading(false); return; }
    const data = await res.json();
    setUsers(data.users ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggle = async (u: User) => {
    const deactivate = !u.deactivated;
    let reason: string | null = null;
    if (deactivate) {
      reason = window.prompt(`Deactivate ${u.email}?\nOptional reason (shown internally):`, "") ?? null;
      if (reason === null) return; // cancelled
    } else if (!window.confirm(`Reactivate ${u.email}?`)) {
      return;
    }
    setBusy(u.id);
    const res = await fetch("/api/admin/deactivate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: u.id, deactivated: deactivate, reason }),
    });
    setBusy(null);
    if (!res.ok) { alert((await res.json()).error || "Failed"); return; }
    load();
  };

  const filtered = users.filter(u =>
    (product === "all" || u.product === product) &&
    (!search || (u.email || "").toLowerCase().includes(search.toLowerCase()))
  );

  if (denied) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif", background: "#f1f5f9" }}>
        <div style={{ textAlign: "center", color: "#64748b" }}>
          <div style={{ fontSize: 40 }}>🚫</div>
          <p style={{ fontWeight: 700, color: "#1a3d2b", marginTop: 8 }}>Not authorized</p>
          <p style={{ fontSize: 14 }}>This area is for platform administrators only.</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui, sans-serif", padding: "32px 24px" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a3d2b", marginBottom: 4 }}>Command Center</h1>
        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>Manage user accounts across VetsAI and HealthPost.</p>

        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <input placeholder="Search by email…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 220, padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14 }} />
          <select value={product} onChange={e => setProduct(e.target.value)}
            style={{ padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14 }}>
            <option value="all">All products</option>
            <option value="vetsai">VetsAI</option>
            <option value="healthpost">HealthPost</option>
          </select>
        </div>

        {loading ? <p style={{ color: "#64748b" }}>Loading…</p> : (
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#f8fafc", textAlign: "left", color: "#94a3b8", fontSize: 12, textTransform: "uppercase" }}>
                  <th style={{ padding: "12px 16px" }}>Email</th>
                  <th style={{ padding: "12px 16px" }}>Product</th>
                  <th style={{ padding: "12px 16px" }}>Status</th>
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px 16px", color: "#1e293b" }}>
                      {u.email} {u.is_platform_admin && <span style={{ fontSize: 11, color: "#1a3d2b", background: "#f0faf4", padding: "1px 6px", borderRadius: 4, marginLeft: 6 }}>admin</span>}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#64748b" }}>{u.product}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: 12, fontWeight: 600, padding: "2px 10px", borderRadius: 20, background: u.deactivated ? "#fef2f2" : "#f0faf4", color: u.deactivated ? "#dc2626" : "#1a3d2b" }}>
                        {u.deactivated ? "Deactivated" : "Active"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <button onClick={() => toggle(u)} disabled={busy === u.id}
                        style={{ padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13,
                          background: u.deactivated ? "#1a3d2b" : "#fef2f2", color: u.deactivated ? "#fff" : "#dc2626" }}>
                        {busy === u.id ? "…" : u.deactivated ? "Reactivate" : "Deactivate"}
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={4} style={{ padding: 24, textAlign: "center", color: "#94a3b8" }}>No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
