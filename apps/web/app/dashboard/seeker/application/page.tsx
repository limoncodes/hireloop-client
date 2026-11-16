"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Download,
  FileText,
  Inbox,
  Percent,
  Star,
  Users,
} from "lucide-react";

import { cn } from "@workspace/ui/lib/utils";
import { BrowsePagination } from "@/components/browse-jobs/pagination";

// ------------------------------------------------------------------
// DUMMY DATA — learning mode 🙂
// পরে এটা real API দিয়ে replace করবেন:
//   const applications = await getApplications(user.id)  ← আপনি লিখবেন
// ------------------------------------------------------------------
type DummyApplication = {
  id: number;
  title: string;
  meta: string; // "Full-time • Remote"
  company: string;
  appliedAgo: string;
  status: "Applied" | "Review" | "Shortlisted" | "Rejected" | "Offered";
};

const DUMMY_APPLICATIONS: DummyApplication[] = [
  { id: 1, title: "Senior Frontend Engineer", meta: "Full-time • Remote", company: "Stark Industries", appliedAgo: "2 hours ago", status: "Applied" },
  { id: 2, title: "Product Designer", meta: "Contract • Hybrid", company: "Cyberdyne Systems", appliedAgo: "1 day ago", status: "Review" },
  { id: 3, title: "Lead Data Scientist", meta: "Full-time • On-site", company: "Wayne Enterprises", appliedAgo: "4 days ago", status: "Shortlisted" },
  { id: 4, title: "Cloud Architect", meta: "Full-time • Remote", company: "Oscorp Tech", appliedAgo: "1 week ago", status: "Rejected" },
  { id: 5, title: "AI Research Engineer", meta: "Full-time • Hybrid", company: "Hooii Corp", appliedAgo: "2 weeks ago", status: "Offered" },
  { id: 6, title: "Backend Developer", meta: "Full-time • On-site", company: "Apex Labs", appliedAgo: "2 weeks ago", status: "Applied" },
  { id: 7, title: "UX Researcher", meta: "Part-time • Remote", company: "Vertex Group", appliedAgo: "3 weeks ago", status: "Shortlisted" },
  { id: 8, title: "DevOps Engineer", meta: "Contract • Remote", company: "Netic Solutions", appliedAgo: "3 weeks ago", status: "Shortlisted" },
  { id: 9, title: "Marketing Manager", meta: "Full-time • On-site", company: "BrightWave", appliedAgo: "1 month ago", status: "Review" },
  { id: 10, title: "QA Automation Engineer", meta: "Full-time • Remote", company: "Quantum Soft", appliedAgo: "1 month ago", status: "Review" },
  { id: 11, title: "Mobile App Developer", meta: "Full-time • Hybrid", company: "Skyline Digital", appliedAgo: "1 month ago", status: "Shortlisted" },
  { id: 12, title: "Data Analyst", meta: "Full-time • On-site", company: "Prime Analytics", appliedAgo: "1 month ago", status: "Rejected" },
  { id: 13, title: "Graphics Designer", meta: "Part-time • Remote", company: "PixelWorks", appliedAgo: "1 month ago", status: "Applied" },
  { id: 14, title: "WordPress Developer", meta: "Contract • Remote", company: "Nexa Agency", appliedAgo: "2 months ago", status: "Shortlisted" },
  { id: 15, title: "Business Analyst", meta: "Full-time • On-site", company: "GlobalVista", appliedAgo: "2 months ago", status: "Applied" },
  { id: 16, title: "Security Engineer", meta: "Full-time • Hybrid", company: "Fortify Systems", appliedAgo: "2 months ago", status: "Shortlisted" },
  { id: 17, title: "Content Strategist", meta: "Part-time • Remote", company: "WordCraft", appliedAgo: "2 months ago", status: "Rejected" },
  { id: 18, title: "React Native Developer", meta: "Full-time • Remote", company: "AppForge", appliedAgo: "3 months ago", status: "Shortlisted" },
  { id: 19, title: "Sales Executive", meta: "Full-time • On-site", company: "MarketPro", appliedAgo: "3 months ago", status: "Applied" },
  { id: 20, title: "Machine Learning Engineer", meta: "Full-time • Hybrid", company: "Neural Tech", appliedAgo: "3 months ago", status: "Offered" },
  { id: 21, title: "HR Coordinator", meta: "Full-time • On-site", company: "PeopleFirst", appliedAgo: "3 months ago", status: "Rejected" },
  { id: 22, title: "Frontend Developer", meta: "Full-time • Remote", company: "WebCraft Studio", appliedAgo: "4 months ago", status: "Shortlisted" },
  { id: 23, title: "Financial Analyst", meta: "Full-time • On-site", company: "Ledger & Co", appliedAgo: "4 months ago", status: "Applied" },
  { id: 24, title: "Game Developer", meta: "Contract • Hybrid", company: "PlayGrid", appliedAgo: "4 months ago", status: "Offered" },
];

