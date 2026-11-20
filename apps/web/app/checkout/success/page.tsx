import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import type Stripe from "stripe"
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  CreditCard,
  Hash,
  Infinity as InfinityIcon,
  LayoutDashboard,
  Lock,
  Mail,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  Zap,
} from "lucide-react"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"

import logo from "@/app/images/logo.png"
import { checkoutverify } from "@/lib/action/payment"
import { stripe } from "@/lib/stripe"

type CheckoutSuccessProps = {
  searchParams: Promise<{ session_id?: string }>
}

const benefits = [
  {
    icon: InfinityIcon,
    title: "Unlimited applications",
    description: "Apply to every job you like — no 10-application cap.",
  },
  {
    icon: Zap,
    title: "Priority job alerts",
    description: "Get the newest roles before everyone else.",
  },
  {
    icon: BadgeCheck,
    title: "Verified profile badge",
    description: "Stand out to recruiters with a Pro badge.",
  },
  {
    icon: Sparkles,
    title: "Full feature access",
    description: "Every Hireloop tool, unlocked from day one.",
  },
]

const steps = [
  { label: "Payment confirmed", icon: CheckCircle2, state: "done" },
  { label: "Pro access activated", icon: BadgeCheck, state: "done" },
  { label: "Start applying", icon: BriefcaseBusiness, state: "active" },
]

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-svh overflow-hidden bg-[#010103] font-[family-name:var(--font-manrope)] text-[#ededef]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px]"
      >
        <div className="absolute -top-52 left-1/2 size-[560px] -translate-x-1/2 rounded-full bg-[#0170e0]/12 blur-[130px]" />
        <div className="absolute -top-40 left-[46%] size-[380px] rounded-full bg-[#5c53fe]/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto w-full max-w-[1080px] px-4 pt-8 pb-16 sm:px-6 sm:pt-10">
        <header className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            aria-label="Back to Hireloop"
          >
            <Image
              src={logo}
              alt="Hireloop"
              height={20}
              priority
              className="h-5 w-auto opacity-90 transition-opacity group-hover:opacity-100"
            />
            <Separator
              orientation="vertical"
              className="h-4 bg-white/10"
              aria-hidden="true"
            />
            <span className="text-[10px] font-semibold tracking-[0.16em] text-[#8b8b93] uppercase">
              Payment receipt
            </span>
          </Link>

          <span className="flex items-center gap-1.5 text-[10px] font-medium tracking-[0.12em] text-[#8b8b93] uppercase">
            <Lock aria-hidden="true" className="size-3" />
            Secure payment
          </span>
        </header>

        {children}
      </div>
    </main>
  )
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="flex items-center gap-2.5 text-xs text-[#8b8b93]">
        <Icon aria-hidden={true} className="size-3.5 shrink-0 text-[#6e6e78]" />
        {label}
      </span>
      <span className="min-w-0 truncate text-right text-xs font-medium text-[#e7e7eb]">
        {value}
      </span>
    </div>
  )
}

