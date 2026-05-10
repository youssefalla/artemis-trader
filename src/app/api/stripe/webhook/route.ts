import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

export async function POST(req: Request) {
  const body = await req.text();
  const sig  = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const admin = createAdminClient();

  switch (event.type) {

    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId  = session.metadata?.user_id;
      const plan    = session.metadata?.plan ?? "trader";
      if (!userId) break;
      await admin.from("profiles").update({ subscription_status: "active" } as any).eq("id", userId);
      await admin.from("subscriptions").upsert({
        user_id: userId,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.subscription as string,
        plan,
        status: "active",
        current_period_start: new Date().toISOString(),
      } as any, { onConflict: "user_id" });
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;
      const { data: sub } = await admin.from("subscriptions").select("user_id").eq("stripe_customer_id", customerId).single();
      if (sub?.user_id) {
        await admin.from("profiles").update({ subscription_status: "active" } as any).eq("id", sub.user_id);
        await admin.from("subscriptions").update({ status: "active" } as any).eq("stripe_customer_id", customerId);
      }
      break;
    }

    case "customer.subscription.deleted":
    case "invoice.payment_failed": {
      const obj = event.data.object as any;
      const customerId = obj.customer as string;
      const { data: sub } = await admin.from("subscriptions").select("user_id").eq("stripe_customer_id", customerId).single();
      if (sub?.user_id) {
        const newStatus = event.type === "customer.subscription.deleted" ? "cancelled" : "inactive";
        await admin.from("profiles").update({ subscription_status: newStatus, bot_access_granted: false, copy_trading_enabled: false } as any).eq("id", sub.user_id);
        await admin.from("subscriptions").update({ status: newStatus } as any).eq("stripe_customer_id", customerId);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
