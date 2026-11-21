import { requireRole } from "@/lib/core/server"


const AdminDashboardlayout = async ({children}:{children:React.ReactNode}) => {
    await requireRole(`admin`)
    return children

}

export default AdminDashboardlayout