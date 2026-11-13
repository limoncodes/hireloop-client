"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Building2,
  CalendarDays,
  Code2,
  MapPin,
  Megaphone,
  MoreVertical,
  Pencil,
  PenTool,
  Plus,
  ServerCog,
  Settings,
  Trash2,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { cn } from "@workspace/ui/lib/utils";

// Same shape the "Post a New Job" form collects (apps/web/lib/jobs.ts)
import type { JobForm } from "@/lib/jobs";
import { getJobs } from "@/lib/api/jobs";

// ---- Data ----

type JobStatus = "Active" | "Expired";

export type JobRow = JobForm & {
  _id: string;
  applicants: number;
  status: JobStatus;
  postedAgo: string;
};

// ---- Small view helpers ----

// Category -> icon + colors (used for the tile and the dept tag)
const categoryMeta: Record<string, { icon: LucideIcon; text: string; bg: string }> = {
  Engineering: { icon: Code2, text: "text-purple-400", bg: "bg-purple-500/10" },
  Design: { icon: PenTool, text: "text-orange-400", bg: "bg-orange-500/10" },
  Infrastructure: { icon: ServerCog, text: "text-blue-400", bg: "bg-blue-500/10" },
  Marketing: { icon: Megaphone, text: "text-orange-400", bg: "bg-orange-500/10" },
  Quality: { icon: Settings, text: "text-yellow-400", bg: "bg-yellow-500/10" },
};

const metaFor = (category: string) =>
  categoryMeta[category] ?? { icon: Briefcase, text: "text-gray-400", bg: "bg-gray-500/10" };

// "per hour" -> "/ hr", "per day" -> "/ day", "per week" -> "/ wk",
// "per month" -> "/ mo", "per year" -> "/ yr"
const frequencyLabels: Record<string, string> = {
  "per hour": "/ hr",
  "per day": "/ day",
  "per week": "/ wk",
  "per month": "/ mo",
  "per year": "/ yr",
};

const frequencyShort = (frequency: string) =>
  frequencyLabels[frequency] ?? `/${frequency.replace("per ", "")}`;

const salaryLabel = (job: JobRow) =>
  `€${job.minSalary} – €${job.maxSalary} ${frequencyShort(job.frequency)}`;

const locationLabel = (job: JobRow) =>
  job.remote ? `Remote (${job.location})` : job.location;

const dateLabel = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

// ---- Shared pieces (used by both the mobile cards and the table) ----

function StatusBadge({ status }: { status: JobStatus }) {
  const expired = status === "Expired";

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        expired
          ? "border-white/10 bg-white/[0.04] text-gray-400"
          : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          expired ? "bg-gray-500" : "bg-emerald-400"
        )}
      />
      {status}
    </span>
  );
}

function JobActions({ job, className }: { job: JobRow; className?: string }) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Button
        nativeButton={false}
        render={<Link href={`/dashboard/recruiter/jobs/new?id=${job._id}`} />}
        className="h-8 gap-1.5 rounded-lg bg-[#5C53FE] px-3 text-xs font-bold text-white transition-colors hover:bg-[#6D65FF]"
      >
        <Pencil className="size-3.5" />
        Update
      </Button>

      <Button
        variant="ghost"
        size="icon"
        aria-label={`Delete ${job.title}`}
        className="size-8 rounded-lg text-gray-500 hover:bg-red-500/10 hover:text-red-400"
      >
        <Trash2 className="size-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        aria-label={`More options for ${job.title}`}
        className="size-8 rounded-lg text-gray-500 hover:bg-white/5 hover:text-white"
      >
        <MoreVertical className="size-4" />
      </Button>
    </div>
  );
}

// ---- Mobile card (shown below md) ----

