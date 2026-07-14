"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import OfficerDashboard from "@/components/border/OfficerDashboard";

type BorderOfficer = {
  id: string;
  full_name: string;
  border_post_id: string;
  verification_status: "pending" | "approved" | "rejected" | "revoked";
};

type BorderPost = {
  id: string;
  name: string;
  country: string;
  neighboring_country: string;
  status: "pending" | "active" | "rejected";
};

// Simple timeout wrapper - deliberately not generic to avoid TypeScript
// losing track of Supabase's specific return types.
function withTimeout(promiseLike: PromiseLike<any>, ms: number, label: string): Promise<any> {
  return Promise.race([
    Promise.resolve(promiseLike),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Timed out after ${ms / 1000}s waiting for: ${label}`)), ms)
    ),
  ]);
}

export default function BorderOfficerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [officer, setOfficer] = useState<BorderOfficer | null>(null);
  const [post, setPost] = useState<BorderPost | null>(null);

  const [fullName, setFullName] = useState("");
  const [officerIdNumber, setOfficerIdNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [postName, setPostName] = useState("");
  const [country, setCountry] = useState("");
  const [regionOrState, setRegionOrState] = useState("");
  const [neighboringCountry, setNeighboringCountry] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const init = async () => {
      try {
        const authResult: any = await withTimeout(supabase.auth.getUser(), 8000, "auth check");
        const user = authResult?.data?.user;

        if (!user) {
          setLoading(false);
          return;
        }
        setUserId(user.id);

        const officerResult: any = await withTimeout(
          supabase
            .from("border_officers")
            .select("id, full_name, border_post_id, verification_status")
            .eq("user_id", user.id)
            .maybeSingle(),
          8000,
          "officer lookup"
        );

        if (officerResult.error) {
          setInitError(`Error loading officer record: ${officerResult.error.message}`);
          setLoading(false);
          return;
        }

        const officerRow = officerResult.data;

        if (officerRow) {
          setOfficer(officerRow as BorderOfficer);

          const postResult: any = await withTimeout(
            supabase
              .from("border_posts")
              .select("id, name, country, neighboring_country, status")
              .eq("id", officerRow.border_post_id)
              .maybeSingle(),
            8000,
            "post lookup"
          );

          if (postResult.error) {
            setInitError(`Error loading border post: ${postResult.error.message}`);
            setLoading(false);
            return;
          }

          if (postResult.data) setPost(postResult.data as BorderPost);
        }
      } catch (err: any) {
        setInitError(err?.message || String(err));
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);
  const submitApplication = async () => {
    if (!userId) return;
    if (!fullName.trim() || !postName.trim() || !country.trim() || !neighboringCountry.trim()) {
      setError("Please fill in your name, border post name, country, and neighboring country.");
      return;
    }
    setSubmitting(true);
    setError("");

    const { error } = await supabase.rpc("fn_apply_as_border_officer", {
      p_user_id: userId,
      p_full_name: fullName.trim(),
      p_officer_id_number: officerIdNumber.trim() || null,
      p_phone_number: phoneNumber.trim() || null,
      p_post_name: postName.trim(),
      p_country: country.trim(),
      p_region_or_state: regionOrState.trim() || null,
      p_neighboring_country: neighboringCountry.trim(),
    });

    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    window.location.reload();
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
        Loading…
      </div>
    );
  }

  if (initError) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 480, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#991b1b", marginBottom: 6 }}>Something went wrong:</p>
          <p style={{ fontSize: 13, color: "#991b1b" }}>{initError}</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
        Please <a href="/login" style={{ color: "#1a3d2b", marginLeft: 6 }}>log in</a> to continue.
      </div>
    );
  }

  if (officer) {
    const postActive = post?.status === "active";
    const officerApproved = officer.verification_status === "approved";
    const fullyLive = postActive && officerApproved;

    return (
      <>
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: system-ui, -apple-system, sans-serif; background: #f1f5f9; color: #1e293b; }
        `}</style>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: fullyLive ? "flex-start" : "center", padding: 24 }}>
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 32, width: "100%", maxWidth: 480, boxShadow: "0 4px 12px rgba(0,0,0,0.06)", marginTop: fullyLive ? 24 : 0 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1a3d2b", marginBottom: 16 }}>Border Officer Status</h1>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 4 }}>Border post</div>
              <div style={{ fontSize: 15, color: "#334155" }}>{post?.name ?? "—"}{post ? `, ${post.country}` : ""}</div>
            </div>

            <StatusRow label="Post review status" value={post?.status ?? "pending"} />
            <StatusRow label="Your officer application" value={officer.verification_status} />

            {fullyLive ? (
              <p style={{ marginTop: 20, fontSize: 14, color: "#2d6b47", background: "#f0faf4", padding: 12, borderRadius: 8 }}>
                ✓ You're fully approved. Movement permit and quarantine tools are below.
              </p>
            ) : (
              <p style={{ marginTop: 20, fontSize: 14, color: "#64748b" }}>
                Both your border post and your own application need to be approved by a VetsAI admin before you can log
                movement permits or quarantine records.
              </p>
            )}
          </div>

          {fullyLive && post && (
            <OfficerDashboard
              borderPostId={post.id}
              userId={userId}
              postCountry={post.country}
              neighboringCountry={post.neighboring_country}
            />
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, -apple-system, sans-serif; background: #f1f5f9; color: #1e293b; }
        .field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
        .field label { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.4px; }
        .field input { padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; color: #1e293b; background: #f8fafc; outline: none; font-family: inherit; }
        .field input:focus { border-color: #1a3d2b; box-shadow: 0 0 0 3px rgba(26,61,43,0.1); background: #fff; }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      `}</style>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 32, width: "100%", maxWidth: 520, boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a3d2b", marginBottom: 6 }}>Apply as a Border Officer</h1>
          <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20, lineHeight: 1.6 }}>
            If your border post isn't already in VetsAI, entering it here proposes it. Both your post and your own
            application will be reviewed by a VetsAI admin before you get access.
          </p>

          <div className="field">
            <label>Full name</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. John Mensah" />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Staff / officer ID (optional)</label>
              <input value={officerIdNumber} onChange={(e) => setOfficerIdNumber(e.target.value)} placeholder="e.g. VSD-00123" />
            </div>
            <div className="field">
              <label>Phone number</label>
              <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="e.g. +233 20 000 0000" />
            </div>
          </div>

          <div className="field">
            <label>Border post name</label>
            <input value={postName} onChange={(e) => setPostName(e.target.value)} placeholder="e.g. Paga Border Post" />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Country</label>
              <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g. Ghana" />
            </div>
            <div className="field">
              <label>Region / state (optional)</label>
              <input value={regionOrState} onChange={(e) => setRegionOrState(e.target.value)} placeholder="e.g. Upper East" />
            </div>
          </div>

          <div className="field">
            <label>Neighboring country at this crossing</label>
            <input value={neighboringCountry} onChange={(e) => setNeighboringCountry(e.target.value)} placeholder="e.g. Burkina Faso" />
          </div>

          {error && <p style={{ fontSize: 13, color: "#dc2626", marginBottom: 12 }}>{error}</p>}

          <button
            onClick={submitApplication}
            disabled={submitting}
            style={{ width: "100%", background: "#1a3d2b", color: "#fff", padding: 12, borderRadius: 8, border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", opacity: submitting ? 0.6 : 1, marginTop: 8 }}
          >
            {submitting ? "Submitting…" : "Submit application"}
          </button>
        </div>
      </div>
    </>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    pending: { bg: "#fef3c7", color: "#92400e" },
    active: { bg: "#d4f0e0", color: "#1a3d2b" },
    approved: { bg: "#d4f0e0", color: "#1a3d2b" },
    rejected: { bg: "#fee2e2", color: "#991b1b" },
    revoked: { bg: "#fee2e2", color: "#991b1b" },
  };
  const c = colors[value] ?? colors.pending;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
      <span style={{ fontSize: 13, color: "#64748b" }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 6, background: c.bg, color: c.color, textTransform: "capitalize" }}>
        {value}
      </span>
    </div>
  );
}