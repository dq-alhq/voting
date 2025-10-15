"use client";
import type {ReactNode} from "react";
import AppBreadcrumbs from "@/app/(app)/dashboard/app-breadcrumbs";
import {AppSidebar} from "@/app/(app)/dashboard/app-sidebar";
import {ModeToggle} from "@/components/mode-toggle";
import {Separator} from "@/components/ui/separator";
import {SidebarInset, SidebarProvider, SidebarTrigger,} from "@/components/ui/sidebar";

export default function DashboardLayout({children}: { children: ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar variant="inset"/>
            <SidebarInset>
                <header
                    className="flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4 w-full">
                        <SidebarTrigger className="-ml-1"/>
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <AppBreadcrumbs/>
                        <div className="ml-auto">
                            <ModeToggle/>
                        </div>
                    </div>
                </header>
                <div className="flex flex-1 flex-col">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
}
