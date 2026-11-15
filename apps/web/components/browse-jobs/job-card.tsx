"use client";

import {
  Bookmark,
  BriefcaseBusiness,
  CreditCard,
  Flame,
  Zap,
} from "lucide-react";

import {
  type JobRow,
  effectiveStatus,
  locationLabel,
  postedDateFromId,
  salaryLabel,
  timeAgo,
} from "@/lib/jobs";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";

// Small rounded tag used inside the card (salary, job type, remote...)
function Pill({
  icon,
  children,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-gray-300">
      {icon}
      {children}
    </span>
  );
}

export function BrowseJobCard({
  job,
  className,
}: {
  job: JobRow;
  className?: string;
}) {
  // Company initial as a simple logo tile (Figma shows dark logo tiles)
  const initial = job.company?.trim()?.[0]?.toUpperCase() || "J";

  // Badges from real data — Active jobs are "Easy Apply" (green),
  // jobs with many applicants are "Hot Job" (orange)
  const status = effectiveStatus(job);
  const isHot = job.applicants >= 5;

  // TODO: implement — save/bookmark this job for the user
  const handleBookmark = () => {};

  return (
    <article
      className={cn(
        "relative rounded-2xl border border-white/[0.07] bg-[#111114] p-5 transition-colors hover:border-white/[0.15]",
        className
      )}
    >
      <div className="flex items-start gap-4">
        {/* Logo tile */}
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-base font-bold text-white">
          {initial}
        </div>

        <div className="min-w-0 flex-1">
          {/* Badges — only render when the data actually says so */}
          {(isHot || status === "Active") && (
            <div className="flex flex-wrap items-center gap-2">
              {isHot && (
                <span className="inline-flex items-center gap-1 rounded-md bg-orange-500/15 px-2 py-0.5 text-[11px] font-semibold text-orange-400">
                  <Flame className="size-3" />
                  Hot Job
                </span>
              )}
              {status === "Active" && (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
                  <Zap className="size-3" />
                  Easy Apply
                </span>
              )}
            </div>
          )}

          <h3 className="mt-1.5 text-lg font-bold text-white">{job.title}</h3>
          <p className="mt-1 text-sm text-gray-400">
            {job.company} • {locationLabel(job)}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Pill
              icon={
                <CreditCard className="size-3.5 shrink-0 text-gray-500" />
              }
            >
              {salaryLabel(job)}
            </Pill>
            <Pill
              icon={
                <BriefcaseBusiness className="size-3.5 shrink-0 text-gray-500" />
              }
            >
              {job.jobType}
            </Pill>
            {job.remote && <Pill>Remote</Pill>}
          </div>
        </div>

        {/* Bookmark + how long ago it was posted — z-10 keeps it above the
            full-card Link below, so clicking Save never navigates */}
        <div className="relative z-10 flex shrink-0 flex-col items-end gap-1">
          <button
            type="button"
            onClick={handleBookmark}
            aria-label={`Save ${job.title}`}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Bookmark className="size-5" />
          </button>
          <span className="text-[11px] text-gray-600">
            {timeAgo(postedDateFromId(job._id))}
          </span>
        </div>
      </div>

      {/* Full-card click target — stretches over the whole box, so clicking
          anywhere on the card opens the job details page */}
      <Link
        href={`/browsejobs/${job._id}`}
        aria-label={`View ${job.title}`}
        className="absolute inset-0 rounded-2xl"
      />
    </article>
  );
}
