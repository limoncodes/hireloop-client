import { headers } from "next/headers"
import { auth } from "../auth"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const getUserPremiumById = async (userId: string): Promise<boolean> => {
  const response = await fetch(`${BASE_URL}/users/${userId}/premium`)

  // A 404/500 from Express is HTML, not JSON — guard it so we get a clear
  // error instead of "Unexpected token '<'".
  const contentType = response.headers.get("content-type") ?? ""
  if (!response.ok || !contentType.includes("application/json")) {
    const text = await response.text().catch(() => "")
    throw new Error(
      `Could not check premium status (${response.status}): ${text.slice(0, 200)}`
    )
  }

  const data = await response.json()

  return data?.premium === true
}
export const getUsers = async () => {
  const users = await auth.api.listUsers({
    query: {

      sortBy: "name", // The field to sort by.
      sortDirection: "desc", // The direction to sort by.

    },
    // This endpoint requires session cookies.
    headers: await headers(),
  });
  return users
}
