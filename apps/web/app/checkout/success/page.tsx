import Link from "next/link"
import { redirect } from "next/navigation"

import { checkoutverify } from "@/lib/action/payment"
import { stripe } from "@/lib/stripe"

type CheckoutSuccessProps = {
  searchParams: Promise<{ session_id?: string }>
}

export default async function CheckOutSuccessPage({
  searchParams,
}: CheckoutSuccessProps) {
  const { session_id } = await searchParams

  if (!session_id) redirect("/checkout")

  let status: string | null = null
  let paymentStatus: string | null = null
  let verifyMessage: string | null = null

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent"],
    })
    status = session.status
    paymentStatus = session.payment_status

    if (status === "open") redirect("/")

    if (status === "complete" && paymentStatus === "paid") {
      await checkoutverify(session_id)
    }
  } catch (error) {
    verifyMessage =
      error instanceof Error ? error.message : "Something went wrong"
  }

  if (status === "complete" && paymentStatus === "paid" && !verifyMessage) {
    return (
      <section id="success" className="mx-auto max-w-xl px-6 py-24">
        <h1 className="text-2xl font-semibold">Payment successful</h1>
        <p className="mt-4 text-sm text-[#8b8b93]">
          We appreciate your business! A confirmation email will be sent to your
          email address. If you have any questions, please email{" "}
          <a href="mailto:orders@example.com" className="underline">
            orders@example.com
          </a>
          .
        </p>
      </section>
    )
  }

  return (
    <section id="success" className="mx-auto max-w-xl px-6 py-24">
      <h1 className="text-2xl font-semibold">Payment not completed</h1>
      <p className="mt-4 text-sm text-[#8b8b93]">
        {verifyMessage ??
          "We couldn't confirm your payment. Please try again or contact support."}
      </p>
      <Link
        href="/checkout"
        className="mt-6 inline-block rounded-lg bg-[#0170e0] px-4 py-2 text-sm font-medium text-white"
      >
        Back to checkout
      </Link>
    </section>
  )
}
