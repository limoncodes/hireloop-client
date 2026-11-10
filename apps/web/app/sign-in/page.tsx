
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Checkbox } from "@workspace/ui/components/checkbox";

import {
  ArrowRight,
  BriefcaseBusiness,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
  ShieldCheck,
  Zap,
  AlertCircle,
} from "lucide-react";

import { FcGoogle } from "react-icons/fc";

const SignIn = () => {
 
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Error State
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  // Sign In Handler
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    const newErrors = {
      email: "",
      password: "",
      general: "",
      
    };

    // Email Validation
    if (!email) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Password Validation
    if (!password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);

    // Stop if validation fails
    if (newErrors.email || newErrors.password) {
      return;
    }

    // Demo Login
    setIsLoading(true);

    try {
      console.log("Sign In Data:", {
        email,
        remember,
      });

      // Connect your authentication API here.
      // Example:
      // const response = await fetch("/api/auth/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password, remember }),
      // });

      // Example backend error:
      // if (!response.ok) {
      //   setErrors((prev) => ({
      //     ...prev,
      //     general: "Invalid email or password. Please try again.",
      //   }));
      // }

    } catch {
      setErrors((prev) => ({
        ...prev,
        general: "Something went wrong. Please try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Clear Individual Error
  const clearError = (field: "email" | "password") => {
    setErrors((prev) => ({
      ...prev,
      [field]: "",
      general: "",
    }));
  };

  // Google Login Handler
  const handleGoogleLogin = () => {
    console.log("Google Login Clicked");
  };

  return (
    <main className="relative isolate min-h-[calc(100dvh-64px)] overflow-x-hidden bg-[#08080B] text-white sm:min-h-[calc(100dvh-72px)]">

      {/* Background Effects */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[150px]" />

      <div className="pointer-events-none absolute right-0 top-1/3 h-[350px] w-[350px] rounded-full bg-blue-600/[0.07] blur-[150px]" />

      {/* Main Container */}
      <div className="relative mx-auto grid min-h-[calc(100dvh-64px)] w-full max-w-[1250px] grid-cols-1 items-center gap-10 px-4 py-8 sm:px-6 sm:py-10 lg:min-h-[calc(100dvh-72px)] lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-12">

        {/* Left Branding Section */}
        <section className="hidden flex-col justify-center lg:flex">

          {/* Brand Logo */}
          <Link href="/" className="mb-10 inline-flex w-fit items-center gap-2">

            <div className="flex size-12 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-500/10">
              <BriefcaseBusiness className="size-6 text-purple-400" />
            </div>

            <span className="text-3xl font-extrabold tracking-tight">
              <span className="text-blue-400">hire</span>
              <span className="text-orange-400">loop</span>
            </span>

          </Link>

          {/* Heading */}
          <div className="max-w-[530px]">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/[0.08] px-4 py-2 text-sm font-medium text-purple-300">
              <Sparkles size={15} />
              Welcome back to HireLoop
            </div>

            <h1 className="text-5xl font-bold leading-[1.15] tracking-tight xl:text-6xl">
              Your next
              <span className="block bg-gradient-to-r from-purple-400 via-blue-400 to-purple-300 bg-clip-text text-transparent">
                opportunity awaits.
              </span>
            </h1>

            <p className="mt-6 max-w-[460px] text-base leading-8 text-gray-400">
              Sign in to continue exploring opportunities, manage your
              applications, and take the next step in your career.
            </p>

          </div>

          {/* Feature Cards */}
          <div className="mt-12 grid max-w-[520px] grid-cols-2 gap-4">

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-colors hover:border-purple-400/30">

              <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <Zap size={20} />
              </div>

              <h3 className="font-semibold text-white">
                Find Opportunities
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Explore jobs that match your career goals.
              </p>

            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-colors hover:border-blue-400/30">

              <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <ShieldCheck size={20} />
              </div>

              <h3 className="font-semibold text-white">
                Secure Access
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Access your account with confidence.
              </p>

            </div>

          </div>

          <p className="mt-12 text-sm text-gray-600">
            Build your future with HireLoop.
          </p>

        </section>

        {/* Right Sign In Section */}
        <section className="mx-auto w-full max-w-[480px]">

          <div className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[#111114] shadow-[0_30px_100px_rgba(0,0,0,0.5)] sm:rounded-3xl">

            {/* Card Top Glow */}
            <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-64 -translate-x-1/2 rounded-full bg-purple-600/[0.12] blur-[70px]" />

            {/* Header */}
            <div className="relative px-5 pb-5 pt-7 text-center sm:px-9 sm:pt-9">

              {/* Mobile Logo */}
              <Link
                href="/"
                className="mb-5 inline-flex items-center gap-1 lg:hidden"
              >
                <span className="text-2xl font-extrabold text-blue-400">
                  hire
                </span>

                <span className="text-2xl font-extrabold text-orange-400">
                  loop
                </span>

                <BriefcaseBusiness className="ml-1 size-5 text-purple-400" />
              </Link>

              {/* Icon */}
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-500/10">
                <Sparkles className="size-5 text-purple-400" />
              </div>

              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Welcome Back!
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                Sign in to your account and continue your journey.
              </p>

            </div>

            {/* Form Content */}
            <div className="relative px-5 pb-7 sm:px-9 sm:pb-9">

              <form onSubmit={handleLogin} noValidate className="space-y-5">

                {/* Email Address */}
                <div className="space-y-2">

                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-300"
                  >
                    Email Address
                  </Label>

                  <div className="group relative">

                    <Mail className="absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-purple-400" />

                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      autoComplete="email"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      onChange={() => clearError("email")}
                      className={`h-12 rounded-xl bg-[#1A1A1F] pl-11 text-sm text-white placeholder:text-gray-500 transition-all focus-visible:ring-2 ${
                        errors.email
                          ? "border-red-500/70 focus-visible:border-red-500 focus-visible:ring-red-500/20"
                          : "border-white/10 focus-visible:border-purple-500/60 focus-visible:ring-purple-500/20"
                      }`}
                    />

                  </div>

                  {/* Email Error */}
                  {errors.email && (
                    <p
                      id="email-error"
                      role="alert"
                      className="flex items-center gap-1.5 text-xs font-medium text-red-400"
                    >
                      <AlertCircle size={14} className="shrink-0" />
                      {errors.email}
                    </p>
                  )}

                </div>

                {/* Password */}
                <div className="space-y-2">

                  <div className="flex items-center justify-between gap-2">

                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-300"
                    >
                      Password
                    </Label>

                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-purple-400 transition-colors hover:text-purple-300"
                    >
                      Forgot Password?
                    </Link>

                  </div>

                  <div className="group relative">

                    <LockKeyhole className="absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-purple-400" />

                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      aria-invalid={!!errors.password}
                      aria-describedby={
                        errors.password ? "password-error" : undefined
                      }
                      onChange={() => clearError("password")}
                      className={`h-12 rounded-xl bg-[#1A1A1F] pl-11 pr-12 text-sm text-white placeholder:text-gray-500 transition-all focus-visible:ring-2 ${
                        errors.password
                          ? "border-red-500/70 focus-visible:border-red-500 focus-visible:ring-red-500/20"
                          : "border-white/10 focus-visible:border-purple-500/60 focus-visible:ring-purple-500/20"
                      }`}
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-1 top-1/2 size-10 -translate-y-1/2 text-gray-500 hover:bg-transparent hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </Button>

                  </div>

                  {/* Password Error */}
                  {errors.password && (
                    <p
                      id="password-error"
                      role="alert"
                      className="flex items-center gap-1.5 text-xs font-medium text-red-400"
                    >
                      <AlertCircle size={14} className="shrink-0" />
                      {errors.password}
                    </p>
                  )}

                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-2.5">

                  <Checkbox
                    id="remember"
                    checked={remember}
                    onCheckedChange={(checked) =>
                      setRemember(checked === true)
                    }
                    className="border-white/20 data-[state=checked]:border-purple-500 data-[state=checked]:bg-purple-500"
                  />

                  <Label
                    htmlFor="remember"
                    className="cursor-pointer text-sm text-gray-400"
                  >
                    Remember me
                  </Label>

                </div>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="group h-12 w-full rounded-xl border-0 bg-gradient-to-r from-[#7955F5] to-[#5938DC] text-sm font-semibold text-white shadow-[0_8px_25px_rgba(101,76,245,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:from-[#896DFF] hover:to-[#694BEA] hover:shadow-[0_10px_30px_rgba(101,76,245,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? "Signing In..." : "Sign In"}

                  {!isLoading && (
                    <ArrowRight
                      size={18}
                      className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  )}
                </Button>

                {/* General Error */}
                {errors.general && (
                  <div
                    role="alert"
                    className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3 text-sm text-red-400"
                  >
                    <AlertCircle size={17} className="mt-0.5 shrink-0" />
                    <p>{errors.general}</p>
                  </div>
                )}

              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-4">

                <div className="h-px flex-1 bg-white/10" />

                <span className="text-[10px] font-semibold tracking-[0.16em] text-gray-500">
                  OR CONTINUE WITH
                </span>

                <div className="h-px flex-1 bg-white/10" />

              </div>

              {/* Google Login */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                className="h-12 w-full gap-3 rounded-xl border-white/10 bg-[#1A1A1F] text-sm font-medium text-gray-200 transition-all duration-300 hover:border-white/20 hover:bg-[#24242A] hover:text-white"
              >
                <FcGoogle size={21} />
                Continue with Google
              </Button>

              {/* Sign Up Link */}
              <p className="mt-6 text-center text-sm text-gray-400">
                Don't have an account?{" "}
                <Link
                  href="/sign-up"
                  className="font-semibold text-purple-400 transition-colors hover:text-purple-300"
                >
                  Create Account
                </Link>
              </p>

            </div>

          </div>

          
        </section>

      </div>

    </main>
  );
};

export default SignIn;
