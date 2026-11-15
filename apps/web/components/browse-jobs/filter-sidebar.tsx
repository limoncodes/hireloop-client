"use client";

import { Checkbox } from "@workspace/ui/components/checkbox";
import { formatCount } from "@/lib/jobs";

export type FilterOption = {
  label: string;
  count: number;
};

// One checkbox row: label on the left, count on the right
function FilterRow({
  option,
  checked,
  onSelect,
}: {
  option: FilterOption;
  checked: boolean;
  onSelect: (label: string) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <Checkbox
        checked={checked}
        onCheckedChange={() => onSelect(option.label)}
        className="size-4"
      />
      <span className="text-sm text-gray-300">{option.label}</span>
      <span className="ml-auto text-xs text-gray-500">
        {formatCount(option.count)}
      </span>
    </label>
  );
}

export function FilterSidebar({
  jobTypes,
  categories,
  remoteOptions,
  selectedJobType,
  selectedCategory,
  selectedRemote,
  onJobTypeSelect,
  onCategorySelect,
  onRemoteSelect,
  className,
}: {
  jobTypes: FilterOption[];
  categories: FilterOption[];
  remoteOptions: FilterOption[];
  // Single-select — only one option at a time per section
  selectedJobType: string | null;
  selectedCategory: string | null;
  selectedRemote: string | null;
  onJobTypeSelect: (label: string) => void;
  onCategorySelect: (label: string) => void;
  onRemoteSelect: (label: string) => void;
  className?: string;
}) {
  return (
    <aside
      className={`rounded-2xl border border-white/[0.07] bg-[#111114] p-5 ${className ?? ""}`}
    >
      <h2 className="text-base font-semibold text-white">Filters</h2>

      <p className="mt-5 text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
        Job Type
      </p>
      <div className="mt-3 space-y-3">
        {jobTypes.map((option) => (
          <FilterRow
            key={option.label}
            option={option}
            checked={selectedJobType === option.label}
            onSelect={onJobTypeSelect}
          />
        ))}
      </div>

      <p className="mt-6 text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
        Category
      </p>
      <div className="mt-3 space-y-3">
        {categories.map((option) => (
          <FilterRow
            key={option.label}
            option={option}
            checked={selectedCategory === option.label}
            onSelect={onCategorySelect}
          />
        ))}
      </div>

      <p className="mt-6 text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
        Remote
      </p>
      <div className="mt-3 space-y-3">
        {remoteOptions.map((option) => (
          <FilterRow
            key={option.label}
            option={option}
            checked={selectedRemote === option.label}
            onSelect={onRemoteSelect}
          />
        ))}
      </div>
    </aside>
  );
}
