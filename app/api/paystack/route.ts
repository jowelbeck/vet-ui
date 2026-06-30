import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest("hex");

  if (hash !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);
  const { event: eventType, data } = event;

  if (eventType === "subscription.create" || eventType === "charge.success") {
    const email = data.customer?.email;
    const subscriptionCode = data.subscription_code || data.reference;
    const customerCode = data.customer?.customer_code;
    const planCode = data.plan?.plan_code || data.plan_code;

    const planMap: Record<string, string> = {
      [process.env.NEXT_PUBLIC_PAYSTACK_STARTER_PLAN!]: "starter",
      [process.env.NEXT_PUBLIC_PAYSTACK_PROFESSIONAL_PLAN!]: "professional",
      [process.env.NEXT_PUBLIC_PAYSTACK_CLINIC_OS_PLAN!]: "clinic_os",
    };
    const planName = planMap[planCode] || "starter";

    const { data: users } = await supabase.auth.admin.listUsers();
    const user = users?.users.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { error: upsertError } = await supabase.from("subscriptions").upsert({
      user_id: user.id,
      plan: planName,
      status: "active",
      paystack_subscription_code: subscriptionCode,
      paystack_customer_code: customerCode,
      amount: data.amount,
      currency: data.currency || "GHS",
      started_at: new Date().toISOString(),
      ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    }, { onConflict: "user_id" });

    if (upsertError) {
      console.error("Subscription upsert failed:", upsertError.message);
    }
  }

  if (eventType === "subscription.disable") {
    const email = data.customer?.email;
    const { data: users } = await supabase.auth.admin.listUsers();
    const user = users?.users.find((u) => u.email === email);
    if (user) {
      await supabase.from("subscriptions")
        .update({ status: "cancelled" })
        .eq("user_id", user.id);
    }
  }

  return NextResponse.json({ received: true });
}
