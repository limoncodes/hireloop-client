"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  BadgeCheck,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  CreditCard,
  Layers,
  MapPin,
} from "lucide-react";

import { Spinner } from "@workspace/ui/components/spinner";
import { getjobsByid } from "@/lib/api/jobs";
import {
  type JobRow,
  dateLabel,
  daysLeftLabel,
  locationLabel,
  salaryLabel,
} from "@/lib/jobs";

// "Develop REST APIs, manage databases, optimize server performance."
// -> ["Develop REST APIs", "Manage databases", "Optimize server performance"]
const toList = (text: string) =>
  text
    .split(",")
    .map((part) => part.trim().replace(/\.$/, ""))
    .filter(Boolean)
    .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1) : part));

// One of the 4 small stat cards (Salary / Location / Job Type / Category)
function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#111114] p-4">
      <div className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-gray-400">
        {icon}
      </div>
      <p className="mt-3 text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

// A bulleted list rendered from one comma-separated DB string
function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-2.5">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-400"
        >
          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gray-500" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function JobDetailsContent() {
  const params = useParams();
  const id = params?.id as string | undefined;

  const [job, setJob] = useState<JobRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    getjobsByid(id)
      .then((data) => {
        if (data && data._id) {
          setJob(data);
          setApiError("");
        } else {
          setApiError("Job not found.");
        }
      })
      .catch((err) => {
        setApiError(err?.message || "Failed to load the job from the API.");
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  // TODO: implement — apply flow for this job
  const handleApply = () => {};
  // TODO: implement — save/bookmark this job
  const handleBookmark = () => {};

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-[1280px] items-center gap-2 px-4 py-16 text-sm text-gray-500 sm:px-6">
        <Spinner className="text-purple-400" />
        Loading job…
      </div>
    );
  }

  if (apiError || !job) {
    return (
      <div className="mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-6">
        <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-10 text-center text-sm text-red-300">
          {apiError || "Job not found."}
        </p>
        <p className="mt-4 text-center">
          <Link
            href="/browsejobs"
            className="text-sm text-gray-400 underline-offset-4 hover:text-white hover:underline"
          >
            ← Back to Browse Jobs
          </Link>
        </p>
      </div>
    );
  }

  const initial = job.company?.trim()?.[0]?.toUpperCase() || "J";
  const responsibilities = toList(job.responsibilities);
  const requirements = toList(job.requirements);

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 text-sm"
      >
        <Link
          href="/"
          className="text-gray-500 transition-colors hover:text-white"
        >
          Public
        </Link>
        <span className="text-gray-700">/</span>
        <Link
          href="/browsejobs"
          className="text-gray-500 transition-colors hover:text-white"
        >
          Browse Jobs
        </Link>
        <span className="text-gray-700">/</span>
        <span className="font-medium text-white">{job.title}</span>
      </nav>

      {/* Hero card */}
      <section className="mt-4 rounded-2xl border border-white/[0.07] bg-[#111114] p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            {/* Logo tile */}
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-lg font-bold text-white">
              {initial}
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-white sm:text-2xl">
                {job.title}
              </h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-400">
                <span>{job.company}</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                  <BadgeCheck className="size-3.5" />
                  Verified Employer
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-600">
                Deadline: {dateLabel(job.deadline)} •{" "}
                {daysLeftLabel(job.deadline)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handleBookmark}
              aria-label={`Save ${job.title}`}
              className="rounded-lg border border-white/10 p-2.5 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Bookmark className="size-5" />
            </button>
            {/* TODO: wire to the apply flow */}
            <button
              type="button"
              onClick={handleApply}
              className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-[#010103] transition-colors hover:bg-gray-200"
            >
              Apply Now
            </button>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* Left column — stat cards + description */}
        <div className="min-w-0">
          {/* Stat cards (2 cols on mobile, 4 on larger screens) */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <InfoCard
              icon={<CreditCard className="size-4" />}
              label="Salary Range"
              value={salaryLabel(job)}
            />
            <InfoCard
              icon={<MapPin className="size-4" />}
              label="Location"
              value={locationLabel(job)}
            />
            <InfoCard
              icon={<BriefcaseBusiness className="size-4" />}
              label="Job Type"
              value={job.jobType}
            />
            {/* Figma shows "Experience" here — not in the data, so Category is shown instead */}
            <InfoCard
              icon={<Layers className="size-4" />}
              label="Category"
              value={job.category}
            />
          </div>

          {/* Description card */}
          <section className="mt-6 rounded-2xl border border-white/[0.07] bg-[#111114] p-5 sm:p-6">
            <h2 className="text-lg font-bold text-white">Responsibilities</h2>
            <BulletList items={responsibilities} />

            <hr className="my-6 border-white/[0.07]" />

            <h2 className="text-lg font-bold text-white">Requirements</h2>
            <BulletList items={requirements} />
          </section>
        </div>

        {/* Right column — company overview */}
        <aside className="min-w-0">
          <section className="rounded-2xl border border-white/[0.07] bg-[#111114] p-5 sm:p-6">
            <h2 className="text-lg font-bold text-white">Company Overview</h2>

            {/* No company images in the DB — initial tile as a placeholder */}
            <div className="mt-5 flex h-44 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-transparent text-5xl font-bold text-white/70">
              {initial}
            </div>

            <div className="mt-5 space-y-4 text-sm">
              <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] pb-4">
                <span className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                  Company
                </span>
                <span className="text-right font-medium text-white">
                  {job.company}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                  Industry
                </span>
                <span className="text-right font-medium text-white">
                  {job.category}
                </span>
              </div>
            </div>

            {/* TODO: company website is not in the data yet */}
            <button
              type="button"
              className="mt-6 w-full rounded-lg border border-white/10 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/5"
            >
              Visit Website
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default function JobDetailsPage() {
  return <JobDetailsContent />;
}
