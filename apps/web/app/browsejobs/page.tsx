"use client";

import { useCallback, useEffect, useState } from "react";

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
  JOB_TYPES,
  JOB_CATEGORIES,
} from "@/lib/jobs";
import { getJobs } from "@/lib/api/jobs";

const SORT_OPTIONS = ["Most Recent", "Highest Salary", "Nearest Deadline"];

export default function BrowseJobsPage() {
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  // Filter / sort UI state — the actual fetching & filtering is TODO (yours)
  // Single-select: one job type + one category at a time (null = nothing)
  const [selectedJobType, setSelectedJobType] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0]);

  const loadJobs = useCallback(() => {
    setIsLoading(true);

    getJobs()
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
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // Single-select: clicking another option replaces it, clicking the
  // same option deselects it.
  // TODO: implement — use `selectedJobType` to fetch/filter the jobs
  const handleJobTypeSelect = (label: string) => {
    setSelectedJobType((prev) => (prev === label ? null : label));
  };

  // TODO: implement — use `selectedCategory` to fetch/filter the jobs
  const handleCategorySelect = (label: string) => {
    setSelectedCategory((prev) => (prev === label ? null : label));
  };

  // Sort change — only updates the dropdown.
  // TODO: implement — sort `jobs` using `sortBy`
  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  // Counts shown next to each filter option (from the loaded jobs)
  const jobTypeOptions: FilterOption[] = JOB_TYPES.map((type) => ({
    label: type,
    count: jobs.filter((job) => job.jobType === type).length,
  }));

  const categoryOptions: FilterOption[] = JOB_CATEGORIES.map((category) => ({
    label: category,
    count: jobs.filter((job) => job.category === category).length,
  }));

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6">
      {/* Search */}
      <SearchBar />

      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        {/* Filters sidebar */}
        <FilterSidebar
          jobTypes={jobTypeOptions}
          categories={categoryOptions}
          selectedJobType={selectedJobType}
          selectedCategory={selectedCategory}
          onJobTypeSelect={handleJobTypeSelect}
          onCategorySelect={handleCategorySelect}
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
              {jobs.map((job) => (
                <BrowseJobCard key={job._id} job={job} />
              ))}
            </div>
          )}

          <BrowsePagination className="mt-8" />
        </section>
      </div>
    </div>
  );
}
