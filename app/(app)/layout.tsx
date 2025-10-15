import {redirect} from "next/navigation";
import type {ReactNode} from "react";
import {getServerSession} from "@/lib/get-session";

export default async function AppLayout({children}: { children: ReactNode }) {
    const session = await getServerSession();
    if (!session) redirect("/sign-in");
    return <>{children}</>;
}
