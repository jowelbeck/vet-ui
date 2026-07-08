import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server-side proxy to the AI backend. This exists so the backend can require a
// secret key WITHOUT that key ever reaching the browser: the client calls this
// route, we verify the user's session, then forward to the backend with the key.
const BACKEND_URL =
  process.env.BACKEND_URL || "https://web-production-91359.up.railway.app";

const ALLOWED_ACTIONS = new Set(["query", "follow-up"]);

export async function POST(
  request: NextRequest,
  ctx: { params: Promise<{ action: string }> }
) {
  const { action } = await ctx.params;
  if (!ALLOWED_ACTIONS.has(action)) {
    return NextResponse.json({ detail: "Not found" }, { status: 404 });
  }

  // The AI is a paid, staff-only feature — require an authenticated session.
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          /* read-only auth check; no cookie writes needed */
        },
      },
    }
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.BACKEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { detail: "AI service not configured" },
      { status: 503 }
    );
  }

  const body = await request.text();
  let backendRes: Response;
  try {
    backendRes = await fetch(`${BACKEND_URL}/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-Key": apiKey },
      body,
    });
  } catch {
    return NextResponse.json(
      { detail: "AI service unavailable. Please try again." },
      { status: 502 }
    );
  }

  const text = await backendRes.text();
  return new NextResponse(text, {
    status: backendRes.status,
    headers: { "Content-Type": "application/json" },
  });
}
