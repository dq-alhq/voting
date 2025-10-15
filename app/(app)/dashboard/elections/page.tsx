import {IconPlus} from "@tabler/icons-react";
import type {Metadata} from "next";
import Link from "next/link";
import {getElections} from "@/actions/elections";
import {ElectionCard} from "@/app/(app)/dashboard/elections/election-card";
import {Paginator} from "@/components/paginator";
import {SearchInput} from "@/components/search-input";
import {buttonVariants} from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Daftar Pemilihan",
};

interface searchParams {
    page?: string;
    search?: string;
    sortBy?: string;
    order?: "asc" | "desc";
}

export default async function ElectionsPage({
                                                searchParams,
                                            }: {
    searchParams: Promise<searchParams>;
}) {
    const {
        page = 1,
        search = "",
        sortBy = "createdAt",
        order = "asc",
    } = await searchParams;
    const limit = 10;
    const skip = (Number(page) - 1) * limit;

    const {
        data: elections,
        total,
        totalPages,
    } = await getElections({
        search,
        sortBy,
        order,
        skip,
        limit,
    });
    return (
        <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
            <div className="flex flex-col gap-1">
                <h3 className="text-2xl font-semibold tracking-tight">
                    Daftar Pemilihan
                </h3>
                <p className="text-muted-foreground">
                    Berikut adalah daftar pemilihan yang telah dibuat
                </p>
            </div>
            <div className="flex items-center justify-between">
                <SearchInput/>
                <Link className={buttonVariants()} href="/dashboard/elections/add">
                    <IconPlus/>
                    Tambah
                </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                {elections?.map((election) => (
                    <ElectionCard key={election.id} election={election}/>
                ))}
            </div>
            <Paginator
                currentData={elections.length}
                totalPages={totalPages}
                total={total}
                currentPage={Number(page)}
            />
        </div>
    );
}
