"use client"

import { type FormEvent, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronDown } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { cn } from "@workspace/ui/lib/utils"

const currencies = [
  { code: "BDT", amount: 2553.33, display: "BDT 2,553.33" },
  { code: "USD", amount: 20, display: "$20.00" },
] as const

const countries = [
  "Bangladesh",
  "India",
  "Pakistan",
  "Nepal",
  "Sri Lanka",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "Singapore",
  "United Arab Emirates",
]

// Small brand marks shown inside the card-number field
function CardBrandMarks() {
  return (
    <div className="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1">
      <svg
        viewBox="0 0 24 16"
        aria-hidden="true"
        className="h-4 w-6 opacity-80"
      >
        <rect width="24" height="16" rx="2" fill="#1a1f71" />
        <path
          d="M10.2 10.9 11.4 5h1.7l-1.2 5.9h-1.7ZM7.1 5l1.6 4.1L9 5.9l.29-.9h1.8L9.6 10.9H7.8L5.3 5h1.8Zm9.1 3.8c.7.3 1.1.8 1 1.3-.1.6-.8 1-1.7 1-.5 0-1-.1-1.3-.3l.2-1 .3.2c.4.2.9.2 1.2.1.2 0 .3-.1.3-.2.1-.2 0-.3-.3-.5l-.4-.2c-.7-.4-.9-.8-.8-1.3.1-.8.9-1.3 1.9-1.3.5 0 .9.1 1.1.2l-.2 1a2 2 0 0 0-1-.2c-.2 0-.4 0-.5.1-.1.1-.1.2-.1.3l.3.3.4.2Z"
          fill="#fff"
        />
      </svg>
      <svg viewBox="0 0 24 16" aria-hidden="true" className="h-4 w-6">
        <rect width="24" height="16" rx="2" fill="#252525" />
        <circle cx="9.6" cy="8" r="4.4" fill="#eb001b" />
        <circle cx="14.4" cy="8" r="4.4" fill="#f79e1b" fillOpacity=".9" />
        <path
          d="M12 4.6a4.4 4.4 0 0 1 0 6.8 4.4 4.4 0 0 1 0-6.8Z"
          fill="#ff5f00"
        />
      </svg>
      <svg
        viewBox="0 0 24 16"
        aria-hidden="true"
        className="h-4 w-6 opacity-80"
      >
        <rect width="24" height="16" rx="2" fill="#2e77bc" />
        <path
          d="M13.5 5.2h1.9l1.1 5.6h-1.7l-.2-1.2h-1.9l-.4 1.2H10.5l3-5.6Zm.2 3.2h1.1l-.4-2-.7 2ZM9.5 5.2h1.6l-1 5.6H8.5l1-5.6Zm-1.9 0-.3 1.6c-.3-.2-.7-.3-1.2-.3-.4 0-.6.1-.6.3 0 .2.2.3.7.4.8.2 1.3.6 1.2 1.4-.1 1-.9 1.7-2.2 1.7-.6 0-1.2-.1-1.6-.3l.2-1.3c.4.2.8.3 1.3.3.4 0 .7-.1.7-.4 0-.2-.2-.3-.6-.4-.7-.2-1.3-.6-1.2-1.4.1-1 .9-1.6 2.1-1.6.5 0 .8 0 1.5 0Z"
          fill="#fff"
        />
      </svg>
    </div>
  )
}

// The Link wordmark badge used on the green banner
function LinkMark() {
  return (
    <span className="flex items-center gap-1.5 text-white">
      <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4">
        <circle
          cx="8"
          cy="8"
          r="6.1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
        />
        <path
          d="M9.9 4.4 6.1 11.6"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-base leading-none font-semibold">link</span>
    </span>
  )
}

