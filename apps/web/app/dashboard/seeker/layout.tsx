import { requireRole } from "@/lib/core/server"


const seekerDashboardlayout = async ({children}:{children:React.ReactNode}) => {
    await requireRole(`seeker`)
    return children

}

export default seekerDashboardlayout