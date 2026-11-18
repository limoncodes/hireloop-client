import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"

import logo from "@/app/images/logo.png"

const order = {
  plan: "Hireloop Pro Plan",
  description: "Access to all features",
  price: "$20.00 USD",
  payable: "$20.00",
}

type CheckoutPageProps = {
  searchParams: Promise<{ canceled?: string }>
}

const CheckoutPage = async ({ searchParams }: CheckoutPageProps) => {
  const { canceled } = await searchParams
  if (canceled) {
    console.log(
      'Order canceled -- continue to shop around and check out when you\'re ready.'
    )
  }




  return (
    <main className="min-h-svh bg-[#08080a] font-[family-name:var(--font-manrope)] text-[#ededef]">
      <div className="relative mx-auto w-full max-w-[880px] px-4 pt-6 pb-10 sm:px-6 sm:pt-10">
        {/* soft glow behind the payment column */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-16 right-0 -z-0 size-[420px] rounded-full bg-[#0170e0]/10 blur-[110px]"
        />

        {/* Top bar */}
        <header className="relative flex items-center justify-between gap-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            aria-label="Back to Hireloop"
          >
            <ArrowLeft className="size-4 text-[#8b8b93] transition-colors group-hover:text-white" />
            <Image
              src={logo}
              alt="Hireloop"
              height={18}
              priority
              className="h-[18px] w-auto opacity-90 transition-opacity group-hover:opacity-100"
            />
          </Link>

          <span className="flex items-center gap-1.5 text-[10px] font-medium tracking-[0.12em] text-[#8b8b93] uppercase">
            <Lock aria-hidden="true" className="size-3" />
            Secure checkout
          </span>
        </header>

        {canceled ? (
          <p
            role="status"
            className="relative mt-6 rounded-lg border border-[#f5a524]/20 bg-[#f5a524]/10 px-3 py-2.5 text-xs leading-5 text-[#f7c26b]"
          >
            Your payment was canceled — you can try again whenever you&apos;re
            ready.
          </p>
        ) : null}

        <div className="relative mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
          {/* Order summary */}
          <section aria-labelledby="order-summary">
            <h1
              id="order-summary"
              className="text-[10px] font-semibold tracking-[0.16em] text-[#8b8b93] uppercase"
            >
              Order summary
            </h1>

            <div className="mt-6 flex items-start gap-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#1b1b1c] text-sm font-bold text-white ring-1 ring-white/10">
                H
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white">{order.plan}</p>
                <p className="mt-1 text-xs text-[#8b8b93]">
                  {order.description}
                </p>
              </div>

              <span className="shrink-0 text-sm text-white">{order.price}</span>
            </div>

            <Separator className="mt-6 bg-white/[0.07]" />

            <div className="mt-4 flex items-baseline justify-between gap-4">
              <span className="text-xs text-[#8b8b93]">Total due today</span>
              <span className="text-base font-semibold text-white">
                {order.price}
              </span>
            </div>

            <p className="mt-2 text-[11px] leading-4 text-[#8b8b93]">
              Billed once. Cancel anytime.
            </p>
          </section>

          {/* Payment hand-off */}
          <section aria-labelledby="payment">
            <h2
              id="payment"
              className="text-[10px] font-semibold tracking-[0.16em] text-[#8b8b93] uppercase"
            >
              Payment
            </h2>

            <p className="mt-6 text-sm leading-6 text-[#a6a6ad]">
              You&apos;ll be redirected to Stripe&apos;s secure checkout to
              complete your payment.
            </p>

            <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-[#8b8b93]">
              <ShieldCheck
                aria-hidden="true"
                className="mt-0.5 size-3.5 shrink-0 text-[#8b8b93]"
              />
              Card details are never stored on Hireloop.
            </p>

            {/* Functionality is wired up separately — this button is presentational for now. */}

            <form action="/api/checkout_sessions" method="POST">
              <section>
                <Button
                  type="submit"
                  role="link"
                  className="mt-8 h-12 w-full rounded-lg border-0 bg-[#0170e0] text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(1,112,224,0.9)] hover:bg-[#0d7de8] focus-visible:ring-[#0170e0]/40"
                >
                  Pay {order.payable}
                </Button>
              </section>
            </form>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[#8b8b93]">
              <Lock aria-hidden="true" className="size-3" />
              Payments are processed by Stripe
            </p>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.07]">
        <div className="mx-auto flex w-full max-w-[880px] items-center justify-center px-4 py-8 sm:px-6">
          <p className="text-xs text-[#8b8b93]">
            Powered by{" "}
            <span className="font-semibold text-white/80">Stripe</span>
          </p>
        </div>
      </footer>
    </main>
  )
}

export default CheckoutPage
