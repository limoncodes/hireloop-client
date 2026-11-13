const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getJobs = async () => {
  const res = await fetch(`${BASE_URL}/jobs`);

  if (!res.ok) {
    throw new Error(`Failed to load jobs (${res.status})`);
  }

  return res.json();
};