// Applications shown per page (footer pagination)
const APPS_PER_PAGE = 5;

// The Active / Archived segmented control
const TABS = ["Active", "Archived"] as const;

// Status -> pill colors (matches the Figma palette)
const STATUS_STYLES: Record<string, string> = {
  Applied: "bg-white/[0.06] text-gray-300 border-white/10",
  Review: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  Shortlisted: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Rejected: "bg-red-500/15 text-red-400 border-red-500/20",
  Offered: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
};

// One of the 4 stat cards on top
function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  accent?: string;
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
  );
}

// Job Title cell icon tile — colored by company name so rows differ a bit
const TILE_COLORS = [
  "bg-purple-500/20 text-purple-300",
  "bg-sky-500/20 text-sky-300",
  "bg-emerald-500/20 text-emerald-300",
  "bg-amber-500/20 text-amber-300",
  "bg-rose-500/20 text-rose-300",
];

const tileColor = (key: string) =>
  TILE_COLORS[
    [...key].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) %
      TILE_COLORS.length
  ];

export default function Application() {
  // পরে এটা real API data দিয়ে replace করবেন
  const applications = DUMMY_APPLICATIONS;

  // Active / Archived toggle
  const [tab, setTab] = useState<(typeof TABS)[number]>("Active");

  // Footer pagination
  const [page, setPage] = useState(1);

  // Stats computed from the (dummy) data — API আসার পরেও একই logic চলবে
  const stats = useMemo(() => {
    const total = applications.length;
    const shortlisted = applications.filter(
      (a) => a.status === "Shortlisted"
    ).length;
    const interviews = applications.filter(
      (a) => a.status === "Review"
    ).length;
    const offered = applications.filter((a) => a.status === "Offered").length;
    return {
      total,
      shortlisted,
      interviews,
      successRate:
        total > 0 ? `${Math.round((offered / total) * 100)}%` : "0%",
    };
  }, [applications]);

  // The rows for the current tab + page
  const filtered =
    tab === "Archived"
      ? [] // archived এখনো dummy data তে নেই
      : applications;

  const totalPages = Math.max(1, Math.ceil(filtered.length / APPS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const visibleApps = filtered.slice(
    (safePage - 1) * APPS_PER_PAGE,
    safePage * APPS_PER_PAGE
  );

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
                  setTab(t);
                  setPage(1);
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
        {/* Empty */}
        {filtered.length === 0 && (
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
        {filtered.length > 0 && (
          <>
            <table className="hidden w-full text-left text-sm md:table">
              <thead>
                <tr className="border-b border-white/[0.07] text-xs text-gray-500">
                  <th className="px-5 py-3.5 font-medium">Job Title</th>
                  <th className="px-5 py-3.5 font-medium">Company</th>
                  <th className="px-5 py-3.5 font-medium">Applied</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 text-right font-medium">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleApps.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "flex size-9 shrink-0 items-center justify-center rounded-lg",
                            tileColor(app.company)
                          )}
                        >
                          <FileText className="size-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-white">
                            {app.title}
                          </p>
                          <p className="text-xs text-gray-500">{app.meta}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-400">{app.company}</td>
                    <td className="px-5 py-4 text-gray-400">
                      {app.appliedAgo}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold",
                          STATUS_STYLES[app.status]
                        )}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href="/browsejobs"
                        className="text-sm font-medium text-white underline-offset-4 hover:underline"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile cards (<md) */}
            <div className="md:hidden">
              {visibleApps.map((app) => (
                <div
                  key={app.id}
                  className="border-b border-white/[0.05] p-4 last:border-0"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-lg",
                        tileColor(app.company)
                      )}
                    >
                      <FileText className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate font-semibold text-white">
                          {app.title}
                        </p>
                        <span
                          className={cn(
                            "shrink-0 rounded-md border px-2 py-0.5 text-[11px] font-semibold",
                            STATUS_STYLES[app.status]
                          )}
                        >
                          {app.status}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {app.company} • {app.meta}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                        <span>Applied {app.appliedAgo}</span>
                        <Link
                          href="/browsejobs"
                          className="font-medium text-white underline-offset-4 hover:underline"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
  );
}
