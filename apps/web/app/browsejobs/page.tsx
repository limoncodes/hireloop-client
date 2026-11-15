"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Spinner } from "@workspace/ui/components/spinner";

import { SearchBar } from "@/components/browse-jobs/search-bar";
import {
  FilterSidebar,
  type FilterOption,
} from "@/components/browse-jobs/filter-sidebar";
import { BrowseJobCard } from "@/components/browse-jobs/job-card";
import { BrowsePagination } from "@/components/browse-jobs/pagination";
import {
  type JobRow,
  postedDateFromId,
  salaryValue,
} from "@/lib/jobs";
import { getJobs } from "@/lib/api/jobs";

const SORT_OPTIONS = ["Most Recent", "Highest Salary", "Nearest Deadline"];

// useSearchParams() needs a Suspense boundary when the page is
// statically prerendered — so the real page lives in this inner component
export default function BrowseJobsPage() {
  return (
    <Suspense
      fallback={
        <p className="mx-auto w-full max-w-[1280px] px-4 py-10 text-sm text-gray-500">
          Loading…
        </p>
      }
    >
      <BrowseJobsContent />
    </Suspense>
  );
}

// Jobs shown per page (pagination)
const JOBS_PER_PAGE = 10;

function BrowseJobsContent() {
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  // Unfiltered copy of the jobs — used only for the sidebar options,
  // so filters and counts never disappear while a filter is active
  const [allJobs, setAllJobs] = useState<JobRow[]>([]);

  const router = useRouter();

  // The URL (?search=&jobType=&category=&remote=) is the single source of
  // truth — the SearchBar and the filter handlers only push the URL, and
  // every change here re-fetches the jobs
  const searchParams = useSearchParams();
  const search = (searchParams.get("search") ?? "").trim();
  const jobType = searchParams.get("jobType");
  const category = searchParams.get("category");
  const remote = searchParams.get("remote");

  // Sort stays local UI state (not in the URL yet)
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0]);

  // Pagination — current page (JOBS_PER_PAGE jobs per page)
  const [page, setPage] = useState(1);

  const loadJobs = useCallback(() => {
    setIsLoading(true);

    // Build the API query from every active URL param
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (jobType) params.set("jobType", jobType);
    if (category) params.set("category", category);
    if (remote) params.set("remote", remote);

    getJobs(params.toString())
      .then((data) => {
        if (Array.isArray(data)) {
          setJobs(data as JobRow[]);
          setApiError("");
        } else {
          setApiError("Unexpected response from the jobs API.");
        }
      })
      .catch((err) => {
        setApiError(err?.message || "Failed to load jobs from the API.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [search, jobType, category, remote]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // One unfiltered fetch for the sidebar options (once on mount)
  useEffect(() => {
    getJobs()
      .then((data) => {
        if (Array.isArray(data)) setAllJobs(data as JobRow[]);
      })
      .catch(() => {
        // the main fetch already shows the error banner
      });
  }, []);

  // Any filter change -> go back to page 1
  useEffect(() => {
    setPage(1);
  }, [search, jobType, category, remote, sortBy]);

  // Single-select: clicking another option replaces it, clicking the same
  // option deselects it. Existing params (search etc.) are preserved.
  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/browsejobs?${params.toString()}`);
  };

  const handleJobTypeSelect = (label: string) => {
    updateParam("jobType", jobType === label ? null : label);
  };

  const handleCategorySelect = (label: string) => {
    updateParam("category", category === label ? null : label);
  };

  const handleRemoteSelect = (label: string) => {
    // "Remote" -> remote=true, "On-site" -> remote=false (Mongo boolean)
    const wanted = label === "Remote" ? "true" : "false";
    updateParam("remote", remote === wanted ? null : wanted);
  };

  // Sort change — sorts the loaded jobs client-side (no extra API call)
  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  // The jobs sorted by the selected "Sort by" option
  const sortedJobs = useMemo(() => {
    const copy = [...jobs];

    switch (sortBy) {
      case "Highest Salary":
        // biggest max salary first ("90k" -> 90000 before comparing)
        return copy.sort(
          (a, b) => salaryValue(b.maxSalary) - salaryValue(a.maxSalary)
        );
      case "Nearest Deadline":
        // soonest deadline first
        return copy.sort(
          (a, b) =>
            new Date(`${a.deadline}T23:59:59`).getTime() -
            new Date(`${b.deadline}T23:59:59`).getTime()
        );
      default:
        // Most Recent — newest ObjectId (= newest post) first
        return copy.sort(
          (a, b) =>
            postedDateFromId(b._id).getTime() - postedDateFromId(a._id).getTime()
        );
    }
  }, [jobs, sortBy]);

  // Filter options are derived from the unfiltered snapshot, so the
  // labels + counts always match what the API really has — and they
  // stay visible even while a filter is active
  const uniqueSorted = (values: string[]) => [...new Set(values)].sort();

  const jobTypeOptions: FilterOption[] = uniqueSorted(
    allJobs.map((job) => job.jobType)
  ).map((type) => ({
    label: type,
    count: allJobs.filter((job) => job.jobType === type).length,
  }));

  const categoryOptions: FilterOption[] = uniqueSorted(
    allJobs.map((job) => job.category)
  ).map((cat) => ({
    label: cat,
    count: allJobs.filter((job) => job.category === cat).length,
  }));

  // Remote section derived from the Mongo boolean field — sections with no
  // jobs on one side are simply not shown
  const remoteCount = allJobs.filter((job) => job.remote).length;
  const remoteOptions: FilterOption[] = [
    ...(remoteCount > 0
      ? [{ label: "Remote", count: remoteCount }]
      : []),
    ...(allJobs.length - remoteCount > 0
      ? [{ label: "On-site", count: allJobs.length - remoteCount }]
      : []),
  ];

  // Only the current page's slice of the sorted jobs is shown
  const totalPages = Math.max(1, Math.ceil(jobs.length / JOBS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const visibleJobs = sortedJobs.slice(
    (safePage - 1) * JOBS_PER_PAGE,
    safePage * JOBS_PER_PAGE
  );

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-sm"
      >
        <Link
          href="/"
          className="text-gray-500 transition-colors hover:text-white"
        >
          Public
        </Link>
        <span className="text-gray-700">/</span>
        <span className="font-medium text-white">Browse Jobs</span>
      </nav>

      {/* Search */}
      <SearchBar initialValue={search} />

      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        {/* Filters sidebar */}
        <FilterSidebar
          jobTypes={jobTypeOptions}
          categories={categoryOptions}
          remoteOptions={remoteOptions}
          selectedJobType={jobType}
          selectedCategory={category}
          selectedRemote={remote === "true" ? "Remote" : remote === "false" ? "On-site" : null}
          onJobTypeSelect={handleJobTypeSelect}
          onCategorySelect={handleCategorySelect}
          onRemoteSelect={handleRemoteSelect}
          className="w-full shrink-0 lg:w-60"
        />

        {/* Results */}
        <section className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-xl font-bold text-white">
              Found{" "}
              <span className="text-gray-400">{jobs.length}</span> Professional
              Jobs
            </h1>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <Select value={sortBy} onValueChange={(value) => value && handleSortChange(value)}>
                <SelectTrigger className="h-9 w-40 rounded-lg border-white/10 bg-[#1A1A1F] text-sm text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#1A1A1F] text-white">
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="mt-6 flex items-center gap-2 rounded-2xl border border-white/[0.07] bg-[#111114] px-5 py-10 text-sm text-gray-500">
              <Spinner className="text-purple-400" />
              Loading jobs…
            </div>
          )}

          {/* API error */}
          {!isLoading && apiError && (
            <p className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-10 text-center text-sm text-red-300">
              {apiError} — is the backend running?
            </p>
          )}

          {/* Empty */}
          {!isLoading && !apiError && jobs.length === 0 && (
            <div className="mt-6 rounded-2xl border border-white/[0.07] bg-[#111114] px-5 py-10 text-center">
              <p className="text-sm font-semibold text-white">No jobs found</p>
              <p className="mt-1 text-sm text-gray-500">
                Try different keywords or check back later.
              </p>
            </div>
          )}

          {/* Job cards */}
          {!isLoading && !apiError && jobs.length > 0 && (
            <div className="mt-5 space-y-4">
              {visibleJobs.map((job) => (
                <BrowseJobCard key={job._id} job={job} />
              ))}
            </div>
          )}

          {/* Pagination — only when there is more than one page */}
          {!isLoading && !apiError && totalPages > 1 && (
            <BrowsePagination
              page={safePage}
              totalPages={totalPages}
              onPageChange={setPage}
              className="mt-8"
            />
          )}
        </section>
      </div>
    </div>
  );
}
