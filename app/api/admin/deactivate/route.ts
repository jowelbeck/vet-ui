import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requirePlatformAdmin } from "../users/route";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const gate = await requirePlatformAdmin();
  if (gate.error) return gate.error;

  const { userId, deactivated, reason } = await request.json();
  if (!userId || typeof deactivated !== "boolean") {
    return NextResponse.json({ error: "userId and deactivated (boolean) are required" }, { status: 400 });
  }

  // Guard: a platform admin cannot deactivate themselves (avoid lockout).
  if (userId === gate.userId && deactivated) {
    return NextResponse.json({ error: "You cannot deactivate your own account." }, { status: 400 });
  }

  const { error } = await admin
    .from("profiles")
    .update({
      deactivated,
      deactivated_at: deactivated ? new Date().toISOString() : null,
      deactivated_by: deactivated ? gate.userId : null,
      deactivation_reason: deactivated ? (reason || null) : null,
    })
    .eq("id", userId);

  if (error) {
    console.error("admin/deactivate failed", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
