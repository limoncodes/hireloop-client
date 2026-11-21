import { redirect } from "next/navigation"

import { getsession } from "@/lib/core/server"

export const USER_ROLES = ["seeker", "recruiter", "admin"] as const
export type UserRole = (typeof USER_ROLES)[number]

export const isUserRole = (value: unknown): value is UserRole =>
  typeof value === "string" && (USER_ROLES as readonly string[]).includes(value)

/**
 * Single source of truth for the dashboard role. The role comes from the
 * logged-in user stored in MongoDB — never from a hard-coded fallback.
 */
export const getDashboardContext = async () => {
  const session = await getsession()

  if (!session?.user) redirect("/sign-in?redirectTo=/dashboard")

  const role = isUserRole(session.user.role) ? session.user.role : "seeker"

  return {
    user: session.user,
    role,
    name: session.user.name ?? "there",
    email: session.user.email,
  }
}

/** Guard a role-specific dashboard page against the wrong role. */
export const requireRole = async (role: UserRole) => {
  const context = await getDashboardContext()

  if (context.role !== role) redirect(`/dashboard/${context.role}`)

  return context
}