function JobCard({ job }: { job: JobRow }) {
  const meta = metaFor(job.category);
  const Icon = meta.icon;
  const expired = job.status === "Expired";

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#111114] p-4">
      {/* Top: identity + status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-lg",
              meta.bg,
              meta.text
            )}
          >
            <Icon className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {job.title}
            </p>
            <p className={cn("mt-0.5 text-xs", meta.text)}>{job.category}</p>
          </div>
        </div>

        <StatusBadge status={job.status} />
      </div>

      {/* Details */}
      <div className="mt-4 space-y-2 text-xs">
        <p className="flex items-center gap-1.5 text-gray-300">
          <Building2 className="size-3.5 shrink-0 text-gray-500" />
          {job.company}
        </p>

        <p className="flex items-center gap-1.5 text-gray-500">
          <MapPin className="size-3.5 shrink-0" />
          {locationLabel(job)}
        </p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-1.5">
          <span className="inline-flex rounded-lg border border-white/10 bg-white/[0.04] px-2 py-0.5 font-medium text-gray-300">
            {job.jobType}
          </span>

          <span className="font-medium text-gray-300">
            {salaryLabel(job)}
          </span>

          <span className="flex items-center gap-1 text-gray-300">
            <Users className="size-3.5 text-gray-500" />
            {job.applicants} Candidates
          </span>

          <span
            className={cn(
              "flex items-center gap-1",
              expired ? "text-gray-600" : "text-gray-300"
            )}
          >
            <CalendarDays className="size-3.5 shrink-0 text-gray-500" />
            {dateLabel(job.deadline)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 border-t border-white/[0.06] pt-3">
        <JobActions job={job} />
      </div>
    </div>
  );
}

