import {IconBrandInstagram} from "@tabler/icons-react";
import Link from "next/link";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {DL} from "@/components/ui/description-list";
import type {Candidate} from "@/prisma/generated";

export function CandidateCard({candidate}: { candidate: Candidate }) {
    return (
        <div className="mb-8 bg-accent rounded-xl p-6 break-inside-avoid">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Avatar className="size-10">
                        <AvatarImage alt={candidate.name} src={candidate.photo ?? ""}/>
                        <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{candidate.name}</p>
                        <p className="text-sm text-muted-foreground">@{candidate.id}</p>
                    </div>
                </div>
                <Button variant="outline" size="icon" asChild>
                    <Link href="#" target="_blank">
                        <IconBrandInstagram/>
                    </Link>
                </Button>
            </div>
            <DL>
                <DL.T>Visi</DL.T>
                <DL.D>{candidate.visi}</DL.D>
                <DL.T>MISI</DL.T>
                <DL.D>{candidate.misi}</DL.D>
            </DL>
        </div>
    );
}
