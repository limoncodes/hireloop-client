"use client"
import { useSession } from "@/lib/auth-client"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@workspace/ui/components/sidebar"
import {
    Bookmark,
    Briefcase,
    Building2,
    FileText,
    LayoutDashboard,
    Settings,
    Users,
    Wallet,
    type LucideIcon,
} from "lucide-react"
import { usePathname } from "next/navigation"

/** One sidebar navigation entry. */
export type MenuItem = {
    id: string
    name: string
    url: string
    icon: LucideIcon
}

export type UserRole = "seeker" | "recruiter" | "admin"

/**
 * Sidebar menu per role — cloned from the Figma `HL 2.0/Sidebar` component:
 * - Role=Seeker:    Dashboard, Jobs, Saved Jobs, Applications, Billing, Settings
 * - Role=Recruiter: Dashboard, My Company, Manage Jobs, Applications, Settings
 * - Role=Admin:     Dashboard, Users, Companies, Jobs, Payments, Settings
 */
const menuItemByRole: Record<UserRole, MenuItem[]> = {
    seeker: [
        { id: "dashboard", name: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        { id: "jobs", name: "Jobs", url: "/jobs", icon: Briefcase },
        { id: "saved-jobs", name: "Saved Jobs", url: "/dashboard/saved-jobs", icon: Bookmark },
        { id: "applications", name: "Applications", url: "/dashboard/applications", icon: FileText },
        { id: "billing", name: "Billing", url: "/dashboard/billing", icon: Wallet },
        { id: "settings", name: "Settings", url: "/dashboard/settings", icon: Settings },
    ],
    recruiter: [
        { id: "dashboard", name: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        { id: "manage-jobs", name: "Manage Jobs", url: "/dashboard/manage-jobs", icon: Briefcase },
        { id: "applications", name: "Applications", url: "/dashboard/applications", icon: FileText },
        { id: "settings", name: "Settings", url: "/dashboard/settings", icon: Settings },
    ],
    admin: [
        { id: "dashboard", name: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        { id: "users", name: "Users", url: "/dashboard/users", icon: Users },
        { id: "companies", name: "Companies", url: "/dashboard/companies", icon: Building2 },
        { id: "jobs", name: "Jobs", url: "/dashboard/jobs", icon: Briefcase },
        { id: "payments", name: "Payments", url: "/dashboard/payments", icon: Wallet },
        { id: "settings", name: "Settings", url: "/dashboard/settings", icon: Settings },
    ],
}

export function DashbordSidebar() {
    const { data: session, isPending } = useSession();
    const pathname = usePathname();
    const role = (session?.user?.role || "seeker") as keyof typeof menuItemByRole



    return (
        <Sidebar>
            <SidebarHeader />
            <SidebarContent>
                <SidebarGroup />
                <SidebarGroup />
                <SidebarGroup>
                    <SidebarMenu>
                        {
                            menuItemByRole[role].map((item) => (
                                <SidebarMenuItem key={item.id}>
                                    <SidebarMenuButton render={<a href={item.url} />} isActive={pathname === item.url}>
                                        <item.icon />
                                        <span>{item.name}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))
                        }
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}
