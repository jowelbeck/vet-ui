import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { timingSafeEqual } from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BASE_URL = "https://vet-ui-beta.vercel.app";

// Lifecycle drip milestones. `grace` lets a single missed/late cron run still
// deliver: a milestone is eligible when milestone <= daysSince <= milestone + grace.
// Dedup (via the sent_emails table) then guarantees each type is sent at most once.
const MILESTONES = [
  { day: 3, type: "day3" },
  { day: 7, type: "day7" },
  { day: 14, type: "day14" },
  { day: 28, type: "day28" },
] as const;
const GRACE_DAYS = 1;

// Constant-time comparison so the secret can't be recovered via response timing.
function secretMatches(header: string | null): boolean {
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (!header) return false;
  const a = Buffer.from(header);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

async function sendSequenceEmail(email: string, type: string, clinicName: string) {
  const res = await fetch(`${BASE_URL}/api/send-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to: email, type, data: { clinicName } }),
  });
  if (!res.ok) {
    throw new Error(`send-email ${type} failed: ${res.status} ${await res.text()}`);
  }
}

export async function GET(request: Request) {
  // Verify this is called by Vercel Cron (which attaches Authorization: Bearer <CRON_SECRET>).
  if (!secretMatches(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
  if (usersError || !users) {
    console.error("cron: failed to list users", usersError);
    return NextResponse.json({ error: "Failed to list users" }, { status: 500 });
  }

  let sent = 0;
  let failed = 0;

  for (const user of users.users) {
    try {
      const signedUp = new Date(user.created_at);
      const daysSince = Math.floor((now.getTime() - signedUp.getTime()) / (1000 * 60 * 60 * 24));

      // Pick the milestone whose window currently contains this user (at most one).
      const milestone = MILESTONES.find(
        (m) => daysSince >= m.day && daysSince <= m.day + GRACE_DAYS
      );
      if (!milestone) continue;

      const email = user.email;
      if (!email) continue;

      // Dedup: skip if this milestone email was already sent to this user.
      const { data: already } = await supabase
        .from("sent_emails")
        .select("id")
        .eq("user_id", user.id)
        .eq("email_type", milestone.type)
        .maybeSingle();
      if (already) continue;

      const { data: clinic } = await supabase
        .from("clinics")
        .select("name")
        .eq("user_id", user.id)
        .maybeSingle();

      const name = clinic?.name || user.user_metadata?.clinic_name || "there";

      await sendSequenceEmail(email, milestone.type, name);

      // Record the send. The unique (user_id, email_type) constraint is the
      // backstop against a racing cron run; ignore duplicate-key conflicts.
      const { error: insertError } = await supabase
        .from("sent_emails")
        .insert({ user_id: user.id, email_type: milestone.type });
      if (insertError && insertError.code !== "23505") {
        console.error("cron: failed to record sent_email", insertError);
      }

      sent++;
    } catch (err) {
      failed++;
      console.error(`cron: failed for user ${user.id}`, err);
    }
  }

  return NextResponse.json({ success: true, sent, failed, checked: users.users.length });
}
