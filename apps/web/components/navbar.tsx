
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@workspace/ui/components/button";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";

import { cn } from "@workspace/ui/lib/utils";
import logo from "@/app/images/logo.png";
import {  authClient, useSession } from "@/lib/auth-client";

// Navbar Links
const navLinks = [
  { href: "/jobs", label: "Browse Jobs" },
  { href: "/companies", label: "Company" },
  { href: "/pricing", label: "Pricing" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: userdata } = useSession()
  const handlesignout = async ()=>{
    await authClient.signOut()

  }
  


  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-4 sm:px-5">

      {/* Main Navbar */}
      <div className="mx-auto w-full max-w-[1440px] rounded-2xl border border-white/[0.07] bg-[#141418] shadow-[0_2px_12px_rgba(0,0,0,0.35)]">

        <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-4 sm:h-[72px] sm:px-6 lg:px-8">

          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center"
            onClick={() => setOpen(false)}
          >
            <Image
              src={logo}
              alt="HireLoop"
              width={154}
              height={44}
              priority
              className="h-9 w-auto object-contain sm:h-11"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center lg:flex">

            <nav className="flex items-center gap-7 xl:gap-9">

              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  pathname.startsWith(`${link.href}/`);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "whitespace-nowrap text-sm font-semibold text-[#EDEDEF] transition-colors hover:text-white xl:text-[15px]",
                      isActive && "text-[#A49FFF]"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}

            </nav>

            {/* Divider */}
            <div className="mx-5 h-6 w-px bg-white/15 xl:mx-6" />

            {
              userdata?.user ? <><span>{userdata.user.name}</span> 
              <Button
              onClick={handlesignout}
                    
                   
                    className="h-11 rounded-lg bg-[#5C53FE] px-4 text-sm font-bold text-white shadow-[inset_0_3px_10px_rgba(255,255,255,0.2)] transition-colors hover:bg-[#6D65FF]"
                  >
                    SignOut
                  </Button>

              </> : <>
                {/* Auth Buttons */}
                <div className="flex shrink-0 items-center gap-2">

                  <Button
                    variant="ghost"
                    nativeButton={false}
                    render={<Link href="/sign-in" />}
                    className="h-11 rounded-lg px-3 text-sm font-semibold text-[#A49FFF] hover:bg-white/5 hover:text-white"
                  >
                    Sign In
                  </Button>

                  <Button
                    nativeButton={false}
                    render={<Link href="/sign-up" />}
                    className="h-11 rounded-lg bg-[#5C53FE] px-4 text-sm font-bold text-white shadow-[inset_0_3px_10px_rgba(255,255,255,0.2)] transition-colors hover:bg-[#6D65FF]"
                  >
                    Get Started
                  </Button>

                </div>
              </>
            }

          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center lg:hidden">

            <Sheet open={open} onOpenChange={setOpen}>

              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Open navigation menu"
                    className="size-10 text-white hover:bg-white/10"
                  />
                }
              >
                <Menu className="size-6" />
              </SheetTrigger>

              <SheetContent
                side="right"
                className="flex w-[280px] flex-col border-l border-white/10 bg-[#141418] p-0 text-white sm:w-[320px]"
              >

                {/* Sheet Header */}
                <SheetHeader className="border-b border-white/10 px-5 py-5">

                  <SheetTitle className="flex items-center">
                    <Link
                      href="/"
                      onClick={() => setOpen(false)}
                    >
                      <Image
                        src={logo}
                        alt="HireLoop"
                        width={130}
                        height={40}
                        className="h-9 w-auto object-contain"
                      />
                    </Link>
                  </SheetTitle>

                </SheetHeader>

                {/* Mobile Links */}
                <nav className="flex flex-1 flex-col gap-2 px-4 py-6">

                  {navLinks.map((link) => {
                    const isActive =
                      pathname === link.href ||
                      pathname.startsWith(`${link.href}/`);

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "rounded-xl px-4 py-3 text-sm font-semibold text-[#EDEDEF] transition-colors hover:bg-white/[0.06] hover:text-white",
                          isActive &&
                          "bg-purple-500/10 text-[#A49FFF]"
                        )}
                      >
                        {link.label}
                      </Link>
                    );
                  })}

                </nav>

                {/* Mobile Auth Buttons */}
                <div className="flex flex-col gap-3 border-t border-white/10 p-5">

                  <Button
                    variant="outline"
                    nativeButton={false}
                    render={<Link href="/sign-in" />}
                    onClick={() => setOpen(false)}
                    className="h-11 w-full border-white/10 bg-transparent text-sm font-semibold text-[#A49FFF] hover:bg-white/5 hover:text-white"
                  >
                    Sign In
                  </Button>

                  <Button
                    nativeButton={false}
                    render={<Link href="/sign-up" />}
                    onClick={() => setOpen(false)}
                    className="h-11 w-full bg-[#5C53FE] text-sm font-semibold text-white hover:bg-[#6D65FF]"
                  >
                    Get Started
                  </Button>

                </div>

              </SheetContent>

            </Sheet>

          </div>

        </div>

      </div>

    </header>
  );
}
