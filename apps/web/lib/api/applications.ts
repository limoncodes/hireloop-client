import { type ApplicationRow } from "@/lib/jobs";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Applications from the backend — all of them, or only one user's
// when an email is passed (?email=...)
export const getApplications = async (email?: string): Promise<
  ApplicationRow[]
> => {
  const res = await fetch(
    `${BASE_URL}/applicants${email ? `?email=${encodeURIComponent(email)}` : ""}`
  );

  if (!res.ok) {
    throw new Error(`Failed to load applications (${res.status})`);
  }

  return res.json();
};
