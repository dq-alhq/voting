"use server";

import {revalidatePath} from "next/cache";
import {prisma} from "@/lib/prisma";

type Props = {
    limit: number;
    skip: number;
    search?: string;
    sortBy?: string;
    order?: "asc" | "desc";
    categoryId?: string;
};

export const getCandidates = async ({
                                        limit,
                                        skip,
                                        search,
                                        sortBy = "createdAt",
                                        order = "asc",
                                    }: Props) => {
    const data = await prisma.candidate.findMany({
        take: limit,
        skip: skip,
        where: {
            OR: [
                {
                    name: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ],
        },
        orderBy: {[sortBy]: order},
    });

    const total = await prisma.candidate.count({
        where: {
            OR: [
                {
                    name: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ],
        },
    });

    const totalPages = Math.ceil(total / limit);
    return {data, total, totalPages};
};

interface CandidatePayload {
    name: string;
    visi: string;
    misi: string;
    photo: string;
    instagram: string;
}

export const createCandidate = async (
    data: CandidatePayload,
    electionId: string,
) => {
    const election = await prisma.election.findUnique({
        where: {id: electionId},
    });

    if (election) {
        await prisma.candidate.create({
            data: {...data, electionId: election?.id},
        });
    }

    revalidatePath("/dashboard/elections");
    return data;
};

export const updateCandidate = async (id: string, data: CandidatePayload) => {
    const candidate = await prisma.candidate.findUnique({
        where: {id},
    });
    if (!candidate) throw new Error("Candidate not found");

    await prisma.$transaction([
        prisma.candidate.update({
            where: {id},
            data,
        }),
    ]);

    const updated = await prisma.candidate.findUnique({
        where: {id},
    });

    revalidatePath("/dashboard/elections");
    return updated;
};

export const deleteCandidate = async (id: string) => {
    const candidate = await prisma.candidate.findUnique({
        where: {id},
    });
    if (!candidate) throw new Error("Candidate not found");

    await prisma.$transaction([
        prisma.candidate.delete({
            where: {id},
        }),
    ]);

    revalidatePath("/dashboard/candidates");
};
