"use server"

import { protectedMutation } from "../core/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const updateuserrole = async (userid: string, role: "seeker" | "recruiter" | "admin") => {
    const api = `${BASE_URL}/users/${userid}/role`
    const response = await protectedMutation(api,"PATCH",{role})
   
    return response.json()
}