"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type BorderPost = {
  id: string;
  name: string;
  country: string;
  region_or_state: string | null;
  neighboring_country: string;
  status: string;
  submitted_at: string;
};

type BorderOfficer = {
  id: string;
  full_name: string;
  officer_id_number: string | null;
  phone_number: string | null;
  border_post_id: string;
  verification_status: string;
  submitted_at: string;
};

type Invite = {
  id: string;
  email: string;
  full_name: string;
  border_post_id: string;
  status: string;
  invited_at: string;
};

const inputStyle: React.CSSProperties = {
  padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 13,
  color: "#1e293b", background: "#f8fafc", outline: "none", fontFamily: "inherit", width: "100%",
};
const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase",
  letterSpacing: 0.4, marginBottom: 4, display: "block",
};

export default function BorderAdminReviewPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [posts, setPosts] = useState<BorderPost[]>([]);
  const [officers, setOfficers] = useState<BorderOfficer[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);

  const [newPostName, setNewPostName] = useState("");
  const [newPostCountry, setNewPostCountry] = useState("");
  const [newPostRegion, setNewPostRegion] = useState("");
  const [newPostNeighboring, setNewPostNeighboring] = useState("");
  const [creatingPost, setCreatingPost] = useState(false);
  const [postCreateError, setPostCreateError] = useState("");

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteFullName, setInviteFullName] = useState("");
  const [inviteIdNumber, setInviteIdNumber] = useState("");
  const [invitePhone, setInvitePhone] = useState("");
  const [invitePostId, setInvitePostId] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState("");

  const load = async (uid: string) => {
    const [{ data: postData }, { data: officerData }, { data: inviteData }] = await Promise.all([
      supabase.from("border_posts").select("*").order("submitted_at", { ascending: false }),
      supabase.from("border_officers").select("*").order("submitted_at", { ascending: false }),
      supabase.from("border_officer_invites").select("*").order("invited_at", { ascending: false }),
    ]);
    if (postData) setPosts(postData as BorderPost[]);
    if (officerData) setOfficers(officerData as BorderOfficer[]);
    if (inviteData) setInvites(inviteData as Invite[]);
  };

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setUserId(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_platform_admin")
        .eq("id", user.id)
        .maybeSingle();

      const admin = !!profile?.is_platform_admin;
      setIsAdmin(admin);
      if (admin) await load(user.id);
      setLoading(false);
    };
    init();
  }, []);

  const createPost = async () => {
    if (!userId) return;
    if (!newPostName.trim() || !newPostCountry.trim() || !newPostNeighboring.trim()) {
      setPostCreateError("Post name, country, and neighboring country are required.");
      return;
    }
    setCreatingPost(true);
    setPostCreateError("");
    const { error } = await supabase.rpc("fn_admin_create_border_post", {
      p_name: newPostName.trim(),
      p_country: newPostCountry.trim(),
      p_region_or_state: newPostRegion.trim() || null,
      p_neighboring_country: newPostNeighboring.trim(),
      p_admin_user_id: userId,
    });
    setCreatingPost(false);
    if (error) { setPostCreateError(error.message); return; }
    setNewPostName(""); setNewPostCountry(""); setNewPostRegion(""); setNewPostNeighboring("");
    load(userId);
  };

  const inviteOfficer = async () => {
    if (!userId) return;
    if (!inviteEmail.trim() || !inviteFullName.trim() || !invitePostId) {
      setInviteError("Email, full name, and border post are required.");
      return;
    }
    setInviting(true);
    setInviteError("");
    const { error } = await supabase.rpc("fn_admin_invite_border_officer", {
      p_email: inviteEmail.trim(),
      p_full_name: inviteFullName.trim(),
      p_officer_id_number: inviteIdNumber.trim() || null,
      p_phone_number: invitePhone.trim() || null,
      p_border_post_id: invitePostId,
      p_admin_user_id: userId,
    });
    setInviting(false);
    if (error) { setInviteError(error.message); return; }
    setInviteEmail(""); setInviteFullName(""); setInviteIdNumber(""); setInvitePhone(""); setInvitePostId("");
    load(userId);
  };

  const reviewPost = async (postId: string, decision: "active" | "rejected") => {
    if (!userId) return;
    const notes = decision === "rejected" ? window.prompt("Reason for rejecting this border post? (optional)") ?? "" : null;
    const { error } = await supabase.rpc("fn_review_border_post", {
      p_post_id: postId,
      p_decision: decision,
      p_admin_user_id: userId,
      p_notes: notes,
    });
    if (error) { alert(error.message); return; }
    load(userId);
  };

  const reviewOfficer = async (officerId: string, decision: "approved" | "rejected") => {
    if (!userId) return;
    const notes = decision === "rejected" ? window.prompt("Reason for rejecting this officer? (optional)") ?? "" : null;
    const { error } = await supabase.rpc("fn_review_border_officer", {
      p_officer_id: officerId,
      p_decision: decision,
      p_admin_user_id: userId,
      p_notes: notes,
    });
    if (error) { alert(error.message); return; }
    load(userId);
  };

  if (loading) {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>Loading…</div>;
  }
  if (!userId) {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>Please log in.</div>;
  }
  if (!isAdmin) {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>Admin access required.</div>;
  }

  const activePosts = posts.filter(p => p.status === "active");
  const pendingPosts = posts.filter(p => p.status === "pending");
  const pendingOfficers = officers.filter(o => o.verification_status === "pending");
  const pendingInvites = invites.filter(i => i.status === "invited");
  const postById = Object.fromEntries(posts.map(p => [p.id, p]));

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, -apple-system, sans-serif; background: #f1f5f9; color: #1e293b; }
        .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
        .row { display: flex; justify-content: space-between; align-items: flex-start; padding: 12px 0; border-bottom: 1px solid #f1f5f9; gap: 12px; }
        .row:last-child { border-bottom: none; }
        .btn { padding: 6px 14px; border-radius: 6px; border: none; font-size: 12px; font-weight: 600; cursor: pointer; }
        .btn-approve { background: #1a3d2b; color: #fff; }
        .btn-reject { background: #fee2e2; color: #991b1b; }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
      `}</style>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a3d2b", marginBottom: 4 }}>Border Management — Admin</h1>
        <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>Create posts, assign officers, and review pending items.</p>

        <div className="card">
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Create a border post</h2>
          <div className="field-row">
            <div><label style={labelStyle}>Post name</label><input style={inputStyle} value={newPostName} onChange={(e) => setNewPostName(e.target.value)} placeholder="e.g. Elubo Border Post" /></div>
            <div><label style={labelStyle}>Country</label><input style={inputStyle} value={newPostCountry} onChange={(e) => setNewPostCountry(e.target.value)} placeholder="e.g. Ghana" /></div>
          </div>
          <div className="field-row">
            <div><label style={labelStyle}>Region/state (optional)</label><input style={inputStyle} value={newPostRegion} onChange={(e) => setNewPostRegion(e.target.value)} /></div>
            <div><label style={labelStyle}>Neighboring country</label><input style={inputStyle} value={newPostNeighboring} onChange={(e) => setNewPostNeighboring(e.target.value)} placeholder="e.g. Côte d'Ivoire" /></div>
          </div>
          {postCreateError && <p style={{ fontSize: 12, color: "#dc2626", marginBottom: 10 }}>{postCreateError}</p>}
          <button className="btn btn-approve" onClick={createPost} disabled={creatingPost}>{creatingPost ? "Creating…" : "Create post (active immediately)"}</button>
        </div>

        <div className="card">
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Invite an officer</h2>
          <div className="field-row">
            <div><label style={labelStyle}>Email</label><input style={inputStyle} value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="officer@example.com" /></div>
            <div><label style={labelStyle}>Full name</label><input style={inputStyle} value={inviteFullName} onChange={(e) => setInviteFullName(e.target.value)} /></div>
          </div>
          <div className="field-row">
            <div><label style={labelStyle}>Staff ID (optional)</label><input style={inputStyle} value={inviteIdNumber} onChange={(e) => setInviteIdNumber(e.target.value)} /></div>
            <div><label style={labelStyle}>Phone (optional)</label><input style={inputStyle} value={invitePhone} onChange={(e) => setInvitePhone(e.target.value)} /></div>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={labelStyle}>Assign to border post</label>
            <select style={inputStyle} value={invitePostId} onChange={(e) => setInvitePostId(e.target.value)}>
              <option value="">— choose an active post —</option>
              {activePosts.map(p => <option key={p.id} value={p.id}>{p.name}, {p.country}</option>)}
            </select>
          </div>
          {inviteError && <p style={{ fontSize: 12, color: "#dc2626", marginBottom: 10 }}>{inviteError}</p>}
          <button className="btn btn-approve" onClick={inviteOfficer} disabled={inviting}>{inviting ? "Inviting…" : "Send invite"}</button>
        </div>

        <div className="card">
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Pending invites ({pendingInvites.length})</h2>
          {pendingInvites.length === 0 && <p style={{ fontSize: 13, color: "#94a3b8", padding: "12px 0" }}>None pending.</p>}
          {pendingInvites.map((i) => (
            <div key={i.id} className="row">
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{i.full_name} — {i.email}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{postById[i.border_post_id]?.name ?? "Unknown post"}</div>
              </div>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>Waiting for them to sign up</span>
            </div>
          ))}
        </div>

        <div className="card">
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Pending border posts (self-submitted) ({pendingPosts.length})</h2>
          {pendingPosts.length === 0 && <p style={{ fontSize: 13, color: "#94a3b8", padding: "12px 0" }}>None pending.</p>}
          {pendingPosts.map((p) => (
            <div key={p.id} className="row">
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{p.country}{p.region_or_state ? `, ${p.region_or_state}` : ""} — borders {p.neighboring_country}</div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <button className="btn btn-approve" onClick={() => reviewPost(p.id, "active")}>Approve</button>
                <button className="btn btn-reject" onClick={() => reviewPost(p.id, "rejected")}>Reject</button>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Pending officer applications (self-submitted) ({pendingOfficers.length})</h2>
          {pendingOfficers.length === 0 && <p style={{ fontSize: 13, color: "#94a3b8", padding: "12px 0" }}>None pending.</p>}
          {pendingOfficers.map((o) => {
            const post = postById[o.border_post_id];
            return (
              <div key={o.id} className="row">
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{o.full_name}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{post ? `${post.name}, ${post.country}` : "Unknown post"}{o.phone_number ? ` — ${o.phone_number}` : ""}</div>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button className="btn btn-approve" onClick={() => reviewOfficer(o.id, "approved")}>Approve</button>
                  <button className="btn btn-reject" onClick={() => reviewOfficer(o.id, "rejected")}>Reject</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
