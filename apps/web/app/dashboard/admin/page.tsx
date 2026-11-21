import { RoleOverview } from "../components/RoleOverview"
import { requireRole } from "@/lib/dashboard"

export default async function AdminDashboardPage() {
  const { name, email } = await requireRole("admin")

  return <RoleOverview role="admin" name={name} email={email} />
}
