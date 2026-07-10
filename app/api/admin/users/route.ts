import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Service-role client (bypasses RLS) for platform-admin operations.
const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Confirm the caller is an authenticated platform admin. Returns the user id, or
// a NextResponse error to return directly.
export async function requirePlatformAdmin() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };

  const { data: me } = await admin
    .from("profiles")
    .select("is_platform_admin")
    .eq("id", user.id)
    .maybeSingle();
  if (!me?.is_platform_admin) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { userId: user.id };
}

export async function GET() {
  const gate = await requirePlatformAdmin();
  if (gate.error) return gate.error;

  const { data, error } = await admin
    .from("profiles")
    .select("id, email, product, deactivated, deactivated_at, deactivation_reason, is_platform_admin, created_at")
    .order("created_at", { ascending: false })
    .limit(1000);
  if (error) {
    console.error("admin/users list failed", error);
    return NextResponse.json({ error: "Failed to load users" }, { status: 500 });
  }
  return NextResponse.json({ users: data ?? [] });
}
