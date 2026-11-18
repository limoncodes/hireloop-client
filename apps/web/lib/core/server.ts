import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export const getsession = async () => {
    "use server";
    const session = await auth.api.getSession({
        headers: await headers()
    })
    return session;
};