export default function ManageJobsPage() {
  // Only API data — nothing is shown until the jobs load
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getJobs()
      .then((data) => {
        if (cancelled) return;

        if (Array.isArray(data)) {
          setJobs(data as JobRow[]);
        } else {
          setApiError("Unexpected response from the jobs API.");
        }
      })
      .catch((err) => {
        // Backend not running / network error / bad status
        if (!cancelled) {
          setApiError(err?.message || "Failed to load jobs from the API.");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto w-full container px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {/* Breadcrumb */}
          <nav className="mb-3 flex items-center gap-1.5 text-sm text-gray-500">
            <Link
              href="/dashboard/recruiter/jobs"
              className="transition-colors hover:text-white"
            >
              Manage Jobs
            </Link>
            <span className="text-gray-600">&rsaquo;</span>
            <span className="text-gray-300">Job Listings &amp; Postings</span>
          </nav>

          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Manage Job Posts
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Review live listings, monitor applicants, and update job details
            across your organization.
          </p>
        </div>

        <Button
          nativeButton={false}
          render={<Link href="/dashboard/recruiter/jobs/new" />}
          className="h-11 w-full shrink-0 gap-2 rounded-xl bg-[#5C53FE] px-4 text-sm font-bold text-white shadow-[inset_0_3px_10px_rgba(255,255,255,0.2)] transition-colors hover:bg-[#6D65FF] sm:w-auto"
        >
          <Plus className="size-4" />
          New Job Post
        </Button>
      </div>

      {/* API status */}
      {isLoading && (
        <p className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <span className="size-3 animate-spin rounded-full border-2 border-gray-600 border-t-purple-400" />
          Loading jobs…
        </p>
      )}

      {!isLoading && apiError && (
        <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
          {apiError} — is the backend running?
        </p>
      )}

      {/* Empty state — API loaded fine but no jobs yet */}
      {!isLoading && !apiError && jobs.length === 0 && (
        <div className="mt-4 rounded-2xl border border-white/[0.07] bg-[#111114] px-6 py-12 text-center">
          <p className="text-sm font-semibold text-white">No job posts yet</p>
          <p className="mt-1 text-sm text-gray-500">
            Create your first job post to start hiring.
          </p>
          <Button
            nativeButton={false}
            render={<Link href="/dashboard/recruiter/jobs/new" />}
            className="mt-4 h-10 gap-2 rounded-xl bg-[#5C53FE] px-4 text-sm font-bold text-white transition-colors hover:bg-[#6D65FF]"
          >
            <Plus className="size-4" />
            New Job Post
          </Button>
        </div>
      )}

      {/* Mobile/tablet — stacked cards (below lg) */}
      <div className="mt-6 space-y-4 lg:hidden">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>

      {/* Desktop — table (lg and up), fits without horizontal scroll */}
      <div className="mt-6 hidden overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111114] lg:block">
        <div className="overflow-x-auto">
          <Table className="w-full min-w-[720px]">
            <TableHeader>
              <TableRow className="border-b border-white/[0.06] hover:bg-transparent">
                <TableHead className="h-12 px-3 text-[11px] font-semibold tracking-wider text-gray-500 uppercase sm:px-4">
                  Job Title &amp; Dept
                </TableHead>
                <TableHead className="h-12 px-3 text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                  Company &amp; Location
                </TableHead>
                <TableHead className="h-12 px-3 text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                  Type
                </TableHead>
                <TableHead className="hidden h-12 px-3 text-[11px] font-semibold tracking-wider text-gray-500 uppercase lg:table-cell">
                  Compensation
                </TableHead>
                <TableHead className="hidden h-12 px-3 text-[11px] font-semibold tracking-wider text-gray-500 uppercase xl:table-cell">
                  Applicants
                </TableHead>
                <TableHead className="h-12 px-3 text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                  Status
                </TableHead>
                <TableHead className="hidden h-12 px-3 text-[11px] font-semibold tracking-wider text-gray-500 uppercase lg:table-cell">
                  Deadline
                </TableHead>
                <TableHead className="h-12 px-3 text-right text-[11px] font-semibold tracking-wider text-gray-500 uppercase sm:px-4">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {jobs.map((job) => {
                const meta = metaFor(job.category);
                const Icon = meta.icon;
                const expired = job.status === "Expired";

                return (
                  <TableRow
                    key={job._id}
                    className="border-b border-white/[0.06] transition-colors last:border-0 hover:bg-white/[0.02]"
                  >
                    {/* Job Title & Dept */}
                    <TableCell className="px-3 py-4 sm:px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex size-9 shrink-0 items-center justify-center rounded-lg",
                            meta.bg,
                            meta.text
                          )}
                        >
                          <Icon className="size-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {job.title}
                          </p>
                          <p className={cn("mt-0.5 text-xs", meta.text)}>
                            {job.category}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Company & Location */}
                    <TableCell className="px-3 py-4">
                      <p className="text-sm font-medium text-white">
                        {job.company}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="size-3 shrink-0" />
                        {locationLabel(job)}
                      </p>
                    </TableCell>

                    {/* Type */}
                    <TableCell className="px-3 py-4">
                      <span className="inline-flex rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-gray-300">
                        {job.jobType}
                      </span>
                    </TableCell>

                    {/* Compensation (lg+) */}
                    <TableCell className="hidden px-3 py-4 text-sm text-gray-300 lg:table-cell">
                      {salaryLabel(job)}
                    </TableCell>

                    {/* Applicants (xl+) */}
                    <TableCell className="hidden px-3 py-4 xl:table-cell">
                      <span className="flex items-center gap-1.5 text-sm font-medium text-white">
                        <Users className="size-4 text-gray-500" />
                        {job.applicants} Candidates
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="px-3 py-4">
                      <StatusBadge status={job.status} />
                    </TableCell>

                    {/* Deadline (lg+) */}
                    <TableCell className="hidden px-3 py-4 lg:table-cell">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          expired ? "text-gray-500" : "text-white"
                        )}
                      >
                        {dateLabel(job.deadline)}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-600">
                        {job.postedAgo}
                      </p>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="px-3 py-4 sm:px-4">
                      <JobActions job={job} className="justify-end" />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
