"use client"

import { useState } from "react"
import { CalendarDays, Inbox, Users } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { toast } from "@workspace/ui/components/toast"

import { applicationStatus, type ApplicationStatus } from "@/lib/applications"
import { postedDateFromId, timeAgo, type ApplicationRow } from "@/lib/jobs"

import { StatusSelect } from "./status-select"

/**
 * Tabular list of the applications sent to one job.
 *
 * Status changes update the UI immediately (optimistic) and call
 * `onStatusChange` to persist. If persistence fails, the previous value
 * is restored and an error toast is shown.
 */
export function ApplicationsTable({
  applications,
  onStatusChange,
}: {
  applications: ApplicationRow[]
  onStatusChange?: (
    applicationId: string,
    status: ApplicationStatus
  ) => Promise<void>
}) {
  const [statuses, setStatuses] = useState<Record<string, ApplicationStatus>>(
    () =>
      Object.fromEntries(
        applications.map((row) => [row._id, applicationStatus(row)])
      )
  )
  const [savingIds, setSavingIds] = useState<string[]>([])

  const changeStatus = async (
    applicationId: string,
    status: ApplicationStatus
  ) => {
    const previous = statuses[applicationId] ?? "Applied"
    if (previous === status) return

    setStatuses((prev) => ({ ...prev, [applicationId]: status }))
    if (!onStatusChange) return

    setSavingIds((prev) => [...prev, applicationId])
    try {
      await onStatusChange(applicationId, status)
    } catch (error) {
      // Roll back the optimistic change when the backend rejects it.
      setStatuses((prev) => ({ ...prev, [applicationId]: previous }))
      toast.add({
        title: "Could not update status",
        description:
          error instanceof Error ? error.message : "Please try again.",
        type: "error",
      })
    } finally {
      setSavingIds((prev) => prev.filter((id) => id !== applicationId))
    }
  }

  if (applications.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.07] bg-[#111114] px-6 py-12 text-center">
        <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-white/[0.04] text-gray-500">
          <Inbox className="size-5" />
        </div>
        <p className="mt-4 text-sm font-semibold text-white">
          No applications yet
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Candidates who apply to this job will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111114]">
      <div className="overflow-x-auto">
        <Table className="w-full min-w-[640px]">
          <TableHeader>
            <TableRow className="border-b border-white/[0.06] hover:bg-transparent">
              <TableHead className="h-12 px-4 text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                Applicant
              </TableHead>
              <TableHead className="h-12 px-4 text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                Applied
              </TableHead>
              <TableHead className="h-12 px-4 text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => (
              <TableRow
                key={application._id}
                className="border-b border-white/[0.06] transition-colors last:border-0 hover:bg-white/[0.02]"
              >
                <TableCell className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                      <Users className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {application.email}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-gray-500">
                        {application.jobTitle || "Candidate"}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-4">
                  <span className="flex items-center gap-1.5 text-xs text-gray-300">
                    <CalendarDays className="size-3.5 shrink-0 text-gray-500" />
                    {timeAgo(postedDateFromId(application._id))}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-4">
                  <StatusSelect
                    value={
                      statuses[application._id] ??
                      applicationStatus(application)
                    }
                    onChange={(status) => changeStatus(application._id, status)}
                    disabled={savingIds.includes(application._id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
