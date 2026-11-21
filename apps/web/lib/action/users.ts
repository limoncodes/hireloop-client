
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const updateuserrole = async (userid: string, role: "seeker" | "recruiter" | "admin") => {
    const response = await fetch(`${BASE_URL}/users/${userid}/role`,{
        method:"PATCH",
        headers:{
            'Content-Type':"application/json"
        },
        body:JSON.stringify({role})
    })
    return response.json()
}