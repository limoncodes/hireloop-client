// Shared job types + display helpers — used by the "Post a New Job" form,
// the "Manage Job Posts" table and the public "Browse Jobs" page

export type JobForm = {
  title: string;
  company: string;
  category: string;
  jobType: string;
  remote: boolean;
  location: string;
  deadline: string;
  minSalary: string;
  maxSalary: string;
  frequency: string;
  responsibilities: string;
  requirements: string;
};

export type JobStatus = "Active" | "Expired";

// Options shown in the "Post a New Job" form and the Browse Jobs filters
export const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];

export const JOB_CATEGORIES = [
  "Engineering & Tech",
  "Design & Creative",
  "Marketing & Sales",
  "Finance & Accounting",
  "Customer Support",
  "Human Resources",
];

// Same shape the API returns for a single job (Mongo document)
export type JobRow = JobForm & {
  _id: string;
  applicants: number;
  status: JobStatus;
  postedAgo: string;
};

// ---- Small view helpers (pure functions, safe to use anywhere) ----

// "per hour" -> "/ hr", "per day" -> "/ day", "per week" -> "/ wk",
// "per month" -> "/ mo", "per year" -> "/ yr"
const frequencyLabels: Record<string, string> = {
  "per hour": "/ hr",
  "per day": "/ day",
  "per week": "/ wk",
  "per month": "/ mo",
  "per year": "/ yr",
};

const frequencyShort = (frequency: string) =>
  frequencyLabels[frequency] ?? `/${frequency.replace("per ", "")}`;

// job -> "€50 – €100 / hr"
export const salaryLabel = (
  job: Pick<JobRow, "minSalary" | "maxSalary" | "frequency">
) => `€${job.minSalary} – €${job.maxSalary} ${frequencyShort(job.frequency)}`;

// job -> "Remote (New York, USA)" | "New York, USA"
export const locationLabel = (job: Pick<JobRow, "remote" | "location">) =>
  job.remote ? `Remote (${job.location})` : job.location;

// "2026-11-25" -> "Nov 25, 2026"
export const dateLabel = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

// A MongoDB ObjectId hides its creation time in the first 8 hex characters —
// so "posted how long ago" can be computed from the id itself, no extra field needed
export const postedDateFromId = (id: string) =>
  new Date(parseInt(id.slice(0, 8), 16) * 1000);

// Date -> "just now" | "5m ago" | "3h ago" | "2d ago" | "1w ago" | "2mo ago" | "1y ago"
export const timeAgo = (date: Date) => {
  const sec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  const week = Math.floor(day / 7);
  if (week < 5) return `${week}w ago`;
  const month = Math.floor(day / 30);
  if (month < 12) return `${month}mo ago`;
  return `${Math.floor(day / 365)}y ago`;
};

// Deadline countdown -> "17d left" | "Last day" | "Closed"
export const daysLeftLabel = (iso: string) => {
  const end = new Date(`${iso}T23:59:59`).getTime();
  const diff = Math.ceil((end - Date.now()) / 86400000);
  if (diff < 0) return "Closed";
  if (diff === 0) return "Last day";
  return `${diff}d left`;
};

// Dynamic status: "Expired" when the DB says so OR the deadline date has passed
export const effectiveStatus = (
  job: Pick<JobRow, "status" | "deadline">
): JobStatus =>
  job.status === "Expired" || new Date(`${job.deadline}T23:59:59`) < new Date()
    ? "Expired"
    : "Active";

// 1200 -> "1.2k", 432 -> "432" (for the filter sidebar counts)
export const formatCount = (count: number) =>
  count >= 1000
    ? `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`
    : String(count);

// Salaries are stored as strings ("50", "90k") — convert to a real number
// so they can be sorted ("90k" -> 90000)
export const salaryValue = (value: string) => {
  const num = parseFloat(value);
  if (Number.isNaN(num)) return 0;
  return value.toLowerCase().includes("k") ? num * 1000 : num;
};
