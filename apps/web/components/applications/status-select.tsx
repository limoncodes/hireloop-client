"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { cn } from "@workspace/ui/lib/utils"

import {
  APPLICATION_STATUSES,
  STATUS_STYLES,
  type ApplicationStatus,
} from "@/lib/applications"

/** Status control shared by every application review row. */
export function StatusSelect({
  value,
  onChange,
  disabled = false,
}: {
  value: ApplicationStatus
  onChange: (status: ApplicationStatus) => void
  disabled?: boolean
}) {
  return (
    <Select
      value={value}
      disabled={disabled}
      onValueChange={(next) => onChange(next as ApplicationStatus)}
    >
      <SelectTrigger
        aria-label="Application status"
        className={cn(
          "h-8 w-32 rounded-full border px-3 text-xs font-semibold",
          STATUS_STYLES[value]
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="border-white/10 bg-[#1A1A1F] text-white">
        {APPLICATION_STATUSES.map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
