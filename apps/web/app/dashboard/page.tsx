import { redirect } from "next/navigation"

import { getDashboardContext } from "@/lib/dashboard"

export default async function DashboardIndexPage() {
  const { role } = await getDashboardContext()
  redirect(`/dashboard/${role}`)
}
