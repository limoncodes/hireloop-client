import { Trash2, Trash2Icon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog"
import { Button } from "@workspace/ui/components/button"
import { JobRow } from "../dashboard/recruiter/jobs/page"
import { deletJob } from "@/lib/action/jobs"

export function DeletejobDialog({ job, onDeleted }: { job: JobRow; onDeleted?: () => void }) {
  const handleDelet = async () => {
    const res = await deletJob(job._id)
    console.log("Delete", res)
    // Refresh the list so the deleted row disappears
    onDeleted?.()
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
            <Button
        variant="ghost"
        size="icon"
        aria-label={`Delete ${job.title}`}
        className="size-8 rounded-lg text-gray-500 hover:bg-red-500/10 hover:text-red-400"
      >
        <Trash2 className="size-4" />
      </Button>
        }
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>{job.title}</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this {job.title} . 
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDelet}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
