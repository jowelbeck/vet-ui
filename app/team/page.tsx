"use client";
import AppNav from "@/components/AppNav";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Member = {
  id: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
};

const ROLES = ["admin", "vet", "nurse", "technician", "receptionist"];

export default function TeamPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("vet");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [clinicName, setClinicName] = useState("");

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const checkAuthAndLoad = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { getCurrentUserRole, hasAccess } = await import("@/lib/roleCheck");
    const role = await getCurrentUserRole();
    if (!hasAccess("team", role)) {
      router.push("/app");
      return;
    }
    setCurrentUser(user);

    // Load clinic name
    const { data: clinic } = await supabase
      .from("clinics")
      .select("name")
      .eq("user_id", user.id)
      .single();
    if (clinic) setClinicName(clinic.name);

    loadMembers(user.id);
  };

  const loadMembers = async (userId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("clinic_members")
      .select("*")
      .eq("invited_by", userId)
      .order("created_at", { ascending: false });
    if (!error && data) setMembers(data);
    setLoading(false);
  };

  const inviteMember = async () => {
    if (!inviteEmail.trim()) { setError("Please enter an email address."); return; }
    if (!inviteEmail.includes("@")) { setError("Please enter a valid email address."); return; }

    setSaving(true);
    setError("");

    const { data: clinic } = await supabase
      .from("clinics")
      .select("id")
      .eq("user_id", currentUser.id)
      .single();

    const { error } = await supabase.from("clinic_members").insert({
      clinic_id: clinic?.id,
      user_id: currentUser.id,
      email: inviteEmail.trim().toLowerCase(),
      role: inviteRole,
      status: "invited",
      invited_by: currentUser.id,
    });

    if (error) { setError(error.message); setSaving(false); return; }

    setSuccessMsg(`Invitation sent to ${inviteEmail}!`);
    setTimeout(() => setSuccessMsg(""), 4000);
    setInviteEmail("");
    loadMembers(currentUser.id);
    setSaving(false);
  };

  const removeMember = async (id: string) => {
    if (!window.confirm("Remove this team member?")) return;
    await supabase.from("clinic_members").delete().eq("id", id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const roleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: { bg: "#f0faf4", color: "#1a3d2b" },
      vet: { bg: "#eff6ff", color: "#1d4ed8" },
      nurse: { bg: "#fef3c7", color: "#92400e" },
      receptionist: { bg: "#f5f3ff", color: "#5b21b6" },
    }[role] ?? { bg: "#f1f5f9", color: "#64748b" };
    return colors;
  };

  const statusColor = (status: string) => {
    if (status === "active") return { bg: "#f0faf4", color: "#1a3d2b" };
    if (status === "invited") return { bg: "#fef3c7", color: "#92400e" };
    return { bg: "#f1f5f9", color: "#64748b" };
  };

  return (
    <AppNav />
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, -apple-system, sans-serif; background: #f1f5f9; color: #1e293b; font-size: 14px; }

        .app-header { background: #fff; border-bottom: 1px solid #e2e8f0; padding: 0 20px; display: flex; align-items: center; justify-content: space-between; height: 56px; position: sticky; top: 0; z-index: 50; }
        .app-logo { display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 700; color: #1a3d2b; text-decoration: none; }
        .app-logo-mark { width: 30px; height: 30px; background: #1a3d2b; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 15px; }
        .nav-links { display: flex; align-items: center; gap: 16px; }
        .nav-link { font-size: 13px; font-weight: 500; color: #64748b; text-decoration: none; padding: 5px 10px; border-radius: 6px; transition: all 0.15s; }
        .nav-link:hover { background: #f1f5f9; color: #1e293b; }
        .nav-link.active { background: #f0faf4; color: #1a3d2b; font-weight: 600; }
        .btn-logout { font-size: 12px; padding: 6px 12px; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 6px; cursor: pointer; color: #64748b; font-family: inherit; }

        .page-body { max-width: 860px; margin: 0 auto; padding: 24px 16px 48px; }
        .page-header { margin-bottom: 24px; }
        .page-title { font-size: 20px; font-weight: 700; color: #1a3d2b; margin-bottom: 4px; }
        .page-sub { font-size: 14px; color: #64748b; }

        .alert { border-radius: 8px; padding: 10px 14px; margin-bottom: 14px; font-size: 13px; }
        .alert-error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; }
        .alert-success { background: #f0faf4; border: 1px solid #d4f0e0; color: #1a3d2b; }

        .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
        .card-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; margin-bottom: 16px; }

        .invite-row { display: flex; gap: 10px; align-items: flex-end; flex-wrap: wrap; }
        .field { display: flex; flex-direction: column; gap: 5px; flex: 1; min-width: 200px; }
        .field label { font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.4px; }
        .field input, .field select { padding: 9px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; color: #1e293b; background: #f8fafc; outline: none; font-family: inherit; transition: border-color 0.15s; }
        .field input:focus, .field select:focus { border-color: #1a3d2b; box-shadow: 0 0 0 3px rgba(26,61,43,0.1); background: #fff; }
        .btn-invite { background: #1a3d2b; color: #fff; padding: 9px 18px; border-radius: 7px; border: none; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; white-space: nowrap; }
        .btn-invite:disabled { opacity: 0.5; cursor: not-allowed; }

        .member-card { display: flex; align-items: center; gap: 12px; padding: 14px 0; border-bottom: 1px solid #f1f5f9; }
        .member-card:last-child { border-bottom: none; }
        .member-avatar { width: 36px; height: 36px; border-radius: 50%; background: #f0faf4; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #1a3d2b; flex-shrink: 0; }
        .member-info { flex: 1; min-width: 0; }
        .member-email { font-size: 14px; font-weight: 500; color: #1e293b; }
        .member-meta { font-size: 12px; color: #94a3b8; margin-top: 2px; }
        .member-badges { display: flex; gap: 6px; align-items: center; flex-shrink: 0; }
        .badge { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; }
        .btn-remove { background: #fff; color: #dc2626; border: 1px solid #fecaca; font-size: 12px; padding: 5px 10px; border-radius: 6px; cursor: pointer; font-family: inherit; }

        .owner-card { background: #f0faf4; border: 1px solid #d4f0e0; border-radius: 10px; padding: 16px 20px; margin-bottom: 16px; display: flex; align-items: center; gap: 12px; }
        .owner-avatar { width: 40px; height: 40px; border-radius: 50%; background: #1a3d2b; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; color: #fff; flex-shrink: 0; }
        .owner-info { flex: 1; }
        .owner-name { font-size: 14px; font-weight: 600; color: #1a3d2b; }
        .owner-role { font-size: 12px; color: #2d6b47; }

        .empty { text-align: center; padding: 32px 20px; color: #94a3b8; }
        .empty-icon { font-size: 32px; margin-bottom: 10px; }
        .empty p { font-size: 13px; }

        .plan-note { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #92400e; margin-bottom: 16px; }

        @media (max-width: 560px) {
          .invite-row { flex-direction: column; }
          .member-badges { flex-wrap: wrap; }
        }
      `}</style>

      {/* Header */}
      <div className="app-header">
        <a href="/app" className="app-logo">
          <img src="/vetsai-icon.svg" alt="VetsAI" width={30} height={30} style={{ borderRadius: "7px" }} />
          VetsAI
        </a>
        <div className="nav-links">
          <a href="/app" className="nav-link">New case</a>
          <a href="/patients" className="nav-link">Patients</a>
          <a href="/team" className="nav-link active">Team</a>
          <button
            className="btn-logout"
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/login";
            }}
          >
            Log out
          </button>
        </div>
      </div>

      <div className="page-body">
        {error && <div className="alert alert-error">⚠ {error}</div>}
        {successMsg && <div className="alert alert-success">✓ {successMsg}</div>}

        <div className="page-header">
          <div className="page-title">👥 Team management</div>
          <div className="page-sub">{clinicName || "Your clinic"} · Manage who has access to your VetsAI account</div>
        </div>

        {/* Plan note */}
        <div className="plan-note">
          💡 <strong>Professional plan</strong> allows up to 3 team members. <strong>Clinic OS plan</strong> allows up to 10. <a href="/#pricing" style={{ color: "#92400e", fontWeight: 600 }}>Upgrade your plan →</a>
        </div>

        {/* Current owner */}
        <div className="owner-card">
          <div className="owner-avatar">
            {currentUser?.email?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="owner-info">
            <div className="owner-name">{currentUser?.email}</div>
            <div className="owner-role">Clinic owner · Admin access</div>
          </div>
          <span className="badge" style={{ background: "#f0faf4", color: "#1a3d2b" }}>Owner</span>
        </div>

        {/* Invite form */}
        <div className="card">
          <div className="card-title">Invite a team member</div>
          <div className="invite-row">
            <div className="field">
              <label>Email address</label>
              <input
                type="email"
                placeholder="colleague@clinic.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="field" style={{ maxWidth: 160 }}>
              <label>Role</label>
              <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                ))}
              </select>
            </div>
            <button className="btn-invite" onClick={inviteMember} disabled={saving}>
              {saving ? "Sending…" : "Send invite"}
            </button>
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 10 }}>
            Team members will receive an email invitation to join your clinic on VetsAI.
          </div>
        </div>

        {/* Team members list */}
        <div className="card">
          <div className="card-title">Team members ({members.length})</div>

          {loading ? (
            <div className="empty"><p>Loading…</p></div>
          ) : members.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">👥</div>
              <p>No team members yet. Invite your first colleague above.</p>
            </div>
          ) : (
            members.map((member) => {
              const rc = roleColor(member.role) as any;
              const sc = statusColor(member.status) as any;
              return (
                <div className="member-card" key={member.id}>
                  <div className="member-avatar">
                    {member.email[0].toUpperCase()}
                  </div>
                  <div className="member-info">
                    <div className="member-email">{member.email}</div>
                    <div className="member-meta">
                      Invited {new Date(member.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="member-badges">
                    <span className="badge" style={{ background: rc.bg, color: rc.color }}>
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </span>
                    <span className="badge" style={{ background: sc.bg, color: sc.color }}>
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </span>
                    <button className="btn-remove" onClick={() => removeMember(member.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}