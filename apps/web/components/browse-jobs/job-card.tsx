"use client";

import { Bookmark } from "lucide-react";

import {
  type JobRow,
  locationLabel,
  salaryLabel,
} from "@/lib/jobs";
import { cn } from "@workspace/ui/lib/utils";

// Small rounded tag used inside the card (salary, job type, remote...)
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-gray-300">
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

  // TODO: implement — save/bookmark this job for the user
  const handleBookmark = () => {};

  return (
    <article
      className={cn(
        "rounded-2xl border border-white/[0.07] bg-[#111114] p-5 transition-colors hover:border-white/[0.15]",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-sm font-bold text-gray-300">
          {initial}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-white">{job.title}</h3>
          <p className="mt-1 text-sm text-gray-400">
            {job.company} • {locationLabel(job)}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Pill>{salaryLabel(job)}</Pill>
            <Pill>{job.jobType}</Pill>
            {job.remote && <Pill>Remote</Pill>}
          </div>
        </div>

        <button
          type="button"
          onClick={handleBookmark}
          aria-label={`Save ${job.title}`}
          className="shrink-0 rounded-lg p-2 text-gray-500 transition-colors hover:bg-white/5 hover:text-white"
        >
          <Bookmark className="size-5" />
        </button>
      </div>
    </article>
  );
}
