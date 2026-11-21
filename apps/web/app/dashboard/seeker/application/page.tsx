"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Download, FileText, Inbox, Percent, Star, Users } from "lucide-react"

import { Spinner } from "@workspace/ui/components/spinner"
import { getApplications } from "@/lib/api/applications"
import { getJobs } from "@/lib/api/jobs"
import { useSession } from "@/lib/auth-client"
import {
  type ApplicationRow,
  type JobRow,
  postedDateFromId,
  salaryLabel,
  timeAgo,
} from "@/lib/jobs"
import { cn } from "@workspace/ui/lib/utils"
import { BrowsePagination } from "@/components/browse-jobs/pagination"
import { applicationStatus, STATUS_STYLES } from "@/lib/applications"

// Applications shown per page (footer pagination)
const APPS_PER_PAGE = 5

// The Active / Archived segmented control
const TABS = ["Active", "Archived"] as const

// One of the 4 stat cards on top
function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode
  label: string
  value: number | string
  accent?: string
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#111114] p-5">
      <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
        {icon}
        {label}
      </div>
      <p className={cn("mt-2 text-2xl font-bold", accent ?? "text-white")}>
        {value}
      </p>
    </div>
  )
}

// Job Title cell icon tile — colored by company name so rows differ a bit
const TILE_COLORS = [
  "bg-purple-500/20 text-purple-300",
  "bg-sky-500/20 text-sky-300",
  "bg-emerald-500/20 text-emerald-300",
  "bg-amber-500/20 text-amber-300",
  "bg-rose-500/20 text-rose-300",
]

const tileColor = (key: string) =>
  TILE_COLORS[
    [...key].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % TILE_COLORS.length
  ]

