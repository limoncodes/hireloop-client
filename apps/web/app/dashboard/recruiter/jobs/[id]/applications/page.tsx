import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, BriefcaseBusiness, FileText } from "lucide-react"

import { ApplicationsTable } from "@/components/applications/applications-table"
import { type ApplicationStatus } from "@/lib/applications"
import { getApplicationsByJob, updateApplication } from "@/lib/api/applications"
import { getjobsByid } from "@/lib/api/jobs"
import { requireRole } from "@/lib/dashboard"

type PageProps = {
  // Next 16 — dynamic route params are a Promise.
  params: Promise<{ id: string }>
}

// Server Action — the only supported way to hand a function to a Client
// Component. Persists the recruiter's status choice to MongoDB via PATCH.
async function saveApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
) {
  "use server"
  await updateApplication(applicationId, { status })
}

export default async function JobApplicationsPage({ params }: PageProps) {
  const { user } = await requireRole("recruiter")
  const { id } = await params

  const [job, applications] = await Promise.all([
    getjobsByid(id),
    getApplicationsByJob(id),
  ])

  if (!job) notFound()

  // A recruiter can only open the applications of their own job posts.
  if (job.recruiterId && job.recruiterId !== user.id) notFound()

  const reviewCount = applications.filter(
    (row) => row.status === "Review"
  ).length
  const shortlistedCount = applications.filter(
    (row) => row.status === "Shortlisted"
  ).length

  return (
    <section className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6">
      <nav className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
        <Link
          href="/dashboard/recruiter/jobs"
          className="transition-colors hover:text-white"
        >
          Manage Jobs
        </Link>
        <span className="text-gray-600">&rsaquo;</span>
        <span className="text-gray-300">Applications</span>
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Job Applications
          </h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-gray-400">
            <BriefcaseBusiness className="size-4 text-gray-500" />
            <span className="font-semibold text-white">{job.title}</span>
            <span className="text-gray-600">&middot;</span>
            {job.company}
          </p>
        </div>

        <Link
          href="/dashboard/recruiter/jobs"
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 px-3.5 text-sm font-semibold text-gray-300 transition-colors hover:border-white/20 hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Back to Jobs
        </Link>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Total applicants", value: applications.length },
          { label: "In review", value: reviewCount },
          { label: "Shortlisted", value: shortlistedCount },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/[0.07] bg-[#111114] px-5 py-4"
          >
            <p className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
              {stat.label}
            </p>
            <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-white">
        <FileText className="size-4 text-purple-400" />
        Applicants
      </div>
      <div className="mt-3">
        <ApplicationsTable
          applications={applications}
          onStatusChange={saveApplicationStatus}
        />
      </div>
    </section>
  )
}
