import {IconArrowLeft, IconPlus} from "@tabler/icons-react";
import Link from "next/link";
import {CandidateCard} from "@/app/(app)/dashboard/elections/[id]/candidate-card";
import DeleteElection from "@/app/(app)/dashboard/elections/[id]/delete";
import {ElectionForm} from "@/app/(app)/dashboard/elections/form";
import {buttonVariants} from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {prisma} from "@/lib/prisma";

export default async function EditElectionPage({
                                                   params,
                                               }: {
    params: Promise<{ id: string }>;
}) {
    const {id} = await params;
    const election = await prisma.election.findUnique({
        where: {
            id,
        },
        include: {
            candidates: true,
        },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0); // biar cuma bandingkan tanggal, bukan jam

    const locked =
        election && (election.endAt < today || election.startAt < today);
    return (
        <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
            <div className="flex flex-col gap-1">
                <h3 className="text-2xl font-semibold tracking-tight">
                    Edit Pemilihan
                </h3>
                <p className="text-muted-foreground">
                    Silakan isi form berikut untuk mengupdate pemilihan
                </p>
            </div>
            <div className="flex items-center justify-between">
                {election && <DeleteElection id={election.id}/>}
                <Link
                    className={buttonVariants({variant: "outline"})}
                    href="/dashboard/elections"
                >
                    <IconArrowLeft/>
                    Kembali
                </Link>
            </div>
            <Card>
                <CardContent>
                    {election && (
                        <ElectionForm locked={locked || !election} election={election}/>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Kandidat</CardTitle>
                    <CardDescription>
                        Berikut adalah daftar kandidat yang terdaftar di pemilihan ini
                    </CardDescription>
                    {!locked && (
                        <CardAction>
                            <Link
                                className={buttonVariants()}
                                href={`/dashboard/elections/${election?.id}/candidates`}
                            >
                                <IconPlus/>
                                Tambah Kandidat
                            </Link>
                        </CardAction>
                    )}
                </CardHeader>
                <CardContent>
                    {election?.candidates.map((candidate) => (
                        <CandidateCard key={candidate.id} candidate={candidate}/>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
