import { RoleOverview } from "../components/RoleOverview"
import { requireRole } from "@/lib/dashboard"

export default async function SeekerDashboardPage() {
  const { name, email } = await requireRole("seeker")

  return <RoleOverview role="seeker" name={name} email={email} />
}
