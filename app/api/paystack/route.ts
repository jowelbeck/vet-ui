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

  console.log("Paystack webhook received");
  console.log("Signature:", signature);

  // Verify webhook signature
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest("hex");

  console.log("Expected hash:", hash);
  console.log("Signature match:", hash === signature);

  if (hash !== signature) {
    console.log("Signature mismatch — rejecting");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);
  const { event: eventType, data } = event;

  console.log("Event type:", eventType);
  console.log("Customer email:", data.customer?.email);
  console.log("Plan code:", data.plan?.plan_code || data.plan_code);
  console.log("Subscription code:", data.subscription_code);
  console.log("Amount:", data.amount);
  console.log("Full data:", JSON.stringify(data, null, 2));

  if (eventType === "subscription.create" || eventType === "charge.success") {
    const email = data.customer?.email;
    const subscriptionCode = data.subscription_code || data.reference;
    const customerCode = data.customer?.customer_code;
    const planCode = data.plan?.plan_code || data.plan_code;

    console.log("Processing subscription for:", email, "plan:", planCode);

    const planMap: Record<string, string> = {
      [process.env.NEXT_PUBLIC_PAYSTACK_STARTER_PLAN!]: "starter",
      [process.env.NEXT_PUBLIC_PAYSTACK_PROFESSIONAL_PLAN!]: "professional",
      [process.env.NEXT_PUBLIC_PAYSTACK_CLINIC_OS_PLAN!]: "clinic_os",
    };

    console.log("Plan map:", planMap);
    const planName = planMap[planCode] || "starter";
    console.log("Resolved plan name:", planName);

    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    console.log("Users error:", usersError);
    console.log("Total users:", users?.users?.length);

    const user = users?.users.find((u) => u.email === email);
    console.log("Found user:", user?.id);

    if (!user) {
      console.log("User not found for email:", email);
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

    console.log("Upsert error:", upsertError);
    console.log("Subscription saved successfully");
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
