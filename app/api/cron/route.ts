import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BASE_URL = "https://vet-ui-beta.vercel.app";

async function sendSequenceEmail(email: string, type: string, clinicName: string) {
  await fetch(`${BASE_URL}/api/send-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to: email, type, data: { clinicName } }),
  });
}

export async function GET(request: Request) {
  // Verify this is called by Vercel Cron
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  // Get all users
  const { data: users } = await supabase.auth.admin.listUsers();
  if (!users) return NextResponse.json({ sent: 0 });

  let sent = 0;

  for (const user of users.users) {
    const signedUp = new Date(user.created_at);
    const daysSince = Math.floor((now.getTime() - signedUp.getTime()) / (1000 * 60 * 60 * 24));
    const email = user.email!;
    const clinicName = user.user_metadata?.clinic_name || "there";

    // Get clinic name from clinics table if available
    const { data: clinic } = await supabase
      .from("clinics")
      .select("name")
      .eq("user_id", user.id)
      .single();

    const name = clinic?.name || clinicName;

    if (daysSince === 3) {
      await sendSequenceEmail(email, "day3", name);
      sent++;
    } else if (daysSince === 7) {
      await sendSequenceEmail(email, "day7", name);
      sent++;
    } else if (daysSince === 14) {
      await sendSequenceEmail(email, "day14", name);
      sent++;
    } else if (daysSince === 28) {
      await sendSequenceEmail(email, "day28", name);
      sent++;
    }
  }

  return NextResponse.json({ success: true, sent, checked: users.users.length });
}
