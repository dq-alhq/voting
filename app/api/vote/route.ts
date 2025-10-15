import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
    try {
        const { option } = await req.json();
        const vote = await prisma.vote.create({ data: { option } });

        await pusherServer.trigger("vote-channel", "new-vote", vote);

        return Response.json(vote, { status: 201 });
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Failed to submit vote" }, { status: 500 });
    }
}

export async function GET() {
    const votes = await prisma.vote.groupBy({
        by: ["option"],
        _count: { option: true },
    });
    return Response.json(votes);
}
