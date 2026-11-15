"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { useRouter } from "next/navigation";

export function SearchBar({ className, initialValue = "" }: { className?: string; initialValue?: string }) {
  const [query, setQuery] = useState(initialValue);

  // TODO: implement — use `query` to filter/fetch the jobs
  const router = useRouter()
  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set('search',query)
    router.push(`/browsejobs?${params.toString()}`)
    
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-[#111114] p-3 sm:flex-row sm:items-center",
        className
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2.5 px-2">
        <Search className="size-4 shrink-0 text-gray-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by job title, keywords..."
          className="h-11 w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
        />
      </div>

      <Button
        onClick={handleSearch}
        className="h-11 shrink-0 rounded-xl bg-white px-5 text-sm font-bold text-[#010103] transition-colors hover:bg-gray-200"
      >
        Search Jobs
      </Button>
    </div>
  );
}
