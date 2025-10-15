"use client";

import {IconChartBar, IconDashboard, IconSelect, IconUser,} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import type {ComponentProps} from "react";
import {NavMenu} from "@/app/(app)/dashboard/nav-menu";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar(props: ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();

    const navMain = [
        {
            title: "Pemilihan",
            url: "/dashboard/elections",
            icon: IconSelect,
            isActive: pathname.includes("/dashboard/elections"),
        },
        {
            title: "Hasil",
            url: "/dashboard/results",
            icon: IconChartBar,
            isActive: pathname.includes("/dashboard/results"),
        },
    ];

    const navSetting = [
        {
            title: "Profil",
            url: "/dashboard/profile",
            icon: IconUser,
            isActive: pathname.includes("/dashboard/profile"),
        },
        {
            title: "Setting Aplikasi",
            url: "/dashboard/app-setting",
            icon: IconUser,
            isActive: pathname.includes("/dashboard/app-setting"),
        },
    ];

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" className="flex items-center">
                                <div
                                    className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-white p-1 shadow-sm">
                                    <Image
                                        src={"/next.svg"}
                                        alt="Logo"
                                        className="flex-1"
                                        width={28}
                                        height={28}
                                    />
                                </div>
                                <div className="grid flex-1 text-left text-sm data-[state=close]:hidden">
                                    <span className="truncate font-bold text-sm">VOTTY</span>
                                    <span className="truncate text-xs">Dashboard</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem isActive={pathname === "/dashboard"}>
                            <SidebarMenuButton asChild tooltip="Dashboard">
                                <Link href={"/dashboard"}>
                                    <IconDashboard/>
                                    <span>Dashboard</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
                <NavMenu title="Aplikasi" items={navMain}/>
                <NavMenu title="Setting" items={navSetting} className="mt-auto"/>
            </SidebarContent>
            <SidebarRail/>
        </Sidebar>
    );
}
