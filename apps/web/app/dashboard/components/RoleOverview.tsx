import Link from "next/link"
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  FileText,
  LayoutDashboard,
  PlusCircle,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react"

import type { UserRole } from "@/lib/dashboard"

type DashboardCard = {
  title: string
  description: string
  href: string
  icon: LucideIcon
}

const overview: Record<
  UserRole,
  { label: string; title: string; description: string; cards: DashboardCard[] }
> = {
  seeker: {
    label: "Job seeker dashboard",
    title: "Find your next opportunity",
    description:
      "Track your applications, discover new roles and manage your profile — all in one place.",
    cards: [
      {
        title: "Browse jobs",
        description: "Explore open roles that match your skills.",
        href: "/browsejobs",
        icon: BriefcaseBusiness,
      },
      {
        title: "My applications",
        description: "See where you have applied and follow up.",
        href: "/dashboard/seeker/application",
        icon: FileText,
      },
      {
        title: "Billing",
        description: "Manage your Pro plan and invoices.",
        href: "/checkout",
        icon: Wallet,
      },
    ],
  },
  recruiter: {
    label: "Recruiter dashboard",
    title: "Hire your next great teammate",
    description:
      "Post roles, manage your listings and review the candidates who applied.",
    cards: [
      {
        title: "Manage jobs",
        description: "Edit, pause or close your active listings.",
        href: "/dashboard/recruiter/jobs",
        icon: LayoutDashboard,
      },
      {
        title: "Post a job",
        description: "Create a new listing in a few steps.",
        href: "/dashboard/recruiter/jobs/new",
        icon: PlusCircle,
      },
      {
        title: "Company profile",
        description: "Keep your company details up to date.",
        href: "/companies",
        icon: Building2,
      },
    ],
  },
  admin: {
    label: "Admin dashboard",
    title: "Platform overview",
    description: "Monitor users, companies, jobs and payments across Hireloop.",
    cards: [
      {
        title: "Users",
        description: "Manage accounts and assigned roles.",
        href: "/dashboard/admin/users",
        icon: Users,
      },
      {
        title: "Companies",
        description: "Review registered companies.",
        href: "/dashboard/companies",
        icon: Building2,
      },
      {
        title: "Payments",
        description: "Track transactions and premium upgrades.",
        href: "/dashboard/payments",
        icon: Wallet,
      },
    ],
  },
}

export function RoleOverview({
  role,
  name,
  email,
}: {
  role: UserRole
  name: string
  email: string
}) {
  const data = overview[role]

  return (
    <section className="mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-6">
      <p className="text-[10px] font-semibold tracking-[0.16em] text-[#8b8b93] uppercase">
        {data.label}
      </p>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            {data.title}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#8b8b93]">
            {data.description}
          </p>
        </div>
        <span className="rounded-full border border-[#5c53fe]/25 bg-[#5c53fe]/10 px-3 py-1.5 text-[10px] font-bold tracking-[0.14em] text-[#a49fff] uppercase">
          {role}
        </span>
      </div>

      <div className="mt-4 rounded-2xl border border-white/[0.07] bg-[#0d0d11] px-5 py-4 text-sm text-[#a6a6ad]">
        Signed in as <span className="font-semibold text-white">{name}</span>
        <span className="text-[#6e6e78]"> · {email}</span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.cards.map(({ title, description, href, icon: Icon }) => (
          <Link
            key={title}
            href={href}
            className="group rounded-2xl border border-white/[0.07] bg-[#0d0d11] p-5 transition-colors hover:border-[#5c53fe]/40 hover:bg-[#111117] focus-visible:ring-2 focus-visible:ring-[#5c53fe]/40 focus-visible:outline-none"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="flex size-9 items-center justify-center rounded-xl bg-[#5c53fe]/15 text-[#a49fff]">
                <Icon aria-hidden="true" className="size-4" />
              </span>
              <ArrowRight
                aria-hidden="true"
                className="size-4 text-[#6e6e78] transition-transform group-hover:translate-x-0.5 group-hover:text-white"
              />
            </div>
            <p className="mt-4 text-sm font-semibold text-white">{title}</p>
            <p className="mt-1 text-xs leading-5 text-[#8b8b93]">
              {description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
