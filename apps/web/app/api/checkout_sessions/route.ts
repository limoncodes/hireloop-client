import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { getsession } from "@/lib/core/server"

export async function POST() {
  const usersession = await getsession()
  try {
    const headersList = await headers()
    const origin = headersList.get("origin")

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: "price_1Ud6QBI1uCBMV2mAihAg5UGV",
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: usersession?.user.email,
      // Backend needs this to mark the user premium after verification.
      metadata: {
        userId: usersession?.user.id ?? "",
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?canceled=true`,
      // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
      integration_identifier: "Hireloop_web",
    })
    return NextResponse.redirect(session.url as string, 303)
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