const PaymentPage = () => {
  const [currency, setCurrency] =
    useState<(typeof currencies)[number]["code"]>("BDT")

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // No payment integration yet — just surface what the form collected.
    const data = Object.fromEntries(new FormData(event.currentTarget))

    console.log("[payment] checkout form data:", {
      ...data,
      plan: "Hireloop Pro Plan",
      price: currencies.find((item) => item.code === currency)?.display,
      total: "BDT 2,553.33",
    })
  }

  return (
    <main className="min-h-svh bg-[#08080a] font-[family-name:var(--font-manrope)] text-[#ededef]">
      <div className="mx-auto w-full max-w-[760px] px-4 pt-6 pb-10 sm:px-6 sm:pt-10">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            aria-label="Back to Hireloop"
          >
            <ArrowLeft className="size-4 text-[#8b8b93] transition-colors group-hover:text-white" />
            <span className="flex size-6 items-center justify-center rounded-md bg-[#1b1b1c] text-sm font-bold text-white ring-1 ring-white/10">
              H
            </span>
          </Link>

          <span className="rounded-full bg-[#1e2329] px-2.5 py-1 text-[9px] font-semibold tracking-[0.14em] text-white/70 uppercase">
            Sandbox
          </span>
        </div>

        <form onSubmit={handleSubmit} className="mt-9 sm:mt-11">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-10">
            {/* Order summary */}
            <section aria-labelledby="order-summary">
              <h1 id="order-summary" className="sr-only">
                Order summary
              </h1>

              <p className="text-[10px] font-semibold tracking-[0.16em] text-[#8b8b93] uppercase">
                Choose a currency:
              </p>

              <div className="mt-3 grid grid-cols-2 gap-3">
                {currencies.map((item) => (
                  <label
                    key={item.code}
                    className={cn(
                      "flex h-9 cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/[0.09] bg-transparent text-sm text-[#a6a6ad] transition-colors select-none",
                      "has-[:checked]:border-white/40 has-[:checked]:bg-[#1b1b1c] has-[:checked]:text-white",
                      "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-white/20"
                    )}
                  >
                    <input
                      type="radio"
                      name="currency"
                      value={item.code}
                      checked={currency === item.code}
                      onChange={() => {
                        setCurrency(item.code)
                        console.log("[payment] currency changed:", item.code)
                      }}
                      className="sr-only"
                    />
                    {item.code === "BDT" ? (
                      <span
                        aria-hidden="true"
                        className="text-[13px] leading-none text-[#c9c9cf]"
                      >
                        ৳
                      </span>
                    ) : null}
                    <span>{item.display}</span>
                  </label>
                ))}
              </div>

              <p className="mt-3 text-[11px] text-[#8b8b93]">
                1 user · ৳2,553.33 BDT
              </p>

              <div className="mt-8 border-t border-white/[0.07] pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-sm font-medium text-white">
                      Hireloop Pro Plan
                    </h2>
                    <p className="mt-1 text-xs text-[#8b8b93]">
                      Access to all features
                    </p>
                  </div>

                  <span className="shrink-0 text-sm text-white">
                    BDT 2,553.33
                  </span>
                </div>
              </div>
            </section>

            {/* Payment form */}
            <section aria-labelledby="payment-details">
              <h2 id="payment-details" className="sr-only">
                Payment details
              </h2>

              {/* Link banner */}
              <div className="flex h-10 items-center gap-3 rounded-lg bg-[#00d66f] px-3.5">
                <LinkMark />

                <span className="ml-auto flex items-center gap-2 text-white">
                  <span
                    aria-hidden="true"
                    className="flex h-4 w-6 items-center justify-center rounded-[3px] bg-white text-[6px] font-bold tracking-tight text-[#1a1f71]"
                  >
                    VISA
                  </span>
                  <span className="text-[13px] font-medium">4242</span>
                </span>
              </div>

              {/* OR divider */}
              <div className="mt-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-white/[0.09]" />
                <span className="text-[10px] font-medium tracking-[0.12em] text-[#8b8b93]">
                  OR
                </span>
                <span className="h-px flex-1 bg-white/[0.09]" />
              </div>

              {/* Contact information */}
              <div className="mt-6">
                <h3 className="text-[13px] font-semibold text-white">
                  Contact information
                </h3>

                <div className="mt-2 space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-[10px] font-medium tracking-[0.08em] text-[#8b8b93]"
                  >
                    Email
                  </Label>

                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="email@example.com"
                    className="h-10 rounded-lg border-white/[0.06] bg-[#1b1b1c] px-3 text-sm text-white placeholder:text-[#6f6f78] focus-visible:border-[#0170e0]/60 focus-visible:ring-[#0170e0]/20 dark:bg-[#1b1b1c]"
                  />
                </div>
              </div>

              {/* Payment method */}
              <div className="mt-5">
                <h3 className="text-[13px] font-semibold text-white">
                  Payment method
                </h3>

                <div className="mt-2 flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-[#17171a] px-3 py-2.5">
                  <span
                    aria-hidden="true"
                    className="flex h-4 w-6 items-center justify-center rounded-[3px] border border-white/40"
                  >
                    <span className="h-px w-2.5 bg-white/50" />
                  </span>
                  <span className="text-sm text-white">Card</span>
                </div>
              </div>

              {/* Card information */}
              <div className="mt-4">
                <Label
                  htmlFor="cardNumber"
                  className="text-[10px] font-medium tracking-[0.08em] text-[#8b8b93]"
                >
                  Card information
                </Label>

                <div className="mt-1.5 overflow-hidden rounded-lg border border-white/[0.06] bg-[#1b1b1c] focus-within:border-[#0170e0]/60">
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      placeholder="1234 1234 1234 1234"
                      className="h-10 rounded-none border-0 bg-transparent pr-24 pl-3 text-sm text-white placeholder:text-[#6f6f78] focus-visible:ring-0 dark:bg-transparent"
                    />
                    <CardBrandMarks />
                  </div>

                  <div className="grid grid-cols-2 border-t border-white/[0.06]">
                    <Input
                      name="expiry"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      aria-label="Expiry date"
                      placeholder="MM / YY"
                      className="h-10 rounded-none border-0 bg-transparent px-3 text-sm text-white placeholder:text-[#6f6f78] focus-visible:ring-0 dark:bg-transparent"
                    />
                    <Input
                      name="cvc"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      aria-label="Card security code"
                      placeholder="CVC"
                      className="h-10 rounded-none border-0 border-l border-white/[0.06] bg-transparent px-3 text-sm text-white placeholder:text-[#6f6f78] focus-visible:ring-0 dark:bg-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Cardholder name */}
              <div className="mt-4 space-y-1.5">
                <Label
                  htmlFor="cardholder"
                  className="text-[10px] font-medium tracking-[0.08em] text-[#8b8b93]"
                >
                  Cardholder name
                </Label>

                <Input
                  id="cardholder"
                  name="cardholder"
                  autoComplete="cc-name"
                  placeholder="Full name on card"
                  className="h-10 rounded-lg border-white/[0.06] bg-[#1b1b1c] px-3 text-sm text-white placeholder:text-[#6f6f78] focus-visible:border-[#0170e0]/60 focus-visible:ring-[#0170e0]/20 dark:bg-[#1b1b1c]"
                />
              </div>

              {/* Country or region */}
              <div className="mt-4 space-y-1.5">
                <Label
                  htmlFor="country"
                  className="text-[10px] font-medium tracking-[0.08em] text-[#8b8b93]"
                >
                  Country or region
                </Label>

                <div className="relative">
                  <select
                    id="country"
                    name="country"
                    autoComplete="country-name"
                    defaultValue="Bangladesh"
                    className="h-10 w-full appearance-none rounded-lg border border-white/[0.06] bg-[#1b1b1c] px-3 pr-9 text-sm text-white outline-none focus-visible:border-[#0170e0]/60 focus-visible:ring-2 focus-visible:ring-[#0170e0]/20"
                  >
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#8b8b93]"
                  />
                </div>
              </div>

              {/* Save information */}
              <div className="mt-5 flex items-start gap-2.5">
                <Checkbox
                  id="saveInfo"
                  name="saveInfo"
                  value="true"
                  className="mt-0.5 size-4 border-white/25 data-checked:border-[#0170e0] data-checked:bg-[#0170e0] data-checked:text-white"
                />
                <Label
                  htmlFor="saveInfo"
                  className="cursor-pointer text-xs leading-5 font-normal text-[#a6a6ad]"
                >
                  Save my information for faster checkout
                </Label>
              </div>

              <p className="mt-2 text-[11px] leading-4 text-[#8b8b93]">
                Pay securely on this site and everywhere Link is accepted.
              </p>

              <div className="mt-4 border-t border-white/[0.07] pt-4">
                <Button
                  type="submit"
                  className="h-12 w-full rounded-lg border-0 bg-[#0170e0] text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(1,112,224,0.9)] hover:bg-[#0d7de8] focus-visible:ring-[#0170e0]/40"
                >
                  Pay
                </Button>
              </div>
            </section>
          </div>
        </form>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.07]">
        <div className="mx-auto w-full max-w-[760px] px-4 py-8 text-center sm:px-6">
          <p className="text-xs text-[#8b8b93]">
            Powered by{" "}
            <span className="font-semibold text-white/80">Stripe</span>
          </p>

          <div className="mt-3 flex items-center justify-center gap-5 text-[11px] text-[#8b8b93]">
            <Link href="/about" className="transition-colors hover:text-white">
              Terms
            </Link>
            <Link href="/about" className="transition-colors hover:text-white">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default PaymentPage
