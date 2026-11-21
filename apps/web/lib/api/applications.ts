import { type ApplicationRow } from "@/lib/jobs"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Applications from the backend — all of them, or only one user's
// when an email is passed (?email=...)
export const getApplications = async (
  email?: string
): Promise<ApplicationRow[]> => {
  const res = await fetch(
    `${BASE_URL}/applicants${email ? `?email=${encodeURIComponent(email)}` : ""}`
  )

  if (!res.ok) {
    throw new Error(`Failed to load applications (${res.status})`)
  }

  return res.json()
}
// Every application for one job — powers the recruiter's review table
// at /dashboard/recruiter/jobs/[id]/applications.
export const getApplicationsByJob = async (
  jobId: string
): Promise<ApplicationRow[]> => {
  const res = await fetch(
    `${BASE_URL}/applicants?jobId=${encodeURIComponent(jobId)}`
  )

  if (!res.ok) {
    throw new Error(`Failed to load applications (${res.status})`)
  }

  return res.json()
}

// Persist an application change (e.g. status) with PATCH /applicants/:id.
export const updateApplication = async (
  applicationId: string,
  data: Partial<ApplicationRow>
): Promise<ApplicationRow> => {
  const res = await fetch(
    `${BASE_URL}/applicants/${encodeURIComponent(applicationId)}`,
    {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    }
  )

  const contentType = res.headers.get("content-type") ?? ""
  if (!res.ok || !contentType.includes("application/json")) {
    const text = await res.text().catch(() => "")
    throw new Error(
      `Could not update application (${res.status}): ${text.slice(0, 160)}`
    )
  }

  const payload = await res.json()
  return payload.result as ApplicationRow
}

export const getApplicationscount = async (
  email?: string
): Promise<{ count: number }> => {
  const res = await fetch(
    `${BASE_URL}/applicants/count${email ? `?email=${encodeURIComponent(email)}` : ""}`
  )

  if (!res.ok) {
    throw new Error(`Failed to load applications (${res.status})`)
  }

  return res.json()
}
