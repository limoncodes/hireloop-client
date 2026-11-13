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
import { Plus } from "lucide-react"
const menuItemByRole = {
    seeker:[

    ],
    recruiter:[

    ],
    admin:[
        
    ]
}

export function DashbordSidebar() {
    const {data:session, isPending}= useSession();
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
                       /*  menuItemByRole[role].map((item) => (
                            <SidebarMenuItem key={item.id}>
                                <SidebarMenuButton render={<a href={item.url} />}>
                                    <item.icon />
                                    <span>{item.name}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )) */
                         }
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}