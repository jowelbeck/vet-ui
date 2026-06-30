"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Stats = {
  totalPatients: number;
  totalInvoices: number;
  totalRevenue: number;
  outstandingRevenue: number;
  totalCases: number;
  highCases: number;
  mediumCases: number;
  lowCases: number;
};

type AnimalCount = { animal: string; count: number };
type RecentCase = { id: number; animal: string; symptoms: string; urgency: string; createdAt: string };

function animalEmoji(a?: string) {
  const m: Record<string, string> = { dog: "🐕", cat: "🐈", rabbit: "🐇", horse: "🐴", bird: "🐦", goat: "🐐", cow: "🐄" };
  return m[a?.toLowerCase() ?? ""] ?? "🐾";
}

function urgencyColor(u?: string) {
  if (u === "high") return { bg: "#fee2e2", color: "#dc2626" };
  if (u === "medium") return { bg: "#fef3c7", color: "#d97706" };
  return { bg: "#d4f0e0", color: "#1a3d2b" };
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalPatients: 0, totalInvoices: 0, totalRevenue: 0,
    outstandingRevenue: 0, totalCases: 0, highCases: 0, mediumCases: 0, lowCases: 0,
  });
  const [animalCounts, setAnimalCounts] = useState<AnimalCount[]>([]);
  const [recentCases, setRecentCases] = useState<RecentCase[]>([]);
  const [clinicName, setClinicName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const checkAuthAndLoad = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { getCurrentUserRole, hasAccess } = await import("@/lib/roleCheck");
    const role = await getCurrentUserRole();
    if (!hasAccess("analytics", role)) {
      router.push("/app");
      return;
    }

    const { data: clinic } = await supabase.from("clinics").select("name").eq("user_id", user.id).maybeSingle();
    if (clinic) setClinicName(clinic.name);

    await loadStats(user.id);
    setLoading(false);
  };

  const loadStats = async (userId: string) => {
    // Patients
    const { count: patientCount } = await supabase.from("patients").select("*", { count: "exact", head: true });

    // Invoices
    const { data: invoices } = await supabase.from("invoices").select("total, status");
    const totalInvoices = invoices?.length ?? 0;
    const totalRevenue = invoices?.filter(i => i.status === "paid").reduce((s, i) => s + i.total, 0) ?? 0;
    const outstandingRevenue = invoices?.filter(i => i.status === "unpaid").reduce((s, i) => s + i.total, 0) ?? 0;

    // Cases from Supabase
    const { data: casesData } = await supabase.from("cases").select("*").order("created_at", { ascending: false });
    const cases = casesData ?? [];
    const totalCases = cases.length;
    const highCases = cases.filter((c: any) => c.urgency === "high").length;
    const mediumCases = cases.filter((c: any) => c.urgency === "medium").length;
    const lowCases = cases.filter((c: any) => c.urgency === "low").length;

    // Animal counts from cases
    const animalMap: Record<string, number> = {};
    cases.forEach((c: any) => {
      const a = c.animal?.toLowerCase() ?? "unknown";
      animalMap[a] = (animalMap[a] ?? 0) + 1;
    });
    const animalCountsArr = Object.entries(animalMap)
      .map(([animal, count]) => ({ animal, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Recent cases
    const recent = cases.slice(0, 5).map((c: any) => ({
      id: c.id,
      animal: c.animal,
      symptoms: c.symptoms,
      urgency: c.urgency,
      createdAt: c.createdAt,
    }));

    setStats({ totalPatients: patientCount ?? 0, totalInvoices, totalRevenue, outstandingRevenue, totalCases, highCases, mediumCases, lowCases });
    setAnimalCounts(animalCountsArr);
    setRecentCases(recent);
  };

  const maxAnimalCount = Math.max(...animalCounts.map(a => a.count), 1);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, -apple-system, sans-serif; background: #f1f5f9; color: #1e293b; font-size: 14px; }
        .app-header { background: #fff; border-bottom: 1px solid #e2e8f0; padding: 0 20px; display: flex; align-items: center; justify-content: space-between; height: 56px; position: sticky; top: 0; z-index: 50; }
        .app-logo { display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 700; color: #1a3d2b; text-decoration: none; }
        .app-logo-mark { width: 30px; height: 30px; background: #1a3d2b; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 15px; }
        .nav-links { display: flex; align-items: center; gap: 12px; }
        .nav-link { font-size: 13px; font-weight: 500; color: #64748b; text-decoration: none; padding: 5px 10px; border-radius: 6px; transition: all 0.15s; }
        .nav-link:hover { background: #f1f5f9; color: #1e293b; }
        .nav-link.active { background: #f0faf4; color: #1a3d2b; font-weight: 600; }
        .btn-logout { font-size: 12px; padding: 6px 12px; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 6px; cursor: pointer; color: #64748b; font-family: inherit; }
        .page-body { max-width: 860px; margin: 0 auto; padding: 24px 16px 48px; }
        .page-header { margin-bottom: 24px; }
        .page-title { font-size: 20px; font-weight: 700; color: #1a3d2b; margin-bottom: 4px; }
        .page-sub { font-size: 14px; color: #64748b; }

        /* Stats grid */
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
        .stat-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; }
        .stat-icon { font-size: 20px; margin-bottom: 8px; }
        .stat-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; margin-bottom: 6px; }
        .stat-value { font-size: 24px; font-weight: 700; color: #1e293b; letter-spacing: -0.5px; }
        .stat-card.green .stat-value { color: #1a3d2b; }
        .stat-card.amber .stat-value { color: #d97706; }
        .stat-card.red .stat-value { color: #dc2626; }

        /* Two column grid */
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; }
        .card-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; margin-bottom: 16px; }

        /* Urgency bars */
        .urgency-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
        .urgency-label { font-size: 12px; font-weight: 600; width: 60px; flex-shrink: 0; }
        .urgency-bar-wrap { flex: 1; background: #f1f5f9; border-radius: 4px; height: 8px; overflow: hidden; }
        .urgency-bar { height: 100%; border-radius: 4px; transition: width 0.5s; }
        .urgency-count { font-size: 12px; font-weight: 600; color: #64748b; width: 24px; text-align: right; flex-shrink: 0; }

        /* Animal bars */
        .animal-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .animal-label { font-size: 13px; width: 80px; flex-shrink: 0; display: flex; align-items: center; gap: 6px; }
        .animal-bar-wrap { flex: 1; background: #f1f5f9; border-radius: 4px; height: 8px; overflow: hidden; }
        .animal-bar { height: 100%; border-radius: 4px; background: #1a3d2b; transition: width 0.5s; }
        .animal-count { font-size: 12px; font-weight: 600; color: #64748b; width: 24px; text-align: right; flex-shrink: 0; }

        /* Revenue */
        .revenue-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
        .revenue-row:last-child { border-bottom: none; }
        .revenue-label { font-size: 13px; color: #64748b; display: flex; align-items: center; gap: 8px; }
        .revenue-amount { font-size: 15px; font-weight: 700; }

        /* Recent cases */
        .case-row { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
        .case-row:last-child { border-bottom: none; }
        .case-avatar { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }
        .case-info { flex: 1; min-width: 0; }
        .case-animal { font-size: 13px; font-weight: 600; color: #1e293b; }
        .case-symptoms { font-size: 12px; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .urgency-pill { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 20px; flex-shrink: 0; }

        .empty { text-align: center; padding: 24px; color: #94a3b8; font-size: 13px; }

        @media (max-width: 600px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .two-col { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="app-header">
        <a href="/app" className="app-logo">
          <img src="/vetsai-icon.svg" alt="VetsAI" width={30} height={30} style={{ borderRadius: "7px" }} />
          VetsAI
        </a>
        <div className="nav-links">
          <a href="/app" className="nav-link">New case</a>
          <a href="/patients" className="nav-link">Patients</a>
          <a href="/team" className="nav-link">Team</a>
          <a href="/billing" className="nav-link">Billing</a>
          <a href="/analytics" className="nav-link active">Analytics</a>
          <button className="btn-logout" onClick={async () => { await supabase.auth.signOut(); window.location.href = "/login"; }}>Log out</button>
        </div>
      </div>

      <div className="page-body">
        <div className="page-header">
          <div className="page-title">📊 Analytics dashboard</div>
          <div className="page-sub">{clinicName || "Your clinic"} · Performance overview</div>
        </div>

        {loading ? (
          <div className="empty">Loading your clinic data…</div>
        ) : (
          <>
            {/* Key stats */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🐾</div>
                <div className="stat-label">Total patients</div>
                <div className="stat-value">{stats.totalPatients}</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🧠</div>
                <div className="stat-label">Cases analyzed</div>
                <div className="stat-value">{stats.totalCases}</div>
              </div>
              <div className="stat-card green">
                <div className="stat-icon">💚</div>
                <div className="stat-label">Revenue collected</div>
                <div className="stat-value">$ {stats.totalRevenue.toFixed(0)}</div>
              </div>
              <div className="stat-card amber">
                <div className="stat-icon">🟠</div>
                <div className="stat-label">Outstanding</div>
                <div className="stat-value">$ {stats.outstandingRevenue.toFixed(0)}</div>
              </div>
            </div>

            <div className="two-col">
              {/* Urgency breakdown */}
              <div className="card">
                <div className="card-title">Cases by urgency</div>
                {stats.totalCases === 0 ? (
                  <div className="empty">No cases yet</div>
                ) : (
                  <>
                    <div className="urgency-row">
                      <span className="urgency-label" style={{ color: "#dc2626" }}>🔴 High</span>
                      <div className="urgency-bar-wrap">
                        <div className="urgency-bar" style={{ width: `${stats.totalCases ? (stats.highCases / stats.totalCases * 100) : 0}%`, background: "#dc2626" }} />
                      </div>
                      <span className="urgency-count">{stats.highCases}</span>
                    </div>
                    <div className="urgency-row">
                      <span className="urgency-label" style={{ color: "#d97706" }}>🟠 Medium</span>
                      <div className="urgency-bar-wrap">
                        <div className="urgency-bar" style={{ width: `${stats.totalCases ? (stats.mediumCases / stats.totalCases * 100) : 0}%`, background: "#d97706" }} />
                      </div>
                      <span className="urgency-count">{stats.mediumCases}</span>
                    </div>
                    <div className="urgency-row">
                      <span className="urgency-label" style={{ color: "#1a3d2b" }}>🟢 Low</span>
                      <div className="urgency-bar-wrap">
                        <div className="urgency-bar" style={{ width: `${stats.totalCases ? (stats.lowCases / stats.totalCases * 100) : 0}%`, background: "#1a3d2b" }} />
                      </div>
                      <span className="urgency-count">{stats.lowCases}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Revenue summary */}
              <div className="card">
                <div className="card-title">Revenue summary</div>
                <div className="revenue-row">
                  <span className="revenue-label">🧾 Total invoices</span>
                  <span className="revenue-amount">{stats.totalInvoices}</span>
                </div>
                <div className="revenue-row">
                  <span className="revenue-label">✅ Paid invoices</span>
                  <span className="revenue-amount" style={{ color: "#1a3d2b" }}>
                    $ {stats.totalRevenue.toFixed(2)}
                  </span>
                </div>
                <div className="revenue-row">
                  <span className="revenue-label">⏳ Outstanding</span>
                  <span className="revenue-amount" style={{ color: "#d97706" }}>
                    $ {stats.outstandingRevenue.toFixed(2)}
                  </span>
                </div>
                <div className="revenue-row">
                  <span className="revenue-label">📈 Collection rate</span>
                  <span className="revenue-amount">
                    {stats.totalInvoices > 0
                      ? Math.round((stats.totalRevenue / (stats.totalRevenue + stats.outstandingRevenue)) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>

            <div className="two-col">
              {/* Top animals */}
              <div className="card">
                <div className="card-title">Top animals seen</div>
                {animalCounts.length === 0 ? (
                  <div className="empty">No cases yet</div>
                ) : (
                  animalCounts.map((a) => (
                    <div className="animal-row" key={a.animal}>
                      <span className="animal-label">
                        {animalEmoji(a.animal)} {a.animal.charAt(0).toUpperCase() + a.animal.slice(1)}
                      </span>
                      <div className="animal-bar-wrap">
                        <div className="animal-bar" style={{ width: `${(a.count / maxAnimalCount) * 100}%` }} />
                      </div>
                      <span className="animal-count">{a.count}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Recent cases */}
              <div className="card">
                <div className="card-title">Recent cases</div>
                {recentCases.length === 0 ? (
                  <div className="empty">No cases yet</div>
                ) : (
                  recentCases.map((c) => {
                    const uc = urgencyColor(c.urgency);
                    return (
                      <div className="case-row" key={c.id}>
                        <div className="case-avatar" style={{ background: uc.bg }}>
                          {animalEmoji(c.animal)}
                        </div>
                        <div className="case-info">
                          <div className="case-animal">{c.animal?.charAt(0).toUpperCase() + c.animal?.slice(1)}</div>
                          <div className="case-symptoms">{c.symptoms}</div>
                        </div>
                        <span className="urgency-pill" style={{ background: uc.bg, color: uc.color }}>
                          {c.urgency?.charAt(0).toUpperCase() + c.urgency?.slice(1)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Quick actions */}
            <div className="card">
              <div className="card-title">Quick actions</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[
                  { label: "➕ New case", href: "/app" },
                  { label: "👤 Add patient", href: "/patients" },
                  { label: "🧾 New invoice", href: "/billing" },
                  { label: "💊 Pharmacy", href: "/pharmacy" },
                  { label: "🔬 Lab Results", href: "/lab" },
                  { label: "👥 Invite team", href: "/team" },
                ].map(a => (
                  <a key={a.label} href={a.href} style={{ background: "#f0faf4", border: "1px solid #d4f0e0", color: "#1a3d2b", padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "all 0.15s" }}>
                    {a.label}
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}