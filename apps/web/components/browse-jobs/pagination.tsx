"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@workspace/ui/lib/utils";

export function BrowsePagination({ className }: { className?: string }) {
  const pages = [1, 2, 3];

  // TODO: implement — real page numbers + fetch jobs for the selected page
  const handlePageChange = () => {};

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-1.5", className)}
    >
      <button
        type="button"
        onClick={handlePageChange}
        aria-label="Previous page"
        className="flex size-9 items-center justify-center rounded-lg border border-white/10 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
      >
        <ChevronLeft className="size-4" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={handlePageChange}
          className={cn(
            "size-9 rounded-lg border text-sm font-semibold transition-colors",
            page === 1
              ? "border-transparent bg-[#5C53FE] text-white"
              : "border-white/10 text-gray-400 hover:bg-white/5 hover:text-white"
          )}
        >
          {page}
        </button>
      ))}

      <span className="px-1 text-sm text-gray-600">…</span>

      <button
        type="button"
        onClick={handlePageChange}
        className="size-9 rounded-lg border border-white/10 text-sm font-semibold text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
      >
        42
      </button>

      <button
        type="button"
        onClick={handlePageChange}
        aria-label="Next page"
        className="flex size-9 items-center justify-center rounded-lg border border-white/10 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
