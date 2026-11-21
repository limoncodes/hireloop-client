"use client"

import { useEffect, useState } from "react"
import {
  BriefcaseBusiness,
  Inbox,
  Search,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Spinner } from "@workspace/ui/components/spinner"
import { cn } from "@workspace/ui/lib/utils"

import { getUsers } from "@/lib/api/user"
import { updateuserrole } from "@/lib/action/users"

type Role = "admin" | "recruiter" | "seeker"
type RoleFilter = "all" | Role

type ManagedUser = {
  id: string
  name: string
  email: string
  role: Role
  emailVerified: boolean
  banned: boolean
  joinedAt: string
}

const ROLES: Role[] = ["admin", "recruiter", "seeker"]

const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  recruiter: "Recruiter",
  seeker: "Seeker",
}

const ROLE_STYLES: Record<Role, string> = {
  admin: "border-[#5c53fe]/30 bg-[#5c53fe]/15 text-[#a49fff]",
  recruiter: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  seeker: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
}

const isRole = (value: unknown): value is Role =>
  typeof value === "string" && ROLES.includes(value as Role)

const userInitials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "?"

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

const formatJoined = (iso: string): string => {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return "—"
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`
}

/** 3-way role switch shown in every table row (presentation only). */
function RoleToggle({
  value,
  onChange,
}: {
  value: Role
  onChange: (role: Role) => void
}) {
  return (
    <div
      role="group"
      aria-label="Change user role"
      className="inline-flex items-center gap-0.5 rounded-xl border border-white/[0.07] bg-[#0d0d11] p-1"
    >
      {ROLES.map((role) => {
        const active = role === value

        return (
          <button
            key={role}
            type="button"
            aria-pressed={active}
            title={`Make ${ROLE_LABELS[role].toLowerCase()}`}
            onClick={() => onChange(role)}
            className={cn(
              "h-7 rounded-lg border px-2.5 text-[11px] font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#5c53fe]/40",
              active
                ? ROLE_STYLES[role]
                : "border-transparent text-gray-500 hover:bg-white/[0.05] hover:text-gray-200"
            )}
          >
            {ROLE_LABELS[role]}
          </button>
        )
      })}
    </div>
  )
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<ManagedUser[]>([])
  const [roles, setRoles] = useState<Record<string, Role>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<RoleFilter>("all")

  useEffect(() => {
    // Auth/role guarding is handled by the dashboard layout + Better Auth's
    // admin endpoint — this screen only renders the management UI.
    let active = true

    const load = async () => {
      try {
        const { data, error: apiError } = await getUsers()
        if (apiError)
          throw new Error(apiError.message ?? "Could not load users")

        // Keep the view model small and serializable — no raw auth docs.
        const list: ManagedUser[] = (data?.users ?? []).map((user) => ({
          id: user.id,
          name: user.name ?? "",
          email: user.email ?? "",
          role: isRole(user.role) ? user.role : "seeker",
          emailVerified: user.emailVerified ?? false,
          banned: user.banned ?? false,
          joinedAt: new Date(user.createdAt).toISOString(),
        }))

        if (!active) return
        setUsers(list)
        setRoles(Object.fromEntries(list.map((user) => [user.id, user.role])))
      } catch (cause) {
        if (active) {
          setError(
            cause instanceof Error ? cause.message : "Could not load users"
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  const roleOf = (user: ManagedUser) => roles[user.id] ?? user.role

  const counts = {
    total: users.length,
    admin: users.filter((user) => roleOf(user) === "admin").length,
    recruiter: users.filter((user) => roleOf(user) === "recruiter").length,
    seeker: users.filter((user) => roleOf(user) === "seeker").length,
  }

  const term = search.trim().toLowerCase()
  const visibleUsers = users.filter((user) => {
    const matchesRole = filter === "all" || roleOf(user) === filter
    const matchesSearch =
      !term ||
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)

    return matchesRole && matchesSearch
  })

  /**
   * UI-only role change. Replace the body with your request when the backend
   * endpoint is ready — no persistence is implemented here.
   */
  const handleRoleChange = async (userId: string, role: Role) => {
    setRoles((prev) => ({ ...prev, [userId]: role }))
    // TODO: await authClient.admin.setRole({ userId, role })
    await updateuserrole(userId, role as "admin" | "seeker" | "recruiter ")
  }

  const stats = [
    { label: "Total users", value: counts.total, icon: Users },
    { label: "Admins", value: counts.admin, icon: ShieldCheck },
    { label: "Recruiters", value: counts.recruiter, icon: BriefcaseBusiness },
    { label: "Seekers", value: counts.seeker, icon: UserRound },
  ]

  return (
    <section className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          User Management
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Manage accounts and assign the right role to each member.
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-white/[0.07] bg-[#111114] px-5 py-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                {label}
              </p>
              <Icon className="size-4 text-gray-500" aria-hidden="true" />
            </div>
            <p className="mt-1 text-2xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <label className="relative block w-full sm:w-72">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-500"
            aria-hidden="true"
          />
          <span className="sr-only">Search users</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or email"
            className="h-10 w-full rounded-xl border border-white/[0.07] bg-[#111114] pr-3 pl-9 text-sm text-white outline-none placeholder:text-gray-600 focus:border-[#5c53fe]/50"
          />
        </label>

        <div
          role="group"
          aria-label="Filter by role"
          className="flex flex-wrap items-center gap-1.5"
        >
          {(["all", ...ROLES] as RoleFilter[]).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={filter === option}
              onClick={() => setFilter(option)}
              className={cn(
                "h-9 rounded-xl border px-3 text-xs font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#5c53fe]/40",
                filter === option
                  ? "border-[#5c53fe]/30 bg-[#5c53fe]/15 text-[#a49fff]"
                  : "border-white/[0.07] bg-[#111114] text-gray-400 hover:text-white"
              )}
            >
              {option === "all" ? "All" : ROLE_LABELS[option]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111114]">
        {loading ? (
          <div className="flex items-center justify-center gap-2 px-6 py-12 text-sm text-gray-400">
            <Spinner className="size-4" />
            Loading users…
          </div>
        ) : error ? (
          <div className="px-6 py-12 text-center text-sm text-red-400">
            {error}
          </div>
        ) : visibleUsers.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-white/[0.04] text-gray-500">
              <Inbox className="size-5" />
            </div>
            <p className="mt-4 text-sm font-semibold text-white">
              No users found
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Try a different search or role filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="w-full min-w-[860px]">
              <TableHeader>
                <TableRow className="border-b border-white/[0.06] hover:bg-transparent">
                  <TableHead className="h-12 px-4 text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                    User
                  </TableHead>
                  <TableHead className="h-12 px-4 text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                    Status
                  </TableHead>
                  <TableHead className="h-12 px-4 text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                    Joined
                  </TableHead>
                  <TableHead className="h-12 px-4 text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                    Role
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="border-b border-white/[0.06] transition-colors last:border-0 hover:bg-white/[0.02]"
                  >
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#5c53fe]/15 text-xs font-bold text-[#a49fff]">
                          {userInitials(user.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {user.name || "Unnamed user"}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-gray-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                            user.emailVerified
                              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                              : "border-white/10 bg-white/[0.04] text-gray-400"
                          )}
                        >
                          {user.emailVerified ? "Verified" : "Unverified"}
                        </span>
                        {user.banned && (
                          <span className="inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[11px] font-semibold text-red-400">
                            Banned
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-xs whitespace-nowrap text-gray-300">
                      {formatJoined(user.joinedAt)}
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <RoleToggle
                        value={roleOf(user)}
                        onChange={(role) => handleRoleChange(user.id, role)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </section>
  )
}
