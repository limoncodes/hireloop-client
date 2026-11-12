
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  UserRound,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";

// Account types — must match the `role` additional field in lib/auth.ts
const roles = [
  {
    value: "seeker",
    label: "Seeker",
    description: "Find jobs",
    icon: UserRound,
  },
  {
    value: "recruiter",
    label: "Recruiter",
    description: "Hire talent",
    icon: BriefcaseBusiness,
  },
  {
    value: "admin",
    label: "Admin",
    description: "Manage platform",
    icon: ShieldCheck,
  },
] as const;

type Role = (typeof roles)[number]["value"];

const SignUp = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [role, setRole] = useState<Role>("seeker");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [termsError, setTermsError] = useState("");

  // Password Requirements
  const passwordChecks = [
    {
      label: "At least 8 characters",
      valid: password.length >= 8,
    },
    {
      label: "Uppercase letter (A-Z)",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "Lowercase letter (a-z)",
      valid: /[a-z]/.test(password),
    },
    {
      label: "One number (0-9)",
      valid: /[0-9]/.test(password),
    },
    {
      label: "Special character (!@#$%)",
      valid: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const strength = passwordChecks.filter((item) => item.valid).length;

  const strengthLabel =
    strength <= 2
      ? "Weak"
      : strength === 3
        ? "Medium"
        : strength === 4
          ? "Good"
          : "Strong";

  const isStrongPassword = strength === 5;

  const strengthColor =
    strength <= 2
      ? "bg-red-500"
      : strength === 3
        ? "bg-yellow-500"
        : strength === 4
          ? "bg-blue-400"
          : "bg-emerald-500";

  const strengthText =
    strength <= 2
      ? "text-red-400"
      : strength === 3
        ? "text-yellow-400"
        : strength === 4
          ? "text-blue-400"
          : "text-emerald-400";

  // Sign Up Handler
  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setPasswordError("");
    setConfirmPasswordError("");
    setTermsError("");
    setSubmitError("");

    if (!isStrongPassword) {
      setPasswordError("Please create a strong password.");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match!");
      return;
    }

    if (!acceptTerms) {
      setTermsError("Please accept Terms & Conditions.");
      return;
    }

    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    setIsSubmitting(true);

    const { data: sessionData, error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
      role, // seeker | recruiter | admin -> stored on the user in MongoDB
      callbackURL: "/",
    });

    setIsSubmitting(false);

    if (error) {
      setSubmitError(
        error.message || "Something went wrong. Please try again."
      );
      return;
    }

    // Never log passwords
    // console.log("Sign Up Data:", data);

    router.push("/");
  };

  const handleGoogleSignUp = () => {
    console.log("Google Sign Up Clicked");
  };

  return (

    <main className="relative isolate min-h-dvh overflow-x-hidden bg-[#08080B] text-white  ">

      {/* Background Effects */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[150px] " />

      <div className="pointer-events-none absolute right-0 top-1/3 h-[350px] w-[350px] rounded-full bg-blue-600/[0.07] blur-[150px]" />

      {/* Main Container
          Navbar is outside this component.
          pt-24 keeps the form below the navbar.
      */}
      <div className="relative mx-auto grid min-h-dvh w-full max-w-[1250px] grid-cols-1 items-center gap-10 px-4 pb-10 pt-24 sm:px-6 sm:pt-28 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-16">

        {/* Left Branding Section */}
        <section className="hidden lg:flex flex-col justify-center">

          {/* Brand */}
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
              Your career journey starts here
            </div>

            <h1 className="text-5xl font-bold leading-[1.15] tracking-tight xl:text-6xl">
              Find your next
              <span className="block bg-gradient-to-r from-purple-400 via-blue-400 to-purple-300 bg-clip-text text-transparent">
                opportunity.
              </span>
            </h1>

            <p className="mt-6 max-w-[460px] text-base leading-8 text-gray-400">
              Create your account and connect with opportunities that
              match your skills, goals, and ambitions.
            </p>

          </div>

          {/* Feature Cards */}
          <div className="mt-12 grid max-w-[520px] grid-cols-2 gap-4">

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-colors hover:border-purple-400/30">
              <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <Zap size={20} />
              </div>

              <h3 className="font-semibold text-white">
                Smart Opportunities
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Discover jobs that match your interests.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-colors hover:border-blue-400/30">
              <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <ShieldCheck size={20} />
              </div>

              <h3 className="font-semibold text-white">
                Secure Account
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Your account and information matter.
              </p>
            </div>

          </div>

          {/* Bottom Text */}
          <p className="mt-12 text-sm text-gray-600">
            Build your future with HireLoop.
          </p>

        </section>

        {/* Right Sign Up Section */}
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

              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-500/10">
                <Sparkles className="size-5 text-purple-400" />
              </div>

              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Create Account
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                Join HireLoop and start your journey today.
              </p>

            </div>

            {/* Form */}
            <div className="relative px-5 pb-7 sm:px-9 sm:pb-9">

              <form onSubmit={handleSignUp} className="space-y-4">

                {/* Account Type */}
                <div className="space-y-2">

                  <Label className="text-sm font-medium text-gray-300">
                    I am joining as
                  </Label>

                  <div
                    role="radiogroup"
                    aria-label="Account type"
                    className="grid grid-cols-3 gap-2"
                  >
                    {roles.map(({ value, label, description, icon: Icon }) => {
                      const selected = role === value;

                      return (
                        <button
                          key={value}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => setRole(value)}
                          className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3.5 transition-all duration-200 ${
                            selected
                              ? "border-purple-500/60 bg-purple-500/[0.08] text-white shadow-[0_0_0_1px_rgba(139,92,246,0.25),inset_0_1px_0_rgba(255,255,255,0.04)]"
                              : "border-white/10 bg-[#1A1A1F] text-gray-400 hover:border-white/20 hover:text-white"
                          }`}
                        >
                          <Icon
                            className={`size-5 transition-colors ${
                              selected ? "text-purple-400" : "text-gray-500"
                            }`}
                          />

                          <span className="text-sm font-semibold">{label}</span>

                          <span
                            className={`text-[10px] leading-3 ${
                              selected ? "text-purple-300/80" : "text-gray-600"
                            }`}
                          >
                            {description}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                </div>

                {/* Full Name */}
                <div className="space-y-2">

                  <Label htmlFor="name" className="text-sm font-medium text-gray-300">
                    Full Name
                  </Label>

                  <div className="group relative">

                    <UserRound className="absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-purple-400" />

                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      autoComplete="name"
                      required
                      className="h-12 rounded-xl border-white/10 bg-[#1A1A1F] pl-11 text-sm text-white placeholder:text-gray-500 transition-all focus-visible:border-purple-500/60 focus-visible:ring-2 focus-visible:ring-purple-500/20"
                    />

                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">

                  <Label htmlFor="email" className="text-sm font-medium text-gray-300">
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
                      required
                      className="h-12 rounded-xl border-white/10 bg-[#1A1A1F] pl-11 text-sm text-white placeholder:text-gray-500 transition-all focus-visible:border-purple-500/60 focus-visible:ring-2 focus-visible:ring-purple-500/20"
                    />

                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">

                  <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                    Password
                  </Label>

                  <div className="group relative">

                    <LockKeyhole className="absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-purple-400" />

                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      autoComplete="new-password"
                      value={password}
                      required
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError("");
                        setConfirmPasswordError("");
                      }}
                      className={`h-12 rounded-xl bg-[#1A1A1F] pl-11 pr-12 text-sm text-white placeholder:text-gray-500 transition-all focus-visible:ring-2 ${passwordError
                          ? "border-red-500/60 focus-visible:border-red-500 focus-visible:ring-red-500/20"
                          : "border-white/10 focus-visible:border-purple-500/60 focus-visible:ring-purple-500/20"
                        }`}
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-1 top-1/2 size-10 -translate-y-1/2 text-gray-500 hover:bg-transparent hover:text-white"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>

                  </div>

                  {/* Password Strength */}
                  {password.length > 0 && (
                    <div className="space-y-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">

                      <div className="flex items-center justify-between">

                        <span className="text-xs text-gray-400">
                          Password strength
                        </span>

                        <span className={`text-xs font-semibold ${strengthText}`}>
                          {strengthLabel}
                        </span>

                      </div>

                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((bar) => (
                          <div
                            key={bar}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${strength >= bar ? strengthColor : "bg-white/10"
                              }`}
                          />
                        ))}
                      </div>

                      <div className="grid grid-cols-1 gap-x-3 gap-y-2 min-[380px]:grid-cols-2">

                        {passwordChecks.map((check) => (
                          <div
                            key={check.label}
                            className={`flex items-center gap-2 text-[11px] sm:text-xs ${check.valid ? "text-emerald-400" : "text-gray-500"
                              }`}
                          >
                            {check.valid ? (
                              <CheckCircle2 size={14} className="shrink-0" />
                            ) : (
                              <span className="flex size-3.5 shrink-0 items-center justify-center">
                                ○
                              </span>
                            )}

                            <span>{check.label}</span>
                          </div>
                        ))}

                      </div>

                    </div>
                  )}

                  {passwordError && (
                    <p className="flex items-center gap-1.5 text-xs text-red-400" role="alert">
                      <AlertCircle size={14} className="shrink-0" />
                      {passwordError}
                    </p>
                  )}

                </div>

                {/* Confirm Password */}
                <div className="space-y-2">

                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">
                    Confirm Password
                  </Label>

                  <div className="group relative">

                    <LockKeyhole className="absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-purple-400" />

                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      required
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setConfirmPasswordError("");
                      }}
                      className={`h-12 rounded-xl bg-[#1A1A1F] pl-11 pr-12 text-sm text-white placeholder:text-gray-500 transition-all focus-visible:ring-2 ${confirmPasswordError
                          ? "border-red-500/60 focus-visible:border-red-500 focus-visible:ring-red-500/20"
                          : "border-white/10 focus-visible:border-purple-500/60 focus-visible:ring-purple-500/20"
                        }`}
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      className="absolute right-1 top-1/2 size-10 -translate-y-1/2 text-gray-500 hover:bg-transparent hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>

                  </div>

                  {confirmPasswordError && (
                    <p className="flex items-center gap-1.5 text-xs text-red-400" role="alert">
                      <AlertCircle size={14} className="shrink-0" />
                      {confirmPasswordError}
                    </p>
                  )}

                  {confirmPassword.length > 0 &&
                    password === confirmPassword &&
                    isStrongPassword && (
                      <p className="flex items-center gap-1.5 text-xs text-emerald-400">
                        <CheckCircle2 size={14} />
                        Passwords match!
                      </p>
                    )}

                </div>

                {/* Terms */}
                <div className="space-y-2 pt-1">

                  <div className="flex items-start gap-2.5">

                    <Checkbox
                      id="terms"
                      checked={acceptTerms}
                      onCheckedChange={(checked) => {
                        setAcceptTerms(checked === true);
                        setTermsError("");
                      }}
                      className="mt-0.5 shrink-0 border-white/20 data-[state=checked]:border-purple-500 data-[state=checked]:bg-purple-500"
                    />

                    <Label
                      htmlFor="terms"
                      className="cursor-pointer text-xs leading-5 text-gray-400"
                    >
                      I agree to the{" "}
                      <Link href="/terms" className="font-semibold text-purple-400 hover:text-purple-300">
                        Terms & Conditions
                      </Link>
                      {" "}and{" "}
                      <Link href="/privacy" className="font-semibold text-purple-400 hover:text-purple-300">
                        Privacy Policy
                      </Link>
                    </Label>

                  </div>

                  {termsError && (
                    <p className="flex items-center gap-1.5 text-xs text-red-400">
                      <AlertCircle size={14} />
                      {termsError}
                    </p>
                  )}

                </div>

                {/* Submit Error */}
                {submitError && (
                  <p
                    className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400"
                    role="alert"
                  >
                    <AlertCircle size={14} className="shrink-0" />
                    {submitError}
                  </p>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="group h-12 w-full rounded-xl border-0 bg-gradient-to-r from-[#7955F5] to-[#5938DC] text-sm font-semibold text-white shadow-[0_8px_25px_rgba(101,76,245,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:from-[#896DFF] hover:to-[#694BEA] hover:shadow-[0_10px_30px_rgba(101,76,245,0.35)] disabled:pointer-events-none disabled:opacity-60"
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}

                  <ArrowRight
                    size={18}
                    className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Button>

              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-4">

                <div className="h-px flex-1 bg-white/10" />

                <span className="text-[10px] font-semibold tracking-[0.16em] text-gray-500">
                  OR SIGN UP WITH
                </span>

                <div className="h-px flex-1 bg-white/10" />

              </div>

              {/* Google */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignUp}
                className="h-12 w-full gap-3 rounded-xl border-white/10 bg-[#1A1A1F] text-sm font-medium text-gray-200 transition-all duration-300 hover:border-white/20 hover:bg-[#24242A] hover:text-white"
              >
                <FcGoogle size={21} />
                Continue with Google
              </Button>

              {/* Footer */}
              <p className="mt-6 text-center text-sm text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="font-semibold text-purple-400 transition-colors hover:text-purple-300"
                >
                  Sign In
                </Link>
              </p>

            </div>
          </div>



        </section>

      </div>
    </main>

  );
};

export default SignUp;
