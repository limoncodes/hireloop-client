import { type ApplicationType, type JobForm } from "@/lib/jobs"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// The form page builds `{ form, recruiterId }`. The backend stores flat
// job documents, so spread `form` before sending — every job keeps the
// same shape and the listings/readers never see a nested object.
type CreateJobPayload = {
  form: JobForm
  recruiterId: string
}

export const createJobs = async (data: CreateJobPayload) => {
  const res = await fetch(`${BASE_URL}/jobs`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ ...data.form, recruiterId: data.recruiterId }),
  })
  return res.json()
}

export const deletJob = async (jobid: string) => {
  const res = await fetch(`${BASE_URL}/jobs/${jobid}`, {
    method: "DELETE",
  })

  if (!res.ok) {
    throw new Error(`Failed to delete job (${res.status})`)
  }

  return res.json()
}

// Sends one application to the backend — the payload is the application
// without _id (Mongo adds it), and the response carries the inserted id
export const applyTojob = async (
  data: Omit<ApplicationType, "_id">
): Promise<{ acknowledged?: boolean; insertedId?: string }> => {
  const res = await fetch(`${BASE_URL}/applicants`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error(`Failed to submit the application (${res.status})`)
  }

  return res.json()
}
