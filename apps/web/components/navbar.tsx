
"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet"

import { cn } from "@workspace/ui/lib/utils"
import logo from "@/app/images/logo.png"


// Navbar Links
const navLinks = [
  { href: "/jobs", label: "Browse Jobs" },
  { href: "/companies", label: "Company" },
  { href: "/pricing", label: "Pricing" },
]


export function Navbar() {

  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="sticky top-4 z-50 mx-auto my-4 w-full max-w-[1440px] px-3 sm:px-5">

      <div className="flex h-[72px] items-center justify-between rounded-2xl border border-white/[0.07] bg-[#141418] px-3 shadow-[0_1px_2px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(0,0,0,0.04)]">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src={logo}
            alt="hireloop"
            width={154}
            height={44}
            className="h-10 w-auto sm:h-11"
            priority
          />
        </Link>


        {/* Desktop Navbar */}
        <div className="hidden items-center lg:flex">

          <nav className="flex items-center gap-8">

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "whitespace-nowrap text-[15px] font-semibold text-[#EDEDEF] underline-offset-[10px] transition-colors hover:text-white",
                  pathname === link.href && "underline decoration-1"
                )}
              >
                {link.label}
              </Link>
            ))}

          </nav>


          {/* Divider */}
          <span className="mx-4 h-6 w-px bg-white/15" />


          {/* Auth Buttons */}
          <div className="flex items-center gap-2">

            <Button
              variant="ghost"
              nativeButton={false}
              render={<Link href="/sign-in" />}
              className="h-[52px] rounded-lg px-3 text-[15px] font-semibold text-[#A49FFF] hover:bg-white/5 hover:text-white"
            >
              Sign In
            </Button>

            <Button
              nativeButton={false}
              render={<Link href="/sign-up" />}
              className="h-[52px] rounded-lg bg-[#5C53FE] px-4 text-base font-bold text-[#EDEDEF] shadow-[inset_0_3px_10px_rgba(255,255,255,0.2),0_2px_4px_rgba(9,10,21,0.1)] hover:bg-[#6D65FF] hover:text-white"
            >
              Get Started
            </Button>

          </div>

        </div>


        {/* Mobile Navbar */}
        <div className="lg:hidden">

          <Sheet open={open} onOpenChange={setOpen}>

            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#EDEDEF] hover:bg-white/5"
                  aria-label="Open menu"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>


            <SheetContent
              side="left"
              className="w-72 border-white/10 bg-[#141418]"
            >

              <SheetHeader>
                <SheetTitle className="sr-only">
                  Menu
                </SheetTitle>
              </SheetHeader>


              {/* Mobile Links */}
              <nav className="flex flex-col gap-1 px-4">

                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-md px-3 py-2 text-base font-bold tracking-[-0.01em] text-[#EDEDEF] transition-colors hover:bg-white/5 hover:text-white",
                      pathname === link.href && "underline decoration-1 underline-offset-[10px]"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}

              </nav>


              {/* Mobile Auth Buttons */}
              <div className="mt-auto flex flex-col gap-3 border-t border-white/10 p-4">

                <Button
                  variant="ghost"
                  nativeButton={false}
                  render={<Link href="/sign-in" />}
                  className="h-11 w-full border border-white/10 px-0 text-sm text-[#A49FFF] hover:border-white/10 hover:bg-white/5"
                >
                  Sign In
                </Button>

                <Button
                  nativeButton={false}
                  render={<Link href="/sign-up" />}
                  className="h-11 w-full bg-[#5C53FE] text-sm text-white hover:bg-[#6D65FF]"
                >
                  Get Started
                </Button>

              </div>

            </SheetContent>

          </Sheet>

        </div>

      </div>

    </div>
  )
}
