import { RoleOverview } from "../components/RoleOverview"
import { requireRole } from "@/lib/dashboard"

export default async function RecruoterDashboardPage() {
  const { name, email } = await requireRole("recruiter")

  return <RoleOverview role="recruiter" name={name} email={email} />
}
