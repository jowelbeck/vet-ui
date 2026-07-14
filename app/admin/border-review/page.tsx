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

export default function BorderAdminReviewPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [posts, setPosts] = useState<BorderPost[]>([]);
  const [officers, setOfficers] = useState<BorderOfficer[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async (uid: string) => {
    const [{ data: postData }, { data: officerData }] = await Promise.all([
      supabase.from("border_posts").select("*").order("submitted_at", { ascending: false }),
      supabase.from("border_officers").select("*").order("submitted_at", { ascending: false }),
    ]);
    if (postData) setPosts(postData as BorderPost[]);
    if (officerData) setOfficers(officerData as BorderOfficer[]);
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

  const pendingPosts = posts.filter(p => p.status === "pending");
  const pendingOfficers = officers.filter(o => o.verification_status === "pending");
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
      `}</style>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a3d2b", marginBottom: 4 }}>Border Management — Admin Review</h1>
        <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>
          Pending border posts and officer applications, across all countries.
        </p>

        <div className="card">
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Pending border posts ({pendingPosts.length})</h2>
          {pendingPosts.length === 0 && <p style={{ fontSize: 13, color: "#94a3b8", padding: "12px 0" }}>None pending.</p>}
          {pendingPosts.map((p) => (
            <div key={p.id} className="row">
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  {p.country}{p.region_or_state ? `, ${p.region_or_state}` : ""} — borders {p.neighboring_country}
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Submitted {new Date(p.submitted_at).toLocaleDateString()}</div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <button className="btn btn-approve" onClick={() => reviewPost(p.id, "active")}>Approve</button>
                <button className="btn btn-reject" onClick={() => reviewPost(p.id, "rejected")}>Reject</button>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Pending officer applications ({pendingOfficers.length})</h2>
          {pendingOfficers.length === 0 && <p style={{ fontSize: 13, color: "#94a3b8", padding: "12px 0" }}>None pending.</p>}
          {pendingOfficers.map((o) => {
            const post = postById[o.border_post_id];
            return (
              <div key={o.id} className="row">
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{o.full_name}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>
                    {post ? `${post.name}, ${post.country}` : "Unknown post"}
                    {o.phone_number ? ` — ${o.phone_number}` : ""}
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Submitted {new Date(o.submitted_at).toLocaleDateString()}</div>
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