import {IconArrowLeft} from "@tabler/icons-react";
import Link from "next/link";
import {CandidateForm} from "@/app/(app)/dashboard/elections/[id]/candidates/form";
import {buttonVariants} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";

export default async function AddCandidatePage({
                                                   params,
                                               }: {
    params: Promise<{ id: string }>;
}) {
    const {id} = await params;
    return (
        <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
            <div className="flex flex-col gap-1">
                <h3 className="text-2xl font-semibold tracking-tight">
                    Buat Kandidat Baru
                </h3>
                <p className="text-muted-foreground">
                    Silakan isi form berikut untuk membuat kandidat baru
                </p>
            </div>
            <div className="flex items-center justify-end">
                <Link
                    className={buttonVariants({variant: "outline"})}
                    href={`/dashboard/elections/${id}`}
                >
                    <IconArrowLeft/>
                    Kembali
                </Link>
            </div>
            <Card>
                <CardContent>
                    <CandidateForm/>
                </CardContent>
            </Card>
        </div>
    );
}
