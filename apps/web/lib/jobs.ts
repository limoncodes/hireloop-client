// Shared job types — used by the "Post a New Job" form (dashboard/recruiter/jobs/new)
// and the "Manage Job Posts" table (dashboard/recruiter/jobs)

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