export default function Application() {
  const { data: session } = useSession()
  const user = session?.user

  const [applications, setApplications] = useState<ApplicationRow[]>([])
  const [jobs, setJobs] = useState<JobRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [apiError, setApiError] = useState("")

  // Active / Archived toggle (archived is a placeholder until the
  // backend grows an archived field)
  const [tab, setTab] = useState<(typeof TABS)[number]>("Active")

  // Footer pagination
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (!user?.email) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    // This user's applications (backend filters by ?email=) + all jobs
    // (so every jobId can show the full job data — type, remote, salary)
    Promise.all([getApplications(user.email), getJobs()])
      .then(([userApps, allJobs]) => {
        setApplications(userApps)
        setJobs(allJobs)
        setApiError("")
      })
      .catch((err) => {
        setApiError(err?.message || "Failed to load applications from the API.")
      })
      .finally(() => setIsLoading(false))
  }, [user?.email])

  // Already filtered by the backend (?email=) — these are this user's
  // applications only
  const myApplications = applications

  // jobId -> full job document, for the row subtitles
  const jobsById = useMemo(
    () => new Map(jobs.map((job) => [job._id, job])),
    [jobs]
  )

  // Stats computed from this user's real data
  const stats = useMemo(() => {
    const total = myApplications.length
    const shortlisted = myApplications.filter(
      (a) => a.status === "Shortlisted"
    ).length
    const interviews = myApplications.filter(
      (a) => a.status === "Review"
    ).length
    const offered = myApplications.filter((a) => a.status === "Offered").length
    return {
      total,
      shortlisted,
      interviews,
      successRate: total > 0 ? `${Math.round((offered / total) * 100)}%` : "0%",
    }
  }, [myApplications])

  // The rows for the current tab + page
  const filtered =
    tab === "Archived"
      ? [] // no archived field in the DB yet
      : myApplications

  const totalPages = Math.max(1, Math.ceil(filtered.length / APPS_PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const visibleApps = filtered.slice(
    (safePage - 1) * APPS_PER_PAGE,
    safePage * APPS_PER_PAGE
  )

  // Sign-in prompt — applications belong to a user
  if (!isLoading && !user) {
    return (
      <div className="mx-auto w-full max-w-[1280px] px-4 py-16 text-center sm:px-6">
        <p className="rounded-2xl border border-white/[0.07] bg-[#111114] px-5 py-10 text-sm text-gray-400">
          Sign in as a job seeker to see your applications.
        </p>
        <Link
          href="/sign-in"
          className="mt-4 inline-block text-sm text-gray-400 underline-offset-4 hover:text-white hover:underline"
        >
          ← Go to Sign In
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Applications</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your job applications and interview progress in real-time.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {/* Active / Archived segmented control */}
          <div className="flex rounded-lg border border-white/10 bg-[#111114] p-1">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTab(t)
                  setPage(1)
                }}
                className={cn(
                  "rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors",
                  tab === t
                    ? "bg-white/10 text-white"
                    : "text-gray-500 hover:text-white"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Export — prints the applications table */}
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#010103] transition-colors hover:bg-gray-200"
          >
            <Download className="size-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={<Users className="size-3.5" />}
          label="Total Applied"
          value={stats.total}
        />
        <StatCard
          icon={<Star className="size-3.5" />}
          label="Shortlisted"
          value={stats.shortlisted}
        />
        <StatCard
          icon={<Inbox className="size-3.5" />}
          label="Interviews"
          value={stats.interviews}
        />
        <StatCard
          icon={<Percent className="size-3.5" />}
          label="Success Rate"
          value={stats.successRate}
          accent="text-emerald-400"
        />
      </div>

      {/* Applications table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111114]">
        {/* Loading */}
        {isLoading && (
          <div className="flex items-center gap-2 px-5 py-12 text-sm text-gray-500">
            <Spinner className="text-purple-400" />
            Loading applications…
          </div>
        )}

        {/* API error */}
        {!isLoading && apiError && (
          <p className="px-5 py-12 text-center text-sm text-red-300">
            {apiError} — is the backend running?
          </p>
        )}

        {/* Empty */}
        {!isLoading && !apiError && filtered.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="text-sm font-semibold text-white">
              {tab === "Archived"
                ? "No archived applications yet"
                : "No applications yet"}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {tab === "Archived"
                ? "Applications you archive will show up here."
                : "Browse jobs and apply to see them here."}
            </p>
            {tab === "Active" && (
              <Link
                href="/browsejobs"
                className="mt-4 inline-block rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#010103] transition-colors hover:bg-gray-200"
              >
                Browse Jobs
              </Link>
            )}
          </div>
        )}

        {/* Desktop table (≥md) */}
        {!isLoading && !apiError && filtered.length > 0 && (
          <>
            <table className="hidden w-full text-left text-sm md:table">
              <thead>
                <tr className="border-b border-white/[0.07] text-xs text-gray-500">
                  <th className="px-5 py-3.5 font-medium">Job Title</th>
                  <th className="px-5 py-3.5 font-medium">Company</th>
                  <th className="px-5 py-3.5 font-medium">Applied</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {visibleApps.map((app) => {
                  // Full job data for this application's jobId
                  const job = jobsById.get(app.jobId)
                  return (
                    <tr
                      key={app._id}
                      className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.02]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              "flex size-9 shrink-0 items-center justify-center rounded-lg",
                              tileColor(app.companyName || app.jobTitle)
                            )}
                          >
                            <FileText className="size-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-white">
                              {app.jobTitle}
                            </p>
                            {job && (
                              <p className="truncate text-xs text-gray-500">
                                {job.jobType} •{" "}
                                {job.remote ? "Remote" : "On-site"} •{" "}
                                {salaryLabel(job)}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-400">
                        {app.companyName}
                      </td>
                      {/* "Applied X ago" comes from the ObjectId timestamp */}
                      <td className="px-5 py-4 text-gray-400">
                        {timeAgo(postedDateFromId(app._id))}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold",
                            STATUS_STYLES[applicationStatus(app)]
                          )}
                        >
                          {applicationStatus(app)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/browsejobs/${app.jobId}`}
                          className="text-sm font-medium text-white underline-offset-4 hover:underline"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* Mobile cards (<md) */}
            <div className="md:hidden">
              {visibleApps.map((app) => {
                const job = jobsById.get(app.jobId)
                return (
                  <div
                    key={app._id}
                    className="border-b border-white/[0.05] p-4 last:border-0"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-lg",
                          tileColor(app.companyName || app.jobTitle)
                        )}
                      >
                        <FileText className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate font-semibold text-white">
                            {app.jobTitle}
                          </p>
                          <span
                            className={cn(
                              "shrink-0 rounded-md border px-2 py-0.5 text-[11px] font-semibold",
                              STATUS_STYLES[applicationStatus(app)]
                            )}
                          >
                            {applicationStatus(app)}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-xs text-gray-500">
                          {app.companyName}
                          {job &&
                            ` • ${job.jobType} • ${
                              job.remote ? "Remote" : "On-site"
                            }`}
                        </p>
                        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                          <span>
                            Applied {timeAgo(postedDateFromId(app._id))}
                          </span>
                          <Link
                            href={`/browsejobs/${app.jobId}`}
                            className="font-medium text-white underline-offset-4 hover:underline"
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Footer — count + pagination */}
            <div className="flex flex-col items-center justify-between gap-3 border-t border-white/[0.07] px-5 py-4 sm:flex-row">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="text-white">
                  {(safePage - 1) * APPS_PER_PAGE + 1}-
                  {(safePage - 1) * APPS_PER_PAGE + visibleApps.length}
                </span>{" "}
                of <span className="text-white">{filtered.length}</span>{" "}
                applications
              </p>
              {totalPages > 1 && (
                <BrowsePagination
                  page={safePage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
