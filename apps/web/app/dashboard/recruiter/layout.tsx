import { requireRole } from "@/lib/core/server"


const RecruiterDashboardlayout = async ({children}:{children:React.ReactNode}) => {
    await requireRole(`recruiter`)
    return children

}

export default RecruiterDashboardlayout