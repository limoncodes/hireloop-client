import { JobForm } from "@/app/dashboard/recruiter/jobs/new/page"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL 

export const createJobs = async (data: JobForm)=>{
    const res = await fetch(`${BASE_URL}/jobs`,{
        method:"POST",
        headers:{
            "content-type":"application/json"

        },
        body:JSON.stringify(data)
    })
    return res.json()
}

export const deletJob = async (jobid:string)=>{
    const res = await fetch(`${BASE_URL}/jobs/${jobid}`,{
        method:"DELETE"
    });

    if (!res.ok) {
        throw new Error(`Failed to delete job (${res.status})`);
    }

    return res.json();

}