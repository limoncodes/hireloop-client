import { JobRow } from "@/app/dashboard/recruiter/jobs/page";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getJobs = async (query = ''):Promise<JobRow[]> => {
  
  const res = await fetch(`${BASE_URL}/jobs?${query}`);

  if (!res.ok) {
    throw new Error(`Failed to load jobs (${res.status})`);
  }

  return res.json();
};
