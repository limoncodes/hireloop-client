import {
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar";
import { DashbordSidebar } from "../components/DashbordSidber";
const Dashbordlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <DashbordSidebar />
      <main className="min-w-0 flex-1">
        <div className="px-4 pt-4 sm:px-6">
          <SidebarTrigger />
        </div>
        {children}
      </main>
    </SidebarProvider>
  )
}

export default Dashbordlayout