export default async function CheckOutSuccessPage({
  searchParams,
}: CheckoutSuccessProps) {
  const { session_id } = await searchParams

  if (!session_id) redirect("/checkout")

  let session: Stripe.Checkout.Session | null = null
  let retrieveError: string | null = null

  try {
    session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent"],
    })
  } catch (error) {
    retrieveError =
      error instanceof Error ? error.message : "Could not retrieve the session"
  }

  if (!retrieveError && session?.status === "open") redirect("/checkout")

  const paid =
    !retrieveError &&
    session?.status === "complete" &&
    session?.payment_status === "paid"

  let activationError: string | null = null
  if (paid) {
    try {
      await checkoutverify(session_id)
    } catch (error) {
      activationError =
        error instanceof Error
          ? error.message
          : "Could not activate your plan automatically"
    }
  }

  if (!paid || !session) {
    return (
      <PageShell>
        <section className="mx-auto mt-24 max-w-xl text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-[#f5a524]/25 bg-[#f5a524]/10 text-[#f7c26b]">
            <TriangleAlert aria-hidden="true" className="size-7" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight">
            Payment not completed
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#8b8b93]">
            {retrieveError ??
              "We couldn't confirm your payment. Please try again or contact support."}
          </p>
          <Button
            nativeButton={false}
            render={<Link href="/checkout" />}
            className="mt-8 h-11 rounded-lg bg-[#0170e0] px-5 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(1,112,224,0.9)] hover:bg-[#0d7de8]"
          >
            Back to checkout
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        </section>
      </PageShell>
    )
  }

  const currency = (session.currency ?? "usd").toUpperCase()
  const amount = session.amount_total
    ? (session.amount_total / 100).toLocaleString("en-US", {
        style: "currency",
        currency,
      })
    : "$20.00"
  const paidAt = session.created
    ? new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(session.created * 1000))
    : "Just now"
  const paymentIntent =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : (session.payment_intent?.id ?? "—")
  const email =
    session.customer_details?.email ?? session.customer_email ?? "your email"
  // Stripe stores this product as "HireLoopPro" — show the readable label.
  const plan = "Hireloop Pro Plan"

  return (
    <PageShell>
      {/* Hero */}
      <section className="mt-14 flex flex-col items-center text-center">
        <div className="relative flex size-20 items-center justify-center rounded-full bg-emerald-400/10 shadow-[0_0_70px_-16px_rgba(52,211,153,0.65)] ring-1 ring-emerald-400/25">
          <div className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-300 to-teal-500 text-[#042018]">
            <Check aria-hidden="true" className="size-7" strokeWidth={3} />
          </div>
        </div>

        <Badge className="mt-6 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold tracking-[0.14em] text-emerald-300 uppercase">
          Pro access active
        </Badge>

        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-[40px] sm:leading-tight">
          Payment successful
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-6 text-[#8b8b93]">
          Welcome to Hireloop Pro. Your account is unlocked — apply to as many
          jobs as you want, with no limits.
        </p>
      </section>

      {activationError ? (
        <div
          role="status"
          className="mx-auto mt-8 flex max-w-2xl items-start gap-2.5 rounded-xl border border-[#f5a524]/20 bg-[#f5a524]/10 px-4 py-3 text-xs leading-5 text-[#f7c26b]"
        >
          <TriangleAlert
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0"
          />
          <span>
            Your payment went through, but we couldn&apos;t activate your plan
            automatically. Please contact support with session{" "}
            <span className="font-mono">{session_id}</span>.
          </span>
        </div>
      ) : null}

      {/* Receipt + plan */}
      <div className="mt-12 grid gap-5 lg:grid-cols-[1.15fr_1fr]">
        <section
          aria-labelledby="receipt-heading"
          className="rounded-2xl border border-white/[0.07] bg-[#0d0d11] p-6 shadow-[0_24px_60px_-32px_rgba(0,0,0,0.9)]"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.04] text-[#a6a6ad]">
                <ReceiptText aria-hidden="true" className="size-4" />
              </span>
              <div>
                <h2
                  id="receipt-heading"
                  className="text-sm font-semibold text-white"
                >
                  Receipt
                </h2>
                <p className="mt-0.5 text-[11px] text-[#8b8b93]">
                  Order summary
                </p>
              </div>
            </div>
            <Badge className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold tracking-wider text-emerald-300 uppercase">
              Paid
            </Badge>
          </div>

          <div className="mt-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.16em] text-[#8b8b93] uppercase">
                Total paid
              </p>
              <p className="mt-1.5 text-3xl font-semibold tracking-tight text-white">
                {amount}
                <span className="ml-2 text-sm font-medium text-[#8b8b93]">
                  {currency}
                </span>
              </p>
            </div>
            <ShieldCheck
              aria-hidden="true"
              className="size-5 text-emerald-400/70"
            />
          </div>

          <Separator className="mt-6 bg-white/[0.07]" />

          <div className="mt-1 divide-y divide-white/[0.05]">
            <DetailRow icon={BriefcaseBusiness} label="Plan" value={plan} />
            <DetailRow icon={CalendarDays} label="Date" value={paidAt} />
            <DetailRow icon={Mail} label="Email" value={email} />
            <DetailRow
              icon={CreditCard}
              label="Payment ID"
              value={paymentIntent}
            />
            <DetailRow icon={Hash} label="Session ID" value={session_id} />
          </div>
        </section>

        <section
          aria-labelledby="plan-heading"
          className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d0d11] p-6 shadow-[0_24px_60px_-32px_rgba(0,0,0,0.9)]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-20 size-56 rounded-full bg-[#5c53fe]/15 blur-[70px]"
          />
          <div className="relative">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-xl border border-[#5c53fe]/25 bg-[#5c53fe]/15 text-[#a49fff]">
                <Sparkles aria-hidden="true" className="size-4" />
              </span>
              <div>
                <h2
                  id="plan-heading"
                  className="text-sm font-semibold text-white"
                >
                  Your plan
                </h2>
                <p className="mt-0.5 text-[11px] text-[#8b8b93]">
                  Billed once. Cancel anytime.
                </p>
              </div>
            </div>

            <div className="mt-7 flex items-baseline gap-2">
              <span className="text-xl font-semibold text-white">
                Hireloop Pro
              </span>
              <span className="text-xs text-[#8b8b93]">
                {amount} / one-time
              </span>
            </div>

            <Separator className="mt-5 bg-white/[0.07]" />

            <ul className="mt-4 space-y-4">
              {benefits.map(({ icon: Icon, title, description }) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                    <Check
                      aria-hidden="true"
                      className="size-3"
                      strokeWidth={3}
                    />
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-xs font-medium text-white">
                      <Icon
                        aria-hidden="true"
                        className="size-3.5 text-[#a49fff]"
                      />
                      {title}
                    </p>
                    <p className="mt-1 text-[11px] leading-4 text-[#8b8b93]">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* Progress */}
      <section
        aria-label="What happens next"
        className="mt-5 grid gap-2 rounded-2xl border border-white/[0.07] bg-[#0d0d11] p-6 sm:grid-cols-3"
      >
        {steps.map(({ label, icon: Icon, state }, index) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 even:sm:border-x even:sm:border-white/[0.06]"
          >
            <span
              className={`flex size-8 shrink-0 items-center justify-center rounded-lg border ${
                state === "active"
                  ? "border-[#0170e0]/30 bg-[#0170e0]/15 text-[#4da6ff]"
                  : "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
              }`}
            >
              <Icon aria-hidden="true" className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-white">{label}</p>
              <p className="mt-0.5 text-[11px] text-[#8b8b93]">
                {state === "active" ? "Ready for you" : "Complete"}
              </p>
            </div>
            {index < steps.length - 1 ? (
              <ArrowRight
                aria-hidden="true"
                className="ml-auto hidden size-3.5 text-[#4b4b55] sm:block"
              />
            ) : null}
          </div>
        ))}
      </section>

      {/* Next actions */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Link
          href="/browsejobs"
          className="group rounded-2xl border border-white/[0.07] bg-[#0d0d11] p-5 transition-colors hover:border-[#0170e0]/40 hover:bg-[#111117] focus-visible:ring-2 focus-visible:ring-[#0170e0]/40 focus-visible:outline-none"
        >
          <div className="flex items-start justify-between gap-4">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#0170e0]/15 text-[#4da6ff]">
              <BriefcaseBusiness aria-hidden="true" className="size-4" />
            </span>
            <ArrowRight
              aria-hidden="true"
              className="size-4 text-[#6e6e78] transition-transform group-hover:translate-x-0.5 group-hover:text-white"
            />
          </div>
          <p className="mt-4 text-sm font-semibold text-white">Browse jobs</p>
          <p className="mt-1 text-xs text-[#8b8b93]">
            Find your next role and apply without limits.
          </p>
        </Link>

        <Link
          href="/dashboard/seeker"
          className="group rounded-2xl border border-white/[0.07] bg-[#0d0d11] p-5 transition-colors hover:border-[#5c53fe]/40 hover:bg-[#111117] focus-visible:ring-2 focus-visible:ring-[#5c53fe]/40 focus-visible:outline-none"
        >
          <div className="flex items-start justify-between gap-4">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#5c53fe]/15 text-[#a49fff]">
              <LayoutDashboard aria-hidden="true" className="size-4" />
            </span>
            <ArrowRight
              aria-hidden="true"
              className="size-4 text-[#6e6e78] transition-transform group-hover:translate-x-0.5 group-hover:text-white"
            />
          </div>
          <p className="mt-4 text-sm font-semibold text-white">
            Go to dashboard
          </p>
          <p className="mt-1 text-xs text-[#8b8b93]">
            See your applications and profile at a glance.
          </p>
        </Link>
      </div>

      <footer className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/[0.07] pt-6 text-[11px] text-[#6e6e78] sm:flex-row">
        <p className="flex items-center gap-1.5">
          <ShieldCheck aria-hidden="true" className="size-3.5" />
          Payments are securely processed by Stripe
        </p>
        <p>
          Questions? Email{" "}
          <a
            href="mailto:orders@example.com"
            className="text-[#a6a6ad] underline underline-offset-2 hover:text-white"
          >
            orders@example.com
          </a>
        </p>
      </footer>
    </PageShell>
  )
}
