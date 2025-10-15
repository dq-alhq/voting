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

export const getElections = async ({
                                       limit,
                                       skip,
                                       search,
                                       sortBy = "createdAt",
                                       order = "asc",
                                   }: Props) => {
    const data = await prisma.election.findMany({
        take: limit,
        skip: skip,
        where: {
            OR: [
                {
                    title: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    description: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ],
        },
        include: {
            _count: {
                select: {
                    votes: true,
                    candidates: true,
                },
            },
        },
        orderBy: {[sortBy]: order},
    });

    const total = await prisma.election.count({
        where: {
            OR: [
                {
                    title: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    description: {
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

interface ElectionPayload {
    title: string;
    description: string;
    startAt: Date;
    endAt: Date;
}

export const createElection = async (data: ElectionPayload) => {
    const election = await prisma.election.create({
        data,
    });

    revalidatePath("/dashboard/elections");
    return election;
};

export const updateElection = async (id: string, data: ElectionPayload) => {
    const election = await prisma.election.findUnique({
        where: {id},
    });
    if (!election) throw new Error("Election not found");

    await prisma.$transaction([
        prisma.election.update({
            where: {id},
            data,
        }),
    ]);

    const updated = await prisma.election.findUnique({
        where: {id},
    });

    revalidatePath("/dashboard/elections");
    return updated;
};

export const deleteElection = async (id: string) => {
    const election = await prisma.election.findUnique({
        where: {id},
    });
    if (!election) throw new Error("Election not found");

    await prisma.$transaction([
        prisma.election.delete({
            where: {id},
        }),
    ]);

    revalidatePath("/dashboard/elections");
};
