import {
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar"

import { DashbordSidebar } from "../components/DashbordSidber"
import { getDashboardContext } from "@/lib/dashboard"

const Dashbordlayout = async ({ children }: { children: React.ReactNode }) => {
  const { role, name } = await getDashboardContext()

  return (
    <SidebarProvider>
      <DashbordSidebar role={role} />
      <main className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-4 px-4 pt-4 sm:px-6">
          <SidebarTrigger />
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-[#8b8b93] sm:inline">
              Welcome back, {name}
            </span>
            <span className="rounded-full border border-[#5c53fe]/25 bg-[#5c53fe]/10 px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] text-[#a49fff] uppercase">
              {role}
            </span>
          </div>
        </div>
        {children}
      </main>
    </SidebarProvider>
  )
}

export default Dashbordlayout
