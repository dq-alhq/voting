import {IconCalendar, IconClockPlay, IconLock, IconTimeDurationOff,} from "@tabler/icons-react";
import Link from "next/link";
import {Badge} from "@/components/ui/badge";
import {Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
import {formatDate} from "@/lib/utils";
import type {Election} from "@/prisma/generated";

export function ElectionCard({
                                 election,
                             }: {
    election: Election & { _count: { votes: number; candidates: number } };
}) {
    return (
        <Link
            href={`/dashboard/elections/${election.id}`}
            key={election.id}
            className="group"
        >
            <Card
                className="group-hover:ring-4 group-hover:ring-primary/40 group-hover:border group-hover:border-primary transition">
                <CardHeader>
                    <CardTitle className="text-primary">{election.title}</CardTitle>
                    <CardDescription className="text-xs">
                        {election.description}
                    </CardDescription>
                    <CardAction>
                        {election.endAt < new Date() ? (
                            <Badge variant="destructive">
                                <IconLock/>
                                Selesai
                            </Badge>
                        ) : election.startAt > new Date() ? (
                            <Badge variant="secondary">
                                <IconTimeDurationOff/>
                                Belum Dimulai
                            </Badge>
                        ) : (
                            <Badge variant="default">
                                <IconClockPlay/>
                                Berlangsung
                            </Badge>
                        )}
                    </CardAction>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div className="border shadow-sm rounded-lg p-3 text-center">
                        <p className="font-semibold text-sm">Pemilih</p>
                        <p className="font-bold text-3xl">{election._count.votes}</p>
                    </div>
                    <div className="border shadow-sm rounded-lg p-3 text-center">
                        <p className="font-semibold text-sm">Calon</p>
                        <p className="font-bold text-3xl">{election._count.candidates}</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <div className="flex gap-2 items-center text-sm font-semibold">
                        <IconCalendar className="size-4"/>
                        <Badge>{formatDate(election.startAt)}</Badge>
                        <span>-</span>
                        <Badge>{formatDate(election.endAt)}</Badge>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}
