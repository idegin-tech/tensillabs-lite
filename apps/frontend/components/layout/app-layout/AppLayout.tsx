import { AppSidebar } from "@/components/layout/app-sidebar"

import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"

export default function AppLayout(
    {
        children,
        navContent
    }: {
        children: React.ReactNode;
        navContent?: React.ReactNode;
    }
) {
    return (
        <SidebarProvider>
            <AppSidebar
                navContent={navContent}
             />
            <SidebarInset>
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}
