import { type ApplicationRow } from "@/lib/jobs"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

/**
 * Bearer token for the Express API.
 *
 * - Browser: read the Better Auth session token from authClient (cookies are
 *   sent with the /api/auth/get-session call automatically).
 * - Server: callers pass the token from `getToken()` in lib/core/server.ts —
 *   that module is server-only and must never be imported here, otherwise
 *   `next/headers` lands in the client bundle and breaks the build.
 */
const authHeaders = async (token?: string): Promise<Record<string, string>> => {
  let bearer = token

  if (!bearer && typeof window !== "undefined") {
    const { authClient } = await import("@/lib/auth-client")
    const { data: session } = await authClient.getSession()
    bearer = session?.session?.token
  }

  return bearer ? { authorization: `Bearer ${bearer}` } : {}
}

// Applications from the backend — all of them, or only one user's
// when an email is passed (?email=...)
export const getApplications = async (
  email?: string
): Promise<ApplicationRow[]> => {
  const res = await fetch(
    `${BASE_URL}/applicants${email ? `?email=${encodeURIComponent(email)}` : ""}`,
    { headers: await authHeaders() }
  )

  if (!res.ok) {
    throw new Error(`Failed to load applications (${res.status})`)
  }

  return res.json()
}

// Every application for one job — powers the recruiter's review table
// at /dashboard/recruiter/jobs/[id]/applications.
export const getApplicationsByJob = async (
  jobId: string,
  token?: string
): Promise<ApplicationRow[]> => {
  const res = await fetch(
    `${BASE_URL}/applicants?jobId=${encodeURIComponent(jobId)}`,
    { headers: await authHeaders(token) }
  )

  if (!res.ok) {
    throw new Error(`Failed to load applications (${res.status})`)
  }

  return res.json()
}

// Persist an application change (e.g. status) with PATCH /applicants/:id.
export const updateApplication = async (
  applicationId: string,
  data: Partial<ApplicationRow>,
  token?: string
): Promise<ApplicationRow> => {
  const res = await fetch(
    `${BASE_URL}/applicants/${encodeURIComponent(applicationId)}`,
    {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        ...(await authHeaders(token)),
      },
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
    `${BASE_URL}/applicants/count${email ? `?email=${encodeURIComponent(email)}` : ""}`,
    { headers: await authHeaders() }
  )

  if (!res.ok) {
    throw new Error(`Failed to load applications (${res.status})`)
  }

  return res.json()
}
