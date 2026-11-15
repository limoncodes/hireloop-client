import { getJobs } from "@/lib/api/jobs";


const BrowseJobs = async({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
    const search = await searchParams;
    const urlSearch = new URLSearchParams(search as Record<string , string> )
    const query  = urlSearch.toString();
    console.log(query)
    const jobs = await getJobs(query)

  return (
    <div>
      {jobs.map((job) => (
        <li key={job._id}>{job.title}</li>
      ))}
    </div>
  )
}

export default BrowseJobs