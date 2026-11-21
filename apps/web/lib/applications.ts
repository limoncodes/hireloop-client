// Shared application status helpers — used by the seeker's "My Applications"
// page and the recruiter's "Job Applications" review table.

import { type ApplicationRow } from "@/lib/jobs"

export const APPLICATION_STATUSES = [
  "Applied",
  "Review",
  "Shortlisted",
  "Rejected",
  "Offered",
] as const

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

// Status -> pill colors (matches the Figma palette)
export const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Applied: "bg-white/[0.06] text-gray-300 border-white/10",
  Review: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  Shortlisted: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Rejected: "bg-red-500/15 text-red-400 border-red-500/20",
  Offered: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
}

/** Older rows have no `status` field — they start as "Applied". */
export const applicationStatus = (row: ApplicationRow): ApplicationStatus =>
  (APPLICATION_STATUSES as readonly string[]).includes(row.status ?? "")
    ? (row.status as ApplicationStatus)
    : "Applied"
