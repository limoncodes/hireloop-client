import {
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar";
import { DashbordSidebar } from "../components/DashbordSidber";
const Dashbordlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <DashbordSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}

export default Dashbordlayout