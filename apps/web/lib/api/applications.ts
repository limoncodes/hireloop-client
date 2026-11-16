import { type ApplicationRow } from "@/lib/jobs";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// All applications from the backend (GET /applicants) — the page
// filters them by the signed-in user's email
export const getApplications = async (): Promise<ApplicationRow[]> => {
  const res = await fetch(`${BASE_URL}/applicants`);

  if (!res.ok) {
    throw new Error(`Failed to load applications (${res.status})`);
  }

  return res.json();
};
